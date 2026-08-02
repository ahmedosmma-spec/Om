/* =========================================================
   1. خلفية السماء المضيئة (Canvas API)
   ========================================================= */
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let meteors = [];

function resizeCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * width,
    y: Math.random() * height,
    radius: Math.random() * 1.5,
    alpha: Math.random(),
    speed: Math.random() * 0.02 + 0.005
  });
}

setInterval(() => {
  meteors.push({
    x: Math.random() * width,
    y: 0,
    length: Math.random() * 80 + 50,
    speed: Math.random() * 10 + 6,
    alpha: 1
  });
}, 15000);

function drawSpace() {
  ctx.clearRect(0, 0, width, height);

  stars.forEach(s => {
    s.alpha += s.speed;
    if (s.alpha > 1 || s.alpha < 0) s.speed = -s.speed;
    ctx.fillStyle = `rgba(255, 255, 255, ${Math.abs(s.alpha)})`;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  meteors.forEach((m, index) => {
    ctx.strokeStyle = `rgba(255, 215, 0, ${m.alpha})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(m.x, m.y);
    ctx.lineTo(m.x - m.length, m.y + m.length);
    ctx.stroke();

    m.x += m.speed;
    m.y += m.speed;
    m.alpha -= 0.01;

    if (m.alpha <= 0) meteors.splice(index, 1);
  });

  requestAnimationFrame(drawSpace);
}
drawSpace();

/* =========================================================
   2. تأثير انبعاث القلوب عند اللمس
   ========================================================= */
window.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') return;
  
  const heart = document.createElement('div');
  heart.className = 'floating-heart';
  heart.innerHTML = ['❤️', '💖', '✨', '🌸'][Math.floor(Math.random() * 4)];
  heart.style.left = `${e.clientX}px`;
  heart.style.top = `${e.clientY}px`;
  document.body.appendChild(heart);

  setTimeout(() => heart.remove(), 1500);
});

/* =========================================================
   3. التنقل بين الصفحات
   ========================================================= */
function nextStep(stepNumber) {
  document.querySelectorAll('.section').forEach(sec => sec.classList.remove('active'));
  const targetSec = document.getElementById(`step-${stepNumber}`);
  if (targetSec) {
    targetSec.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (stepNumber === 4) startLetterTypewriter();
  if (stepNumber === 6) initWishStars();
}

function restartJourney() {
  nextStep(1);
}

/* =========================================================
   4. شاشة التحميل (Step 0)
   ========================================================= */
const introText = "إلى أسيل...\nيمكن الكلمات متقدرش توصف كل اللي جوايا، بس حبيت أعمل المكان ده مخصوص ليكي.";
let textIdx = 0;

function typeLoaderText() {
  if (textIdx < introText.length) {
    document.getElementById('loader-text').innerHTML += introText.charAt(textIdx) === '\n' ? '<br>' : introText.charAt(textIdx);
    textIdx++;
    setTimeout(typeLoaderText, 40);
  }
}
typeLoaderText();

let progress = 0;
const progressBar = document.getElementById('progressBar');
const progressPercent = document.getElementById('progressPercent');

const progressInterval = setInterval(() => {
  progress += Math.floor(Math.random() * 5) + 2;
  if (progress >= 100) {
    progress = 100;
    clearInterval(progressInterval);
    setTimeout(() => nextStep(1), 800);
  }
  progressBar.style.width = `${progress}%`;
  progressPercent.innerText = `${progress}%`;
}, 100);

/* =========================================================
   5. العداد الزمني الحقيقي
   ========================================================= */
const startDate = new Date('2026-07-01T00:00:00');

function updateCounter() {
  const now = new Date();
  const diff = now - startDate;

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  document.getElementById('days').innerText = days >= 0 ? days : 0;
  document.getElementById('hours').innerText = hours >= 0 ? hours : 0;
  document.getElementById('minutes').innerText = minutes >= 0 ? minutes : 0;
  document.getElementById('seconds').innerText = seconds >= 0 ? seconds : 0;
}
setInterval(updateCounter, 1000);
updateCounter();

/* =========================================================
   6. طباعة الرسالة الخاصة
   ========================================================= */
const fullLetter = `إلى Asil… ❤️\n\nمن يوم 1 Jul 2026 وأنا حاسس إن حياتي بقت مختلفة.\n\nيمكن الفترة اللي بينا لسه قصيرة، لكن كل يوم كان ليه ذكرى جميلة.\n\nويوم 25 Jul 2026 كان من أكتر الأيام اللي كنت متوتر فيها، لأن ده اليوم اللي قررت أقولك فيه اللي جوايا.\n\nشكراً على كل لحظة، وكل ضحكة، وكل إحساس جميل دخل حياتي بسببك.\n\nأتمنى إن كل يوم يعدي يبقى أحسن من اللي قبله، وإن أفضل أشوف ابتسامتك دايمًا.\n\nبحبك يا Asil. ❤️\n\n— Yassin`;
let letterIdx = 0;
let letterStarted = false;

function startLetterTypewriter() {
  if (letterStarted) return;
  letterStarted = true;
  const letterElement = document.getElementById('letter-text');
  
  function type() {
    if (letterIdx < fullLetter.length) {
      letterElement.innerHTML += fullLetter.charAt(letterIdx);
      letterIdx++;
      setTimeout(type, 35);
    } else {
      document.getElementById('after-letter').style.display = 'block';
    }
  }
  type();
}

/* =========================================================
   7. بطاقات الأسباب والهدية
   ========================================================= */
function flipCard(card) {
  if (!card.classList.contains('flipped')) {
    card.classList.add('flipped');
  }
}

function openGift() {
  document.getElementById('gift-message').style.display = 'block';
}

/* =========================================================
   8. سماء النجوم المضيئة (Step 6)
   ========================================================= */
const wishes = [
  "وجودك فرق معايا. ❤️", "ابتسامتك أجمل حاجة شوفتها.", "ربنا يديمك في حياتي.",
  "كل يوم بفتخر إني عرفتك.", "يا رب أشوفك مبسوطة دايمًا.", "بحب كل تفاصيلك.",
  "ضحكتك بتنور يومي.", "أجمل صدفة في 2026.", "راحة بالي معاكي.",
  "أنقى قلب عرفته.", "معاكي الوقت بيعدي في ثانية.", "جمالك ملوش مثيل.",
  "دائمًا في بالي.", "كل لحظة معاكي ذكرى حلوة.", "سعادتي من سعادتك.",
  "يا أحلى حاجة حصلتلي.", "تستاهلي كل حاجة حلوة.", "حضورك بيكفي.",
  "عيونك فيها سحر خاص.", "بحبك يا Asil ❤️"
];

let clickedStarsCount = 0;

function initWishStars() {
  const starBox = document.getElementById('starBox');
  if (starBox.children.length > 0) return;

  wishes.forEach((wishText) => {
    const star = document.createElement('div');
    star.className = 'wish-star';
    star.innerHTML = '⭐';
    
    star.style.left = `${Math.random() * 85 + 5}%`;
    star.style.top = `${Math.random() * 80 + 10}%`;

    star.onclick = () => {
      document.getElementById('wish-text').innerText = wishText;
      star.style.opacity = '0.3';
      star.style.transform = 'scale(0.8)';
      clickedStarsCount++;

      if (clickedStarsCount >= 5) {
        document.getElementById('finalStarBtn').style.display = 'inline-block';
      }
    };

    starBox.appendChild(star);
  });
}

function triggerHeartGathering() {
  const starBox = document.getElementById('starBox');
  starBox.innerHTML = '<div style="font-size: 80px; margin-top: 100px; animation: pulseBtn 1s infinite;">❤️</div><p style="color:var(--gold); margin-top:10px;">Y ❤️ A</p>';
  
  setTimeout(() => {
    nextStep(7);
  }, 2500);
}

/* =========================================================
   9. زر الموسيقى وإمالة الموبايل
   ========================================================= */
document.getElementById('musicBtn').onclick = () => {
  window.open('https://www.youtube.com', '_blank');
};

window.addEventListener('deviceorientation', (e) => {
  const tiltX = e.gamma / 3; 
  const tiltY = e.beta / 3;
  document.querySelectorAll('.glass-card').forEach(card => {
    card.style.transform = `rotateY(${tiltX}deg) rotateX(${tiltY}deg)`;
  });
});

/* =========================================================
   10. نافذة الحقوق السرية (بعد 8 دقائق و 50 ثانية) والنسخ
   ========================================================= */
// 8 دقائق و 50 ثانية = 530 ثانية = 530,000 ملي ثانية
setTimeout(() => {
  document.getElementById('creditsModal').style.display = 'block';
}, 530000);

function closeCredits() {
  document.getElementById('creditsModal').style.display = 'none';
}

function copyTikTok() {
  const username = document.getElementById('tiktokUser').innerText;
  
  navigator.clipboard.writeText(username).then(() => {
    const toast = document.getElementById('copyToast');
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  }).catch(err => {
    const textArea = document.createElement("textarea");
    textArea.value = username;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
    
    const toast = document.getElementById('copyToast');
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 2000);
  });
}
