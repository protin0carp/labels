function pcEscapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pcExpiryDate(product) {
  const days = Number(product?.shelfLifeDays || 1);
  const d = new Date();
  d.setDate(d.getDate() + days);
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
}

function pcFitText(text, max = 44) {
  text = String(text || '').trim();
  if (text.length <= max) return text;
  const mid = Math.ceil(text.length / 2);
  let cut = text.lastIndexOf(' ', mid);
  if (cut < 10) cut = mid;
  return text.slice(0, cut).trim() + '<br>' + text.slice(cut).trim();
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

function pcBuildSingleLabel(product, settings) {
  const desc = pcFitText(pcEscapeHtml(product.description || ''), 44);
  return `
    <div class="label">
      <div class="field desc" style="${pcFieldCss(settings.desc, 'direction:rtl;')}">${desc}</div>
      <div class="field num" style="${pcFieldCss(settings.calories, 'direction:ltr;')}">${pcEscapeHtml(product.calories)}</div>
      <div class="field num" style="${pcFieldCss(settings.carbs, 'direction:ltr;')}">${pcEscapeHtml(product.carbs)}</div>
      <div class="field num" style="${pcFieldCss(settings.protein, 'direction:ltr;')}">${pcEscapeHtml(product.protein)}</div>
      <div class="field num" style="${pcFieldCss(settings.fat, 'direction:ltr;')}">${pcEscapeHtml(product.fat)}</div>
      <div class="field expiry" style="${pcFieldCss(settings.expiry, 'direction:ltr;')}">${pcEscapeHtml(pcExpiryDate(product))}</div>
      <div class="field name" style="${pcFieldCss(settings.name, 'direction:rtl;')}">${pcEscapeHtml(product.name || '')}</div>
    </div>`;
}

function buildPrintDocument(product, copies = 1, test = false) {
  const data = test
    ? { name: 'اختبار وضوح', description: 'دقيق ٧ حبوب - بروتين شوكولاتة 200G', calories: 322, carbs: 34, protein: 6, fat: 14, shelfLifeDays: 1 }
    : product;

  if (!data) {
    alert('اختر الصنف أولاً');
    return;
  }

  const printWin = window.open('', '_blank', 'width=700,height=420');
  if (!printWin) {
    alert('المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة.');
    return;
  }

  const count = Math.max(1, Number(copies || 1));
  const settings = pcGetSettings();
  let labels = '';
  for (let i = 0; i < count; i++) labels += pcBuildSingleLabel(data, settings);

  printWin.document.open();
  printWin.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>Print Label</title>
<style>
  @page { size: 55mm 33.6mm; margin: 0; }
  html, body {
    width: 55mm;
    height: 33.6mm;
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: hidden;
    font-family: Arial, Tahoma, sans-serif;
  }
  * { box-sizing: border-box; }
  .label {
    position: relative;
    width: 55mm;
    height: 33.6mm;
    margin: 0;
    padding: 0;
    overflow: hidden;
    background: transparent;
    page-break-after: always;
    break-after: page;
  }
  .field {
    position: absolute;
    transform: translate(-50%, -50%);
    color: #000;
    font-family: Arial, Tahoma, sans-serif;
    font-weight: 900;
    text-align: center;
    line-height: 1.05;
    white-space: normal;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    text-rendering: geometricPrecision;
  }
  .desc, .name { font-family: Tahoma, Arial, sans-serif; }
  .num { font-size: 10px; }
  .expiry { font-family: Arial, Tahoma, sans-serif; }
  @media print {
    html, body { width: 55mm; height: 33.6mm; margin:0; padding:0; overflow:hidden; }
    .label { width:55mm; height:33.6mm; }
  }
</style>
</head>
<body>
${labels}
<script>
  window.onload = function () {
    setTimeout(function () {
      window.focus();
      window.print();
    }, 350);
  };
<\/script>
</body>
</html>`);
  printWin.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('printBtn')?.addEventListener('click', () => {
    const copies = Math.max(1, Number(document.getElementById('copiesInput')?.value || 1));
    const product = (typeof window.getSelectedProduct === 'function') ? window.getSelectedProduct() : (window.selected || (typeof selected !== 'undefined' ? selected : null));
    buildPrintDocument(product, copies, false);
  });
  document.getElementById('testPrintBtn')?.addEventListener('click', () => {
    const product = (typeof window.getSelectedProduct === 'function') ? window.getSelectedProduct() : (window.selected || null);
    buildPrintDocument(product, 1, true);
  });
});
