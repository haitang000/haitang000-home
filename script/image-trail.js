(function() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const isMobile = window.innerWidth < 768;

    // Array of random square images to use for the trail
    const images = Array.from({ length: 12 }, (_, i) => `https://www.xiayan.icu/image/${i + 1}.jpg`);

    let globalIndex = 0;
    let last = { x: 0, y: 0 };
    // Adjust threshold for mobile so it doesn't spawn too many images too fast
    const threshold = isMobile ? 80 : 100; 

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

    // Fewer images in pool for mobile to save performance
    const poolSize = isMobile ? 20 : 40;
    const imageElements = Array.from({ length: poolSize }, (_, i) => {
        const img = document.createElement('img');
        img.src = images[i % images.length];
        img.classList.add('trail-image');
        // Make images smaller on mobile
        if (isMobile) {
            img.style.width = '120px';
            img.style.height = '120px';
        }
        homeSection.appendChild(img);
        return img;
    });

    const handleMove = (clientX, clientY) => {
        if (!document.body.classList.contains('is-loaded')) return;
        if (distanceFromLast(clientX, clientY) > threshold) {
            last.x = clientX;
            last.y = clientY;

            const rect = homeSection.getBoundingClientRect();
            const x = clientX - rect.left;
            const y = clientY - rect.top;

            const currentImage = imageElements[globalIndex % imageElements.length];
            activateImage(currentImage, x, y);

            globalIndex++;
        }
    };

    homeSection.addEventListener('mousemove', e => {
        handleMove(e.clientX, e.clientY);
    });

    // Touch support for mobile devices
    homeSection.addEventListener('touchmove', e => {
        if (e.touches.length > 0) {
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        }
    }, { passive: true });
})();
