/* ================== ЭЛЕМЕНТЫ ================== */

document.body.classList.add("js-ready");

const openGiftBtn  = document.getElementById("openGift");
const musicButton  = document.getElementById("musicButton");
const music        = document.getElementById("music");
const petalsWrap   = document.getElementById("petals");

/* ================== ПЕРЕХОД ================== */

if (openGiftBtn) {
    openGiftBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const href = openGiftBtn.getAttribute("href");

        if (music && music.paused) {
            music.volume = 0.4;
            music.play().catch(() => {});
        }

        window.location.href = href;
    });
}

/* ================== МУЗЫКА ================== */

if (musicButton && music) {
    musicButton.addEventListener("click", () => {
        if (music.paused) {
            music.volume = 0.4;
            music.play().then(() => {
                musicButton.classList.add("playing");
                musicButton.textContent = "🎶";
            }).catch(() => {});
        } else {
            music.pause();
            musicButton.classList.remove("playing");
            musicButton.textContent = "🎵";
        }
    });
}

/* ================== REVEAL ================== */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));
}

/* ================== ПЕТАЛИ (мало, легко) ================== */

const petalEmojis = ["🌸", "🌷", "💗", "🤍", "💕"];

function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = (14 + Math.random() * 10) + "px";
    petal.style.animationDuration = (10 + Math.random() * 6) + "s";
    petal.style.animationDelay = Math.random() * 3 + "s";

    petalsWrap.appendChild(petal);
    setTimeout(() => petal.remove(), 20000);
}

if (petalsWrap) {
    // Только 8 лепестков — не перегружаем GPU
    for (let i = 0; i < 8; i++) {
        setTimeout(createPetal, i * 800);
    }
    setInterval(createPetal, 2500);
}

/* ================== КОНВЕРТ ================== */

const envelope = document.getElementById("envelope");
if (envelope) {
    envelope.addEventListener("click", () => {
        envelope.classList.toggle("open");
    });
}

/* ================== КАРУСЕЛЬ ================== */

const track    = document.getElementById("carouselTrack");
const prevBtn  = document.getElementById("prevBtn");
const nextBtn  = document.getElementById("nextBtn");
const dotsWrap = document.getElementById("carouselDots");

if (track && prevBtn && nextBtn && dotsWrap) {
    const slides = track.querySelectorAll(".slide");
    let currentIndex = 0;
    let autoplayTimer = null;
    const AUTOPLAY_DELAY = 5000;

    slides.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => goToSlide(i));
        dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll(".dot");

    function update() {
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((d, i) => d.classList.toggle("active", i === currentIndex));
    }

    function goToSlide(i) {
        currentIndex = (i + slides.length) % slides.length;
        update();
        restartAutoplay();
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    function startAutoplay() { autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY); }
    function stopAutoplay() { clearInterval(autoplayTimer); }
    function restartAutoplay() { stopAutoplay(); startAutoplay(); }

    startAutoplay();

    let touchStartX = 0;
    track.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    }, { passive: true });

    track.addEventListener("touchend", (e) => {
        const delta = e.changedTouches[0].clientX - touchStartX;
        if (Math.abs(delta) > 50) {
            delta > 0 ? prevSlide() : nextSlide();
        } else {
            startAutoplay();
        }
    });
}

/* ================== ПОЖЕЛАНИЯ ================== */

const wishes = document.querySelectorAll(".wish");

if (wishes.length) {
    const wishObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                wishes.forEach((wish, i) => {
                    setTimeout(() => wish.classList.add("visible"), i * 400);
                });
                wishObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    wishObserver.observe(wishes[0]);
}

/* ================== КОНФЕТТИ ================== */

const finalSection = document.querySelector(".final");

if (finalSection) {
    const canvas = document.createElement("canvas");
    canvas.classList.add("confetti-canvas");
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");

    let confetti = [];
    let confettiActive = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const colors = ["#d98c9c", "#f7b8c4", "#ffd6e0", "#c9798b", "#ffffff", "#ffd166"];

    function makePiece() {
        return {
            x: Math.random() * canvas.width,
            y: -20,
            w: 6 + Math.random() * 8,
            h: 8 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 2 + Math.random() * 3,
            speedX: -1.5 + Math.random() * 3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: -0.12 + Math.random() * 0.24,
            shape: Math.random() > 0.5 ? "rect" : "circle"
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = confetti.length - 1; i >= 0; i--) {
            const c = confetti[i];
            ctx.save();
            ctx.translate(c.x, c.y);
            ctx.rotate(c.rotation);
            ctx.fillStyle = c.color;

            if (c.shape === "circle") {
                ctx.beginPath();
                ctx.arc(0, 0, c.w / 2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            }
            ctx.restore();

            c.y += c.speedY;
            c.x += c.speedX;
            c.rotation += c.rotationSpeed;

            if (c.y > canvas.height + 30) confetti.splice(i, 1);
        }

        if (confettiActive || confetti.length > 0) requestAnimationFrame(draw);
    }

    function startConfetti() {
        if (confettiActive) return;
        confettiActive = true;

        for (let i = 0; i < 100; i++) confetti.push(makePiece());
        draw();

        const interval = setInterval(() => {
            if (!confettiActive) { clearInterval(interval); return; }
            for (let i = 0; i < 20; i++) confetti.push(makePiece());
        }, 600);

        setTimeout(() => { confettiActive = false; clearInterval(interval); }, 8000);
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startConfetti();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.4 });

    observer.observe(finalSection);
}