function pcEscapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pcFitText(text, max = 44) {
  text = String(text || '').trim();
  if (text.length <= max) return { html: pcEscapeHtml(text), size: text.length <= 25 ? 10 : 9 };
  const mid = Math.ceil(text.length / 2);
  let cut = text.lastIndexOf(' ', mid);
  if (cut < 10) cut = mid;
  return {
    html: pcEscapeHtml(text.slice(0, cut).trim()) + '<br>' + pcEscapeHtml(text.slice(cut).trim()),
    size: 8
  };
}

function pcGetSettings() {
  const defaults = {
    desc: { x: 50, y: 31, size: 7.6, width: 78 },
    calories: { x: 20, y: 50, size: 10 },
    carbs: { x: 45, y: 50, size: 10 },
    protein: { x: 67, y: 50, size: 10 },
    fat: { x: 87, y: 50, size: 10 },
    expiry: { x: 22, y: 82, size: 7.8 },
    name: { x: 14, y: 92, size: 8.2, width: 28 }
  };

  try {
    const saved = JSON.parse(localStorage.getItem('pc_label_settings_landscape_v1') || 'null');
    return saved || defaults;
  } catch (_) {
    return defaults;
  }
}

function pcFieldCss(s, extra = '') {
  const width = s.width ? `width:${s.width}%;` : '';
  return `left:${s.x}%;top:${s.y}%;font-size:${s.size}px;${width}${extra}`;
}

function pcRiyalIconSvg() {
  return `<svg class="riyal-icon" viewBox="0 0 1024 1024" aria-label="ريال" xmlns="http://www.w3.org/2000/svg"><path fill="currentColor" d="M622 82h91v378l170-40v91l-170 40v107l170-40v91l-170 40v193h-91V770l-214 50v122h-91V841l-176 41v-91l176-41V643l-176 41v-91l176-41V82h91v449l214-50V82Zm-214 540v107l214-50V572l-214 50Z"/></svg>`;
}

function pcPriceHtml(product) {
  const value = product?.price ?? '';
  if (value === '') return '';
  const mode = product?.currencyMode || product?.currency || 'sr';
  if (mode === 'symbol') return `<span class="price-number">${pcEscapeHtml(value)}</span>${pcRiyalIconSvg()}`;
  return `<span class="price-number">${pcEscapeHtml(value)} SR</span>`;
}

function pcBuildSingleLabel(product, settings) {
  const desc = pcFitText(product.description || '', 44);
  const name = pcFitText(product.name || '', 28);
  const descSize = Math.min(Number(settings.desc.size || 9), desc.size);
  const nameSize = Math.min(Number(settings.name.size || 8), name.size);

  return `
    <div class="label">
      <div class="field desc" style="${pcFieldCss({...settings.desc, size: descSize}, 'direction:rtl;')}">${desc.html}</div>
      <div class="field num" style="${pcFieldCss(settings.calories, 'direction:ltr;')}">${pcEscapeHtml(product.calories)}</div>
      <div class="field num" style="${pcFieldCss(settings.carbs, 'direction:ltr;')}">${pcEscapeHtml(product.carbs)}</div>
      <div class="field num" style="${pcFieldCss(settings.protein, 'direction:ltr;')}">${pcEscapeHtml(product.protein)}</div>
      <div class="field num" style="${pcFieldCss(settings.fat, 'direction:ltr;')}">${pcEscapeHtml(product.fat)}</div>
      <div class="field price" style="${pcFieldCss(settings.expiry, 'direction:ltr;')}">${pcPriceHtml(product)}</div>
      <div class="field name" style="${pcFieldCss({...settings.name, size: nameSize}, 'direction:rtl;')}">${name.html}</div>
    </div>`;
}

function buildPrintDocument(product, copies = 1, test = false) {
  const data = test
    ? { name: 'اختبار وضوح', description: 'دقيق ٧ حبوب - بروتين شوكولاتة 200G', calories: 322, carbs: 34, protein: 6, fat: 14, price: 15, currencyMode: 'symbol' }
    : product;

  if (!data) {
    alert('اختر الصنف أولاً');
    return;
  }

  const count = Math.max(1, Number(copies || 1));
  const settings = pcGetSettings();
  let labels = '';
  for (let i = 0; i < count; i++) labels += pcBuildSingleLabel(data, settings);

  const printWin = window.open('', '_blank', 'width=760,height=520');
  if (!printWin) {
    alert('المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة.');
    return;
  }

  printWin.document.open();
  printWin.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>Print Label</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@700;800;900&display=swap" rel="stylesheet">
<style>
  @page { size: 55mm 33.6mm; margin: 0; }
  html, body { width:55mm; min-height:33.6mm; margin:0; padding:0; background:#fff; font-family:Cairo,Tahoma,Arial,sans-serif; }
  * { box-sizing:border-box; }
  .label { position:relative; width:55mm; height:33.6mm; margin:0; padding:0; overflow:hidden; background:transparent; page-break-after:always; break-after:page; }
  .field { position:absolute; transform:translate(-50%,-50%); color:#000; font-family:Cairo,Tahoma,Arial,sans-serif; font-weight:900; text-align:center; line-height:1.18; white-space:normal; -webkit-print-color-adjust:exact; print-color-adjust:exact; -webkit-font-smoothing:antialiased; text-rendering:optimizeLegibility; }
  .desc,.name { font-weight:900; line-height:1.2; }
  .num,.price { font-weight:900; }
  .riyal-icon { width:9px; height:10px; display:inline-block; vertical-align:-1px; margin-right:2px; color:#000; }
  @media print { html,body{width:55mm;height:33.6mm;margin:0;padding:0;overflow:hidden;} .label{width:55mm;height:33.6mm;} }
</style>
</head>
<body>${labels}
<script>
  window.onload = function () {
    setTimeout(function () {
      window.focus();
      window.print();
    }, 450);
  };
  window.onafterprint = function () {
    setTimeout(function () { window.close(); }, 350);
  };
<\/script>
</body>
</html>`);
  printWin.document.close();
}

function pcAttachPrintHandlers() {
  const printBtn = document.getElementById('printBtn');
  const testBtn = document.getElementById('testPrintBtn');
  if (printBtn && !printBtn.dataset.pcPrintReady) {
    printBtn.dataset.pcPrintReady = '1';
    printBtn.addEventListener('click', () => {
      const copies = Math.max(1, Number(document.getElementById('copiesInput')?.value || 1));
      const product = (typeof window.getSelectedProduct === 'function') ? window.getSelectedProduct() : (window.selected || null);
      buildPrintDocument(product, copies, false);
    });
  }
  if (testBtn && !testBtn.dataset.pcPrintReady) {
    testBtn.dataset.pcPrintReady = '1';
    testBtn.addEventListener('click', () => {
      const product = (typeof window.getSelectedProduct === 'function') ? window.getSelectedProduct() : (window.selected || null);
      buildPrintDocument(product, 1, true);
    });
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', pcAttachPrintHandlers);
} else {
  pcAttachPrintHandlers();
}

// احتياط: لو تغيرت الواجهة أو ظهرت الأزرار بعد التحميل.
setTimeout(pcAttachPrintHandlers, 800);
setTimeout(pcAttachPrintHandlers, 2000);
