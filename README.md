# Medus Video Factory

Template-driven medical explainer video factory for Medus.

## MVP
- Remotion vertical video 1080x1920 / 30fps
- Scene JSON -> deterministic video
- Medus visual system: white graph paper, black line-art, pale-yellow highlight, red warning/block, restrained teal accent
- One scene = one idea; minimal on-screen text
- Aspirin mechanism demo included

## Run
```bash
npm install
npm run start
```

Render demo:
```bash
npm run render:aspirin
```

## Pipeline target
`topic -> medical script -> scene JSON -> assets -> TTS/timing -> Remotion -> MP4`

Next: reusable SVG medical asset library, TTS/subtitles, AI topic-to-JSON generator, batch rendering and a simple creator UI.
