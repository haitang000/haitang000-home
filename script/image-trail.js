const homeSection = document.getElementById('home');

// Array of random square images to use for the trail
const images = Array.from({ length: 12 }, (_, i) => `https://www.xiayan.icu/image/${i + 1}.jpg`);

let globalIndex = 0;
let last = { x: 0, y: 0 };
const threshold = 100; // Minimum distance to travel before showing next image

const activateImage = (image, x, y) => {
    // Clear previous timeout to avoid premature hiding if recycled
    if (image.timeoutId) {
        clearTimeout(image.timeoutId);
    }

    const randomRotation = Math.random() * 20 - 10; // -10deg to 10deg

    // Temporarily remove transition to teleport and reset scale without animating
    image.style.transition = 'none';
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;
    image.style.zIndex = globalIndex;
    image.classList.remove('active');
    image.style.transform = `translate(-50%, -50%) scale(0) rotate(${randomRotation}deg)`;

    // Force reflow to apply the non-transitioned state
    void image.offsetWidth;

    // Restore CSS transition
    image.style.transition = '';

    // Add active class and animate scale/rotation
    requestAnimationFrame(() => {
        image.classList.add('active');
        image.style.transform = `translate(-50%, -50%) scale(1) rotate(${randomRotation}deg)`;
    });

    // Remove active class after a delay
    image.timeoutId = setTimeout(() => {
        image.classList.remove('active');
        image.style.transform = `translate(-50%, -50%) scale(0) rotate(0deg)`;
    }, 1200); // 1.2 seconds trail time
}

const distanceFromLast = (x, y) => {
    return Math.hypot(x - last.x, y - last.y);
}

// Pre-create a large pool of image elements (e.g., 40) recycling the loaded image URLs 
// so that fast mouse movements don't recycle an image element before it finishes its fade-out animation.
const poolSize = 40;
const imageElements = Array.from({ length: poolSize }, (_, i) => {
    const img = document.createElement('img');
    img.src = images[i % images.length];
    img.classList.add('trail-image');
    homeSection.appendChild(img);
    return img;
});

homeSection.addEventListener('mousemove', e => {
    // Only trigger if moved enough distance
    if (distanceFromLast(e.clientX, e.clientY) > threshold) {
        last.x = e.clientX;
        last.y = e.clientY;

        const rect = homeSection.getBoundingClientRect();
        // Calculate relative position within the section
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Use current index, then increment
        const currentImage = imageElements[globalIndex % imageElements.length];
        activateImage(currentImage, x, y);

        globalIndex++;
    }
});
