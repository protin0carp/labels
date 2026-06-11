function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getExpiryDate(product) {
  const days = Number(product?.shelfLifeDays || 1);
  const d = new Date();
  d.setDate(d.getDate() + days);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");

  return `${yyyy}/${mm}/${dd}`;
}

function buildPrintDocument(product, copies = 1, test = false) {
  const data = test
    ? {
        name: "اختبار وضوح",
        description: "دجاج باربكيو 200G",
        calories: 322,
        carbs: 34,
        protein: 6,
        fat: 14,
        shelfLifeDays: 1
      }
    : product;

  if (!data) {
    alert("اختر الصنف أولاً");
    return;
  }

  const printWin = window.open("", "_blank", "width=420,height=700");

  if (!printWin) {
    alert("المتصفح منع نافذة الطباعة. اسمح بالنوافذ المنبثقة.");
    return;
  }

  const expiry = getExpiryDate(data);

  let labels = "";

  for (let i = 0; i < copies; i++) {
    labels += `
      <div class="label">
        <div class="desc">${escapeHtml(data.description)}</div>

        <div class="num calories">${escapeHtml(data.calories)}</div>
        <div class="num carbs">${escapeHtml(data.carbs)}</div>
        <div class="num protein">${escapeHtml(data.protein)}</div>
        <div class="num fat">${escapeHtml(data.fat)}</div>

        <div class="expiry">${escapeHtml(expiry)}</div>
        <div class="product-name">${escapeHtml(data.name)}</div>
      </div>
    `;
  }

  printWin.document.open();
  printWin.document.write(`
<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>Print Label</title>

<style>
  @page {
    size: 33.6mm 55mm;
    margin: 0;
  }

  html,
  body {
    margin: 0;
    padding: 0;
    width: 33.6mm;
    background: #fff;
    font-family: Arial, Tahoma, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .label {
    position: relative;
    width: 33.6mm;
    height: 55mm;
    overflow: hidden;
    background: transparent;
    page-break-after: always;
    break-after: page;
  }

  .desc {
    position: absolute;
    top: 17.8mm;
    left: 1.5mm;
    width: 30.5mm;
    text-align: center;
    font-size: 7.3pt;
    font-weight: 700;
    line-height: 1.05;
    color: #000;
    white-space: normal;
  }

  .num {
    position: absolute;
    top: 29.2mm;
    width: 6mm;
    text-align: center;
    font-size: 8pt;
    font-weight: 700;
    color: #000;
    direction: ltr;
  }

  .calories { left: 2.2mm; }
  .carbs    { left: 9.7mm; }
  .protein  { left: 17.2mm; }
  .fat      { left: 24.6mm; }

  .expiry {
    position: absolute;
    top: 42.2mm;
    left: 6.5mm;
    width: 22mm;
    text-align: left;
    font-size: 7pt;
    font-weight: 700;
    color: #000;
    direction: ltr;
  }

  .product-name {
    position: absolute;
    top: 47mm;
    left: 1.5mm;
    width: 30.5mm;
    text-align: center;
    font-size: 7.2pt;
    font-weight: 700;
    line-height: 1.05;
    color: #000;
  }

  @media print {
    html,
    body {
      width: 33.6mm;
      margin: 0;
      padding: 0;
      background: #fff;
    }

    .label {
      width: 33.6mm;
      height: 55mm;
    }
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
      }, 400);
    };
  <\/script>
</body>
</html>
  `);

  printWin.document.close();
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("printBtn")?.addEventListener("click", () => {
    const copiesInput = document.getElementById("copiesInput");
    const copies = Math.max(1, Number(copiesInput?.value || 1));
    buildPrintDocument(window.selected || selected, copies, false);
  });

  document.getElementById("testPrintBtn")?.addEventListener("click", () => {
    buildPrintDocument(window.selected || selected, 1, true);
  });
});
