(() => {
  const generateBtn = document.getElementById('generate');
  const topicInput = document.getElementById('topic');
  const stepList = document.getElementById('steplist');
  const stepName = document.getElementById('stepname');
  const titleEl = document.getElementById('videoTitle');
  const panel = document.querySelector('.panel');

  const status = document.createElement('div');
  status.style.cssText = 'margin-top:12px;padding:10px 12px;border-radius:10px;background:#eef8f7;color:#0f6f70;font-size:12px;font-weight:700;display:none';
  panel.insertBefore(status, stepName);

  const aiCard = document.createElement('div');
  aiCard.id = 'ai-card';
  aiCard.style.cssText = 'position:absolute;left:32px;right:32px;bottom:110px;z-index:8;background:rgba(251,250,246,.96);border:2px solid #111;border-radius:18px;padding:16px;box-shadow:5px 5px 0 #111;display:none';
  document.querySelector('.phone').appendChild(aiCard);

  const esc = (s) => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function showStatus(text, type='ok') {
    status.style.display = 'block';
    status.style.background = type === 'error' ? '#fff0ef' : '#eef8f7';
    status.style.color = type === 'error' ? '#b42318' : '#0f6f70';
    status.textContent = text;
  }

  function renderStoryboard(data) {
    const steps = Array.isArray(data.steps) ? data.steps : [];
    titleEl.textContent = String(data.title || topicInput.value || '').toUpperCase();
    stepList.innerHTML = steps.map((s, i) => `<div>${i + 1}. ${esc(s.title)}</div>`).join('');
    stepName.textContent = `AI storyboard · ${steps.length} bước`;

    aiCard.style.display = 'block';
    aiCard.innerHTML = `
      <div style="font-size:11px;font-weight:900;color:#0f8b8d;letter-spacing:.08em">AI STORYBOARD</div>
      <div style="font-size:22px;font-weight:900;margin:5px 0 8px">${esc(data.hook || data.title)}</div>
      <div style="font-size:13px;line-height:1.45;color:#333">${esc(steps[0]?.visual || '')}</div>
      <div style="margin-top:10px;background:#fff0a8;display:inline-block;padding:6px 9px;border-radius:8px;font-size:13px;font-weight:900">${esc(steps[0]?.emphasis || '')}</div>`;

    let idx = 0;
    const controls = {
      next: document.getElementById('next'),
      prev: document.getElementById('prev')
    };
    const renderAiStep = () => {
      if (!steps.length) return;
      const s = steps[idx];
      [...stepList.children].forEach((el, i) => el.classList.toggle('active', i === idx));
      stepName.textContent = `Bước ${idx + 1} · ${s.title}`;
      aiCard.innerHTML = `
        <div style="font-size:11px;font-weight:900;color:#0f8b8d;letter-spacing:.08em">BƯỚC ${idx + 1}/${steps.length} · ${esc(s.action)}</div>
        <div style="font-size:21px;font-weight:900;margin:5px 0 8px">${esc(s.title)}</div>
        <div style="font-size:13px;line-height:1.45;color:#333">${esc(s.visual)}</div>
        <div style="margin-top:10px;background:#fff0a8;display:inline-block;padding:6px 9px;border-radius:8px;font-size:13px;font-weight:900">${esc(s.emphasis)}</div>`;
    };
    controls.next.onclick = () => { idx = Math.min(steps.length - 1, idx + 1); renderAiStep(); };
    controls.prev.onclick = () => { idx = Math.max(0, idx - 1); renderAiStep(); };
    renderAiStep();
  }

  generateBtn.onclick = async () => {
    const topic = topicInput.value.trim();
    if (!topic) return showStatus('Nhập chủ đề trước đã.', 'error');
    generateBtn.disabled = true;
    generateBtn.textContent = 'AI đang tạo storyboard…';
    showStatus('Đang gửi chủ đề cho AI và chia thành các bước vẽ…');

    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({topic})
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Generate failed');
      renderStoryboard(data);
      showStatus(`Đã tạo ${data.steps?.length || 0} bước bằng AI.`);
    } catch (e) {
      showStatus(e.message || 'Không gọi được AI.', 'error');
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = '✨ Generate bằng AI';
    }
  };

  generateBtn.textContent = '✨ Generate bằng AI';
})();
