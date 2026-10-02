#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

printf '\n[MEDUS] Preparing isolated Python environment...\n'
python3 scripts/prepare_env.py

if [[ -x "$ROOT_DIR/.venv/bin/python" ]]; then
  ENV_PY="$ROOT_DIR/.venv/bin/python"
elif [[ -x "$ROOT_DIR/.venv/Scripts/python.exe" ]]; then
  ENV_PY="$ROOT_DIR/.venv/Scripts/python.exe"
else
  echo "[MEDUS] ERROR: virtualenv Python was not found after prepare_env.py" >&2
  exit 1
fi

mkdir -p outputs
OUTPUT="$ROOT_DIR/outputs/medus-whiteboard-demo.mp4"

printf '\n[MEDUS] Rendering bundled smoke-test scene...\n'
"$ENV_PY" scripts/render_stream_whiteboard.py \
  examples/scene-01-monkey-mountain-banana.png \
  examples/scene-01-monkey-mountain-banana.annotation.json \
  "$OUTPUT" \
  assets/drawing-hand.png \
  --ink-path grid \
  --color-fill contour-wipe

if [[ ! -s "$OUTPUT" ]]; then
  echo "[MEDUS] ERROR: renderer finished without producing a non-empty MP4" >&2
  exit 1
fi

printf '\n[MEDUS] SUCCESS\nOutput: %s\n' "$OUTPUT"
