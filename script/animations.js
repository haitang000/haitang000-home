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

    // Animate hero subtitle
    gsap.from(".hero-subtitle", {
        y: 20,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.8
    });
};

// Scroll Animations for Sections
const initScrollAnimations = () => {


    // About List Items (Staggered)
    gsap.from(".bento-item", {
        scrollTrigger: {
            trigger: ".bento-container",
            start: "top 85%",
            toggleActions: "play none none reverse"
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.1)"
    });

    // Blog Cards (Staggered)
    gsap.from(".blog-card", {
        scrollTrigger: {
            trigger: "#blog",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        y: 80,
        scale: 0.95,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power4.out"
    });
    
    // Function section (Like button)
    gsap.from(".func-item", {
        scrollTrigger: {
            trigger: "footer",
            start: "top 95%",
            toggleActions: "play none none reverse"
        },
        scale: 0.8,
        y: 20,
        opacity: 0,
        duration: 0.6,
        ease: "back.out(2)"
    });
};

// Initialize animations on load
document.addEventListener("DOMContentLoaded", () => {
    initHeroAnimations();
    initScrollAnimations();
});