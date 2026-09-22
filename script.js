/* ================== ЭЛЕМЕНТЫ ================== */

const openGiftBtn    = document.getElementById("openGift");
const pageTransition = document.getElementById("pageTransition");
const musicButton    = document.getElementById("musicButton");
const music          = document.getElementById("music");
const petalsWrap     = document.getElementById("petals");
const sparklesWrap   = document.getElementById("sparkles");

/* ================== ПЕРЕХОД МЕЖДУ СТРАНИЦАМИ ================== */

if (openGiftBtn) {
    openGiftBtn.addEventListener("click", (e) => {
        e.preventDefault();
        const href = openGiftBtn.getAttribute("href");

        // Запускаем музыку
        if (music && music.paused) {
            music.volume = 0.4;
            music.play().catch(() => {});
        }

        // Плавный переход
        pageTransition.classList.add("show");

        setTimeout(() => {
            window.location.href = href;
        }, 700);
    });
}

// На gift.html плавно убираем занавес при загрузке
window.addEventListener("load", () => {
    if (pageTransition && document.body.classList.contains("gift-page")) {
        setTimeout(() => {
            pageTransition.classList.add("show");
            requestAnimationFrame(() => {
                pageTransition.classList.remove("show");
            });
        }, 50);
    }
});

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

/* ================== REVEAL ПРИ ПРОКРУТКЕ ================== */

const revealElements = document.querySelectorAll(".reveal");

if (revealElements.length) {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add("visible");
                }, i * 120);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealElements.forEach(el => revealObserver.observe(el));
}

/* ================== ЛЕПЕСТКИ ================== */

const petalEmojis = ["🌸", "🌷", "❤️", "🤍", "💗", "🌺", "💕"];

function createPetal() {
    const petal = document.createElement("div");
    petal.classList.add("petal");
    petal.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    petal.style.left = Math.random() * 100 + "vw";
    petal.style.fontSize = (14 + Math.random() * 20) + "px";
    petal.style.animationDuration = (8 + Math.random() * 9) + "s";
    petal.style.animationDelay = Math.random() * 5 + "s";

    petalsWrap.appendChild(petal);
    setTimeout(() => petal.remove(), 22000);
}

if (petalsWrap) {
    setInterval(createPetal, 800);
    for (let i = 0; i < 20; i++) setTimeout(createPetal, i * 250);
}

/* ================== ИСКОРКИ ================== */

function createSparkle() {
    const s = document.createElement("div");
    s.classList.add("sparkle");
    s.style.left = Math.random() * 100 + "vw";
    s.style.top = Math.random() * 100 + "vh";
    s.style.animationDelay = Math.random() * 3 + "s";
    s.style.animationDuration = (2 + Math.random() * 2) + "s";

    sparklesWrap.appendChild(s);
    setTimeout(() => s.remove(), 6000);
}

if (sparklesWrap) {
    setInterval(createSparkle, 400);
    for (let i = 0; i < 15; i++) setTimeout(createSparkle, i * 200);
}

/* ================== ОТКРЫТИЕ КОНВЕРТА ================== */

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
    const AUTOPLAY_DELAY = 4500;

    // Точки
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

    const carouselEl = document.querySelector(".carousel");
    carouselEl.addEventListener("mouseenter", stopAutoplay);
    carouselEl.addEventListener("mouseleave", startAutoplay);

    // Свайпы
    let touchStartX = 0;
    carouselEl.addEventListener("touchstart", (e) => {
        touchStartX = e.touches[0].clientX;
        stopAutoplay();
    }, { passive: true });

    carouselEl.addEventListener("touchend", (e) => {
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
                    setTimeout(() => wish.classList.add("visible"), i * 500);
                });
                wishObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.25 });

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

    const colors = ["#d98c9c", "#f7b8c4", "#ffd6e0", "#c9798b", "#ffffff", "#ffd166", "#ffb3c6"];

    function makePiece() {
        return {
            x: Math.random() * canvas.width,
            y: -20,
            w: 6 + Math.random() * 8,
            h: 8 + Math.random() * 10,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: 2 + Math.random() * 4,
            speedX: -1.5 + Math.random() * 3,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: -0.15 + Math.random() * 0.3,
            shape: Math.random() > 0.5 ? "rect" : "circle"
        };
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        confetti.forEach((c, i) => {
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
        });

        if (confettiActive || confetti.length > 0) requestAnimationFrame(draw);
    }

    function startConfetti() {
        if (confettiActive) return;
        confettiActive = true;

        for (let i = 0; i < 180; i++) confetti.push(makePiece());
        draw();

        const interval = setInterval(() => {
            if (!confettiActive) { clearInterval(interval); return; }
            for (let i = 0; i < 40; i++) confetti.push(makePiece());
        }, 500);

        setTimeout(() => { confettiActive = false; clearInterval(interval); }, 10000);
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