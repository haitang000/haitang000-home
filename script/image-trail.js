(function() {
    const homeSection = document.getElementById('home');
    if (!homeSection || window.innerWidth < 768) return;

    // Array of random square images to use for the trail
    const images = Array.from({ length: 12 }, (_, i) => `https://www.xiayan.icu/image/${i + 1}.jpg`);

    let globalIndex = 0;
    let last = { x: 0, y: 0 };
    const threshold = 100; // Minimum distance to travel before showing next image

    const activateImage = (image, x, y) => {
        if (image.timeoutId) {
            clearTimeout(image.timeoutId);
        }

        const randomRotation = Math.random() * 20 - 10;

        image.style.transition = 'none';
        image.style.left = `${x}px`;
        image.style.top = `${y}px`;
        image.style.zIndex = globalIndex;
        image.classList.remove('active');
        image.style.transform = `translate(-50%, -50%) scale(0) rotate(${randomRotation}deg)`;

        void image.offsetWidth;

        image.style.transition = '';

        requestAnimationFrame(() => {
            image.classList.add('active');
            image.style.transform = `translate(-50%, -50%) scale(1) rotate(${randomRotation}deg)`;
        });

        image.timeoutId = setTimeout(() => {
            image.classList.remove('active');
            image.style.transform = `translate(-50%, -50%) scale(0) rotate(0deg)`;
        }, 1200);
    }

    const distanceFromLast = (x, y) => {
        return Math.hypot(x - last.x, y - last.y);
    }

    const poolSize = 40;
    const imageElements = Array.from({ length: poolSize }, (_, i) => {
        const img = document.createElement('img');
        img.src = images[i % images.length];
        img.classList.add('trail-image');
        homeSection.appendChild(img);
        return img;
    });

    homeSection.addEventListener('mousemove', e => {
        if (!document.body.classList.contains('is-loaded')) return;
        if (distanceFromLast(e.clientX, e.clientY) > threshold) {
            last.x = e.clientX;
            last.y = e.clientY;

            const rect = homeSection.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const currentImage = imageElements[globalIndex % imageElements.length];
            activateImage(currentImage, x, y);

            globalIndex++;
        }
    });
})();
