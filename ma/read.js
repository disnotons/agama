const p=new URLSearchParams(location.search);
const n=Math.max(1,Math.min(60,Number(p.get('vol')||3)));
const wanted=Number(p.get('sutra')||0);
const content=document.getElementById('content');
const meta=document.getElementById('meta');
const nav=document.getElementById('volNav');
const sutraNav=document.getElementById('sutraNav');
const theme=document.getElementById('themeButton');
const prog=document.getElementById('readProgress');
const v=MA_VOLUMES.find(x=>x[0]===n);

const SPECIAL={
  3:[
    {no:11,title:'염유경',kind:'base',base:'03',count:3},
    {no:12,title:'화파경',kind:'gzip',base:'12',count:2},
    {no:13,title:'도경',kind:'md',file:'13.md'},
    {no:14,title:'나운경',kind:'gzip',base:'14',count:3},
    {no:15,title:'사경',kind:'gzip',base:'15',count:3},
    {no:16,title:'가람경',kind:'gzip',base:'16',count:3},
    {no:17,title:'가미니경',kind:'gzip',base:'17',count:3}
  ],
  4:[
    {no:18,title:'사자경',kind:'base',base:'04',count:3},
    {no:19,title:'니건경',kind:'gzip',base:'19',count:3},
    {no:20,title:'파라뢰경',kind:'md',file:'20.md'}
  ],
  8:[
    {no:32,title:'미증유법경',kind:'base',base:'08',count:1},
    {no:33,title:'시자경',kind:'gzip',base:'33x',count:5},
    {no:34,title:'박구라경',kind:'gzip',base:'34x',count:3},
    {no:35,title:'아수라경',kind:'gzip',base:'35x',count:4}
  ]
};

function volumeHref(x){return [3,4,8].includes(x)?`./read.html?vol=${x}`:`./reader.html?vol=${x}`;}
nav.innerHTML=MA_VOLUMES.map(x=>x[4]==='published'
  ?`<a class="${x[0]===n?'active':''}" href="${volumeHref(x[0])}"><b>제${x[0]}권</b><span>${x[6]}/${x[3]}경</span></a>`
  :`<span class="disabled"><b>제${x[0]}권</b><span>${x[1]}~${x[2]}경</span></span>`).join('');

if(!v||!SPECIAL[n]){
  location.replace(`./reader.html?vol=${n}`);
}else{
  meta.innerHTML=`<span>제${v[0]}권 / 60권</span><b>제${v[1]}~${v[2]}경 · 독립 복구 독서기</b>`;
  document.getElementById('barTitle').textContent=`제${v[0]}권 · 중아함경 쉬운 완전읽기`;
  document.title=`제${v[0]}권 | 중아함경 쉬운 완전읽기`;
}

const items=(SPECIAL[n]||[]);
sutraNav.innerHTML=`<a href="./read.html?vol=${n}" style="padding:.45rem .7rem;border:1px solid currentColor;border-radius:999px;text-decoration:none">전체</a>`+
  items.map(x=>`<a href="./read.html?vol=${n}&sutra=${x.no}" style="padding:.45rem .7rem;border:1px solid currentColor;border-radius:999px;text-decoration:none">제${x.no}경 ${x.title}</a>`).join('');

async function fetchText(path){
  const sep=path.includes('?')?'&':'?';
  const r=await fetch(`${path}${sep}r=20260824c`,{cache:'no-store'});
  if(!r.ok)throw new Error(`${path}: HTTP ${r.status}`);
  return r.text();
}
function normalizeBase64(raw,label){
  let b64=raw.replace(/\s+/g,'');
  const rem=b64.length%4;
  if(rem===1)throw new Error(`${label}: Base64 길이 손상 (${b64.length})`);
  if(rem)b64+='='.repeat(4-rem);
  return b64;
}
function gunzip(raw,label){
  const b64=normalizeBase64(raw,label);
  const bin=atob(b64);
  const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
  return pako.ungzip(bytes,{to:'string'});
}
async function loadItem(x){
  if(x.kind==='md')return fetchText(`./data/${x.file}`);
  const suffix=x.kind==='base'?'part':'g';
  const paths=Array.from({length:x.count},(_,i)=>`./data/${x.base}.${suffix}${i+1}`);
  const raw=(await Promise.all(paths.map(fetchText))).join('');
  return gunzip(raw,`제${x.no}경 ${x.title}`);
}
function renderMarkdown(md){
  marked.setOptions({gfm:true});
  return DOMPurify.sanitize(marked.parse(md),{USE_PROFILES:{html:true}});
}

async function load(){
  const chosen=wanted?items.filter(x=>x.no===wanted):items;
  if(!chosen.length){
    content.innerHTML='<div class="loading">해당 경을 찾지 못했습니다.</div>';
    return;
  }
  content.innerHTML='';
  let ok=0,fail=0;
  for(const x of chosen){
    const section=document.createElement('section');
    section.id=`ma${x.no}`;
    section.innerHTML=`<div class="loading">제${x.no}경 《${x.title}》 불러오는 중…</div>`;
    content.appendChild(section);
    try{
      const md=await loadItem(x);
      section.innerHTML=renderMarkdown(md);
      ok++;
    }catch(e){
      fail++;
      console.error(`MA${x.no} load failed`,e);
      section.innerHTML=`<div class="loading"><b>제${x.no}경 《${x.title}》만 불러오지 못했습니다.</b><br><small>${String(e.message||e)}</small><br><small>다른 경은 계속 읽을 수 있습니다.</small></div>`;
    }
    if(!wanted&&x!==chosen[chosen.length-1]){
      const hr=document.createElement('hr');
      hr.style.margin='3rem 0';
      content.appendChild(hr);
    }
  }
  const note=document.createElement('div');
  note.style.cssText='margin-top:2rem;padding:1rem;border:1px solid currentColor;border-radius:12px;opacity:.8';
  note.textContent=`복구 독서기 결과: ${ok}경 정상${fail?`, ${fail}경 데이터 오류`:''}`;
  content.appendChild(note);
}

function pager(id,label,x){
  const el=document.getElementById(id);
  if(!x){el.className='disabled-link';el.textContent=label;return;}
  el.href=volumeHref(x[0]);
  el.innerHTML=`<small>${label}</small><b>제${x[0]}권 · 제${x[1]}~${x[2]}경</b>`;
}
const published=MA_VOLUMES.filter(x=>x[4]==='published');
const vi=published.findIndex(x=>x[0]===n);
pager('prev','← 이전 공개 권',published[vi-1]);
pager('next','다음 공개 권 →',published[vi+1]);

theme.addEventListener('click',()=>{
  document.body.classList.toggle('dark');
  localStorage.setItem('ma-volume-theme',document.body.classList.contains('dark')?'dark':'light');
});
if(localStorage.getItem('ma-volume-theme')==='dark')document.body.classList.add('dark');
addEventListener('scroll',()=>{
  const m=document.documentElement.scrollHeight-innerHeight;
  prog.style.width=(m>0?Math.min(100,scrollY/m*100):0)+'%';
},{passive:true});
load();
