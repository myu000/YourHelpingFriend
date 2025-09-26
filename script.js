// Elements
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const progressBar = document.getElementById('progressBar');
const surpriseBtn = document.getElementById('surpriseBtn');

// State
let step = 0;
let formData = {
  name: '',
  vibe: '',
  details: '',
  format: '',
  timeline: '',
  email: ''
};
const steps = [
  "👋 Hey! I’m YourHelpingBuddy. What’s your name?",
  "🎨 Nice to meet you! What vibe are you feeling? (e.g., That Girl, Beachcore, Dark Academia, Yellow Joy, Healing & Calm, Music Vibes, Branding & Business, Custom)",
  "🖼️ Any colors, quotes, or references you’d like me to include?",
  "📦 Preferred format? (PDF, Canva link, PNG collage)",
  "⏰ When do you need it?",
  "📧 Where should I send it? (email)"
];
const vibesMap = {
  'that girl':'that-girl',
  'beachcore':'beachcore',
  'dark academia':'dark-academia',
  'yellow joy':'yellow-joy',
  'healing & calm':'healing-calm',
  'music vibes':'music-vibes',
  'branding & business':'branding-business',
  'custom':'default'
};

// Init
document.getElementById('year').textContent = new Date().getFullYear();
restoreSession();
if (step === 0 && chatWindow.childElementCount === 0) {
  typeBot(steps[0]);
}

// Helpers
function saveSession(){
  localStorage.setItem('yhb_chat', JSON.stringify({
    step, formData, html: chatWindow.innerHTML, theme: document.documentElement.getAttribute('data-theme')
  }));
}
function restoreSession(){
  const saved = localStorage.getItem('yhb_chat');
  if(!saved) return;
  try{
    const data = JSON.parse(saved);
    step = data.step || 0;
    formData = data.formData || formData;
    chatWindow.innerHTML = data.html || '';
    document.documentElement.setAttribute('data-theme', data.theme || 'default');
    updateProgress();
    // Reattach reaction handlers if any
    [...chatWindow.querySelectorAll('.emoji')].forEach(btn=>{
      btn.addEventListener('click', ()=> btn.classList.add('selected'));
    });
  }catch(e){ console.warn('Session restore failed', e); }
}
function scrollToBottom(){ chatWindow.scrollTop = chatWindow.scrollHeight; }
function updateProgress(){
  const pct = Math.min(100, Math.round((step / steps.length) * 100));
  progressBar.style.width = `${pct}%`;
}
function addMessage(text, sender='bot', extraClass=''){
  const wrap = document.createElement('div');
  wrap.className = `msg ${sender} ${extraClass}`.trim();
  wrap.innerHTML = sanitize(text);
  chatWindow.appendChild(wrap);
  scrollToBottom();
  saveSession();
}
function sanitize(s){
  const div = document.createElement('div');
  div.textContent = s;
  return div.innerHTML.replace(/\n/g,'<br>');
}

// Typing indicator + message
function typeBot(text){
  const typing = document.createElement('div');
  typing.className = 'typing msg bot';
  typing.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
  chatWindow.appendChild(typing);
  scrollToBottom();
  setTimeout(()=>{
    typing.remove();
    addMessage(text, 'bot');
    addReactions();
  }, 500 + Math.min(1200, text.length * 20));
}

// Emoji reactions under the latest bot message
function addReactions(){
  const lastBot = [...chatWindow.querySelectorAll('.msg.bot')].pop();
  if(!lastBot) return;
  const row = document.createElement('div');
  row.className = 'reactions';
  ['👍','💡','🎨','✨'].forEach(e=>{
    const btn = document.createElement('button');
    btn.className = 'emoji';
    btn.textContent = e;
    btn.addEventListener('click', ()=> btn.classList.add('selected'));
    row.appendChild(btn);
  });
  lastBot.appendChild(row);
  saveSession();
}

// Mood preview bubble and theme swap
function showMoodPreview(vibeText){
  const mood = (vibeText || '').trim().toLowerCase();
  let theme = 'default';
  for(const key of Object.keys(vibesMap)){
    if(mood.includes(key)) { theme = vibesMap[key]; break; }
  }
  document.documentElement.setAttribute('data-theme', theme);

  const card = document.createElement('div');
  card.className = 'msg bot preview';
  card.innerHTML = `
    <div class="title">Mood: ${vibeText}</div>
    <div class="tags">Theme set • Live preview updated</div>
  `;
  chatWindow.appendChild(card);
  scrollToBottom();
  saveSession();
}

// Validation prompts
function validate(stepIndex, input){
  if(!input) return "🌸 Could you add something here? I’ll tailor it to you.";
  if(stepIndex === 5){
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input);
    if(!ok) return "📧 Hmm, that email looks off. Try something like name@example.com";
  }
  return null;
}

// Handle input
function handleSend(){
  const text = userInput.value.trim();
  if(!text) return;

  // Validate current step input
  const err = validate(step, text);
  if(err){
    addMessage(text, 'user');
    userInput.value = '';
    typeBot(err);
    return;
  }

  // Record user message
  addMessage(text, 'user');
  userInput.value = '';

  // Save to formData
  switch(step){
    case 0: formData.name = text; break;
    case 1: formData.vibe = text; showMoodPreview(text); break;
    case 2: formData.details = text; break;
    case 3: formData.format = text; break;
    case 4: formData.timeline = text; break;
    case 5: formData.email = text; break;
    default: break;
  }

  step++;
  updateProgress();

  if(step < steps.length){
    setTimeout(()=> typeBot(steps[step]), 500);
  }else{
    setTimeout(() => {
      typeBot(`✨ Thanks, ${formData.name}! I’ve saved your request. I’ll send your mood board to ${formData.email}.`);
      addMessage(`Summary:
- Name: ${formData.name}
- Vibe: ${formData.vibe}
- Details: ${formData.details}
- Format: ${formData.format}
- Timeline: ${formData.timeline}
- Email: ${formData.email}`, 'bot', 'preview');
      typeBot("Want to tweak anything? Just type it in. Or hit “✨ Surprise me” for an instant vibe suggestion.");
    }, 600);
  }
}

// Surprise Me: suggest a random curated vibe and set theme
const curated = [
  "Beachcore — ocean blues, warm sand, shells, sunlight",
  "Dark Academia — deep browns, parchment, books, vintage notes",
  "Yellow Joy — sunlit hues, daisies, playful quotes",
  "Healing & Calm — mint, sky blue, plants, gentle textures",
  "Music Vibes — neon gradients, vinyl, waveforms",
  "That Girl — blush tones, clean lines, wellness icons",
  "Branding & Business — crisp whites, navy, minimalist grids"
];
function surprise(){
  const pick = curated[Math.floor(Math.random()*curated.length)];
  addMessage("✨ Surprise unlocked!", 'bot');
  showMoodPreview(pick);
  if(step <= 1){
    // If vibe not provided yet, treat surprise as vibe answer
    formData.vibe = pick;
    step = Math.max(step, 2); // move past vibe step
    updateProgress();
    setTimeout(()=> typeBot(steps[2]), 600);
  }
}

// Events
sendBtn.addEventListener('click', handleSend);
userInput.addEventListener('keydown', e => { if(e.key === 'Enter') handleSend(); });
surpriseBtn.addEventListener('click', surprise);

// Accessibility: focus input on load
window.addEventListener('load', ()=> userInput.focus());
