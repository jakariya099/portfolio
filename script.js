// --- 1. Interactive Particle Canvas Background ---
const canvas = document.getElementById("particleCanvas");
const ctx = canvas.getContext("2d");
let particles = [];
let mouse = { x: null, y: null, radius: 120 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

window.addEventListener("mousemove", (e) => {
  mouse.x = e.x;
  mouse.y = e.y;
});

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = (Math.random() - 0.5) * 0.8;
    this.color = Math.random() > 0.5 ? "#00f3ff" : "#9d4edd";
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;

    // Mouse interaction distance
    let dx = mouse.x - this.x;
    let dy = mouse.y - this.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < mouse.radius) {
      this.x -= dx * 0.03;
      this.y -= dy * 0.03;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  let count = Math.floor((canvas.width * canvas.height) / 18000);
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// --- 2. Custom Glowing Cursor Follower ---
const cursorDot = document.getElementById("cursor-dot");
const cursorBlur = document.getElementById("cursor-blur");

window.addEventListener("mousemove", (e) => {
  cursorDot.style.left = `${e.clientX}px`;
  cursorDot.style.top = `${e.clientY}px`;
  cursorBlur.style.left = `${e.clientX}px`;
  cursorBlur.style.top = `${e.clientY}px`;
});

// --- 3. Dynamic Typewriter Effect ---
const roles = [
  "Full-Stack Web Developer",
  "Software Engineer",
  "UI/UX Specialist",
  "Problem Solver",
];
let rIndex = 0;
let cIndex = 0;
let isDeleting = false;
const typewriterEl = document.getElementById("typewriter");

function typeLoop() {
  const current = roles[rIndex];
  if (isDeleting) {
    typewriterEl.textContent = current.substring(0, cIndex - 1);
    cIndex--;
  } else {
    typewriterEl.textContent = current.substring(0, cIndex + 1);
    cIndex++;
  }

  let speed = isDeleting ? 40 : 90;

  if (!isDeleting && cIndex === current.length) {
    speed = 2000;
    isDeleting = true;
  } else if (isDeleting && cIndex === 0) {
    isDeleting = false;
    rIndex = (rIndex + 1) % roles.length;
    speed = 500;
  }

  setTimeout(typeLoop, speed);
}
document.addEventListener("DOMContentLoaded", typeLoop);

// --- 4. 3D Tilt Card Effect ---
const tiltCards = document.querySelectorAll(".tilt-card");
tiltCards.forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    card.style.transform = `perspective(1000px) rotateX(${-y / 20}deg) rotateY(${x / 20}deg)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg)`;
  });
});

// --- 5. Scroll Reveal & Skill Progress Bar Trigger ---
const revealNodes = document.querySelectorAll(".reveal-node");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");

        // Trigger skill bar animation inside this node
        const skillBars = entry.target.querySelectorAll(".skill-bar");
        skillBars.forEach((bar) => {
          bar.style.width = bar.getAttribute("data-width");
        });

        // Trigger stats counters
        const counters = entry.target.querySelectorAll(".counter");
        counters.forEach((counter) => {
          const target = +counter.getAttribute("data-target");
          let count = 0;
          const inc = target / 40;
          const updateCount = () => {
            count += inc;
            if (count < target) {
              counter.innerText = Math.ceil(count);
              setTimeout(updateCount, 30);
            } else {
              counter.innerText = target;
            }
          };
          updateCount();
        });
      }
    });
  },
  { threshold: 0.15 },
);

revealNodes.forEach((node) => observer.observe(node));

// --- 6. Mobile Menu Logic ---
const mobileBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

mobileBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
mobileNavLinks.forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// --- 7. Portfolio Projects Filter ---
const filterBtns = document.querySelectorAll(".project-filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => {
      b.classList.remove("bg-neonCyan", "text-black", "active-filter");
      b.classList.add("text-slate-300");
    });
    btn.classList.add("bg-neonCyan", "text-black", "active-filter");
    btn.classList.remove("text-slate-300");

    const filter = btn.getAttribute("data-filter");
    projectCards.forEach((card) => {
      if (filter === "all" || card.getAttribute("data-category") === filter) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  });
});

// --- 8. Project Detail Modal ---
function openModal(title, desc, tech, github, demo) {
  document.getElementById("modalTitle").textContent = title;
  document.getElementById("modalDesc").textContent = desc;
  document.getElementById("modalTech").textContent = tech;
  document.getElementById("modalGithub").href = github;
  document.getElementById("modalDemo").href = demo;
  document.getElementById("projectModal").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("projectModal").classList.add("hidden");
}

// --- 9. Toast Helper & Copy Clipboard ---
function showToast(message) {
  const toast = document.getElementById("toast");
  document.getElementById("toastMsg").textContent = message;
  toast.classList.remove("translate-y-20", "opacity-0");
  setTimeout(() => {
    toast.classList.add("translate-y-20", "opacity-0");
  }, 3500);
}

function copyInfo(text, msg) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
  showToast(msg);
}

// --- 10. Contact Form Submit ---
function submitForm(e) {
  e.preventDefault();
  showToast(
    "Message transmitted successfully! Jakariya will get back to you shortly.",
  );
  document.getElementById("contactForm").reset();
}
