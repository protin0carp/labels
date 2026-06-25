function pcEscapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pcGetSettings() {
  const defaults = {
    desc: { x: 50, y: 31, size: 16, width: 78 },
    calories: { x: 20, y: 50, size: 10 },
    carbs: { x: 45, y: 50, size: 10 },
    protein: { x: 67, y: 50, size: 10 },
    fat: { x: 87, y: 50, size: 10 },
    expiry: { x: 22, y: 82, size: 9 },
    name: { x: 14, y: 92, size: 13, width: 28 }
  };

  try {
    const saved = JSON.parse(localStorage.getItem('pc_label_settings_landscape_v1') || 'null');
    return saved ? { ...defaults, ...saved } : defaults;
  } catch (_) {
    return defaults;
  }
}

function pcFieldCss(s, extra = '') {
  const width = s.width ? `width:${s.width}%;` : '';
  return `left:${s.x}%;top:${s.y}%;font-size:${s.size}px;${width}${extra}`;
}

function pcPriceHtml(product) {
  const raw = product?.price;
  if (raw === undefined || raw === null || raw === '') return '';
  return `<span class="price-number">${pcEscapeHtml(raw)} SR</span>`;
}

function pcBuildSingleLabel(product, settings, options = {}) {
  const priceSettings = settings.price || settings.expiry;
  const priceField = options.showPrice === false ? '' :
    `<div class="field price" style="${pcFieldCss(priceSettings, 'direction:ltr;')}">${pcPriceHtml(product)}</div>`;

  return `
    <div class="label">
      <div class="field desc" style="${pcFieldCss(settings.desc, 'direction:rtl;')}">${pcEscapeHtml(product.description || '')}</div>
      <div class="field num" style="${pcFieldCss(settings.calories, 'direction:ltr;')}">${pcEscapeHtml(product.calories)}</div>
      <div class="field num" style="${pcFieldCss(settings.carbs, 'direction:ltr;')}">${pcEscapeHtml(product.carbs)}</div>
      <div class="field num" style="${pcFieldCss(settings.protein, 'direction:ltr;')}">${pcEscapeHtml(product.protein)}</div>
      <div class="field num" style="${pcFieldCss(settings.fat, 'direction:ltr;')}">${pcEscapeHtml(product.fat)}</div>
      ${priceField}
      <div class="field name" style="${pcFieldCss(settings.name, 'direction:rtl;')}">${pcEscapeHtml(product.name || '')}</div>
    </div>`;
}

function buildPrintDocument(product, copies = 1, test = false, options = {}) {
  const data = test
    ? { name: 'سولتد شوكلت', description: 'حمص - دارك شوكلت - بروتين شوكلت ستيفيا - حليب خالي من اللاكتوز - بندق', calories: 197.4, carbs: 15, protein: 12.3, fat: 9.8, price: 15 }
    : product;

  if (!data) {
    alert('اختر الصنف أولاً');
    return;
  }

  const count = Math.max(1, Number(copies || 1));
  const settings = pcGetSettings();
  const showPrice = options.showPrice !== false;

  let labels = '';
  for (let i = 0; i < count; i++) {
    labels += pcBuildSingleLabel(data, settings, { showPrice });
  }

  const printWin = window.open('', '_blank', 'width=800,height=600');
  if (!printWin) {
    alert('المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة.');
    return;
  }

  printWin.document.open();
  printWin.document.write(`<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>طباعة</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Noto+Kufi+Arabic:wght@500;700;800;900&family=Cairo:wght@500;700;800;900&display=swap');
  @page { size: 55mm 33.6mm; margin: 0; }

  html, body {
    width: 55mm;
    min-height: 33.6mm;
    margin: 0;
    padding: 0;
    background: #fff;
    font-family: 'Noto Kufi Arabic', Cairo, Arial, Tahoma, sans-serif;
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
    font-family: 'Noto Kufi Arabic', Cairo, Arial, Tahoma, sans-serif;
    font-weight: 700;
    text-align: center;
    line-height: 1.18;
    white-space: normal;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
    text-rendering: geometricPrecision;
  }

  .desc, .name {
    direction: rtl;
    line-height: 1.28;
    white-space: normal;
  }

  .num {
    direction: ltr;
    font-weight: 700;
  }

  .price {
    direction: ltr;
    white-space: nowrap;
    font-weight: 700;
  }

  .price-number {
    display: inline-block;
    line-height: 1;
  }

  @media print {
    html, body { margin:0!important; padding:0!important; background:#fff!important; }
    .label { width:55mm!important; height:33.6mm!important; }
  }
</style>
</head>
<body>
${labels}
<script>
  window.addEventListener('load', function () {
    setTimeout(function () {
      window.focus();
      window.print();
    }, 900);
  });
<\/script>
</body>
</html>`);
  printWin.document.close();
}

window.buildPrintDocument = buildPrintDocument;

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('printBtn')?.addEventListener('click', () => {
    const copies = Math.max(1, Number(document.getElementById('copiesInput')?.value || 1));
    const product = (typeof window.getSelectedProduct === 'function')
      ? window.getSelectedProduct()
      : (window.selected || (typeof selected !== 'undefined' ? selected : null));
    buildPrintDocument(product, copies, false, {
      showPrice: document.getElementById('showPricePrint')?.checked !== false
    });
  });

  document.getElementById('testPrintBtn')?.addEventListener('click', () => {
    const product = (typeof window.getSelectedProduct === 'function') ? window.getSelectedProduct() : (window.selected || null);
    buildPrintDocument(product, 1, true, {
      showPrice: document.getElementById('showPricePrint')?.checked !== false
    });
  });
});
