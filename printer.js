function pcEscapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// رمز الريال كصورة مضمّنة حتى لا يظهر مربع داخل الطباعة.
const PC_RIYAL_MARK_SRC = 'data:image/png;base64,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';

function pcGetSettings() {
  const defaults = {
    desc: { x: 50, y: 31, size: 10, width: 78 },
    calories: { x: 20, y: 50, size: 10 },
    carbs: { x: 45, y: 50, size: 10 },
    protein: { x: 67, y: 50, size: 10 },
    fat: { x: 87, y: 50, size: 10 },
    expiry: { x: 22, y: 82, size: 9 },
    name: { x: 14, y: 92, size: 9.5, width: 28 }
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

function pcSplitArabicLines(text) {
  text = String(text || '').trim();
  if (!text) return [''];
  if (text.length <= 24) return [text];

  const maxLines = text.length > 58 ? 3 : 2;
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  const target = Math.ceil(text.length / maxLines);

  for (const word of words) {
    const next = (current + ' ' + word).trim();
    if (next.length > target && lines.length < maxLines - 1) {
      if (current) lines.push(current.trim());
      current = word;
    } else {
      current = next;
    }
  }
  if (current) lines.push(current.trim());
  return lines.slice(0, maxLines);
}

function pcAutoArabicSize(key, text, base) {
  const len = String(text || '').trim().length;
  let size = Number(base || 9);

  if (key === 'desc') {
    if (len <= 18) size = Math.max(size, 12);
    else if (len <= 32) size = Math.max(size, 10.8);
    else if (len <= 48) size = Math.min(size, 9.6);
    else size = Math.min(size, 8.8);
  }

  if (key === 'name') {
    if (len <= 12) size = Math.max(size, 11);
    else if (len <= 24) size = Math.max(size, 10);
    else size = Math.min(size, 9);
  }

  return size;
}

function pcArabicImage(text, key, baseSize, widthPercent) {
  const lines = pcSplitArabicLines(text);
  const size = pcAutoArabicSize(key, text, baseSize);

  const scale = 5;
  const w = Math.max(130, Math.round((widthPercent || 40) * 5.4));
  const h = Math.max(38, Math.ceil((size * 1.42 * lines.length) + 12));

  const canvas = document.createElement('canvas');
  canvas.width = w * scale;
  canvas.height = h * scale;

  const ctx = canvas.getContext('2d');
  ctx.scale(scale, scale);
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = '#000';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.direction = 'rtl';
  ctx.font = `900 ${size}px Cairo, Tahoma, Arial, sans-serif`;

  const lineHeight = size * 1.25;
  const startY = h / 2 - ((lines.length - 1) * lineHeight) / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, w / 2, startY + i * lineHeight, w - 8);
  });

  return {
    src: canvas.toDataURL('image/png'),
    widthPercent: widthPercent || 40,
    size
  };
}

function pcPriceHtml(product) {
  const raw = product?.price;
  if (raw === undefined || raw === null || raw === '') return '';
  const price = pcEscapeHtml(raw);
  const mode = product?.currencyMode || product?.currency || 'symbol';

  if (mode === 'sr') {
    return `<span class="price-number">${price} SR</span>`;
  }

  return `<span class="price-number">${price}</span><img class="riyal-icon" src="${PC_RIYAL_MARK_SRC}" alt="ريال">`;
}

function pcBuildSingleLabel(product, settings, imageCache) {
  const priceSettings = settings.price || settings.expiry;
  return `
    <div class="label">
      <img class="field arabic-img desc-img" style="${pcFieldCss(settings.desc, `width:${imageCache.desc.widthPercent}%;`)}" src="${imageCache.desc.src}" alt="">
      <div class="field num" style="${pcFieldCss(settings.calories, 'direction:ltr;')}">${pcEscapeHtml(product.calories)}</div>
      <div class="field num" style="${pcFieldCss(settings.carbs, 'direction:ltr;')}">${pcEscapeHtml(product.carbs)}</div>
      <div class="field num" style="${pcFieldCss(settings.protein, 'direction:ltr;')}">${pcEscapeHtml(product.protein)}</div>
      <div class="field num" style="${pcFieldCss(settings.fat, 'direction:ltr;')}">${pcEscapeHtml(product.fat)}</div>
      <div class="field price" style="${pcFieldCss(priceSettings, 'direction:ltr;')}">${pcPriceHtml(product)}</div>
      <img class="field arabic-img name-img" style="${pcFieldCss(settings.name, `width:${imageCache.name.widthPercent}%;`)}" src="${imageCache.name.src}" alt="">
    </div>`;
}

async function buildPrintDocument(product, copies = 1, test = false) {
  const data = test
    ? { name: 'سولتد شوكلت', description: 'حمص - دارك شوكلت - بروتين شوكلت ستيفيا - حليب خالي من اللاكتوز - بندق', calories: 197.4, carbs: 15, protein: 12.3, fat: 9.8, price: 15, currencyMode: 'symbol' }
    : product;

  if (!data) {
    alert('اختر الصنف أولاً');
    return;
  }

  if (document.fonts?.ready) {
    try { await document.fonts.ready; } catch (_) {}
  }

  const count = Math.max(1, Number(copies || 1));
  const settings = pcGetSettings();

  const imageCache = {
    desc: pcArabicImage(data.description || '', 'desc', settings.desc?.size || 10, settings.desc?.width || 78),
    name: pcArabicImage(data.name || '', 'name', settings.name?.size || 9.5, settings.name?.width || 28)
  };

  let labels = '';
  for (let i = 0; i < count; i++) labels += pcBuildSingleLabel(data, settings, imageCache);

  const printWin = window.open('', '_blank', 'width=700,height=420');
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
<style>
  @page { size: 55mm 33.6mm; margin: 0; }
  html, body {
    width: 55mm;
    height: 33.6mm;
    margin: 0;
    padding: 0;
    background: #fff;
    overflow: hidden;
    font-family: Cairo, Tahoma, Arial, sans-serif;
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
    font-family: Cairo, Tahoma, Arial, sans-serif;
    font-weight: 900;
    text-align: center;
    line-height: 1.16;
    white-space: normal;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }
  .arabic-img {
    display: block;
    height: auto;
    image-rendering: auto;
  }
  .num {
    font-size: 11px;
    font-weight: 900;
    direction: ltr;
  }
  .price {
    font-size: 12.5px;
    font-weight: 900;
    direction: ltr;
    white-space: nowrap;
  }
  .price-number {
    display: inline-block;
    vertical-align: middle;
    line-height: 1;
  }
  .riyal-icon {
    width: 18px;
    height: 18px;
    object-fit: contain;
    vertical-align: -4px;
    margin-right: 3px;
  }
  @media print {
    html, body { width:55mm; height:33.6mm; margin:0; padding:0; overflow:hidden; }
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
  window.onafterprint = function () {
    setTimeout(function () { window.close(); }, 300);
  };
<\/script>
</body>
</html>`);
  printWin.document.close();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('printBtn')?.addEventListener('click', () => {
    const copies = Math.max(1, Number(document.getElementById('copiesInput')?.value || 1));
    const product = (typeof window.getSelectedProduct === 'function')
      ? window.getSelectedProduct()
      : (window.selected || (typeof selected !== 'undefined' ? selected : null));
    buildPrintDocument(product, copies, false);
  });

  document.getElementById('testPrintBtn')?.addEventListener('click', () => {
    const product = (typeof window.getSelectedProduct === 'function') ? window.getSelectedProduct() : (window.selected || null);
    buildPrintDocument(product, 1, true);
  });
});
