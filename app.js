(() => {
  const generateBtn = document.getElementById('generate');
  const topicInput = document.getElementById('topic');
  const titleEl = document.getElementById('videoTitle');
  const cards = document.getElementById('cards');
  const canvas = document.querySelector('.canvas');
  const originalSvg = canvas?.querySelector('svg');
  const side = document.querySelector('.side');
  const storyHead = document.querySelector('.storyhead');
  const bar = document.getElementById('bar');
  const prev = document.getElementById('prev');
  const next = document.getElementById('next');
  const play = document.getElementById('play');

  let currentStoryboard = null;
  let currentStep = 0;

  const status = document.createElement('div');
  status.style.cssText = 'display:none;border:1px solid #cfe8e4;background:#eff9f7;color:#08766f;border-radius:10px;padding:10px 12px;font-size:12px;font-weight:800;line-height:1.4';
  generateBtn.insertAdjacentElement('afterend', status);

  const aiImage = document.createElement('img');
  aiImage.alt = 'AI medical illustration';
  aiImage.style.cssText = 'display:none;width:100%;height:100%;object-fit:contain;border-radius:14px;background:#fffdf8;animation:fadeIn .4s ease';
  canvas.appendChild(aiImage);

  const overlay = document.createElement('div');
  overlay.style.cssText = 'display:none;position:absolute;left:18px;right:18px;bottom:18px;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.92);border:1px solid #d9e2e8;box-shadow:0 8px 24px #102a4318;font-size:13px;line-height:1.4';
  canvas.appendChild(overlay);

  const style = document.createElement('style');
  style.textContent = '@keyframes fadeIn{from{opacity:0;transform:scale(.985)}to{opacity:1;transform:scale(1)}}';
  document.head.appendChild(style);

  const esc = s => String(s || '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

  function setStatus(text, error=false) {
    status.style.display = 'block';
    status.style.background = error ? '#fff1f0' : '#eff9f7';
    status.style.color = error ? '#b42318' : '#08766f';
    status.style.borderColor = error ? '#ffd0cc' : '#cfe8e4';
    status.textContent = text;
  }

  function iconFor(action) {
    return ({draw:'✎', highlight:'◉', arrow:'→', block:'✕', label:'T', result:'✓'})[action] || '•';
  }

  function renderStep(index) {
    const steps = currentStoryboard?.steps || [];
    if (!steps.length) return;
    currentStep = Math.max(0, Math.min(index, steps.length - 1));
    const s = steps[currentStep];
    [...cards.children].forEach((el, i) => el.classList.toggle('active', i === currentStep));
    overlay.style.display = 'block';
    overlay.innerHTML = `<div style="font-size:10px;font-weight:900;color:#0d8b83;letter-spacing:.08em">BƯỚC ${currentStep + 1}/${steps.length}</div><div style="font-size:17px;font-weight:900;margin:3px 0">${esc(s.title)}</div><div style="color:#52606d">${esc(s.narration)}</div><div style="margin-top:7px;display:inline-block;background:#fff1aa;padding:4px 7px;border-radius:7px;font-weight:900">${esc(s.emphasis)}</div>`;
    if (bar) bar.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  }

  function renderStoryboard(data) {
    currentStoryboard = data;
    currentStep = 0;
    const steps = data.steps || [];
    titleEl.textContent = String(data.title || topicInput.value).toUpperCase();
    if (storyHead) storyHead.textContent = `CÁC BƯỚC VẼ (${steps.length}/${steps.length})`;
    cards.innerHTML = steps.map((s, i) => `<div class="card${i===0?' active':''}" data-i="${i}"><span class="num">${i+1}</span><div class="thumb">${iconFor(s.action)}</div><div class="ct">${esc(s.title)}</div></div>`).join('');
    [...cards.children].forEach(el => el.onclick = () => renderStep(Number(el.dataset.i)));
    renderStep(0);
  }

  async function generateIllustration(topic, storyboard) {
    setStatus('Storyboard xong. AI đang vẽ hình y khoa…');
    const r = await fetch('/api/illustrate', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({topic, storyboard})
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.error || 'Không tạo được hình AI');
    if (originalSvg) originalSvg.style.display = 'none';
    aiImage.src = data.image;
    aiImage.style.display = 'block';
    overlay.style.display = 'block';
  }

  generateBtn.onclick = async () => {
    const topic = topicInput.value.trim();
    if (!topic) return setStatus('Nhập chủ đề trước đã.', true);

    generateBtn.disabled = true;
    generateBtn.textContent = 'AI đang làm…';
    setStatus('AI đang tạo kịch bản + storyboard…');

    try {
      const r = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({topic})
      });
      const storyboard = await r.json();
      if (!r.ok) throw new Error(storyboard.error || 'Không tạo được storyboard');
      renderStoryboard(storyboard);
      await generateIllustration(topic, storyboard);
      setStatus(`Xong: ${storyboard.steps?.length || 0} bước + 1 hình AI mới cho “${topic}”.`);
    } catch (e) {
      setStatus(e.message || 'Generate thất bại.', true);
    } finally {
      generateBtn.disabled = false;
      generateBtn.textContent = '✦ Generate bằng AI';
    }
  };

  if (prev) prev.onclick = () => renderStep(currentStep - 1);
  if (next) next.onclick = () => renderStep(currentStep + 1);
  if (play) play.onclick = () => {
    if (!currentStoryboard?.steps?.length) return;
    let i = currentStep;
    play.textContent = '⏸ Pause';
    const timer = setInterval(() => {
      i += 1;
      if (i >= currentStoryboard.steps.length) {
        clearInterval(timer);
        play.textContent = '▶ Play';
        return;
      }
      renderStep(i);
    }, 1600);
  };

  generateBtn.textContent = '✦ Generate bằng AI';
})();
