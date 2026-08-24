(function() {
    const homeSection = document.getElementById('home');
    if (!homeSection) return;

    const isMobile = window.innerWidth < 768;

    // Curated landscape photos. A random photo is assigned to each trail item
    // when the page loads, so the trail has a different mix on every visit.
    const landscapeImages = [
        'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=800&h=800&q=85',
        'https://images.unsplash.com/photo-1433086966358-54859d0ed716?auto=format&fit=crop&w=800&h=800&q=85'
    ];

    const getRandomLandscapeImage = () => {
        return landscapeImages[Math.floor(Math.random() * landscapeImages.length)];
    };

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
        img.src = getRandomLandscapeImage();
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
