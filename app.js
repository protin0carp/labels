const LABEL_KEY = 'pc_label_settings_landscape_v1';
const PRODUCTS_KEY = 'pc_products_v4';
const LABEL_MM = { width: 55, height: 33.6 };
const RIYAL_MARK_SRC = 'data:image/png;base64,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';

const firebaseConfig = {
  apiKey: "AIzaSyDRXIyvDmGgoKRYJEm2pVBE1pv3SQSWlwk",
  authDomain: "protin-and-carp-labels.firebaseapp.com",
  projectId: "protin-and-carp-labels",
  storageBucket: "protin-and-carp-labels.firebasestorage.app",
  messagingSenderId: "946120100164",
  appId: "1:946120100164:web:b1608bc1688c6bdd3caf11",
  measurementId: "G-L5K2KDZTKQ"
};

let firebaseReady = false;
let db = null;
let fb = {};

async function initFirebase() {
  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js');
    const fsMod = await import('https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js');
    const app = appMod.initializeApp(firebaseConfig);
    db = fsMod.getFirestore(app);
    fb = fsMod;
    firebaseReady = true;
    setCloudStatus('متصل بالسحابة', true);
    return true;
  } catch (err) {
    console.error('Firebase init error:', err);
    setCloudStatus('حفظ محلي', false);
    return false;
  }
}

function setCloudStatus(text, ok = true) {
  const el = document.querySelector('.status');
  if (!el) return;
  el.innerHTML = `${text} <span></span>`;
  const dot = el.querySelector('span');
  if (dot) dot.style.background = ok ? '#caff39' : '#ffcf5a';
}

const defaultSettings = {
  desc: { x: 50, y: 31, size: 16, width: 78 },
  calories: { x: 20, y: 50, size: 10 },
  carbs: { x: 45, y: 50, size: 10 },
  protein: { x: 67, y: 50, size: 10 },
  fat: { x: 87, y: 50, size: 10 },
  expiry: { x: 22, y: 82, size: 9 },
  name: { x: 14, y: 92, size: 13, width: 28 }
};

const defaultProducts = [
  {id:'p1',name:'شوكر كرانشو',description:'دجاج باربكيو 200G',calories:532,carbs:38,protein:68,fat:12,price:15,currencyMode:'sr',shelfLifeDays:1},
  {id:'p2',name:'براونيز برتزل',description:'بروتين شوكولاتة سولتد كراميل 200G',calories:227.6,carbs:9,protein:22,fat:11.5,price:18,currencyMode:'sr',shelfLifeDays:3},
  {id:'p3',name:'تشيز كيك',description:'تشيز كيك فراولة لايت 180G',calories:310,carbs:26,protein:18,fat:14,price:20,currencyMode:'sr',shelfLifeDays:2}
];

let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null') || defaultProducts;
products = products.map(normalizeProduct);
let settings = JSON.parse(localStorage.getItem(LABEL_KEY) || 'null') || cloneDefaultSettings();
settings = mergeSettings(settings);
let selected = products[0] || null;
let editingProductId = null;
window.getSelectedProduct = () => selected;
window.selected = selected;
let selectedField = null;

function cloneDefaultSettings(){return JSON.parse(JSON.stringify(defaultSettings));}
function mergeSettings(saved){return {...cloneDefaultSettings(), ...(saved || {})};}
function normalizeProduct(p){
  return {
    id: p.id || 'p'+Date.now(),
    name: p.name || '',
    description: p.description || '',
    calories: Number(p.calories || 0),
    carbs: Number(p.carbs || 0),
    protein: Number(p.protein || 0),
    fat: Number(p.fat || 0),
    price: p.price ?? p.shelfLifeDays ?? '',
    currencyMode: p.currencyMode || p.currency || 'sr',
    shelfLifeDays: Number(p.shelfLifeDays || 1),
    active: p.active !== false,
    updatedAt: p.updatedAt || Date.now()
  };
}

function saveProducts(){
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}
function saveSettings(){
  localStorage.setItem(LABEL_KEY, JSON.stringify(settings));
}
async function cloudSaveProduct(p){
  saveProducts();
  if(!firebaseReady || !db) return;
  await fb.setDoc(fb.doc(db, 'products', p.id), {...p, updatedAt: Date.now()});
}
async function cloudDeleteProduct(id){
  saveProducts();
  if(!firebaseReady || !db) return;
  await fb.deleteDoc(fb.doc(db, 'products', id));
}
async function cloudSaveSettings(){
  saveSettings();
  if(!firebaseReady || !db) return;
  await fb.setDoc(fb.doc(db, 'labelSettings', 'default'), {...settings, updatedAt: Date.now()});
}
async function loadCloudData(){
  if(!firebaseReady || !db) return;
  try {
    const snap = await fb.getDocs(fb.collection(db, 'products'));
    if (snap.empty) {
      for (const p of products) await cloudSaveProduct(p);
    } else {
      products = snap.docs.map(d => normalizeProduct({id:d.id, ...d.data()}));
      products.sort((a,b)=>(b.updatedAt || 0) - (a.updatedAt || 0));
      saveProducts();
    }
    const sDoc = await fb.getDoc(fb.doc(db, 'labelSettings', 'default'));
    if (sDoc.exists()) {
      settings = mergeSettings(sDoc.data());
      saveSettings();
    } else {
      await cloudSaveSettings();
    }
    selected = products[0] || null;
    window.selected = selected;
    renderProducts();renderSelected();renderManage();renderEditor();
  } catch (err) {
    console.error('Firestore load error:', err);
    alert('تعذر تحميل بيانات السحابة. سيعمل النظام بالحفظ المحلي مؤقتاً.');
  }
}

function priceText(product){
  const v = product?.price ?? '';
  if(v === '') return '—';
  return `${v} SR`;
}
function priceHtml(product){
  const v = product?.price ?? '';
  if(v === '') return '—';
  return `<span class="price-number">${v} SR</span>`;
}
function autoFontSize(key, text, base){
  // حجم الخط الآن طبيعي ويأخذ الرقم من ضبط الملصق كما هو.
  return Number(base || 12);
}

function fitText(text,max=42){return String(text||'');}
function nav(view){document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('view-'+view).classList.add('active'); if(view==='settings') renderEditor();}
function renderProducts(){const q=(document.getElementById('searchInput')?.value||'').trim();const list=document.getElementById('productList');if(!list)return;list.innerHTML='';products.filter(p=>!q||p.name.includes(q)||p.description.includes(q)).forEach(p=>{const el=document.createElement('div');el.className='product-item '+(selected?.id===p.id?'active':'');el.innerHTML=`<h3>${p.name}</h3><p>${p.description}</p><div class="chips"><span>${priceText(p)}</span><span>الدهون ${p.fat}</span><span>بروتين ${p.protein}</span><span>كارب ${p.carbs}</span><span>السعرات ${p.calories}</span></div>`;el.onclick=()=>{selected=p;window.selected=p;renderProducts();renderSelected();renderEditor();};list.appendChild(el);});}
function renderSelected(){
  if(!selected)return;
  window.selected=selected;
  const ids={selectedName:selected.name,selectedDesc:selected.description,selectedCalories:selected.calories,selectedCarbs:selected.carbs,selectedProtein:selected.protein,selectedFat:selected.fat,selectedExp:priceText(selected)};
  Object.entries(ids).forEach(([id,val])=>{const el=document.getElementById(id); if(el) el.textContent=val;});
}
function makeLabel(product, editable=false){
  const wrap=document.createElement('div');
  wrap.className= editable?'label-preview editor-mode':'print-label';
  const map={desc:fitText(product.description,42),calories:product.calories,carbs:product.carbs,protein:product.protein,fat:product.fat,expiry:priceText(product),name:product.name};
  Object.keys(settings).forEach(key=>{
    const s=settings[key];
    const el=document.createElement('div');
    el.className='label-field '+key+(selectedField===key?' selected':'');
    el.dataset.key=key;
    if(key === 'expiry') { el.innerHTML = priceHtml(product); } else { el.textContent=map[key]; }
    el.style.left=s.x+'%';
    el.style.top=s.y+'%';
    el.style.fontSize=Number(s.size || 12)+'px';
    if(s.width)el.style.width=s.width+'%';
    if(editable){el.addEventListener('pointerdown',startDrag);}
    wrap.appendChild(el);
  });
  return wrap;
}
function renderEditor(){const host=document.getElementById('labelEditor');if(!host)return;const lbl=makeLabel(selected||products[0]||defaultProducts[0],true);host.replaceWith(lbl);lbl.id='labelEditor';updateFontSizeUI();}
let drag={active:false,key:null,rect:null};function startDrag(e){e.preventDefault();e.stopPropagation();selectedField=e.currentTarget.dataset.key;drag={active:true,key:selectedField,rect:document.getElementById('labelEditor').getBoundingClientRect()};document.body.style.touchAction='none';renderEditor();updateFontSizeUI();window.addEventListener('pointermove',onDrag);window.addEventListener('pointerup',endDrag,{once:true});}
function onDrag(e){if(!drag.active)return;const x=((e.clientX-drag.rect.left)/drag.rect.width)*100;const y=((e.clientY-drag.rect.top)/drag.rect.height)*100;settings[drag.key].x=Math.max(0,Math.min(100,x));settings[drag.key].y=Math.max(0,Math.min(100,y));renderEditor();}
function endDrag(){drag.active=false;document.body.style.touchAction='';window.removeEventListener('pointermove',onDrag);}
function moveSelected(dx,dy){if(!selectedField)return;settings[selectedField].x=Math.max(0,Math.min(100,settings[selectedField].x+dx));settings[selectedField].y=Math.max(0,Math.min(100,settings[selectedField].y+dy));renderEditor();}
function setFieldValue(id, value){const el=document.getElementById(id); if(el) el.value=value ?? '';}
function getFieldValue(id){return (document.getElementById(id)?.value || '').trim();}
function ensurePriceInput(){
  let input=document.getElementById('pPrice');
  const shelf = document.getElementById('pShelf');
  if(!input){
    if(!shelf) return;
    input=document.createElement('input');
    input.id='pPrice'; input.className='field'; input.placeholder='السعر'; input.type='number'; input.step='0.1';
    shelf.insertAdjacentElement('afterend', input);
    shelf.placeholder='الصلاحية بالأيام - اختياري';
  }
  if(!document.getElementById('pCurrency')){
    const select=document.createElement('select');
    select.id='pCurrency'; select.className='field';
    select.innerHTML='<option value="sr">SR</option><option value="symbol">رمز الريال الجديد</option>';
    input.insertAdjacentElement('afterend', select);
  }
}
function ensureCopiesInput(){
  const old=document.getElementById('copiesInput');
  if(!old) return;
  if(old.tagName.toLowerCase()==='input'){
    old.type='number'; old.min='1'; old.step='1'; old.inputMode='numeric'; old.value=old.value || '1';
    return;
  }
  const input=document.createElement('input');
  input.id='copiesInput'; input.className=old.className || 'field'; input.type='number'; input.min='1'; input.step='1'; input.inputMode='numeric'; input.value=old.value || '1';
  old.replaceWith(input);
}

function ensurePrintPriceToggle(){
  const copies = document.getElementById('copiesInput');
  if(!copies || document.getElementById('showPricePrint')) return;

  const wrap = document.createElement('label');
  wrap.id = 'showPricePrintWrap';
  wrap.className = 'print-option-row';
  wrap.innerHTML = `
    <input id="showPricePrint" type="checkbox" checked>
    <span>السعر</span>
  `;
  const parent = copies.closest('label') || copies.parentElement;
  if(parent) parent.insertAdjacentElement('afterend', wrap);
}

function getShowPricePrint(){
  const el = document.getElementById('showPricePrint');
  return !el || el.checked;
}

function ensureFontSizeDisplay(){
  const range=document.getElementById('fontSizeRange');
  if(!range || document.getElementById('fontSizeValue')) return;
  range.min='6'; range.max='40'; range.step='0.5';
  const div=document.createElement('div');
  div.id='fontSizeValue';
  div.className='font-size-value';
  div.textContent='حجم الخط: — px';
  range.insertAdjacentElement('afterend', div);
}
function updateFontSizeUI(){
  const range=document.getElementById('fontSizeRange');
  const label=document.getElementById('fontSizeValue');
  if(!range || !label) return;
  if(!selectedField){label.textContent='حجم الخط: اختر عنصراً من الملصق'; return;}
  const size=Number(settings[selectedField]?.size || 9);
  range.value=size;
  label.textContent=`حجم الخط: ${size}px`;
}
function clearProductForm(){
  editingProductId=null;
  ['pName','pDesc','pCalories','pCarbs','pProtein','pFat','pPrice'].forEach(id=>setFieldValue(id,''));
  setFieldValue('pShelf',1);
  setFieldValue('pCurrency','sr');
  const btn=document.getElementById('saveProductBtn'); if(btn) btn.textContent='➕ حفظ الصنف';
  const cancel=document.getElementById('cancelEditBtn'); if(cancel) cancel.style.display='none';
}
function fillProductForm(p){
  editingProductId=p.id;
  setFieldValue('pName',p.name);
  setFieldValue('pDesc',p.description);
  setFieldValue('pCalories',p.calories);
  setFieldValue('pCarbs',p.carbs);
  setFieldValue('pProtein',p.protein);
  setFieldValue('pFat',p.fat);
  setFieldValue('pPrice',p.price ?? '');
  setFieldValue('pCurrency',p.currencyMode || 'sr');
  setFieldValue('pShelf',p.shelfLifeDays || 1);
  const btn=document.getElementById('saveProductBtn'); if(btn) btn.textContent='💾 حفظ التعديل';
  const cancel=document.getElementById('cancelEditBtn'); if(cancel) cancel.style.display='block';
  nav('products');
}
function readProductForm(){
  return normalizeProduct({
    id: editingProductId || 'p'+Date.now(),
    name: getFieldValue('pName'),
    description: getFieldValue('pDesc'),
    calories: Number(getFieldValue('pCalories')),
    carbs: Number(getFieldValue('pCarbs')),
    protein: Number(getFieldValue('pProtein')),
    fat: Number(getFieldValue('pFat')),
    price: getFieldValue('pPrice') === '' ? '' : Number(getFieldValue('pPrice')),
    currencyMode: getFieldValue('pCurrency') || 'sr',
    shelfLifeDays: Number(getFieldValue('pShelf') || 1)
  });
}
function renderManage(){
  const host=document.getElementById('manageList');
  if(!host)return;
  host.innerHTML='';
  products.forEach(p=>{
    const el=document.createElement('div');
    el.className='product-item manage-item';
    el.innerHTML=`
      <div class="manage-info">
        <h3>${p.name}</h3>
        <p>${p.description}</p>
        <div class="chips"><span>${priceText(p)}</span><span>السعرات ${p.calories}</span><span>كارب ${p.carbs}</span><span>بروتين ${p.protein}</span><span>الدهون ${p.fat}</span></div>
      </div>
      <div class="manage-actions">
        <button type="button" class="mini edit-product">تعديل</button>
        <button type="button" class="mini danger delete-product">حذف</button>
      </div>`;
    el.querySelector('.edit-product').onclick=(e)=>{e.stopPropagation();fillProductForm(p);};
    el.querySelector('.delete-product').onclick=async(e)=>{
      e.stopPropagation();
      if(!confirm(`هل تريد حذف الصنف: ${p.name}؟`)) return;
      products=products.filter(x=>x.id!==p.id);
      if(selected?.id===p.id){selected=products[0]||null;window.selected=selected;}
      await cloudDeleteProduct(p.id);renderProducts();renderSelected();renderManage();renderEditor();
    };
    el.onclick=()=>{selected=p;window.selected=p;renderProducts();renderSelected();renderEditor();nav('print');};
    host.appendChild(el);
  });
}
document.addEventListener('DOMContentLoaded',async()=>{
  ensurePriceInput();ensureCopiesInput();ensurePrintPriceToggle();ensureFontSizeDisplay();
  document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>nav(b.dataset.view));
  document.getElementById('searchInput')?.addEventListener('input',renderProducts);
  document.getElementById('saveProductBtn')?.addEventListener('click',async()=>{
    const p=readProductForm();
    if(!p.name||!p.description)return alert('اكتب اسم الحلى والمحتويات');
    if([p.calories,p.carbs,p.protein,p.fat].some(v=>Number.isNaN(v))) return alert('تأكد من إدخال القيم الغذائية بالأرقام');
    if(p.price !== '' && Number.isNaN(Number(p.price))) return alert('تأكد من إدخال السعر بالأرقام');
    if(editingProductId){
      products=products.map(x=>x.id===editingProductId?p:x);
    }else{
      products.unshift(p);
    }
    selected=p;window.selected=p;
    await cloudSaveProduct(p);clearProductForm();renderProducts();renderSelected();renderManage();renderEditor();
    alert(editingProductId?'تم تعديل الصنف':'تم حفظ الصنف');
  });
  document.getElementById('cancelEditBtn')?.addEventListener('click',clearProductForm);
  document.getElementById('saveSettingsBtn')?.addEventListener('click',async()=>{await cloudSaveSettings();alert('تم حفظ إعدادات الملصق');});
  document.getElementById('resetSettingsBtn')?.addEventListener('click',async()=>{
    if(!confirm('هل تريد إعادة ضبط إعدادات الملصق الافتراضية؟ سيتم تطبيقها على كل الأصناف.')) return;
    settings=cloneDefaultSettings();await cloudSaveSettings();renderEditor();
  });
  document.getElementById('moveUp')?.addEventListener('click',()=>moveSelected(0,-.5));
  document.getElementById('moveDown')?.addEventListener('click',()=>moveSelected(0,.5));
  document.getElementById('moveLeft')?.addEventListener('click',()=>moveSelected(-.5,0));
  document.getElementById('moveRight')?.addEventListener('click',()=>moveSelected(.5,0));
  document.getElementById('fontSizeRange')?.addEventListener('input',e=>{if(!selectedField)return;settings[selectedField].size=Number(e.target.value);updateFontSizeUI();renderEditor();});
  window.selected=selected;renderProducts();renderSelected();renderManage();renderEditor();
  if(await initFirebase()) await loadCloudData();
});







(function categoryLightPatchV2(){
  const CATS = [
    {id:'protein', label:'بروتين وكارب'},
    {id:'yomelz', label:'يوملز'}
  ];
  let activeCategory = localStorage.getItem('pc_active_category_v2') || 'protein';

  function getProductCategory(p){ return p?.category || 'protein'; }

  function ensureCategorySelect(){
    if(document.getElementById('pCategory')) return;
    const anchor = document.getElementById('pCurrency') || document.getElementById('pName');
    if(!anchor) return;
    const select = document.createElement('select');
    select.id = 'pCategory';
    select.className = anchor.className || 'field';
    select.innerHTML = CATS.map(c=>`<option value="${c.id}">${c.label}</option>`).join('');
    anchor.insertAdjacentElement('afterend', select);
  }

  function ensureTabsAndSearch(){
    const productList = document.getElementById('productList');
    if(productList && !document.getElementById('pcProductTabs')){
      const tabs = document.createElement('div');
      tabs.id = 'pcProductTabs';
      tabs.className = 'pc-category-tabs';
      tabs.innerHTML = CATS.map(c=>`<button type="button" data-cat="${c.id}">${c.label}</button>`).join('');
      productList.insertAdjacentElement('beforebegin', tabs);
      tabs.addEventListener('click', e=>{
        const b = e.target.closest('button[data-cat]');
        if(!b) return;
        activeCategory = b.dataset.cat;
        localStorage.setItem('pc_active_category_v2', activeCategory);
        updateTabs();
        renderProducts();
        renderManage();
      });
    }

    const manageList = document.getElementById('manageList');
    if(manageList && !document.getElementById('pcManageSearch')){
      const input = document.createElement('input');
      input.id = 'pcManageSearch';
      input.className = 'field pc-manage-search';
      input.placeholder = 'بحث سريع...';
      input.autocomplete = 'off';
      manageList.insertAdjacentElement('beforebegin', input);
      input.addEventListener('input', renderManage);
    }
    updateTabs();
  }

  function updateTabs(){
    document.querySelectorAll('.pc-category-tabs button').forEach(b=>{
      b.classList.toggle('active', b.dataset.cat === activeCategory);
    });
  }

  const oldReadProductForm = readProductForm;
  readProductForm = function(){
    const p = oldReadProductForm();
    p.category = document.getElementById('pCategory')?.value || activeCategory || 'protein';
    return p;
  };

  const oldFillProductForm = fillProductForm;
  fillProductForm = function(p){
    oldFillProductForm(p);
    ensureCategorySelect();
    const el = document.getElementById('pCategory');
    if(el) el.value = getProductCategory(p);
  };

  const oldClearProductForm = clearProductForm;
  clearProductForm = function(){
    oldClearProductForm();
    ensureCategorySelect();
    const el = document.getElementById('pCategory');
    if(el) el.value = activeCategory || 'protein';
  };

  renderProducts = function(){
    ensureTabsAndSearch();
    const q=(document.getElementById('searchInput')?.value||'').trim();
    const list=document.getElementById('productList');
    if(!list)return;
    list.innerHTML='';
    products
      .filter(p=>getProductCategory(p) === activeCategory)
      .filter(p=>!q||p.name.includes(q)||p.description.includes(q))
      .forEach(p=>{
        const el=document.createElement('div');
        el.className='product-item '+(selected?.id===p.id?'active':'');
        el.innerHTML=`<h3>${p.name}</h3><p>${p.description}</p><div class="chips"><span>${priceText(p)}</span><span>الدهون ${p.fat}</span><span>بروتين ${p.protein}</span><span>كارب ${p.carbs}</span><span>السعرات ${p.calories}</span></div>`;
        el.onclick=()=>{selected=p;window.selected=p;renderProducts();renderSelected();renderEditor();};
        list.appendChild(el);
      });
  };

  renderManage = function(){
    ensureTabsAndSearch();
    const host=document.getElementById('manageList');
    if(!host)return;
    const q=(document.getElementById('pcManageSearch')?.value||'').trim();
    host.innerHTML='';
    products
      .filter(p=>getProductCategory(p) === activeCategory)
      .filter(p=>!q||p.name.includes(q)||p.description.includes(q))
      .forEach(p=>{
        const el=document.createElement('div');
        el.className='product-item manage-item';
        el.innerHTML=`
          <div class="manage-info">
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <div class="chips"><span>${priceText(p)}</span><span>السعرات ${p.calories}</span><span>كارب ${p.carbs}</span><span>بروتين ${p.protein}</span><span>الدهون ${p.fat}</span></div>
          </div>
          <div class="manage-actions">
            <button type="button" class="mini edit-product">تعديل</button>
            <button type="button" class="mini danger delete-product">حذف</button>
          </div>`;
        el.querySelector('.edit-product').onclick=(e)=>{e.stopPropagation();fillProductForm(p);};
        el.querySelector('.delete-product').onclick=async(e)=>{
          e.stopPropagation();
          if(!confirm(`هل تريد حذف الصنف: ${p.name}؟`)) return;
          products=products.filter(x=>x.id!==p.id);
          if(selected?.id===p.id){selected=products[0]||null;window.selected=selected;}
          await cloudDeleteProduct(p.id);renderProducts();renderSelected();renderManage();renderEditor();
        };
        el.onclick=()=>{selected=p;window.selected=p;renderProducts();renderSelected();renderEditor();nav('print');};
        host.appendChild(el);
      });
  };

  document.addEventListener('DOMContentLoaded',()=>{
    ensureCategorySelect();
    ensureTabsAndSearch();
    renderProducts();
    renderManage();
  });
})();



(function printButtonHardFixV2(){
  function readCopies(){
    const n = parseInt(document.getElementById('copiesInput')?.value || '1', 10);
    return Math.max(1, Number.isFinite(n) ? n : 1);
  }
  function readShowPrice(){
    const el = document.getElementById('showPricePrint');
    return !el || el.checked;
  }
  function currentProduct(){
    if(typeof window.getSelectedProduct === 'function') return window.getSelectedProduct();
    if(window.selected) return window.selected;
    try { if(typeof selected !== 'undefined') return selected; } catch(_) {}
    return null;
  }
  function runPrint(test=false){
    const product = currentProduct();
    if(!product){ alert('اختر الصنف أولاً'); return; }
    const fn = window.buildPrintDocument || (typeof buildPrintDocument === 'function' ? buildPrintDocument : null);
    if(!fn){ alert('ملف الطباعة غير محمل. تأكد من رفع printer.js'); return; }
    try{
      const result = fn(product, test ? 1 : readCopies(), test, { showPrice: readShowPrice() });
      if(result && typeof result.catch === 'function'){
        result.catch(err=>{
          console.error(err);
          alert('تعذر تجهيز الطباعة.');
        });
      }
    }catch(err){
      console.error(err);
      alert('تعذر تجهيز الطباعة.');
    }
  }
  document.addEventListener('click', function(e){
    const btn = e.target.closest && e.target.closest('#printBtn,#testPrintBtn');
    if(!btn) return;
    e.preventDefault();
    e.stopPropagation();
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    runPrint(btn.id === 'testPrintBtn');
  }, true);
})();


(function forceSRModeV2(){
  function apply(){
    const cur = document.getElementById('pCurrency');
    if(cur){
      cur.value = 'sr';
      cur.style.display = 'none';
    }
  }
  document.addEventListener('DOMContentLoaded', apply);
  setInterval(apply, 1200);
})();
