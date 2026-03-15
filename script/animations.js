// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

// Initialize animations on load
document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimations();
    initScrollAnimations();
});