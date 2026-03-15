// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Initialize Lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true
});

// Sync ScrollTrigger with Lenis
lenis.on('scroll', ScrollTrigger.update);

gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);

// Smooth scroll to anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            lenis.scrollTo(target, {
                offset: 0,
                lerp: 0.1
            });
        }
    });
});

// Initial Hero Animations
const initHeroAnimations = () => {
    // Animate navbar
    gsap.from(".navbar", {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power4.out"
    });

    // Animate hero title lines (staggered reveal from bottom)
    gsap.from(".hero-title .title-line span", {
        yPercent: 100,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: "power4.out",
        delay: 0.2
    });

};

// Scroll Animations for Sections
const initScrollAnimations = () => {


    // About Section (Editorial Grid)
    gsap.from(".editorial-left, .editorial-right", {
        scrollTrigger: {
            trigger: ".editorial-grid",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out"
    });
};

// Initialize animations after loading finishes
window.addEventListener("loading-finished", () => {
    initHeroAnimations();
    initScrollAnimations();
});