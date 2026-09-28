document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();el.scrollIntoView({behavior:'smooth'})}}));
const promptItems=[...document.querySelectorAll('.prompt-list li')];
if(promptItems.length){
  const filter=document.getElementById('prompt-filter'),count=document.getElementById('prompt-count'),empty=document.getElementById('prompt-empty');
  const setCount=n=>{count.textContent=n+' prompt'+(n===1?'':'s')};
  setCount(promptItems.length);
  promptItems.forEach(li=>{
    li.tabIndex=0;li.setAttribute('role','button');li.title='Click to copy';
    const copy=()=>{navigator.clipboard.writeText(li.textContent.trim()).then(()=>{li.classList.add('copied');setTimeout(()=>li.classList.remove('copied'),1500)})};
    li.addEventListener('click',copy);
    li.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();copy()}});
  });
  filter.addEventListener('input',()=>{
    const q=filter.value.trim().toLowerCase();let shown=0;
    document.querySelectorAll('.prompt-group').forEach(g=>{
      const match=q&&g.querySelector('h2').textContent.toLowerCase().includes(q);let n=0;
      g.querySelectorAll('li').forEach(li=>{const hit=!q||match||li.textContent.toLowerCase().includes(q);li.hidden=!hit;if(hit)n++});
      g.hidden=n===0;shown+=n;
    });
    setCount(shown);empty.hidden=shown>0;
  });
}
