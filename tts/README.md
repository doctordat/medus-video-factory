# MEDUS VieNeu TTS Provider

Local Vietnamese TTS provider for the MEDUS video pipeline using VieNeu-TTS v3 Turbo.

## Why local service

The MEDUS web/API layer can stay on Node/Vercel while the heavier ONNX speech model runs locally on the production machine. Remotion or any orchestration script calls the provider over HTTP.

## macOS / CPU setup

Recommended upstream path for VieNeu v3 Turbo is ONNX/CPU on macOS.

```bash
cd tts
python3 -m venv .venv
source .venv/bin/activate
python -m pip install -U pip
pip install -r requirements.txt
uvicorn server:app --host 127.0.0.1 --port 8001
```

Health check:

```bash
curl http://127.0.0.1:8001/health
```

Generate a WAV:

```bash
curl -X POST http://127.0.0.1:8001/v1/tts \
  -H 'Content-Type: application/json' \
  -d '{"text":"Bệnh nhân ung thư phổi có đột biến EGFR exon 19.","voice":"Phạm Tuyên","style":"tu_nhien"}' \
  --output test.wav
```

## Node / Remotion client

```js
const {generateTTS} = require('./tts/client');

await generateTTS({
  text: 'HER2 dương tính cần được diễn giải trong đúng bối cảnh lâm sàng.',
  outputPath: 'public/audio/scene-001.wav',
});
```

Environment variables:

```bash
MEDUS_TTS_URL=http://127.0.0.1:8001/v1/tts
MEDUS_TTS_VOICE='Phạm Tuyên'
MEDUS_TTS_STYLE=tu_nhien
```

## Production behavior

- VieNeu v3 Turbo through ONNX/CPU.
- 48 kHz WAV output.
- SHA-256 cache based on model, voice, style and normalized text.
- Medical pronunciation normalization before synthesis.
- Cache hit/miss is returned in response headers.
- The pronunciation dictionary lives in `medical_pronunciations.json` and should be expanded after human listening QC.

## Important QC rule

The starter medical dictionary is provisional. Do not assume every English abbreviation is best pronounced phonetically in Vietnamese. Lock each entry only after a human listening pass on the MEDUS reference voice.
