const fs = require('node:fs/promises');
const path = require('node:path');

const DEFAULT_ENDPOINT = process.env.MEDUS_TTS_URL || 'http://127.0.0.1:8001/v1/tts';

async function generateTTS({
  text,
  outputPath,
  voice = process.env.MEDUS_TTS_VOICE || 'Phạm Tuyên',
  style = process.env.MEDUS_TTS_STYLE || 'tu_nhien',
  endpoint = DEFAULT_ENDPOINT,
}) {
  if (!text?.trim()) throw new Error('TTS text is required');
  if (!outputPath) throw new Error('outputPath is required');

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      text,
      voice,
      style,
      use_medical_normalizer: true,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`MEDUS TTS failed (${response.status}): ${body}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await fs.mkdir(path.dirname(outputPath), {recursive: true});
  await fs.writeFile(outputPath, bytes);

  return {
    outputPath,
    bytes: bytes.length,
    cache: response.headers.get('x-medus-tts-cache'),
    key: response.headers.get('x-medus-tts-key'),
  };
}

module.exports = {generateTTS};
