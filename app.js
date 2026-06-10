const STORAGE_KEYS = {
  products: 'pcl_products_v1',
  settings: 'pcl_label_settings_v1'
};

const defaultProducts = [
  { id: crypto.randomUUID(), name: 'شوكر كرانشو', description: 'دجاج باربكيو 200G', calories: 532, carbs: 38, protein: 68, fat: 12, shelfLifeDays: 1, active: true },
  { id: crypto.randomUUID(), name: 'براونيز بروتين', description: 'بروتين شوكولاتة سولتد كراميل 200G', calories: 227.6, carbs: 9, protein: 22, fat: 11.5, shelfLifeDays: 3, active: true },
  { id: crypto.randomUUID(), name: 'تشيز كيك', description: 'تشيز كيك فراولة لايت 180G', calories: 310, carbs: 24, protein: 18, fat: 14, shelfLifeDays: 2, active: true }
];

// الإحداثيات بالمليمتر على قالب 70×50
// هذه القيم هي الوضع الطبيعي المعتمد. قسم ضبط الملصق للطوارئ فقط.
const defaultSettings = {
  description: { x: 35.0, y: 15.2, font: 8.2, maxWidth: 44, align: 'center' },
  calories:    { x: 10.2, y: 28.2, font: 9.4, maxWidth: 12, align: 'center' },
  carbs:       { x: 27.0, y: 28.2, font: 9.4, maxWidth: 12, align: 'center' },
  protein:     { x: 43.5, y: 28.2, font: 9.4, maxWidth: 12, align: 'center' },
  fat:         { x: 60.2, y: 28.2, font: 9.4, maxWidth: 12, align: 'center' },
  expiry:      { x: 20.4, y: 44.2, font: 8.0, maxWidth: 24, align: 'left' },
  name:        { x: 25.0, y: 47.8, font: 7.4, maxWidth: 34, align: 'center' }
};

let products = load(STORAGE_KEYS.products, defaultProducts);
let settings = load(STORAGE_KEYS.settings, defaultSettings);
let selectedProduct = products[0] || null;
let activeLayerKey = null;
let firestoreReady = false;
let productsSyncTimer = null;
let settingsSyncTimer = null;

const layerLabels = {
  description: 'المحتويات', calories: 'Calories', carbs: 'Carbs', protein: 'Protein', fat: 'Fat', expiry: 'تاريخ الانتهاء', name: 'اسم الحلى'
};

window.LabelAppUtils = {
  getExpiryDate,
  buildLayerData(product, expiry, s = settings) {
    if (!product) return [];
    return [
      { key: 'description', text: autoBreak(product.description, 24), ...s.description },
      { key: 'calories', text: product.calories, ...s.calories },
      { key: 'carbs', text: product.carbs, ...s.carbs },
      { key: 'protein', text: product.protein, ...s.protein },
      { key: 'fat', text: product.fat, ...s.fat },
      { key: 'expiry', text: expiry, ...s.expiry },
      { key: 'name', text: product.name, ...s.name }
    ].map(layer => ({ ...layer, font: fitFont(String(layer.text), layer.font, layer.key) }));
  }
};

document.addEventListener('DOMContentLoaded', init);

function init() {
  bindNavigation();
  bindProducts();
  bindPrinting();
  bindEditor();
  renderAll();
  syncFromFirestore();
}

function bindNavigation() {
  document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.view).classList.add('active');
    const titles = { printView:'طباعة الملصقات', productsView:'إدارة الأصناف', settingsView:'ضبط إعدادات الملصق', printerView:'إعدادات الطابعة' };
    document.getElementById('pageTitle').textContent = titles[btn.dataset.view];
  }));
}

function bindProducts() {
  document.getElementById('searchInput').addEventListener('input', renderProductList);
  document.getElementById('clearFormBtn').addEventListener('click', clearForm);
  document.getElementById('productForm').addEventListener('submit', e => {
    e.preventDefault();
    const id = document.getElementById('productId').value || crypto.randomUUID();
    const product = {
      id,
      name: val('productName'), description: val('productDescription'),
      calories: num('calories'), carbs: num('carbs'), protein: num('protein'), fat: num('fat'),
      shelfLifeDays: Number(document.getElementById('shelfLife').value || 0), active: true
    };
    const idx = products.findIndex(p => p.id === id);
    if (idx >= 0) products[idx] = product; else products.unshift(product);
    selectedProduct = product;
    save(STORAGE_KEYS.products, products);
    clearForm(); renderAll();
  });
}

function bindPrinting() {
  document.getElementById('printBtn').addEventListener('click', () => PrinterModule.print(selectedProduct, settings, Number(document.getElementById('copiesInput').value || 1)));
  document.getElementById('testPrintBtn').addEventListener('click', () => PrinterModule.print(selectedProduct, settings, 1));
  document.getElementById('printerTestBtn').addEventListener('click', () => PrinterModule.print(selectedProduct, settings, 1));
}

function bindEditor() {
  document.getElementById('saveSettingsBtn').addEventListener('click', () => { save(STORAGE_KEYS.settings, settings); toast('تم حفظ إعدادات الملصق'); });
  document.getElementById('resetSettingsBtn').addEventListener('click', () => {
    if(confirm('إرجاع إعدادات الملصق للوضع الافتراضي؟')) { settings = structuredClone(defaultSettings); save(STORAGE_KEYS.settings, settings); renderAll(); }
  });
  document.querySelectorAll('.nudge').forEach(btn => btn.addEventListener('click', () => {
    if (!activeLayerKey) return;
    settings[activeLayerKey].x += Number(btn.dataset.dx) * 0.2;
    settings[activeLayerKey].y += Number(btn.dataset.dy) * 0.2;
    renderLabel('labelEditor', true); renderLabel('labelPreview', false);
  }));
  document.getElementById('fontSizeRange').addEventListener('input', e => {
    if (!activeLayerKey) return;
    settings[activeLayerKey].font = Number(e.target.value);
    renderLabel('labelEditor', true); renderLabel('labelPreview', false);
  });
}

function renderAll() { renderProductList(); renderManageList(); renderSelected(); renderLabel('labelPreview', false); renderLabel('labelEditor', true); }

function renderProductList() {
  const q = document.getElementById('searchInput').value.trim();
  const list = document.getElementById('productList');
  const filtered = products.filter(p => !q || `${p.name} ${p.description}`.includes(q));
  list.innerHTML = filtered.map(p => productItemHtml(p, p.id === selectedProduct?.id)).join('') || '<p class="hint">لا توجد نتائج.</p>';
  list.querySelectorAll('.product-item').forEach(el => el.addEventListener('click', () => { selectedProduct = products.find(p => p.id === el.dataset.id); renderAll(); }));
}

function productItemHtml(p, active=false) {
  return `<div class="product-item ${active ? 'active' : ''}" data-id="${p.id}">
    <div><strong>${escapeHtml(p.name)}</strong><small>${escapeHtml(p.description)}</small></div>
    <div class="nutrition-mini"><span>C ${p.calories}</span><span>Carb ${p.carbs}</span><span>P ${p.protein}</span><span>F ${p.fat}</span></div>
  </div>`;
}

function renderSelected() {
  document.getElementById('selectedBadge').textContent = selectedProduct ? 'جاهز للطباعة' : 'لم يتم الاختيار';
  document.getElementById('selectedDetails').innerHTML = selectedProduct ? `
    <h3>${escapeHtml(selectedProduct.name)}</h3><p>${escapeHtml(selectedProduct.description)}</p>
    <div class="nutrition-grid"><div><b>${selectedProduct.calories}</b><span>Calories</span></div><div><b>${selectedProduct.carbs}</b><span>Carbs</span></div><div><b>${selectedProduct.protein}</b><span>Protein</span></div><div><b>${selectedProduct.fat}</b><span>Fat</span></div></div>
    <p style="margin-top:12px">Exp: ${getExpiryDate(selectedProduct.shelfLifeDays)}</p>` : '<p class="hint">اختر صنفاً من القائمة.</p>';
}

function renderManageList() {
  document.getElementById('countBadge').textContent = `${products.length} صنف`;
  document.getElementById('manageList').innerHTML = products.map(p => `<div class="manage-row"><div><strong>${escapeHtml(p.name)}</strong><br><small>${escapeHtml(p.description)}</small></div><div class="manage-actions"><button class="small-btn edit-btn" data-edit="${p.id}">تعديل</button><button class="small-btn delete-btn" data-del="${p.id}">حذف</button></div></div>`).join('');
  document.querySelectorAll('[data-edit]').forEach(btn => btn.addEventListener('click', () => fillForm(products.find(p => p.id === btn.dataset.edit))));
  document.querySelectorAll('[data-del]').forEach(btn => btn.addEventListener('click', () => { if(confirm('حذف الصنف؟')) { products = products.filter(p => p.id !== btn.dataset.del); selectedProduct = products[0] || null; save(STORAGE_KEYS.products, products); renderAll(); } }));
}

function renderLabel(containerId, editable) {
  const el = document.getElementById(containerId);
  const expiry = getExpiryDate(selectedProduct?.shelfLifeDays || 1);
  const layers = window.LabelAppUtils.buildLayerData(selectedProduct || products[0], expiry, settings);
  el.classList.toggle('grid-on', editable);
  el.innerHTML = layers.map(layer => {
    const left = mmToPctX(layer.x);
    const top = mmToPctY(layer.y);
    const maxWidth = mmToPctX(layer.maxWidth || 40);
    const fontSize = stageFont(layer.font);
    return `<div class="label-text ${layer.key} ${['calories','carbs','protein','fat'].includes(layer.key)?'number':''} ${activeLayerKey===layer.key?'active':''}" data-key="${layer.key}" style="left:${left}%;top:${top}%;font-size:${fontSize};max-width:${maxWidth}%;text-align:${layer.align || 'center'}">${escapeHtml(layer.text)}</div>`;
  }).join('');
  if (editable) enableDrag(el);
}

function enableDrag(container) {
  container.querySelectorAll('.label-text').forEach(node => {
    node.addEventListener('pointerdown', ev => {
      ev.preventDefault(); ev.stopPropagation();
      activeLayerKey = node.dataset.key;
      document.getElementById('activeLayerName').textContent = layerLabels[activeLayerKey];
      document.getElementById('fontSizeRange').value = settings[activeLayerKey].font;
      node.setPointerCapture(ev.pointerId);
      const start = { x: ev.clientX, y: ev.clientY, lx: settings[activeLayerKey].x, ly: settings[activeLayerKey].y };
      function move(e) {
        e.preventDefault();
        const rect = container.getBoundingClientRect();
        settings[activeLayerKey].x = clamp(start.lx + ((e.clientX - start.x) / rect.width) * 70, 0, 70);
        settings[activeLayerKey].y = clamp(start.ly + ((e.clientY - start.y) / rect.height) * 50, 0, 50);
        renderLabel('labelEditor', true); renderLabel('labelPreview', false);
      }
      function up() { node.removeEventListener('pointermove', move); node.removeEventListener('pointerup', up); }
      node.addEventListener('pointermove', move);
      node.addEventListener('pointerup', up);
    }, { passive:false });
  });
}

function fillForm(p) { if(!p) return; setVal('productId', p.id); setVal('productName', p.name); setVal('productDescription', p.description); setVal('calories', p.calories); setVal('carbs', p.carbs); setVal('protein', p.protein); setVal('fat', p.fat); setVal('shelfLife', p.shelfLifeDays); }
function clearForm(){ document.getElementById('productForm').reset(); setVal('productId',''); setVal('shelfLife',1); }
function getExpiryDate(days=1){ const d=new Date(); d.setDate(d.getDate()+Number(days||0)); return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`; }
function autoBreak(text, limit=24){ text=String(text||''); if(text.length<=limit) return text; const words=text.split(' '); let a='',b=''; for(const w of words){ if((a+' '+w).trim().length<=limit) a=(a+' '+w).trim(); else b=(b+' '+w).trim(); } return `${a}\n${b}`.trim(); }
function fitFont(text, base, key){ if(!['description','name'].includes(key)) return base; const len=text.replace(/\s/g,'').length; if(len>32) return Math.max(6, base-3); if(len>24) return Math.max(7, base-2); if(len>18) return Math.max(8, base-1); return base; }
function mmToPctX(mm){ return (Number(mm) / 70) * 100; }
function mmToPctY(mm){ return (Number(mm) / 50) * 100; }
function stageFont(pt){ return `clamp(8px, ${(Number(pt) * 0.32).toFixed(3)}cqw, 26px)`; }
function load(key, fallback){ try{return JSON.parse(localStorage.getItem(key)) || structuredClone(fallback)}catch{return structuredClone(fallback)} }

function save(key, value){
  localStorage.setItem(key, JSON.stringify(value));
  if (key === STORAGE_KEYS.products) queueProductsSync();
  if (key === STORAGE_KEYS.settings) queueSettingsSync();
}

async function syncFromFirestore(){
  if (!window.db) {
    console.warn('Firestore غير متصل: تأكد من firebase-config.js');
    return;
  }
  try {
    firestoreReady = true;
    document.getElementById('printerStatus').textContent = '🟢 Firestore متصل';

    const productsSnap = await window.db.collection('products').get();
    if (productsSnap.empty) {
      products = defaultProducts.map(p => ({ ...p }));
      selectedProduct = products[0] || null;
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
      await writeProductsToFirestore();
    } else {
      products = productsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      products.sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''), 'ar'));
      selectedProduct = products[0] || null;
      localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(products));
    }

    const settingsDoc = await window.db.collection('labelSettings').doc('default').get();
    if (settingsDoc.exists) {
      settings = mergeSettings(defaultSettings, settingsDoc.data());
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
    } else {
      await window.db.collection('labelSettings').doc('default').set(settings);
    }

    renderAll();
    toast('تم ربط البيانات مع Firestore');
  } catch (error) {
    console.error(error);
    document.getElementById('printerStatus').textContent = '🟡 يعمل محلياً - تحقق من Firestore';
    toast('تعذر الاتصال بـ Firestore، النظام يعمل محلياً');
  }
}

function mergeSettings(base, incoming){
  const merged = structuredClone(base);
  Object.keys(incoming || {}).forEach(key => {
    if (merged[key] && typeof incoming[key] === 'object') merged[key] = { ...merged[key], ...incoming[key] };
  });
  return merged;
}

function queueProductsSync(){
  if (!firestoreReady || !window.db) return;
  clearTimeout(productsSyncTimer);
  productsSyncTimer = setTimeout(writeProductsToFirestore, 450);
}

function queueSettingsSync(){
  if (!firestoreReady || !window.db) return;
  clearTimeout(settingsSyncTimer);
  settingsSyncTimer = setTimeout(() => {
    window.db.collection('labelSettings').doc('default').set(settings, { merge: true })
      .catch(err => console.error('settings sync error', err));
  }, 450);
}

async function writeProductsToFirestore(){
  if (!window.db) return;
  const batch = window.db.batch();
  const col = window.db.collection('products');
  const currentIds = new Set(products.map(p => p.id));
  const existing = await col.get();

  existing.docs.forEach(doc => {
    if (!currentIds.has(doc.id)) batch.delete(doc.ref);
  });

  products.forEach(product => {
    const id = product.id || crypto.randomUUID();
    product.id = id;
    batch.set(col.doc(id), product, { merge: true });
  });

  await batch.commit();
}

function val(id){ return document.getElementById(id).value.trim(); } function num(id){ return Number(document.getElementById(id).value || 0); } function setVal(id,v){ document.getElementById(id).value=v; }
function escapeHtml(value){ return String(value ?? '').replace(/[&<>'"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#39;', '"':'&quot;' }[ch])); }
function clamp(v,min,max){ return Math.max(min, Math.min(max, v)); }
function toast(msg){ const t=document.createElement('div'); t.textContent=msg; t.style.cssText='position:fixed;bottom:22px;left:22px;background:#315f2c;color:#fff;padding:13px 18px;border-radius:16px;z-index:9999;font-weight:900;box-shadow:0 10px 30px rgba(0,0,0,.2)'; document.body.appendChild(t); setTimeout(()=>t.remove(),1800); }
