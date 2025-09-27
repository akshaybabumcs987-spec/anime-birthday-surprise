const cards = document.querySelectorAll(".card");
const note = document.getElementById("birthdayNote");
let clickedCount = 0;

// 3D Tilt Effect
cards.forEach(card => {
  card.addEventListener("mousemove", e => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width/2;
    const cy = rect.height/2;
    const dx = (x - cx) / 20;
    const dy = (y - cy) / 20;
    card.style.transform = `rotateY(${dx}deg) rotateX(${-dy}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = "rotateY(0deg) rotateX(0deg)";
  });

  // Click → Show funny image
  card.addEventListener("click", () => {
    if (!card.dataset.clicked) {
      card.dataset.clicked = "true";
      const img = card.querySelector("img");
      img.style.transform = "scale(1.1)";
      setTimeout(() => {
        img.src = card.dataset.funny;
        img.style.transform = "scale(1)";
      }, 300);

      clickedCount++;
      if (clickedCount === cards.length) {
        setTimeout(showBirthdayNote, 800);
      }
    }
  });
});

// Show Birthday Note + Confetti
function showBirthdayNote() {
  note.style.display = "block";
  note.scrollIntoView({ behavior: "smooth" });
  startConfetti();
}

/* === Confetti Animation === */
const canvas = document.getElementById("confettiCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let confettis = [];

function randomColor() {
  const colors = ["#ffcc00", "#ff6b6b", "#6bffb8", "#6bc9ff", "#ffffff"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function ConfettiPiece() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height - canvas.height;
  this.size = Math.random() * 6 + 4;
  this.color = randomColor();
  this.speed = Math.random() * 3 + 2;
  this.angle = Math.random() * 2 * Math.PI;
}

ConfettiPiece.prototype.update = function() {
  this.y += this.speed;
  this.x += Math.sin(this.angle)*2;
  this.angle += 0.02;
  if(this.y > canvas.height){
    this.y = -10;
    this.x = Math.random()*canvas.width;
  }
};

ConfettiPiece.prototype.draw = function(){
  ctx.fillStyle = this.color;
  ctx.beginPath();
  ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
  ctx.fill();
};

function startConfetti(){
  confettis = [];
  for(let i=0;i<150;i++) confettis.push(new ConfettiPiece());
  animateConfetti();
}

function animateConfetti(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  confettis.forEach(c => { c.update(); c.draw(); });
  requestAnimationFrame(animateConfetti);
}

window.addEventListener("resize",()=>{
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
