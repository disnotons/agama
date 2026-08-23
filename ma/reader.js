const p=new URLSearchParams(location.search);
const n=Math.max(1,Math.min(60,Number(p.get('vol')||1)));
const v=MA_VOLUMES.find(x=>x[0]===n);
const content=document.getElementById('content'),meta=document.getElementById('meta'),nav=document.getElementById('volNav'),theme=document.getElementById('themeButton'),prog=document.getElementById('readProgress');

const DATA_PARTS={1:9,2:5,3:3,4:3,5:3,6:3,7:1,8:1,9:4};
const EXTRA_MD={2:['08.md']};
const EXTRA_GZIP={2:[['09',6],['10',3]],3:[['12',2]]};
const EXTRA_ORDERED_AFTER={
  3:[['md','13.md'],['gzip','14',3],['gzip','15',3],['gzip','16',3],['gzip','17',3]],
  4:[['gzip','19',3],['md','20.md']],
  5:[['gzip','22',3],['md','23.md'],['gzip','24',3],['gzip','25',3]],
  6:[['md','27.md'],['md','28.md']],
  7:[['gzip','30',4],['gzip','31',3]],
  8:[['gzip','33x',5],['gzip','34x',3],['gzip','35x',4]],
  9:[['gzip','37x',2],['gzip','38x',3],['gzip','39x',2],['gzip','40x',2]]
};

function navHtml(){
  return MA_VOLUMES.map(x=>x[4]==='published'
    ?`<a class="${x[0]===n?'active':''}" href="?vol=${x[0]}"><b>제${x[0]}권</b><span>${x[6]}/${x[3]}경</span></a>`
    :`<span class="disabled"><b>제${x[0]}권</b><span>${x[1]}~${x[2]}경</span></span>`).join('');
}
nav.innerHTML=navHtml();
meta.innerHTML=`<span>제${v[0]}권 / 60권</span><b>제${v[1]}~${v[2]}경 · 현재 ${v[6]}/${v[3]}경 공개</b>`;
document.getElementById('barTitle').textContent=`제${v[0]}권 · 중아함경 쉬운 완전읽기`;
document.title=`제${v[0]}권 | 중아함경 쉬운 완전읽기`;

async function fetchPart(path){
  const r=await fetch(path,{cache:'no-cache'});
  if(!r.ok)throw new Error(`${path}: ${r.status}`);
  return r.text();
}

function normalizeBase64(raw,label){
  let b64=raw.replace(/\s+/g,'');
  const rem=b64.length%4;
  if(rem===1)throw new Error(`${label}: invalid base64 length ${b64.length}`);
  if(rem)b64+='='.repeat(4-rem);
  return b64;
}

function decodeGzipBase64(raw,label){
  const b64=normalizeBase64(raw,label);
  const bin=atob(b64);
  const bytes=Uint8Array.from(bin,c=>c.charCodeAt(0));
  return pako.ungzip(bytes,{to:'string'});
}

async function decodeGzipParts(base,count){
  const paths=Array.from({length:count},(_,i)=>`./data/${base}.g${i+1}`);
  const raw=(await Promise.all(paths.map(fetchPart))).join('');
  return decodeGzipBase64(raw,base);
}

function joinSection(md,extra){
  return md+'\n\n---\n\n'+extra;
}

async function load(){
  if(v[4]!=='published'){
    content.innerHTML='<div class="loading">이 권의 통합 해설은 아직 준비 중입니다.</div>';
    return;
  }

  let md='';
  try{
    const count=DATA_PARTS[v[0]]||0;
    if(!count)throw new Error(`volume ${v[0]} has no base data`);
    const paths=Array.from({length:count},(_,i)=>`./data/${String(v[0]).padStart(2,'0')}.part${i+1}`);
    const raw=(await Promise.all(paths.map(fetchPart))).join('');
    md=decodeGzipBase64(raw,`volume-${v[0]}`);
  }catch(e){
    console.error('MA base volume load failed',e);
    content.innerHTML='<div class="loading">이 권의 기본 본문을 불러오지 못했습니다.<br><small>페이지를 새로고침해도 반복되면 권 번호를 알려 주세요.</small></div>';
    return;
  }

  const extraErrors=[];
  async function appendExtra(label,loader){
    try{
      md=joinSection(md,await loader());
    }catch(e){
      extraErrors.push(label);
      console.error(`MA extra load failed: ${label}`,e);
    }
  }

  for(const x of (EXTRA_MD[v[0]]||[])){
    await appendExtra(x,()=>fetchPart(`./data/${x}`));
  }
  for(const [base,c] of (EXTRA_GZIP[v[0]]||[])){
    await appendExtra(base,()=>decodeGzipParts(base,c));
  }
  for(const item of (EXTRA_ORDERED_AFTER[v[0]]||[])){
    if(item[0]==='md')await appendExtra(item[1],()=>fetchPart(`./data/${item[1]}`));
    else await appendExtra(item[1],()=>decodeGzipParts(item[1],item[2]));
  }

  if(extraErrors.length){
    md+='\n\n---\n\n> **웹북 로딩 안내:** 이 권의 일부 추가 해설을 불러오지 못했습니다. 기본 본문과 정상적으로 읽힌 해설은 계속 표시합니다.';
  }

  try{
    marked.setOptions({gfm:true});
    content.innerHTML=DOMPurify.sanitize(marked.parse(md),{USE_PROFILES:{html:true}});
  }catch(e){
    console.error('MA markdown render failed',e);
    content.innerHTML='<div class="loading">본문 표시 중 오류가 발생했습니다.</div>';
  }
}

function pager(id,label,x){
  const el=document.getElementById(id);
  if(!x){el.className='disabled-link';el.textContent=label;return;}
  el.href=`?vol=${x[0]}`;
  el.innerHTML=`<small>${label}</small><b>제${x[0]}권 · 제${x[1]}~${x[2]}경</b>`;
}
const published=MA_VOLUMES.filter(x=>x[4]==='published');
const i=published.findIndex(x=>x[0]===n);
pager('prev','← 이전 공개 권',published[i-1]);
pager('next','다음 공개 권 →',published[i+1]);

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
