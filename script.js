// ─── CURSOR
const cursor=document.getElementById('cursor');
const ring=document.getElementById('cursor-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX;my=e.clientY;
  cursor.style.left=mx+'px';cursor.style.top=my+'px';
});
function animRing(){
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  ring.style.left=rx+'px';ring.style.top=ry+'px';
  requestAnimationFrame(animRing);
}
animRing();

// ─── NAV SCROLL
const nav=document.getElementById('nav');
window.addEventListener('scroll',()=>{
  nav.classList.toggle('scrolled',window.scrollY>60);
});

// ─── POPUP
let items=[],currentIndex=0;
const popup=document.getElementById('popup');
const popupImg=document.getElementById('popup-img');
const popupVideo=document.getElementById('popup-video');
const counter=document.getElementById('popup-counter');

document.querySelectorAll('.card img,.card video').forEach((el,i)=>{
  items.push(el);
  el.onclick=()=>{currentIndex=i;openPopup();};
});

// disable scroll when popup open
function openPopup(){
    popup.classList.add('open');
    document.body.style.overflow='hidden';
  
    const el = items[currentIndex];
    counter.textContent = (currentIndex+1)+' / '+items.length;
  
    if(el.tagName==='IMG'){
      popupImg.src = el.src;
      popupImg.style.display='block';
      popupVideo.style.display='none';
    } else {
  
      popupVideo.pause(); // reset
      popupVideo.src = el.src;
  
      popupVideo.muted = false;   // 🔥 MUST
      popupVideo.controls = true; // show controls
      popupVideo.currentTime = 0;
  
      popupVideo.style.display='block';
      popupImg.style.display='none';
  
      // IMPORTANT: play after user interaction
      setTimeout(()=>{
        popupVideo.play().catch(()=>{});
      },100);
    }
  }

function closePopup(){
  popup.classList.remove('open');
  document.body.style.overflow = 'auto';
  popupVideo.pause();
}

function nextSlide(){currentIndex=(currentIndex+1)%items.length;openPopup();}
function prevSlide(){currentIndex=(currentIndex-1+items.length)%items.length;openPopup();}

document.addEventListener('keydown',e=>{
  if(e.key==='Escape') closePopup();
  if(e.key==='ArrowRight') nextSlide();
  if(e.key==='ArrowLeft') prevSlide();
});

// ─── HOVER PLAY
document.querySelectorAll('.card').forEach(card=>{
  const v=card.querySelector('video');
  if(!v) return;
  card.addEventListener('mouseenter',()=>v.play());
  card.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0;});
});

// ─── SCROLL REVEAL
const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
},{threshold:0.1});
document.querySelectorAll('.reveal,.exp-cell').forEach(el=>observer.observe(el));

// ─── SWIPE
let startX=0;
popup.addEventListener('touchstart',e=>startX=e.touches[0].clientX);
popup.addEventListener('touchend',e=>{
  const dx=e.changedTouches[0].clientX-startX;
  if(dx<-50) nextSlide();
  else if(dx>50) prevSlide();
});

// ─── STAGGER EXP CELLS
document.querySelectorAll('.exp-cell').forEach((el,i)=>{
  el.style.transitionDelay=(i*0.15)+'s';
});

document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',(e)=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      card.style.setProperty('--x', x + 'px');
      card.style.setProperty('--y', y + 'px');
  
      const rotateX = (y / rect.height - 0.5) * 25;
      const rotateY = (x / rect.width - 0.5) * -25;
  
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
    });
  
    card.addEventListener('mouseleave',()=>{
      card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });