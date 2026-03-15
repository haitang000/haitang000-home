window.addEventListener('loading-finished', () => {
    VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
        max: 10,
        speed: 400,
        glare: true,
        "max-glare": 0.2,
        scale: 1.02
    });
});