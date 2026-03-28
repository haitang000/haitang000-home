window.addEventListener('loading-finished', () => {
    // Only initialize VanillaTilt on non-touch devices (where hover is supported)
    if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
            max: 10,
            speed: 400,
            glare: true,
            "max-glare": 0.2,
            scale: 1.02
        });
    }
});