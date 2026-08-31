module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: 'OPENAI_API_KEY chưa được cấu hình trên Vercel',
      code: 'MISSING_OPENAI_API_KEY'
    });
  }

  const topic = String(req.body?.topic || '').trim();
  if (!topic) return res.status(400).json({ error: 'Thiếu chủ đề' });

  const schema = {
    type: 'object',
    additionalProperties: false,
    properties: {
      title: { type: 'string' },
      hook: { type: 'string' },
      clinical_pearl: { type: 'string' },
      steps: {
        type: 'array',
        minItems: 6,
        maxItems: 10,
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            title: { type: 'string' },
            narration: { type: 'string' },
            visual: { type: 'string' },
            action: {
              type: 'string',
              enum: ['draw', 'highlight', 'arrow', 'block', 'label', 'result']
            },
            emphasis: { type: 'string' }
          },
          required: ['title', 'narration', 'visual', 'action', 'emphasis']
        }
      }
    },
    required: ['title', 'hook', 'clinical_pearl', 'steps']
  };

  const prompt = `Bạn là biên kịch video y khoa cho Medus. Hãy biến chủ đề sau thành storyboard video dọc 9:16 theo phong cách bảng vẽ tay từng bước: ${topic}\n\nYêu cầu:\n- 6 đến 10 bước, mỗi bước nối tiếp và giữ lại hình của bước trước.\n- Mỗi bước chỉ thêm một ý/hình/mũi tên/nhãn mới.\n- Ưu tiên cơ chế sinh lý/dược lý, đúng thuật ngữ y khoa tiếng Việt.\n- narration ngắn, tự nhiên, phù hợp voice-over.\n- visual mô tả chính xác thứ cần vẽ trên canvas.\n- emphasis tối đa 3-7 từ để hiện trên màn hình.\n- Không bịa số liệu hay khuyến cáo điều trị nếu không cần.\n- clinical_pearl chỉ 1 câu ngắn.`;

  try {
    const r = await fetch('https://api.openai.com/v1/responses', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || 'gpt-5.6-luna',
        input: prompt,
        text: {
          format: {
            type: 'json_schema',
            name: 'medus_storyboard',
            strict: true,
            schema
          }
        }
      })
    });

    const data = await r.json();
    if (!r.ok) {
      return res.status(r.status).json({ error: data?.error?.message || 'OpenAI API error', raw: data });
    }

    const outputText = data.output_text || data.output?.flatMap(x => x.content || []).find(c => c.type === 'output_text')?.text;
    if (!outputText) return res.status(502).json({ error: 'AI không trả storyboard hợp lệ' });

    return res.status(200).json(JSON.parse(outputText));
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Generate failed' });
  }
};
