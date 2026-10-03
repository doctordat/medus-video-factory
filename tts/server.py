from __future__ import annotations

import hashlib
import io
import json
import re
from functools import lru_cache
from pathlib import Path

import numpy as np
import soundfile as sf
from fastapi import FastAPI, HTTPException
from fastapi.responses import Response
from pydantic import BaseModel, Field
from vieneu import Vieneu

ROOT = Path(__file__).resolve().parent
CACHE_DIR = ROOT / "cache"
CACHE_DIR.mkdir(parents=True, exist_ok=True)
PRONUNCIATION_FILE = ROOT / "medical_pronunciations.json"

app = FastAPI(title="MEDUS VieNeu TTS Provider", version="0.1.0")


class TTSRequest(BaseModel):
    text: str = Field(min_length=1)
    voice: str = "Phạm Tuyên"
    style: str = "tu_nhien"
    precision: str = "int8"
    use_medical_normalizer: bool = True


@lru_cache(maxsize=1)
def engine():
    return Vieneu(mode="v3turbo", backend="onnx", precision="int8")


def load_dictionary() -> dict[str, str]:
    if not PRONUNCIATION_FILE.exists():
        return {}
    return json.loads(PRONUNCIATION_FILE.read_text(encoding="utf-8"))


def normalize_medical_text(text: str) -> str:
    normalized = text.strip()
    for source, target in load_dictionary().items():
        normalized = re.sub(rf"(?<!\w){re.escape(source)}(?!\w)", target, normalized, flags=re.IGNORECASE)
    normalized = re.sub(r"\s+", " ", normalized)
    return normalized


def cache_key(req: TTSRequest, normalized_text: str) -> str:
    payload = "|".join([
        "vieneu-v3-turbo",
        req.voice,
        req.style,
        req.precision,
        normalized_text,
    ])
    return hashlib.sha256(payload.encode("utf-8")).hexdigest()


def wav_bytes(audio: np.ndarray, sample_rate: int = 48000) -> bytes:
    buffer = io.BytesIO()
    sf.write(buffer, np.asarray(audio, dtype=np.float32), sample_rate, format="WAV", subtype="PCM_16")
    return buffer.getvalue()


@app.get("/health")
def health():
    return {
        "ok": True,
        "provider": "vieneu",
        "model": "v3-turbo",
        "backend": "onnx",
        "sample_rate": 48000,
    }


@app.post("/v1/tts")
def synthesize(req: TTSRequest):
    text = normalize_medical_text(req.text) if req.use_medical_normalizer else req.text.strip()
    key = cache_key(req, text)
    cache_path = CACHE_DIR / f"{key}.wav"

    if cache_path.exists():
        return Response(
            content=cache_path.read_bytes(),
            media_type="audio/wav",
            headers={"X-Medus-TTS-Cache": "HIT", "X-Medus-TTS-Key": key},
        )

    try:
        audio = engine().infer(text, voice=req.voice, style=req.style)
        data = wav_bytes(audio)
        cache_path.write_bytes(data)
        return Response(
            content=data,
            media_type="audio/wav",
            headers={"X-Medus-TTS-Cache": "MISS", "X-Medus-TTS-Key": key},
        )
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"VieNeu synthesis failed: {exc}") from exc
