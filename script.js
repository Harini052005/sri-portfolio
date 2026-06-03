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


// ─── HOVER PLAY & AUTO PLAY
const isTouch = window.matchMedia('(hover: none)').matches;
document.querySelectorAll('.card').forEach(card=>{
  const v=card.querySelector('video');
  if(!v) return;
  
  // Mobile: autoplay muted
  if(isTouch){
    v.autoplay=true;
    v.muted=true;
  } else {
    // Desktop: play on hover
    card.addEventListener('mouseenter',()=>v.play().catch(()=>{}));
    card.addEventListener('mouseleave',()=>{v.pause();v.currentTime=0;});
  }
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

// ─── DETECT MEDIA TYPE & SET CARD CLASS
document.querySelectorAll('.card').forEach(card=>{
  const img = card.querySelector('img');
  const video = card.querySelector('video');
  
  if(img){
    img.onload=()=>{
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ratio = w / h;
      
      // Remove existing classes
      card.classList.remove('card-horizontal', 'card-vertical', 'card-portrait', 'card-square');
      
      // Classify by aspect ratio
      if(ratio > 1.3) card.classList.add('card-horizontal');
      else if(ratio < 0.7) card.classList.add('card-vertical');
      else if(ratio < 0.9) card.classList.add('card-portrait');
      else card.classList.add('card-square');
    };
    if(img.complete) img.onload();
  }
  
  if(video){
    video.onloadedmetadata=()=>{
      const w = video.videoWidth;
      const h = video.videoHeight;
      const ratio = w / h;
      
      card.classList.remove('card-horizontal', 'card-vertical', 'card-portrait', 'card-square');
      
      if(ratio > 1.3) card.classList.add('card-horizontal');
      else if(ratio < 0.7) card.classList.add('card-vertical');
      else if(ratio < 0.9) card.classList.add('card-portrait');
      else card.classList.add('card-square');
    };
  }
});

// ─── CARD TILT EFFECT (Desktop Only)
if(!isTouch){
  document.querySelectorAll('.card').forEach(card=>{
    card.addEventListener('mousemove',(e)=>{
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
  
      card.style.setProperty('--x', x + 'px');
      card.style.setProperty('--y', y + 'px');
  
      const rotateX = (y / rect.height - 0.5) * 20;
      const rotateY = (x / rect.width - 0.5) * -20;
  
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
  
    card.addEventListener('mouseleave',()=>{
      card.style.transform = `rotateX(0deg) rotateY(0deg) scale(1)`;
    });
  });
}