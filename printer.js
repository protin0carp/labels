// printer.js - مسؤول عن تجهيز طباعة Zebra من المتصفح
// ملاحظة: القالب الملون لا يطبع. الطباعة تكون للنصوص المتغيرة فقط فوق الاستيكر المطبوع مسبقاً.

const PrinterModule = (() => {
    function getPrintHtml(product, settings, copies = 1) {
    const expiry = window.LabelAppUtils?.getExpiryDate(product.shelfLifeDays) || '';
    const layers = window.LabelAppUtils?.buildLayerData(product, expiry, settings) || [];
    const layerHtml = layers.map(layer => `
      <div class="ptext ${layer.key}" style="left:${layer.x}mm;top:${layer.y}mm;font-size:${layer.font}pt;max-width:${layer.maxWidth || 40}mm;text-align:${layer.align || 'center'};">
        ${escapeHtml(layer.text)}
      </div>`).join('');

    const labels = Array.from({ length: Number(copies) || 1 }, () => `<section class="label-print-area">${layerHtml}</section>`).join('');

    return `<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><title>Print Label</title>
      <style>
        @page { size: 70mm 50mm; margin: 0; }
        *{box-sizing:border-box} html,body{margin:0;padding:0;background:white;font-family:Arial,'Cairo',sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
        .label-print-area{position:relative;width:70mm;height:50mm;page-break-after:always;overflow:hidden;background:transparent;}
        .label-print-area:last-child{page-break-after:auto;}
        .ptext{position:absolute;transform:translate(-50%,-50%);color:#000;font-weight:900;line-height:1.05;white-space:pre-line;direction:rtl;text-align:center;}
        @media print{ body{margin:0!important;} }
        .ptext.calories,.ptext.carbs,.ptext.protein,.ptext.fat{direction:ltr;}
      </style></head><body>${labels}<script>window.onload=()=>{setTimeout(()=>window.print(),250)}<\/script></body></html>`;
  }

  function print(product, settings, copies = 1) {
    if (!product) return alert('اختر الصنف أولاً');
    const win = window.open('', '_blank', 'width=800,height=600');
    win.document.open();
    win.document.write(getPrintHtml(product, settings, copies));
    win.document.close();
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch]));
  }

  return { print, getPrintHtml };
})();
