const LABEL_KEY = 'pc_label_settings_landscape_v1';
const PRODUCTS_KEY = 'pc_products_v4';
const LABEL_MM = { width: 55, height: 33.6 };
const defaultSettings = {
  desc: { x: 50, y: 31, size: 7.6, width: 78 },
  calories: { x: 20, y: 50, size: 10 },
  carbs: { x: 45, y: 50, size: 10 },
  protein: { x: 67, y: 50, size: 10 },
  fat: { x: 87, y: 50, size: 10 },
  expiry: { x: 22, y: 82, size: 8.8 },
  name: { x: 14, y: 92, size: 8.2, width: 28 }
};
let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null') || [
  {id:'p1',name:'شوكر كرانشو',description:'دجاج باربكيو 200G',calories:532,carbs:38,protein:68,fat:12,shelfLifeDays:1,price:15},
  {id:'p2',name:'براونيز برتزل',description:'بروتين شوكولاتة سولتد كراميل 200G',calories:227.6,carbs:9,protein:22,fat:11.5,shelfLifeDays:3,price:18},
  {id:'p3',name:'تشيز كيك',description:'تشيز كيك فراولة لايت 180G',calories:310,carbs:26,protein:18,fat:14,shelfLifeDays:2,price:16}
];
let settings = JSON.parse(localStorage.getItem(LABEL_KEY) || 'null') || cloneDefaultSettings();
function cloneDefaultSettings(){return JSON.parse(JSON.stringify(defaultSettings));}
let selected = products[0];
let editingProductId = null;
window.getSelectedProduct = () => selected;
let selectedField = null;
function saveProducts(){localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));}
function saveSettings(){localStorage.setItem(LABEL_KEY, JSON.stringify(settings));}
function expiryDate(days){const d=new Date();d.setDate(d.getDate()+Number(days||1));return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;}
function fitText(text,max=42){text=String(text||'');if(text.length<=max)return text;const mid=Math.ceil(text.length/2);let cut=text.lastIndexOf(' ',mid);if(cut<10)cut=mid;return text.slice(0,cut).trim()+"\n"+text.slice(cut).trim();}
function nav(view){document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('view-'+view).classList.add('active'); if(view==='settings') renderEditor();}
function renderProducts(){const q=(document.getElementById('searchInput')?.value||'').trim();const list=document.getElementById('productList');if(!list)return;list.innerHTML='';products.filter(p=>!q||p.name.includes(q)||p.description.includes(q)).forEach(p=>{const el=document.createElement('div');el.className='product-item '+(selected?.id===p.id?'active':'');el.innerHTML=`<h3>${p.name}</h3><p>${p.description}</p><div class="chips"><span>F ${p.fat}</span><span>P ${p.protein}</span><span>C ${p.carbs}</span><span>Cal ${p.calories}</span></div>`;el.onclick=()=>{selected=p;window.selected=p;renderProducts();renderSelected();renderEditor();};list.appendChild(el);});}
function renderSelected(){
  if(!selected)return;
  window.selected=selected;
  const ids={selectedName:selected.name,selectedDesc:selected.description,selectedCalories:selected.calories,selectedCarbs:selected.carbs,selectedProtein:selected.protein,selectedFat:selected.fat,selectedExp:(selected.price ?? selected.shelfLifeDays ?? '') + ' SR'};
  Object.entries(ids).forEach(([id,val])=>{const el=document.getElementById(id); if(el) el.textContent=val;});
}
function makeLabel(product, editable=false){const wrap=document.createElement('div');wrap.className= editable?'label-preview editor-mode':'print-label';const map={desc:fitText(product.description,42),calories:product.calories,carbs:product.carbs,protein:product.protein,fat:product.fat,expiry:((product.price ?? product.shelfLifeDays ?? '') + ' SR'),name:product.name};Object.keys(settings).forEach(key=>{const s=settings[key];const el=document.createElement('div');el.className='label-field '+key+(selectedField===key?' selected':'');el.dataset.key=key;el.textContent=map[key];el.style.left=s.x+'%';el.style.top=s.y+'%';el.style.fontSize=s.size+'px';if(s.width)el.style.width=s.width+'%';if(editable){el.addEventListener('pointerdown',startDrag);}wrap.appendChild(el);});return wrap;}
function renderEditor(){const host=document.getElementById('labelEditor');if(!host)return;const lbl=makeLabel(selected||products[0],true);host.replaceWith(lbl);lbl.id='labelEditor';updateFontSizeControl();}
let drag={active:false,key:null,rect:null};function startDrag(e){e.preventDefault();e.stopPropagation();selectedField=e.currentTarget.dataset.key;updateFontSizeControl();drag={active:true,key:selectedField,rect:document.getElementById('labelEditor').getBoundingClientRect()};document.body.style.touchAction='none';renderEditor();window.addEventListener('pointermove',onDrag);window.addEventListener('pointerup',endDrag,{once:true});}
function onDrag(e){if(!drag.active)return;const x=((e.clientX-drag.rect.left)/drag.rect.width)*100;const y=((e.clientY-drag.rect.top)/drag.rect.height)*100;settings[drag.key].x=Math.max(0,Math.min(100,x));settings[drag.key].y=Math.max(0,Math.min(100,y));renderEditor();}
function endDrag(){drag.active=false;document.body.style.touchAction='';window.removeEventListener('pointermove',onDrag);}
function moveSelected(dx,dy){if(!selectedField)return;settings[selectedField].x=Math.max(0,Math.min(100,settings[selectedField].x+dx));settings[selectedField].y=Math.max(0,Math.min(100,settings[selectedField].y+dy));renderEditor();}
function setFieldValue(id, value){const el=document.getElementById(id); if(el) el.value=value ?? '';}
function getFieldValue(id){return (document.getElementById(id)?.value || '').trim();}
function clearProductForm(){
  editingProductId=null;
  ['pName','pDesc','pCalories','pCarbs','pProtein','pFat','pPrice'].forEach(id=>setFieldValue(id,''));
  setFieldValue('pShelf','');
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
  setFieldValue('pShelf',p.price ?? p.shelfLifeDays ?? '');
  const btn=document.getElementById('saveProductBtn'); if(btn) btn.textContent='💾 حفظ التعديل';
  const cancel=document.getElementById('cancelEditBtn'); if(cancel) cancel.style.display='block';
  nav('products');
}
function readProductForm(){
  return {
    id: editingProductId || 'p'+Date.now(),
    name: getFieldValue('pName'),
    description: getFieldValue('pDesc'),
    calories: Number(getFieldValue('pCalories')),
    carbs: Number(getFieldValue('pCarbs')),
    protein: Number(getFieldValue('pProtein')),
    fat: Number(getFieldValue('pFat')),
    price: Number(getFieldValue('pPrice') || getFieldValue('pShelf') || 0),
    shelfLifeDays: 1
  };
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
        <div class="chips"><span>${p.price ?? ''} SR</span><span>${p.calories} Cal</span><span>${p.carbs} C</span><span>${p.protein} P</span><span>${p.fat} F</span></div>
      </div>
      <div class="manage-actions">
        <button type="button" class="mini edit-product">تعديل</button>
        <button type="button" class="mini danger delete-product">حذف</button>
      </div>`;
    el.querySelector('.edit-product').onclick=(e)=>{e.stopPropagation();fillProductForm(p);};
    el.querySelector('.delete-product').onclick=(e)=>{
      e.stopPropagation();
      if(!confirm(`هل تريد حذف الصنف: ${p.name}؟`)) return;
      products=products.filter(x=>x.id!==p.id);
      if(selected?.id===p.id){selected=products[0]||null;window.selected=selected;}
      saveProducts();renderProducts();renderSelected();renderManage();renderEditor();
    };
    el.onclick=()=>{selected=p;window.selected=p;renderProducts();renderSelected();renderEditor();nav('print');};
    host.appendChild(el);
  });
}

function updateFontSizeControl(){
  const range=document.getElementById('fontSizeRange');
  const label=document.getElementById('fontSizeValue') || document.getElementById('fontSizeLabel');
  if(!range) return;
  if(selectedField && settings[selectedField]) range.value=settings[selectedField].size;
  if(label) label.textContent = selectedField ? `حجم الخط: ${settings[selectedField].size}px` : 'اختر عنصر لعرض حجم الخط';
}

document.addEventListener('DOMContentLoaded',()=>{
  document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>nav(b.dataset.view));
  document.getElementById('searchInput')?.addEventListener('input',renderProducts);
  document.getElementById('saveProductBtn')?.addEventListener('click',()=>{
    const p=readProductForm();
    if(!p.name||!p.description)return alert('اكتب اسم الحلى والمحتويات');
    if([p.calories,p.carbs,p.protein,p.fat].some(v=>Number.isNaN(v))) return alert('تأكد من إدخال القيم الغذائية بالأرقام');
    if(editingProductId){
      products=products.map(x=>x.id===editingProductId?p:x);
    }else{
      products.unshift(p);
    }
    selected=p;window.selected=p;
    saveProducts();clearProductForm();renderProducts();renderSelected();renderManage();renderEditor();
    alert(editingProductId?'تم تعديل الصنف':'تم حفظ الصنف');
  });
  document.getElementById('cancelEditBtn')?.addEventListener('click',clearProductForm);
  document.getElementById('saveSettingsBtn')?.addEventListener('click',()=>{saveSettings();alert('تم حفظ إعدادات الملصق');});
  document.getElementById('resetSettingsBtn')?.addEventListener('click',()=>{
    if(!confirm('هل تريد إعادة ضبط إعدادات الملصق الافتراضية؟ سيتم تطبيقها على كل الأصناف.')) return;
    settings=cloneDefaultSettings();saveSettings();renderEditor();
  });
  document.getElementById('moveUp')?.addEventListener('click',()=>moveSelected(0,-.5));
  document.getElementById('moveDown')?.addEventListener('click',()=>moveSelected(0,.5));
  document.getElementById('moveLeft')?.addEventListener('click',()=>moveSelected(-.5,0));
  document.getElementById('moveRight')?.addEventListener('click',()=>moveSelected(.5,0));
  document.getElementById('fontSizeRange')?.addEventListener('input',e=>{if(!selectedField)return;settings[selectedField].size=Number(e.target.value);updateFontSizeControl();renderEditor();});
  window.selected=selected;renderProducts();renderSelected();renderManage();renderEditor();
});
