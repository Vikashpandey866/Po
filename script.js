// small helpers
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

// year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle (simple)
const themeBtn = document.getElementById('themeToggle');
if(themeBtn){
  themeBtn.addEventListener('click', ()=>{
    document.body.classList.toggle('dark');
    // small style switch: invert background
    if(document.body.classList.contains('dark')){
      document.documentElement.style.setProperty('--bg','#071124');
      document.documentElement.style.setProperty('--card','#071124');
    } else {
      document.documentElement.style.removeProperty('--bg');
      document.documentElement.style.removeProperty('--card');
    }
  });
}

// Skill bar reveal on scroll
function revealSkills(){
  $$('.skill-bar span').forEach(el=>{
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight - 60){
      el.style.width = el.style.getPropertyValue('--val') || '60%';
    }
  });
}
window.addEventListener('scroll', revealSkills);
window.addEventListener('load', revealSkills);

// Tilt effect (vanilla)
$$('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * 10; // rotateX
    const ry = (x - 0.5) * -10; // rotateY
    card.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
  });
  card.addEventListener('mouseleave', ()=> card.style.transform = 'none');
});

// Certificate lightbox
const lightbox = $('#lightbox');
const lbImg = $('#lbImage');
$$('.cert-card img').forEach(img=>{
  img.addEventListener('click', ()=>{
    lbImg.src = img.dataset.full || img.src;
    lightbox.style.display = 'flex';
    lightbox.setAttribute('aria-hidden','false');
  });
});
$('#lbClose').addEventListener('click', ()=>{
  lightbox.style.display = 'none';
  lightbox.setAttribute('aria-hidden','true');
  lbImg.src = '';
});
lightbox.addEventListener('click', (e)=> { if(e.target === lightbox){ lbImg.src=''; lightbox.style.display='none'; }} );

// Contact form demo validation
const form = $('#contactForm');
if(form){
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();
    const msg = $('#formMsg');
    msg.textContent = '';
    if(!name || !email || !message){
      msg.style.color = '#d9534f'; msg.textContent = 'Please fill all fields';
      return;
    }
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!re.test(email)){ msg.style.color = '#d9534f'; msg.textContent = 'Please enter valid email'; return; }
    msg.style.color = 'green';
    msg.textContent = 'Thanks — message prepared (demo).';
    form.reset();
    setTimeout(()=> msg.textContent = '', 4000);
  });
}

// Assistant (mini Q&A) with voice support (speech recognition)
const assistantToggle = $('#assistantToggle');
const assistantWindow = $('#assistantWindow');
const assistantClose = $('#assistantClose');
const assistantMessages = $('#assistantMessages');
const assistantInput = $('#assistantInput');
const assistantSend = $('#assistantSend');
const voiceBtn = $('#voiceBtn');

function addAssistantMessage(text, who='bot'){
  const d = document.createElement('div');
  d.className = who === 'bot' ? 'msg-bot' : 'msg-user';
  d.textContent = text;
  assistantMessages.appendChild(d);
  assistantMessages.scrollTop = assistantMessages.scrollHeight;
}

function getAssistantReply(msg){
  msg = msg.toLowerCase();
  if(msg.includes('name')) return 'My name is Vikash Kumar Pandey.';
  if(msg.includes('skills')) return 'Skills: Cybersecurity, Frontend (HTML/CSS/JS), Data Analysis (Python, Pandas).';
  if(msg.includes('resume') || msg.includes('cv')) return 'You can download my resume via the Download Resume button or this link: https://vikashpandey866.github.io/Portfolio/resume.pdf';
  if(msg.includes('certificat') || msg.includes('certificate')) return 'I have certificates from TATA, Accenture, Deloitte, PwC and Programming Hub. See the Certificates section.';
  if(msg.includes('college')|| msg.includes('university')) return 'I am a BCA 3rd-year student at Swami Vivekanand Subharti University.';
  if(msg.includes('contact') || msg.includes('email')) return 'Email: pandvikash46@gmail.com • Phone: +91 9110989610';
  return "Sorry — I can only answer questions about Vikash's profile, skills, certificates, resume and contact.";
}

// toggle assistant
assistantToggle.addEventListener('click', ()=>{
  const open = assistantWindow.style.display === 'flex';
  assistantWindow.style.display = open ? 'none' : 'flex';
  assistantWindow.setAttribute('aria-hidden', open ? 'true' : 'false');
  if(!open) assistantWindow.querySelector('input').focus();
});
assistantClose.addEventListener('click', ()=> { assistantWindow.style.display='none'; assistantWindow.setAttribute('aria-hidden','true'); });

// send assistant message
assistantSend.addEventListener('click', ()=>{
  const text = assistantInput.value.trim();
  if(!text) return;
  addAssistantMessage(text,'user');
  assistantInput.value = '';
  setTimeout(()=> addAssistantMessage(getAssistantReply(text),'bot'), 400);
});

// allow Enter
assistantInput.addEventListener('keydown', (e)=> { if(e.key === 'Enter') assistantSend.click(); });

// Speech Recognition (if available)
let recognition;
if('SpeechRecognition' in window || 'webkitSpeechRecognition' in window){
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recognition = new SR();
  recognition.lang = 'en-IN';
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  voiceBtn.addEventListener('click', ()=>{
    try{
      recognition.start();
      voiceBtn.textContent = '🎙️';
    }catch(err){ console.warn(err) }
  });

  recognition.onresult = (e)=>{
    const text = e.results[0][0].transcript;
    assistantInput.value = text;
    assistantSend.click();
    voiceBtn.textContent = '🎤';
  };
  recognition.onerror = ()=> { voiceBtn.textContent = '🎤'; }
  recognition.onend = ()=> { voiceBtn.textContent = '🎤'; }
} else {
  // hide voice button if not supported
  if(voiceBtn) voiceBtn.style.display = 'none';
}

// small animation: reveal elements on load
window.addEventListener('load', ()=>{
  // animate skill bars
  revealSkills();
  // subtle entrance
  $$('.card, .project-card, .cert-card, .skill-card').forEach((el,i)=>{
    el.style.opacity = 0;
    el.style.transform = 'translateY(10px)';
    setTimeout(()=> { el.style.transition = 'all .6s cubic-bezier(.2,.9,.3,1)'; el.style.opacity=1; el.style.transform='none'; }, 120 * i );
  });
});
