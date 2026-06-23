

// variables
/* Modern interactive JS for the birthday site */
(() => {
	const qs = (s, el = document) => el.querySelector(s);
	const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

	// Init AOS
	document.addEventListener('DOMContentLoaded', () => {
		if (window.AOS) AOS.init({duration:900, once:true});
		initSite();
	});

	// helper random
	const rand = (min, max) => Math.random()*(max-min)+min;

	// Core init
	function initSite(){
		setTimeout(()=>document.getElementById('loader').style.display='none',1200);
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

	/* Background canvas: particles, hearts, stars */
	function initCanvas(){
		const canvas = document.getElementById('bg-canvas');
		const ctx = canvas.getContext('2d');
		let w = canvas.width = innerWidth; let h = canvas.height = innerHeight;
		const particles = [];
		for(let i=0;i<60;i++) particles.push({x:rand(0,w), y:rand(0,h), r:rand(0.4,2.8), vx:rand(-0.2,0.2), vy:rand(0.1,0.6), a:rand(0.05,0.8)});
		function resize(){ w=canvas.width=innerWidth; h=canvas.height=innerHeight; }
		addEventListener('resize', resize);
		function draw(){ ctx.clearRect(0,0,w,h);
			// soft glow background
			const grd = ctx.createLinearGradient(0,0,w,h); grd.addColorStop(0,'rgba(161,108,241,0.08)'); grd.addColorStop(1,'rgba(255,122,182,0.04)'); ctx.fillStyle=grd; ctx.fillRect(0,0,w,h);
			for(let p of particles){ p.x+=p.vx; p.y+=p.vy; p.a+=Math.sin(Date.now()/2000+p.x)*0.002; if(p.y>h+10) p.y=-10; if(p.x> w+10) p.x=-10; ctx.beginPath(); ctx.fillStyle=`rgba(255,255,255,${0.06+p.a*0.2})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill(); }
			requestAnimationFrame(draw);
		}
		draw();
	}

	/* Gallery */
	function populateGallery(){
		const grid = qs('#galleryGrid');
		const urls = [
			'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80',
			'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
			'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80',
			'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&q=80',
			'https://images.unsplash.com/photo-1504198266286-1659872e6590?w=800&q=80',
			'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=80'
		];
		urls.forEach((u,i)=>{
			const p = document.createElement('div'); p.className='polaroid'; p.style.transform=`rotate(${rand(-6,6)}deg)`;
			const img = document.createElement('img'); img.src=u; img.alt='Memory '+(i+1);
			p.appendChild(img);
			p.addEventListener('click', ()=>{ openModal(`<img src="${u}" style="width:100%;border-radius:8px">`); heartBurst(14); });
			grid.appendChild(p);
		});
	}

	/* Modal lightbox */
	function openModal(html){ const modal = qs('#modal'); qs('#modalContent').innerHTML=html; modal.style.display='flex'; modal.setAttribute('aria-hidden','false'); }
	function closeModal(){ const modal=qs('#modal'); modal.style.display='none'; modal.setAttribute('aria-hidden','true'); qs('#modalContent').innerHTML=''; }
	qs('#modalClose').addEventListener('click', closeModal);
	qs('#modal').addEventListener('click', (e)=>{ if(e.target.id==='modal'){ closeModal(); }});

	/* Typewriter love letter */
	function initTypewriter(){
		const text = `Dear Shweta,\n\nOn your special day, I just want you to know how grateful I am to have you in my life. Every smile of yours brightens my darkest days, and every moment with you becomes a beautiful memory.\n\nYou are not just my girlfriend; you are my happiness, my comfort, my inspiration, and my favorite person.\n\nAs you step into your 20th year, I wish you endless joy, success, good health, and dreams that come true.\n\nThank you for being you.\n\nHappy Birthday, My Love ❤️\n\nForever Yours.`;
		const el = qs('#typewriter');
		let i=0; function step(){ el.textContent = text.slice(0,i) + (i%2? '▌':''); i++; if(i<=text.length) setTimeout(step, 28); }
		setTimeout(step,900);
	}

	/* Quotes carousel */
	function initQuotesCarousel(){
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
		let idx=0;
		function show(){ carousel.innerHTML = `<div class="quote">❤️ ${quotes[idx]}</div>`; idx=(idx+1)%quotes.length; }
		show(); setInterval(show,4200);
	}

	/* Live rotating timer showing age */
	function initTimer(){
		const birth = new Date(2006,6-1,3,0,0,0); // 03 July 2006 (month index 6-1)
		const el = qs('#ageText');
		function update(){ const now=new Date(); let years = now.getFullYear()-birth.getFullYear(); let months = now.getMonth()-birth.getMonth(); if(months<0){years--; months+=12;} const days = Math.floor((now - new Date(now.getFullYear(), now.getMonth(), birth.getDate()))/ (1000*60*60*24)); const diff = now - birth; const s=Math.floor(diff/1000)%60; const m=Math.floor(diff/60000)%60; const h=Math.floor(diff/3600000)%24; const D=Math.floor(diff/86400000); el.textContent = `${years}y ${months}m ${D}d ${h}h ${m}m ${s}s`; }
		update(); setInterval(update,1000);
	}

	/* Controls: music toggle and open heart scroll */
	function initControls(){
		const music = qs('#bgMusic'); const musicToggle = qs('#musicToggle'); musicToggle.addEventListener('click', ()=>{ if(music.paused){ music.play(); musicToggle.textContent='Pause'; } else { music.pause(); musicToggle.textContent='Music'; }});
		qs('#heroOpen').addEventListener('click', ()=>{ qs('#loveLetter').scrollIntoView({behavior:'smooth',block:'center'}); });
		qs('#openHeart').addEventListener('click', ()=>{ qs('#loveLetter').scrollIntoView({behavior:'smooth',block:'center'}); });
		qs('#foreverBtn').addEventListener('click', grandFinale);
	}

	/* Heart burst on click */
	function heartBurst(count=24, x=innerWidth/2, y=innerHeight/2){
		for(let i=0;i<count;i++){ const h=document.createElement('div'); h.className='trail-heart'; h.style.left=`${x}px`; h.style.top=`${y}px`; const size = rand(8,28); h.style.width=`${size}px`; h.style.height=`${size}px`; h.style.background=`radial-gradient(circle at 30% 30%, rgba(255,122,182,0.95), rgba(161,108,241,0.95))`; h.style.borderRadius='50%'; h.style.transform='translate(-50%,-50%)'; h.style.opacity='1'; document.body.appendChild(h);
			const angle = rand(0,Math.PI*2); const speed = rand(60,260);
			const dx = Math.cos(angle)*speed; const dy = Math.sin(angle)*speed;
			h.animate([{transform:'translate(-50%,-50%) translate(0,0)', opacity:1},{transform:`translate(-50%,-50%) translate(${dx}px,${dy}px)`, opacity:0}],{duration:rand(1400,2400),easing:'cubic-bezier(.16,.8,.32,1)'});
			setTimeout(()=>h.remove(),2500);
		}
	}

	// global click for heart burst
	function initGlobalClicks(){ document.addEventListener('click',(e)=>{ heartBurst(22, e.clientX, e.clientY); });
		// trail hearts on mousemove
		let last=0; document.addEventListener('mousemove', (e)=>{ if(Date.now()-last<60) return; last=Date.now(); const th=document.createElement('div'); th.className='trail-heart'; th.style.left=`${e.clientX}px`; th.style.top=`${e.clientY}px`; const s=rand(6,14); th.style.width=`${s}px`; th.style.height=`${s}px`; th.style.background=`rgba(255,122,182,0.9)`; th.style.borderRadius='6px'; document.body.appendChild(th); th.animate([{opacity:1, transform:'translate(-50%,-50%) scale(1)'},{opacity:0, transform:'translate(-50%,-50%) translateY(-40px) scale(.6)'}],{duration:900,easing:'ease-out'}); setTimeout(()=>th.remove(),1000); }); }

	/* Scatter love notes as clickable small hearts */
	const NOTES = [
		'You are my favorite notification.', 'Every moment with you is a blessing.', 'I fall in love with you more every day.', 'You are the most beautiful chapter of my life.', 'Your smile is worth more than a thousand stars.', 'You make ordinary moments magical.'
	];
	function scatterLoveNotes(n){ for(let i=0;i<n;i++){ const a=document.createElement('div'); a.className='trail-heart'; a.style.left=`${rand(6,94)}vw`; a.style.top=`${rand(12,86)}vh`; a.style.width='18px'; a.style.height='18px'; a.style.background='linear-gradient(90deg,#ff7ab6,#a16cf1)'; a.style.borderRadius='50%'; a.style.cursor='pointer'; a.title='Open Note'; document.body.appendChild(a); a.addEventListener('click',(e)=>{ e.stopPropagation(); const note = NOTES[Math.floor(Math.random()*NOTES.length)]; openModal(`<div style="padding:18px;font-size:18px">❤️ ${note}</div>`); heartBurst(12,e.clientX,e.clientY); }); }
	}

	/* Falling roses (petals) */
	function startFallingRoses(){ setInterval(()=>{ const p=document.createElement('div'); p.className='petal'; p.style.position='fixed'; p.style.left=`${rand(0,100)}vw`; p.style.top='-40px'; p.style.width=`${rand(12,36)}px`; p.style.height=`${rand(12,36)}px`; p.style.background='radial-gradient(circle,#ff99b2,#c06cfb)'; p.style.borderRadius='50% 30% 50% 30%'; p.style.transform=`rotate(${rand(0,360)}deg)`; p.style.zIndex=50; document.body.appendChild(p); p.animate([{transform:p.style.transform,opacity:1, offset:0, top:'-40px'},{transform:`translateY(${innerHeight+120}px) rotate(${rand(30,160)}deg)`,opacity:0.2}],{duration:rand(4000,9000),easing:'cubic-bezier(.2,.6,.2,1)'}); setTimeout(()=>p.remove(),9500); },1400);
	}

	/* Shooting stars */
	function startShootingStars(){ setInterval(()=>{ const s=document.createElement('div'); s.className='star'; s.style.position='fixed'; s.style.left=`${rand(10,90)}vw`; s.style.top=`${rand(6,40)}vh`; s.style.width='2px'; s.style.height='2px'; s.style.background='linear-gradient(90deg,#fff,#ffd1e6)'; s.style.zIndex=10; document.body.appendChild(s); const dx=rand(-800,800); const dy=rand(200,600); s.animate([{transform:'translate(0,0) scale(1)',opacity:1},{transform:`translate(${dx}px,${dy}px) scale(0.6)`,opacity:0}],{duration:rand(900,1600),easing:'linear'}); setTimeout(()=>s.remove(),1700); },12000);
	}

	/* Grand finale */
	function grandFinale(){ // zoom + fireworks + hearts
		document.body.style.transition='background 1s'; document.body.style.background='linear-gradient(180deg,#020018 0%, #0b0030 100%)'; heartBurst(120, innerWidth/2, innerHeight*0.7); // quick music ensure
		const fireworks = setInterval(()=>{ heartBurst(28, rand(80,innerWidth-80), rand(120,innerHeight-120)); },220);
		setTimeout(()=>clearInterval(fireworks),14000);
		// cinematic text
		openModal('<div style="text-align:center;padding:24px"><h1 style="font-family:Great Vibes,cursive;font-size:36px;color:#ffd1e6">Happy 20th Birthday Shweta ❤️</h1><p style="opacity:.9">Thank You For Being The Most Beautiful Part Of My Life<br>I Love You Forever ♾️</p></div>');
	}

})();
