
/* Premium Birthday Website with Lock Screen for Shweta */
(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));
  const rand = (min, max) => Math.random()*(max-min)+min;
  
  // Birth date: 03 July 2005
  // Unlock date: 03 July 2026 00:00:00 IST
  const BIRTH_DATE = new Date('2005-07-03T00:00:00+05:30');
  const UNLOCK_DATE = new Date('2026-07-03T00:00:00+05:30');
  
  let lockState = { clickCount: 0, loveScore: 0, unlocked: false };
  
  const LOCK_QUOTES = [
    'The wait is worth it for someone as special as you.',
    'Something magical is being prepared for your birthday.',
    'Every second brings us closer to your special day.',
    'A beautiful surprise is waiting just for you.',
    'The countdown to celebrating you has begun.',
    'Some surprises become more beautiful with patience.',
    'Every heartbeat brings us closer to your special moment.'
  ];
  
  const FUNNY_MESSAGES = [
    '😏 Raha nahi ja raha? Thoda sabr karo!',
    '🤣 Abe ruk jao... Birthday abhi aaya nahi hai!',
    '🎂 Server says: Patience loading... 73%',
    '🙈 Shweta, cheating mat karo!',
    '❤️ Itni bhi kya jaldi hai jaan?',
    '😎 Access Denied. Birthday permissions not granted yet.',
    '🔥 Arre arre... surprise kharab mat karo!',
    '🥲 Mujhe bhi wait karna pad raha hai.',
    '🎁 Gift wrapping abhi chal rahi hai...',
    '🤣 System detected extreme curiosity.',
    '💖 Love detected. Access rejected.',
    '😜 Kuch log countdown dekhte hain, kuch log button 100 baar click karte hain.',
    '🤭 Aap bahut impatient category mein aate ho.',
    '🎂 Birthday gate abhi band hai.',
    '🚫 Unauthorized birthday access attempt detected.',
    '😏 FBI: Birthday Investigation Bureau is watching.',
    '😂 Shweta ji, thoda control.',
    '❤️ Har click se surprise 1 second aur special ho raha hai.',
    '🤣 Ye button decoration ke liye nahi hai, par abhi kaam bhi nahi karega.',
    '🙃 Nice try.',
    '🎁 Wait karne waalon ko hi best surprises milte hain.'
  ];
  
  const PROGRESS_MESSAGES = {
    5: '😂 Bas karo yaar!',
    10: '🤣 Aap sach mein nahi ruk sakte?',
    20: '😏 Countdown kam nahi hoga itna click karne se.',
    30: '🔥 Developer ko bhi itni testing nahi mili.',
    50: '💀 Achievement Unlocked: Professional Button Clicker',
    100: '👑 Congratulations! You are officially the Queen of Curiosity.'
  };
  
  const PASSWORD_MESSAGES = [
    '🤣 Wrong Password.',
    '😏 Even I don\'t know the password.',
    '❤️ The password unlocks itself on 03 July.',
    '🎂 Nice attempt though.',
    '🔥 Password currently under romantic encryption.'
  ];
  
  document.addEventListener('DOMContentLoaded', () => {
    document.body.classList.add('locked');
    setTimeout(() => qs('#loader').style.display='none', 1200);
    initLockScreen();
    initLockCanvas();
    initLockQuotes();
    initLockButtons();
    
    // Always initialize countdown values immediately
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    if(window.AOS) AOS.init({duration:900, once:true});
  });
  
  function initLockCanvas() {
    const canvas = qs('#lockCanvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    
    const particles = [];
    for(let i=0;i<50;i++) {
      particles.push({
        x: rand(0,w), y: rand(0,h), r: rand(0.5,2), 
        vx: (rand(0,1)-0.5)*0.3, vy: rand(0.1,0.4), a: rand(0.2,0.6)
      });
    }
    
    addEventListener('resize', () => {
      w = canvas.width = innerWidth;
      h = canvas.height = innerHeight;
    });
    
    function draw() {
      ctx.clearRect(0,0,w,h);
      const grd = ctx.createLinearGradient(0,0,w,h);
      grd.addColorStop(0, 'rgba(161,108,241,0.05)');
      grd.addColorStop(1, 'rgba(255,122,182,0.03)');
      ctx.fillStyle=grd;
      ctx.fillRect(0,0,w,h);
      
      for(let p of particles) {
        p.x+=p.vx; p.y+=p.vy;
        p.a+=Math.sin(Date.now()/2000+p.x)*0.002;
        if(p.y>h+10) p.y=-10;
        if(p.x>w+10) p.x=-10;
        ctx.beginPath();
        ctx.fillStyle=`rgba(255,255,255,${0.04+p.a*0.12})`;
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fill();
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  
  function initLockScreen() {
    if(isUnlocked()) unlockWebsite();
  }
  
  function isUnlocked() {
    return new Date() >= UNLOCK_DATE;
  }
  
  function updateCountdown() {
    const now = new Date();
    const diff = UNLOCK_DATE - now;
    
    const dEl = qs('#countDays');
    const hEl = qs('#countHours');
    const mEl = qs('#countMins');
    const sEl = qs('#countSecs');
    
    if(diff <= 0) {
      if(dEl) dEl.textContent = '00';
      if(hEl) hEl.textContent = '00';
      if(mEl) mEl.textContent = '00';
      if(sEl) sEl.textContent = '00';
      unlockWebsite();
      return;
    }
    
    const totalSeconds = Math.floor(diff/1000);
    const days = Math.floor(totalSeconds/86400);
    const hours = Math.floor((totalSeconds%86400)/3600);
    const mins = Math.floor((totalSeconds%3600)/60);
    const secs = totalSeconds%60;
    
    if(dEl) dEl.textContent = String(days).padStart(2,'0');
    if(hEl) hEl.textContent = String(hours).padStart(2,'0');
    if(mEl) mEl.textContent = String(mins).padStart(2,'0');
    if(sEl) sEl.textContent = String(secs).padStart(2,'0');
  }
  
  function initLockQuotes() {
    let idx = 0;
    const el = qs('#rotatingQuote');
    if(!el) return;
    el.textContent = LOCK_QUOTES[idx];
    setInterval(() => {
      idx = (idx+1)%LOCK_QUOTES.length;
      el.textContent = LOCK_QUOTES[idx];
    }, 5000);
  }
  
  function initLockButtons() {
    const openBtn = qs('#openSurpriseBtn');
    const cantWaitBtn = qs('#cantWaitBtn');
    const tryLuckBtn = qs('#tryLuckBtn');
    const passwordBtn = qs('#passwordBtn');
    
    if(openBtn) openBtn.addEventListener('click', handleUnlockAttempt);
    if(cantWaitBtn) cantWaitBtn.addEventListener('click', handleUnlockAttempt);
    if(tryLuckBtn) tryLuckBtn.addEventListener('click', handleLuckWheel);
    if(passwordBtn) passwordBtn.addEventListener('click', handlePasswordModal);
    
    const wClose = qs('#wheelClose');
    const pClose = qs('#passwordClose');
    const pSubmit = qs('#passwordSubmit');
    
    if(wClose) wClose.addEventListener('click', () => qs('#wheelModal').classList.add('hidden'));
    if(pClose) pClose.addEventListener('click', () => qs('#passwordModal').classList.add('hidden'));
    if(pSubmit) pSubmit.addEventListener('click', handlePasswordSubmit);
  }
  
  function handleUnlockAttempt() {
    lockState.clickCount++;
    lockState.loveScore += 10;
    
    const clickEl = qs('#clickCount');
    const scoreEl = qs('#loveScore');
    if(clickEl) clickEl.textContent = lockState.clickCount;
    if(scoreEl) scoreEl.textContent = lockState.loveScore;
    
    if(PROGRESS_MESSAGES[lockState.clickCount]) {
      showPopupMessage(PROGRESS_MESSAGES[lockState.clickCount]);
    } else {
      showPopupMessage(FUNNY_MESSAGES[Math.floor(Math.random()*FUNNY_MESSAGES.length)]);
    }
    
    const btn = event.target;
    btn.classList.add('shake');
    setTimeout(() => btn.classList.remove('shake'), 400);
    
    heartBurst(18, innerWidth/2, innerHeight/2);
    launchConfetti(30);
    
    if(Math.random() < 0.01) triggerEasterEgg();
  }
  
  function handleLuckWheel() {
    lockState.loveScore += 5;
    qs('#loveScore').textContent = lockState.loveScore;
    
    const modal = qs('#wheelModal');
    modal.classList.remove('hidden');
    
    const wheel = qs('#luckWheel');
    const rotation = rand(720, 1080);
    wheel.style.transform = `rotate(${rotation}deg)`;
    wheel.style.transition = 'transform 3s cubic-bezier(0.25,0.46,0.45,0.94)';
    
    setTimeout(() => {
      qs('#wheelResult').textContent = '🎉 Result: Come Back Later!';
      heartBurst(12, innerWidth/2, innerHeight/2-100);
    }, 3000);
  }
  
  function handlePasswordModal() {
    const modal = qs('#passwordModal');
    modal.classList.remove('hidden');
    qs('#passwordInput').focus();
  }
  
  function handlePasswordSubmit() {
    const inputEl = qs('#passwordInput');
    if(!inputEl) return;
    const val = (inputEl.value || '').trim();
    const CORRECT_PASSWORD = 'lebhikari';

    if(val && val.toLowerCase() === CORRECT_PASSWORD) {
      qs('#passwordMsg').textContent = '✅ Password correct! Unlocking...';
      inputEl.value = '';
      qs('#passwordModal').classList.add('hidden');
      setTimeout(() => unlockWebsite(), 600);
      return;
    }

    // Wrong password flow
    lockState.loveScore += 3;
    qs('#loveScore').textContent = lockState.loveScore;
    const msg = PASSWORD_MESSAGES[Math.floor(Math.random()*PASSWORD_MESSAGES.length)];
    qs('#passwordMsg').textContent = msg;
  }
  
  function showPopupMessage(text) {
    // Remove any existing popup first
    const existingPopup = qs('.popup-msg');
    if(existingPopup) existingPopup.remove();
    
    const popup = document.createElement('div');
    popup.className = 'popup-msg';
    popup.textContent = text;
    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 5000);
  }
  
  function triggerEasterEgg() {
    const glow = document.createElement('div');
    glow.className = 'easter-glow';
    document.body.appendChild(glow);
    showPopupMessage('✨ Wow! You found a secret message! ❤️');
    heartBurst(50, innerWidth/2, innerHeight/2);
    launchConfetti(80);
    setTimeout(() => glow.remove(), 1800);
  }
  
  function heartBurst(count=24, x=innerWidth/2, y=innerHeight/2) {
    for(let i=0;i<count;i++) {
      const h = document.createElement('div');
      h.className = 'trail-heart';
      h.style.left = `${x}px`;
      h.style.top = `${y}px`;
      const size = rand(8,20);
      h.style.width = `${size}px`;
      h.style.height = `${size}px`;
      h.style.background = `radial-gradient(circle at 30% 30%, rgba(255,122,182,0.95), rgba(161,108,241,0.95))`;
      h.style.borderRadius = '50%';
      h.style.transform = 'translate(-50%,-50%)';
      document.body.appendChild(h);
      
      const angle = rand(0, Math.PI*2);
      const speed = rand(60, 200);
      const dx = Math.cos(angle)*speed;
      const dy = Math.sin(angle)*speed;
      
      h.animate([
        {transform:'translate(-50%,-50%) translate(0,0)', opacity:1},
        {transform:`translate(-50%,-50%) translate(${dx}px,${dy}px)`, opacity:0}
      ], {duration: rand(1400, 2400), easing:'cubic-bezier(.16,.8,.32,1)'});
      
      setTimeout(() => h.remove(), 2500);
    }
  }
  
  function launchConfetti(count=30) {
    for(let i=0;i<count;i++) {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = `${rand(0,100)}vw`;
      c.style.top = `-10px`;
      c.style.width = `${rand(4,8)}px`;
      c.style.height = `${rand(4,8)}px`;
      c.style.background = ['#ff7ab6', '#a16cf1', '#e6b2a6'][Math.floor(Math.random()*3)];
      c.style.borderRadius = '50%';
      document.body.appendChild(c);
      
      const duration = rand(2000, 4000);
      const x = (rand(0,1)-0.5)*400;
      
      c.animate([
        {transform:'translate(0,0) rotate(0deg)', opacity:1},
        {transform:`translate(${x}px,${innerHeight+100}px) rotate(${rand(0,720)}deg)`, opacity:0}
      ], {duration, easing:'cubic-bezier(0.25,0.46,0.45,0.94)'});
      
      setTimeout(() => c.remove(), duration);
    }
  }
  
  function unlockWebsite() {
    if(lockState.unlocked) return;
    lockState.unlocked = true;
    
    const door = document.createElement('div');
    door.className = 'unlock-door active';
    door.innerHTML = `<div style="text-align:center"><div style="font-size:72px;margin-bottom:20px">🚪</div><div style="font-size:28px;margin-bottom:40px">✨ Happy 21st Birthday Shweta ❤️ ✨</div><div style="font-size:18px;margin-bottom:20px">You are loved more than words can ever express.</div><div style="animation:beat 1s infinite;font-size:48px">❤️</div></div>`;
    document.body.appendChild(door);
    
    heartBurst(100, innerWidth/2, innerHeight*0.6);
    launchConfetti(150);
    
    setTimeout(() => {
      // Hide lock screen
      qs('#lockScreen').classList.add('hidden');
      door.remove();
      
      // Show all content
      if(qs('header')) qs('header').style.display = 'flex';
      if(qs('main')) qs('main').style.display = 'block';
      if(qs('.footer')) qs('.footer').style.display = 'block';
      
      // Unlock scrolling
      document.body.classList.remove('locked');
      
      // Initialize birthday site
      setTimeout(() => {
        if(window.AOS) AOS.init({duration:900, once:true});
        initBirthdaySite();
      }, 100);
    }, 3000);
  }
  
  /* Birthday Site Functions */
  function initBirthdaySite() {
    initCanvas();
    populateGallery();
    initTypewriter();
    initQuotesCarousel();
    initTimer();
    initControls();
    initGlobalClicks();
    scatterLoveNotes(6);
    startFallingRoses();
    startShootingStars();
  }
  
  function initCanvas() {
    const canvas = qs('#bg-canvas');
    if(!canvas) return;
    const ctx = canvas.getContext('2d');
    let w = canvas.width = innerWidth;
    let h = canvas.height = innerHeight;
    const particles = [];
    for(let i=0;i<60;i++) particles.push({x:rand(0,w), y:rand(0,h), r:rand(0.4,2.8), vx:rand(-0.2,0.2), vy:rand(0.1,0.6), a:rand(0.05,0.8)});
    addEventListener('resize', () => { w=canvas.width=innerWidth; h=canvas.height=innerHeight; });
    function draw(){ 
      ctx.clearRect(0,0,w,h);
      const grd = ctx.createLinearGradient(0,0,w,h); 
      grd.addColorStop(0,'rgba(161,108,241,0.08)'); 
      grd.addColorStop(1,'rgba(255,122,182,0.04)'); 
      ctx.fillStyle=grd; 
      ctx.fillRect(0,0,w,h);
      for(let p of particles){ 
        p.x+=p.vx; p.y+=p.vy; 
        p.a+=Math.sin(Date.now()/2000+p.x)*0.002; 
        if(p.y>h+10) p.y=-10; 
        if(p.x>w+10) p.x=-10; 
        ctx.beginPath(); 
        ctx.fillStyle=`rgba(255,255,255,${0.06+p.a*0.2})`; 
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2); 
        ctx.fill(); 
      }
      requestAnimationFrame(draw);
    }
    draw();
  }
  
  function populateGallery() {
    const grid = qs('#galleryGrid');
    if(!grid) return;
    const urls = [
    "1.jpeg",
    "2.jpeg",
    "3.jpeg",
    "4.jpeg",
    "5.jpeg",
    "6.jpeg",
    "7.jpeg",
    "8.jpeg",
    "9.jpeg",
    "10.jpeg",
    "11.jpeg",
    "12.jpeg",
    "13.jpeg",
    "14.jpeg",
    "15.jpeg",
    "16.jpeg",
    "17.jpeg",
    "18.jpeg"
    ];
    urls.forEach((u,i) => {
      const p = document.createElement('div'); 
      p.className='polaroid'; 
      p.style.transform=`rotate(${rand(-6,6)}deg)`;
      const img = document.createElement('img'); 
      img.src=u; 
      img.alt='Memory '+(i+1);
      p.appendChild(img);
      p.addEventListener('click', () => { openModal(`<img src="${u}" style="width:100%;border-radius:8px">`); heartBurst(14); });
      grid.appendChild(p);
    });
  }
  
  // function openModal(html) { 
  //   const modal = qs('#modal'); 
  //   qs('#modalContent').innerHTML=html; 
  //   modal.style.display='flex'; 
  //   modal.setAttribute('aria-hidden','false'); 
  // }
  
  // function closeModal() { 
  //   const modal = qs('#modal'); 
  //   modal.style.display='none'; 
  //   modal.setAttribute('aria-hidden','true'); 
  //   qs('#modalContent').innerHTML=''; 
  // }

  function openModal(html)
  {
      const modal = qs('#modal');

      qs('#modalContent').innerHTML = html;

      modal.classList.add("show");

      modal.setAttribute("aria-hidden","false");
  }
  
  function closeModal(){
      const modal = qs('#modal');

      modal.classList.remove("show");

      modal.setAttribute("aria-hidden","true");

      qs('#modalContent').innerHTML = "";
  }
  
  const modalClose = qs('#modalClose');
  if(modalClose) modalClose.addEventListener('click', closeModal);
  const modal = qs('#modal');
  if(modal) modal.addEventListener('click', (e) => { if(e.target.id==='modal') closeModal(); });
  
  function initTypewriter() {
    const text = `Dear Shweta,\n\nOn your special day, I just want you to know how grateful I am to have you in my life. Every smile of yours brightens my darkest days, and every moment with you becomes a beautiful memory.\n\nYou are not just my girlfriend; you are my happiness, my comfort, my inspiration, and my favorite person.\n\nAs you step into your 21st year, I wish you endless joy, success, good health, and dreams that come true.\n\nThank you for being you.\n\nHappy Birthday, My Love ❤️\n\nForever Yours.`;
    const el = qs('#typewriter');
    if(!el) return;
    let i=0; 
    function step() { 
      el.textContent = text.slice(0,i) + (i%2? '▌':'');
      i++; 
      if(i<=text.length) setTimeout(step, 28); 
    }
    setTimeout(step, 900);
  }
  
  function initQuotesCarousel() {
    const quotes = [
      'Every love story is beautiful, but ours is my favorite.',
      'You are the reason I believe in magic.',
      'In a world full of temporary things, you are my forever.',
      'Your smile is my favorite sunrise.',
      'The best thing that ever happened to me is you.',
      'With you, every moment becomes a beautiful memory.',
      'You are the chapter of my life I never want to end.',
      'If I could choose again, I would still choose you.'
    ];
    const carousel = qs('#quotesCarousel');
    if(!carousel) return;
    let idx=0;
    function show() { 
      carousel.innerHTML = `<div class="quote">❤️ ${quotes[idx]}</div>`; 
      idx=(idx+1)%quotes.length; 
    }
    show(); 
    setInterval(show, 4200);
  }
  
  function initTimer() {
    const birth = new Date(2005, 6, 3, 0, 0, 0);
    const el = qs('#ageText');
    if(!el) return;
    function update() { 
      const now = new Date(); 
      let years = now.getFullYear()-birth.getFullYear(); 
      let months = now.getMonth()-birth.getMonth(); 
      if(months<0) {years--; months+=12;} 
      const days = Math.floor((now - new Date(now.getFullYear(), now.getMonth(), birth.getDate()))/(1000*60*60*24)); 
      const diff = now - birth; 
      const s = Math.floor(diff/1000)%60; 
      const m = Math.floor(diff/60000)%60; 
      const h = Math.floor(diff/3600000)%24; 
      const D = Math.floor(diff/86400000); 
      el.textContent = `${years}y ${months}m ${D}d ${h}h ${m}m ${s}s`; 
    }
    update(); 
    setInterval(update, 1000);
  }
  
  function initControls() {
    const music = qs('#bgMusic'); 
    const musicToggle = qs('#musicToggle'); 
    if(musicToggle && music) {
      musicToggle.addEventListener('click', () => { 
        if(music.paused) { 
          music.play(); 
          musicToggle.textContent='Pause'; 
        } else { 
          music.pause(); 
          musicToggle.textContent='Music'; 
        }
      });
    }
    const heroOpen = qs('#heroOpen');
    if(heroOpen) heroOpen.addEventListener('click', () => { qs('#loveLetter').scrollIntoView({behavior:'smooth',block:'center'}); });
    const openHeart = qs('#openHeart');
    if(openHeart) openHeart.addEventListener('click', () => { qs('#loveLetter').scrollIntoView({behavior:'smooth',block:'center'}); });
    const foreverBtn = qs('#foreverBtn');
    if(foreverBtn) foreverBtn.addEventListener('click', grandFinale);
  }
  
  function initGlobalClicks() { 
    document.addEventListener('click', (e) => { heartBurst(22, e.clientX, e.clientY); });
    let last=0; 
    document.addEventListener('mousemove', (e) => { 
      if(Date.now()-last<60) return; 
      last=Date.now(); 
      const th = document.createElement('div'); 
      th.className='trail-heart'; 
      th.style.left=`${e.clientX}px`; 
      th.style.top=`${e.clientY}px`; 
      const s = rand(6,14); 
      th.style.width=`${s}px`; 
      th.style.height=`${s}px`; 
      th.style.background=`rgba(255,122,182,0.9)`; 
      th.style.borderRadius='6px'; 
      document.body.appendChild(th); 
      th.animate([{opacity:1, transform:'translate(-50%,-50%) scale(1)'},{opacity:0, transform:'translate(-50%,-50%) translateY(-40px) scale(.6)'}], {duration:900, easing:'ease-out'}); 
      setTimeout(() => th.remove(), 1000); 
    }); 
  }
  
  const NOTES = ['You are my favorite notification.', 'Every moment with you is a blessing.', 'I fall in love with you more every day.', 'You are the most beautiful chapter of my life.', 'Your smile is worth more than a thousand stars.', 'You make ordinary moments magical.'];
  
  function scatterLoveNotes(n) { 
    for(let i=0;i<n;i++) { 
      const a = document.createElement('div'); 
      a.className='trail-heart'; 
      a.style.left=`${rand(6,94)}vw`; 
      a.style.top=`${rand(12,86)}vh`; 
      a.style.width='18px'; 
      a.style.height='18px'; 
      a.style.background='linear-gradient(90deg,#ff7ab6,#a16cf1)'; 
      a.style.borderRadius='50%'; 
      a.style.cursor='pointer'; 
      a.title='Open Note'; 
      document.body.appendChild(a); 
      a.addEventListener('click', (e) => { 
        e.stopPropagation(); 
        const note = NOTES[Math.floor(Math.random()*NOTES.length)]; 
        openModal(`<div style="padding:18px;font-size:18px">❤️ ${note}</div>`); 
        heartBurst(12, e.clientX, e.clientY); 
      }); 
    }
  }
  
  function startFallingRoses() { 
    setInterval(() => { 
      const p = document.createElement('div'); 
      p.className='petal'; 
      p.style.position='fixed'; 
      p.style.left=`${rand(0,100)}vw`; 
      p.style.top='-40px'; 
      p.style.width=`${rand(12,36)}px`; 
      p.style.height=`${rand(12,36)}px`; 
      p.style.background='radial-gradient(circle,#ff99b2,#c06cfb)'; 
      p.style.borderRadius='50% 30% 50% 30%'; 
      p.style.transform=`rotate(${rand(0,360)}deg)`; 
      p.style.zIndex=50; 
      document.body.appendChild(p); 
      p.animate([{transform:p.style.transform, opacity:1, offset:0, top:'-40px'}, {transform:`translateY(${innerHeight+120}px) rotate(${rand(30,160)}deg)`, opacity:0.2}], {duration:rand(4000,9000), easing:'cubic-bezier(.2,.6,.2,1)'}); 
      setTimeout(() => p.remove(), 9500); 
    }, 1400);
  }
  
  function startShootingStars() { 
    setInterval(() => { 
      const s = document.createElement('div'); 
      s.className='star'; 
      s.style.position='fixed'; 
      s.style.left=`${rand(10,90)}vw`; 
      s.style.top=`${rand(6,40)}vh`; 
      s.style.width='2px'; 
      s.style.height='2px'; 
      s.style.background='linear-gradient(90deg,#fff,#ffd1e6)'; 
      s.style.zIndex=10; 
      document.body.appendChild(s); 
      const dx = rand(-800,800); 
      const dy = rand(200,600); 
      s.animate([{transform:'translate(0,0) scale(1)', opacity:1}, {transform:`translate(${dx}px,${dy}px) scale(0.6)`, opacity:0}], {duration:rand(900,1600), easing:'linear'}); 
      setTimeout(() => s.remove(), 1700); 
    }, 12000);
  }
  
  function grandFinale() {
    document.body.style.transition='background 1s'; 
    document.body.style.background='linear-gradient(180deg,#020018 0%, #0b0030 100%)'; 
    heartBurst(120, innerWidth/2, innerHeight*0.7);
    const fireworks = setInterval(() => { heartBurst(28, rand(80,innerWidth-80), rand(120,innerHeight-120)); }, 220);
    setTimeout(() => clearInterval(fireworks), 14000);
    openModal('<div style="text-align:center;padding:24px"><h1 style="font-family:Great Vibes,cursive;font-size:36px;color:#ffd1e6">Happy 21st Birthday Shweta ❤️</h1><p style="opacity:.9">Thank You For Being The Most Beautiful Part Of My Life<br>I Love You Forever ♾️</p></div>');
  }
  
})();
