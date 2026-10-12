const reduceMotion=matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis=window.Lenis&&!reduceMotion?new Lenis({autoRaf:true,lerp:.1}):null;
document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',e=>{const el=document.querySelector(a.getAttribute('href'));if(el){e.preventDefault();lenis?lenis.scrollTo(el,{offset:-80}):el.scrollIntoView({behavior:reduceMotion?'auto':'smooth'})}}));

const scrollBar=document.querySelector('.scroll-progress'),siteHeader=document.querySelector('.nav');
const onScroll=()=>{
  const max=document.documentElement.scrollHeight-innerHeight;
  if(scrollBar)scrollBar.style.transform='scaleX('+(max>0?Math.min(scrollY/max,1):0)+')';
  if(siteHeader)siteHeader.classList.toggle('scrolled',scrollY>10);
};
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

if(!reduceMotion&&'IntersectionObserver' in window){
  const revealItems=[...document.querySelectorAll('.hero-hello,.sticker.dark,.polaroid,.hero-id,.hero-copy>*,.stats-inner>div>*,.hero>*,.section-head,.work-card,.rows article,.stack>div,.cert-card,.steps>div,.prompt-list,.prompt-tips,.case-meta,.case-figure,.case-body section,.case-note,.contact>*')];
  const revealer=new IntersectionObserver(entries=>entries.forEach(en=>{if(en.isIntersecting){en.target.classList.add('in');revealer.unobserve(en.target)}}),{rootMargin:'0px 0px -6% 0px',threshold:.06});
  revealItems.forEach(el=>{
    const i=[...el.parentElement.children].filter(c=>revealItems.includes(c)).indexOf(el);
    el.style.setProperty('--d',(i%4)*80+'ms');el.classList.add('reveal');revealer.observe(el);
  });
}
const counters=[...document.querySelectorAll('[data-count]')];
if(counters.length&&!reduceMotion&&'IntersectionObserver' in window){
  const counter=new IntersectionObserver(entries=>entries.forEach(en=>{
    if(!en.isIntersecting)return;counter.unobserve(en.target);
    const el=en.target,end=+el.dataset.count,t0=performance.now(),dur=1200;
    const tick=t=>{const p=Math.min((t-t0)/dur,1);el.textContent=Math.round(end*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(tick)};
    requestAnimationFrame(tick);
  }),{threshold:.6});
  counters.forEach(el=>{el.textContent='0';counter.observe(el)});
}
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

document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',()=>{
  const email=a.getAttribute('href').slice(7).split('?')[0],label=a.dataset.label||(a.dataset.label=a.textContent);
  if(!navigator.clipboard||a.children.length)return;
  navigator.clipboard.writeText(email).then(()=>{a.textContent='Copied: '+email;setTimeout(()=>{a.textContent=label},3000)});
}));

const contactForm=document.getElementById('contact-form');
if(contactForm){
  const status=contactForm.querySelector('.form-status'),btn=contactForm.querySelector('button');
  contactForm.addEventListener('submit',e=>{
    e.preventDefault();
    if(contactForm.website.value)return;
    const data=new URLSearchParams();
    new FormData(contactForm).forEach((v,k)=>{if(k.startsWith('entry.'))data.append(k,v)});
    btn.disabled=true;status.className='form-status';status.textContent='Sending…';
    fetch(contactForm.action,{method:'POST',mode:'no-cors',body:data})
      .then(()=>{contactForm.reset();status.classList.add('ok');status.textContent="Thanks! Your message has been sent. I'll get back to you soon."})
      .catch(()=>{status.classList.add('err');status.textContent='Something went wrong. Please email me at rakeshgangani87@gmail.com.'})
      .finally(()=>{btn.disabled=false});
  });
}

const navBar=document.querySelector('.nav'),navToggle=document.querySelector('.nav-toggle');
if(navBar&&navToggle){
  const setMenu=open=>{navBar.classList.toggle('open',open);navToggle.setAttribute('aria-expanded',open);navToggle.setAttribute('aria-label',open?'Close menu':'Open menu')};
  navToggle.addEventListener('click',()=>setMenu(!navBar.classList.contains('open')));
  navBar.querySelectorAll('nav a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  document.addEventListener('click',e=>{if(!navBar.contains(e.target))setMenu(false)});
  document.addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
}
