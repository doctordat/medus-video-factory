module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'OPENAI_API_KEY chưa được cấu hình' });

  const topic = String(req.body?.topic || '').trim();
  const storyboard = req.body?.storyboard || {};
  if (!topic) return res.status(400).json({ error: 'Thiếu chủ đề' });

  const steps = Array.isArray(storyboard.steps) ? storyboard.steps : [];
  const stepText = steps.map((s, i) => `${i + 1}. ${s.title}: ${s.visual}`).join('\n');

  const prompt = `Create a clean, accurate medical teaching illustration for: ${topic}.

This is for MEDUS, a Vietnamese medical education video. Style: elegant hand-drawn medical sketch on warm white graph paper, black ink line art, restrained teal/blue/red/green accents, pale yellow highlights, lots of whitespace, clear anatomy, no photorealism, no glossy 3D render, no decorative clutter. The composition must work inside a vertical 9:16 educational video canvas. Use one coherent persistent diagram that can be progressively revealed step by step.

Storyboard:
${stepText}

Clinical pearl: ${storyboard.clinical_pearl || ''}

Important: prioritize medically correct structure and causal arrows. Keep labels extremely short. Do not add paragraphs of text. Do not invent numerical values. No logos, no watermarks, no UI chrome.`;

  try {
    const r = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_IMAGE_MODEL || 'gpt-image-2',
        prompt,
        size: '1024x1536',
        quality: 'medium'
      })
    });

    const data = await r.json();
    if (!r.ok) return res.status(r.status).json({ error: data?.error?.message || 'Image generation failed' });
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) return res.status(502).json({ error: 'AI không trả ảnh hợp lệ' });

    return res.status(200).json({ image: `data:image/png;base64,${b64}` });
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Illustration failed' });
  }
};
