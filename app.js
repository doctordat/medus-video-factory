(() => {
  const $ = (s) => document.querySelector(s);
  const generateBtn = $('#generate');
  const topicInput = $('#topic');
  const titleEl = $('#videoTitle');
  const canvas = $('.canvas');
  const cards = $('#cards');
  const bar = $('#bar');
  const storyHead = $('.storyhead');
  const prevBtn = $('#prev');
  const nextBtn = $('#next');
  const playBtn = $('#play');
  const side = $('.side');

  const status = document.createElement('div');
  status.style.cssText='padding:10px 12px;border:1px solid #dfe5ea;border-radius:10px;background:#eef8f7;color:#0b726c;font-size:12px;font-weight:800';
  status.textContent='FREE MODE · SVG asset library · không gọi AI tạo ảnh';
  side.insertBefore(status, side.querySelector('.status'));

  const esc=(s)=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const baseStyle = `<style>
    .sk{fill:none;stroke:#17222b;stroke-width:5;stroke-linecap:round;stroke-linejoin:round}.thin{stroke-width:3}.red{stroke:#d9433c}.blue{stroke:#2869b3}.green{stroke:#2f8f46}.teal{stroke:#0d8b83}.tan{stroke:#c9a789}.fillY{fill:#fff1ad}.fillG{fill:#eaf7e8}.fillB{fill:#e9f3ff}.fillR{fill:#ffe8e5}.box{stroke:#17222b;stroke-width:2}.txt{font:800 22px Inter,Arial,sans-serif;fill:#17222b}.sm{font-size:17px}.redT{fill:#d9433c}.blueT{fill:#2869b3}.greenT{fill:#2f8f46}.step{opacity:0;transition:opacity .3s}.step.visible{opacity:1}.draw{stroke-dasharray:1;stroke-dashoffset:1;path-length:1;transition:stroke-dashoffset .9s ease}.step.visible .draw{stroke-dashoffset:0}
  </style>`;

  const templates = {
    furosemide: {
      title:'CƠ CHẾ FUROSEMIDE',
      steps:['Cấu trúc nephron','Xác định quai Henle','NKCC2 ở nhánh lên dày','Furosemide chặn NKCC2','↓ tái hấp thu ion','H₂O đi theo','↑ lượng nước tiểu','Ứng dụng lâm sàng'],
      thumbs:['〽','∪','▣','✕','↓','H₂O','↑','★'],
      svg:`${baseStyle}<svg viewBox="0 0 900 560">
        <g class="step" data-step="0"><circle cx="205" cy="120" r="48" class="sk tan draw" pathLength="1"/><path class="sk red draw" pathLength="1" d="M90 110 C130 90 165 100 175 115 M185 92 C208 70 240 85 250 110 C258 134 231 153 207 148 C184 143 175 122 188 108 C200 96 220 101 224 115"/><path class="sk tan draw" pathLength="1" d="M253 122 C318 90 348 111 338 165 C328 215 310 242 340 258 C356 342 359 411 402 447 C433 473 467 445 473 403 C479 321 474 252 510 220 C545 189 566 160 541 139 C515 117 485 148 456 139 C429 130 441 106 470 101 C531 92 579 135 630 119 C661 109 685 108 688 135 L688 420"/><text x="164" y="48" class="txt redT">Cầu thận</text><text x="373" y="505" class="txt blueT">Quai Henle</text><text x="652" y="72" class="txt blueT">Ống góp</text></g>
        <g class="step" data-step="1"><path class="sk blue draw" pathLength="1" stroke-width="13" d="M340 260 C352 344 358 410 402 447"/><path class="sk red draw" pathLength="1" stroke-width="13" d="M402 447 C442 467 467 442 473 403 C478 342 477 294 487 258"/><text x="310" y="535" class="txt sm blueT">Nhánh xuống</text><text x="482" y="535" class="txt sm redT">Nhánh lên dày</text></g>
        <g class="step" data-step="2"><rect x="443" y="293" width="92" height="44" rx="10" class="fillY box"/><text x="489" y="321" text-anchor="middle" class="txt sm">NKCC2</text><text x="548" y="300" class="txt sm">Na⁺ K⁺ 2Cl⁻</text></g>
        <g class="step" data-step="3"><rect x="270" y="240" width="135" height="44" rx="9" class="fillG box"/><text x="337" y="268" text-anchor="middle" class="txt sm greenT">FUROSEMIDE</text><path class="sk green draw" pathLength="1" d="M405 262 C430 263 445 278 458 295"/><path class="sk red" stroke-width="10" d="M458 302 L521 332 M521 302 L458 332"/></g>
        <g class="step" data-step="4"><path class="sk blue draw" pathLength="1" d="M535 345 L590 345 M573 331 L591 345 L573 359"/><text x="600" y="342" class="txt sm blueT">↓ tái hấp thu Na⁺, K⁺, Cl⁻</text></g>
        <g class="step" data-step="5"><path class="sk teal draw" pathLength="1" d="M535 389 C590 405 632 405 678 388 M660 377 L680 388 L660 400"/><text x="575" y="430" class="txt sm blueT">H₂O đi theo</text></g>
        <g class="step" data-step="6"><rect x="665" y="445" width="190" height="58" rx="10" class="fillG box"/><text x="760" y="480" text-anchor="middle" class="txt sm greenT">↑ LƯỢNG NƯỚC TIỂU</text></g>
        <g class="step" data-step="7"><text x="86" y="485" class="txt sm greenT">★ Phù · tăng huyết áp · phù phổi cấp</text></g>
      </svg>`
    },
    aspirin: {
      title:'CƠ CHẾ ASPIRIN',
      steps:['Tiểu cầu và COX-1','Arachidonic acid','Tạo thromboxane A₂','Aspirin acetyl hóa COX-1','Ức chế không hồi phục','↓ TXA₂','↓ kết tập tiểu cầu','Clinical pearl'],
      thumbs:['◉','→','TXA₂','A','✕','↓','↓','★'],
      svg:`${baseStyle}<svg viewBox="0 0 900 560">
        <g class="step" data-step="0"><circle cx="285" cy="280" r="145" class="fillR box"/><circle cx="245" cy="250" r="18" fill="#e8897f"/><circle cx="320" cy="320" r="22" fill="#e8897f"/><circle cx="355" cy="230" r="16" fill="#e8897f"/><text x="285" y="95" text-anchor="middle" class="txt redT">TIỂU CẦU</text><rect x="390" y="250" width="115" height="60" rx="14" class="fillY box"/><text x="447" y="287" text-anchor="middle" class="txt">COX-1</text></g>
        <g class="step" data-step="1"><text x="90" y="220" class="txt sm">Arachidonic acid</text><path class="sk draw" pathLength="1" d="M225 225 C290 185 350 205 392 255"/></g>
        <g class="step" data-step="2"><path class="sk blue draw" pathLength="1" d="M505 280 L640 280 M620 264 L642 280 L620 296"/><rect x="645" y="245" width="135" height="70" rx="14" class="fillB box"/><text x="712" y="287" text-anchor="middle" class="txt blueT">TXA₂</text></g>
        <g class="step" data-step="3"><rect x="370" y="120" width="150" height="54" rx="12" class="fillG box"/><text x="445" y="154" text-anchor="middle" class="txt sm greenT">ASPIRIN</text><path class="sk green draw" pathLength="1" d="M445 174 L445 245"/></g>
        <g class="step" data-step="4"><path class="sk red" stroke-width="10" d="M405 250 L490 310 M490 250 L405 310"/><text x="365" y="350" class="txt sm redT">Ức chế không hồi phục</text></g>
        <g class="step" data-step="5"><text x="650" y="350" class="txt blueT">TXA₂ ↓</text></g>
        <g class="step" data-step="6"><path class="sk blue draw" pathLength="1" d="M640 385 L640 445 M624 425 L640 447 L656 425"/><text x="555" y="480" class="txt blueT">↓ KẾT TẬP TIỂU CẦU</text></g>
        <g class="step" data-step="7"><text x="95" y="500" class="txt sm greenT">★ Tác dụng kéo dài suốt đời tiểu cầu</text></g>
      </svg>`
    },
    metformin: {
      title:'CƠ CHẾ METFORMIN',
      steps:['Gan là đích chính','Metformin vào tế bào gan','Ức chế hô hấp ty thể','AMP tăng','AMPK được hoạt hóa','↓ tân tạo đường','↑ nhạy insulin ngoại biên','Kết quả'],
      thumbs:['LIVER','M','⚡','AMP','AMPK','↓','↑','✓'],
      svg:`${baseStyle}<svg viewBox="0 0 900 560">
        <g class="step" data-step="0"><path class="sk tan draw" pathLength="1" d="M170 175 C265 90 430 105 500 170 C555 222 527 302 455 330 C365 365 230 342 162 287 C112 247 120 210 170 175 Z"/><text x="300" y="215" class="txt redT">GAN</text></g>
        <g class="step" data-step="1"><rect x="70" y="365" width="150" height="54" rx="12" class="fillG box"/><text x="145" y="399" text-anchor="middle" class="txt sm greenT">METFORMIN</text><path class="sk green draw" pathLength="1" d="M220 392 C280 390 305 340 330 305"/></g>
        <g class="step" data-step="2"><ellipse cx="410" cy="245" rx="75" ry="38" class="fillR box"/><path class="sk red thin" d="M355 245 C375 220 395 270 415 240 C435 210 455 265 475 238"/><text x="410" y="300" text-anchor="middle" class="txt sm redT">Ty thể ↓</text></g>
        <g class="step" data-step="3"><path class="sk blue draw" pathLength="1" d="M500 245 L620 245 M600 230 L622 245 L600 260"/><text x="650" y="252" class="txt blueT">AMP ↑</text></g>
        <g class="step" data-step="4"><rect x="605" y="300" width="150" height="58" rx="12" class="fillY box"/><text x="680" y="336" text-anchor="middle" class="txt">AMPK ↑</text></g>
        <g class="step" data-step="5"><path class="sk blue draw" pathLength="1" d="M680 358 L680 420"/><text x="555" y="458" class="txt blueT">↓ TÂN TẠO ĐƯỜNG</text></g>
        <g class="step" data-step="6"><text x="100" y="485" class="txt greenT">↑ NHẠY INSULIN</text></g>
        <g class="step" data-step="7"><rect x="590" y="475" width="220" height="55" rx="10" class="fillG box"/><text x="700" y="510" text-anchor="middle" class="txt sm greenT">↓ glucose máu</text></g>
      </svg>`
    },
    paracetamol: {
      title:'CƠ CHẾ PARACETAMOL',
      steps:['Tín hiệu gây sốt','COX ở hệ thần kinh trung ương','PGE₂ tăng set-point','Paracetamol tác động trung ương','↓ tổng hợp PGE₂','Set-point trở về','Tăng thải nhiệt','Hạ sốt'],
      thumbs:['🔥','COX','PGE₂','P','↓','↘','💧','✓'],
      svg:`${baseStyle}<svg viewBox="0 0 900 560">
        <g class="step" data-step="0"><circle cx="270" cy="250" r="120" class="fillR box"/><text x="270" y="258" text-anchor="middle" class="txt redT">VÙNG HẠ ĐỒI</text><text x="125" y="110" class="txt redT">IL-1 / IL-6 / TNF-α</text><path class="sk red draw" pathLength="1" d="M240 125 L255 165"/></g>
        <g class="step" data-step="1"><rect x="420" y="180" width="120" height="56" rx="12" class="fillY box"/><text x="480" y="216" text-anchor="middle" class="txt">COX</text></g>
        <g class="step" data-step="2"><path class="sk blue draw" pathLength="1" d="M540 208 L660 208"/><text x="690" y="216" class="txt blueT">PGE₂ ↑</text><text x="610" y="260" class="txt sm redT">set-point ↑</text></g>
        <g class="step" data-step="3"><rect x="405" y="315" width="175" height="58" rx="12" class="fillG box"/><text x="492" y="350" text-anchor="middle" class="txt sm greenT">PARACETAMOL</text><path class="sk green draw" pathLength="1" d="M492 315 L492 240"/></g>
        <g class="step" data-step="4"><path class="sk red" stroke-width="10" d="M445 185 L525 235 M525 185 L445 235"/><text x="610" y="335" class="txt blueT">PGE₂ ↓</text></g>
        <g class="step" data-step="5"><text x="590" y="395" class="txt greenT">set-point ↘ bình thường</text></g>
        <g class="step" data-step="6"><path class="sk teal draw" pathLength="1" d="M260 390 C260 440 230 465 180 480 M285 390 C305 440 350 470 405 480"/><text x="180" y="515" class="txt sm blueT">giãn mạch · vã mồ hôi</text></g>
        <g class="step" data-step="7"><rect x="600" y="455" width="180" height="55" rx="10" class="fillG box"/><text x="690" y="490" text-anchor="middle" class="txt greenT">HẠ SỐT</text></g>
      </svg>`
    }
  };

  function genericTemplate(topic){
    const clean=topic.replace(/^cơ chế\s*/i,'').trim()||'THUỐC';
    return {title:`CƠ CHẾ ${clean.toUpperCase()}`,steps:['Xác định đích tác dụng','Thuốc tiếp cận đích','Tương tác thuốc–đích','Thay đổi tín hiệu','Thay đổi chức năng tế bào','Tác dụng sinh lý','Kết quả lâm sàng'],thumbs:['◎','→','▣','⇄','CELL','↓','✓'],svg:`${baseStyle}<svg viewBox="0 0 900 560">
      <g class="step" data-step="0"><circle cx="620" cy="270" r="125" class="fillB box"/><text x="620" y="278" text-anchor="middle" class="txt">TẾ BÀO ĐÍCH</text><rect x="535" y="215" width="75" height="38" rx="10" class="fillY box"/><text x="572" y="240" text-anchor="middle" class="txt sm">ĐÍCH</text></g>
      <g class="step" data-step="1"><rect x="110" y="235" width="170" height="60" rx="12" class="fillG box"/><text x="195" y="272" text-anchor="middle" class="txt sm greenT">${esc(clean.toUpperCase())}</text><path class="sk green draw" pathLength="1" d="M280 265 C370 265 430 245 535 235"/></g>
      <g class="step" data-step="2"><path class="sk red" stroke-width="9" d="M520 215 L615 260 M615 215 L520 260"/></g>
      <g class="step" data-step="3"><path class="sk blue draw" pathLength="1" d="M620 305 L620 390"/><text x="645" y="355" class="txt sm blueT">tín hiệu ↓/↑</text></g>
      <g class="step" data-step="4"><circle cx="620" cy="420" r="38" class="fillY box"/><text x="620" y="428" text-anchor="middle" class="txt sm">CELL</text></g>
      <g class="step" data-step="5"><path class="sk teal draw" pathLength="1" d="M585 455 C535 490 465 500 390 490"/><text x="185" y="500" class="txt sm blueT">Thay đổi đáp ứng sinh lý</text></g>
      <g class="step" data-step="6"><rect x="605" y="470" width="195" height="55" rx="10" class="fillG box"/><text x="702" y="505" text-anchor="middle" class="txt sm greenT">KẾT QUẢ LÂM SÀNG</text></g>
    </svg>`};
  }

  function choose(topic){const t=topic.toLowerCase();if(t.includes('furosemide')||t.includes('lợi tiểu quai'))return templates.furosemide;if(t.includes('aspirin'))return templates.aspirin;if(t.includes('metformin'))return templates.metformin;if(t.includes('paracetamol')||t.includes('acetaminophen'))return templates.paracetamol;return genericTemplate(topic);}

  let tpl=templates.furosemide,current=0,timer=null;
  function renderStep(n){const nodes=[...canvas.querySelectorAll('.step')];current=Math.max(0,Math.min(nodes.length-1,n));nodes.forEach((el,i)=>el.classList.toggle('visible',i<=current));[...cards.querySelectorAll('.card')].forEach((el,i)=>el.classList.toggle('active',i===current));if(bar)bar.style.width=`${((current+1)/nodes.length)*100}%`;}
  function renderTemplate(t){tpl=t;titleEl.textContent=t.title;canvas.innerHTML=t.svg;cards.innerHTML=t.steps.map((s,i)=>`<div class="card" data-i="${i}"><span class="num">${i+1}</span><div class="thumb">${esc(t.thumbs[i]||'•')}</div><div class="ct">${esc(s)}</div></div>`).join('');storyHead.textContent=`CÁC BƯỚC VẼ (${t.steps.length}/${t.steps.length})`;cards.querySelectorAll('.card').forEach(c=>c.onclick=()=>{stop();renderStep(+c.dataset.i)});renderStep(0);}
  function stop(){if(timer){clearInterval(timer);timer=null}playBtn.textContent='▶ Play'}
  generateBtn.onclick=()=>{stop();const topic=topicInput.value.trim();tpl=choose(topic);renderTemplate(tpl);status.textContent='✓ FREE MODE · Đã ráp visual từ thư viện SVG cục bộ';};
  prevBtn.onclick=()=>{stop();renderStep(current-1)};nextBtn.onclick=()=>{stop();renderStep(current+1)};
  playBtn.onclick=()=>{if(timer){stop();return}if(current>=tpl.steps.length-1)renderStep(0);playBtn.textContent='⏸ Pause';timer=setInterval(()=>{if(current>=tpl.steps.length-1){stop();return}renderStep(current+1)},1300)};
  generateBtn.textContent='⚡ Generate FREE';
  renderTemplate(tpl);
})();