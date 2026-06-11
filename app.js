const LABEL_KEY = 'pc_label_settings_v4';
const PRODUCTS_KEY = 'pc_products_v4';
const LABEL_MM = { width: 33.6, height: 55 };
const defaultSettings = {
  desc: { x: 50, y: 28, size: 8.2, width: 76 },
  calories: { x: 18, y: 44, size: 10 },
  carbs: { x: 43, y: 44, size: 10 },
  protein: { x: 66, y: 44, size: 10 },
  fat: { x: 88, y: 44, size: 10 },
  expiry: { x: 35, y: 83, size: 7.8 },
  name: { x: 20, y: 92, size: 8.5 }
};
let products = JSON.parse(localStorage.getItem(PRODUCTS_KEY) || 'null') || [
  {id:'p1',name:'شوكر كرانشو',description:'دجاج باربكيو 200G',calories:532,carbs:38,protein:68,fat:12,shelfLifeDays:1},
  {id:'p2',name:'براونيز برتزل',description:'بروتين شوكولاتة سولتد كراميل 200G',calories:227.6,carbs:9,protein:22,fat:11.5,shelfLifeDays:3},
  {id:'p3',name:'تشيز كيك',description:'تشيز كيك فراولة لايت 180G',calories:310,carbs:26,protein:18,fat:14,shelfLifeDays:2}
];
let settings = JSON.parse(localStorage.getItem(LABEL_KEY) || 'null') || cloneDefaultSettings();
function cloneDefaultSettings(){return JSON.parse(JSON.stringify(defaultSettings));}
let selected = products[0];
let selectedField = null;
function saveProducts(){localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));}
function saveSettings(){localStorage.setItem(LABEL_KEY, JSON.stringify(settings));}
function expiryDate(days){const d=new Date();d.setDate(d.getDate()+Number(days||1));return `${d.getFullYear()}/${d.getMonth()+1}/${d.getDate()}`;}
function fitText(text,max=42){text=String(text||'');if(text.length<=max)return text;const mid=Math.ceil(text.length/2);let cut=text.lastIndexOf(' ',mid);if(cut<10)cut=mid;return text.slice(0,cut).trim()+"\n"+text.slice(cut).trim();}
function nav(view){document.querySelectorAll('.nav').forEach(b=>b.classList.toggle('active',b.dataset.view===view));document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));document.getElementById('view-'+view).classList.add('active'); if(view==='settings') renderEditor();}
function renderProducts(){const q=(document.getElementById('searchInput')?.value||'').trim();const list=document.getElementById('productList');if(!list)return;list.innerHTML='';products.filter(p=>!q||p.name.includes(q)||p.description.includes(q)).forEach(p=>{const el=document.createElement('div');el.className='product-item '+(selected?.id===p.id?'active':'');el.innerHTML=`<h3>${p.name}</h3><p>${p.description}</p><div class="chips"><span>F ${p.fat}</span><span>P ${p.protein}</span><span>C ${p.carbs}</span><span>Cal ${p.calories}</span></div>`;el.onclick=()=>{selected=p;renderProducts();renderSelected();renderEditor();};list.appendChild(el);});}
function renderSelected(){
  if(!selected)return;
  const ids={selectedName:selected.name,selectedDesc:selected.description,selectedCalories:selected.calories,selectedCarbs:selected.carbs,selectedProtein:selected.protein,selectedFat:selected.fat,selectedExp:'Exp:- '+expiryDate(selected.shelfLifeDays)};
  Object.entries(ids).forEach(([id,val])=>{const el=document.getElementById(id); if(el) el.textContent=val;});
}
function makeLabel(product, editable=false){const wrap=document.createElement('div');wrap.className= editable?'label-preview editor-mode':'print-label';const map={desc:fitText(product.description,42),calories:product.calories,carbs:product.carbs,protein:product.protein,fat:product.fat,expiry:expiryDate(product.shelfLifeDays),name:product.name};Object.keys(settings).forEach(key=>{const s=settings[key];const el=document.createElement('div');el.className='label-field '+key+(selectedField===key?' selected':'');el.dataset.key=key;el.textContent=map[key];el.style.left=s.x+'%';el.style.top=s.y+'%';el.style.fontSize=s.size+'px';if(s.width)el.style.width=s.width+'%';if(editable){el.addEventListener('pointerdown',startDrag);}wrap.appendChild(el);});return wrap;}
function renderEditor(){const host=document.getElementById('labelEditor');if(!host)return;const lbl=makeLabel(selected||products[0],true);host.replaceWith(lbl);lbl.id='labelEditor';}
let drag={active:false,key:null,rect:null};function startDrag(e){e.preventDefault();e.stopPropagation();selectedField=e.currentTarget.dataset.key;drag={active:true,key:selectedField,rect:document.getElementById('labelEditor').getBoundingClientRect()};document.body.style.touchAction='none';renderEditor();window.addEventListener('pointermove',onDrag);window.addEventListener('pointerup',endDrag,{once:true});}
function onDrag(e){if(!drag.active)return;const x=((e.clientX-drag.rect.left)/drag.rect.width)*100;const y=((e.clientY-drag.rect.top)/drag.rect.height)*100;settings[drag.key].x=Math.max(0,Math.min(100,x));settings[drag.key].y=Math.max(0,Math.min(100,y));renderEditor();}
function endDrag(){drag.active=false;document.body.style.touchAction='';window.removeEventListener('pointermove',onDrag);}
function moveSelected(dx,dy){if(!selectedField)return;settings[selectedField].x=Math.max(0,Math.min(100,settings[selectedField].x+dx));settings[selectedField].y=Math.max(0,Math.min(100,settings[selectedField].y+dy));renderEditor();}
function renderManage(){const host=document.getElementById('manageList');if(!host)return;host.innerHTML='';products.forEach(p=>{const el=document.createElement('div');el.className='product-item';el.innerHTML=`<h3>${p.name}</h3><p>${p.description}</p><div class="chips"><span>${p.calories} Cal</span><span>${p.carbs} C</span><span>${p.protein} P</span><span>${p.fat} F</span></div>`;host.appendChild(el);});}
document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.nav').forEach(b=>b.onclick=()=>nav(b.dataset.view));document.getElementById('searchInput')?.addEventListener('input',renderProducts);document.getElementById('saveProductBtn')?.addEventListener('click',()=>{const p={id:'p'+Date.now(),name:document.getElementById('pName').value.trim(),description:document.getElementById('pDesc').value.trim(),calories:Number(document.getElementById('pCalories').value),carbs:Number(document.getElementById('pCarbs').value),protein:Number(document.getElementById('pProtein').value),fat:Number(document.getElementById('pFat').value),shelfLifeDays:Number(document.getElementById('pShelf').value||1)};if(!p.name||!p.description)return alert('اكتب اسم الحلى والمحتويات');products.unshift(p);selected=p;saveProducts();renderProducts();renderSelected();renderManage();});document.getElementById('saveSettingsBtn')?.addEventListener('click',()=>{saveSettings();alert('تم حفظ إعدادات الملصق');});document.getElementById('resetSettingsBtn')?.addEventListener('click',()=>{settings=cloneDefaultSettings();saveSettings();renderEditor();});document.getElementById('moveUp')?.addEventListener('click',()=>moveSelected(0,-.5));document.getElementById('moveDown')?.addEventListener('click',()=>moveSelected(0,.5));document.getElementById('moveLeft')?.addEventListener('click',()=>moveSelected(-.5,0));document.getElementById('moveRight')?.addEventListener('click',()=>moveSelected(.5,0));document.getElementById('fontSizeRange')?.addEventListener('input',e=>{if(!selectedField)return;settings[selectedField].size=Number(e.target.value);renderEditor();});renderProducts();renderSelected();renderManage();renderEditor();});
