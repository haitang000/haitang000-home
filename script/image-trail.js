const homeSection = document.getElementById('home');

// Array of random images to use for the trail
const images = [
    'https://picsum.photos/id/10/400/600',
    'https://picsum.photos/id/11/400/600',
    'https://picsum.photos/id/12/400/600',
    'https://picsum.photos/id/13/400/600',
    'https://picsum.photos/id/14/400/600',
    'https://picsum.photos/id/15/400/600',
    'https://picsum.photos/id/16/400/600',
    'https://picsum.photos/id/17/400/600',
    'https://picsum.photos/id/18/400/600',
    'https://picsum.photos/id/19/400/600',
];

let globalIndex = 0;
let last = { x: 0, y: 0 };
const threshold = 100; // Minimum distance to travel before showing next image

const activateImage = (image, x, y) => {
    image.style.left = `${x}px`;
    image.style.top = `${y}px`;
    image.style.zIndex = globalIndex;
    
    // Slight random rotation for dynamic feel
    const randomRotation = Math.random() * 20 - 10; // -10deg to 10deg
    
    // Add active class and rotation
    requestAnimationFrame(() => {
        image.classList.add('active');
        image.style.transform = `translate(-50%, -50%) scale(1) rotate(${randomRotation}deg)`;
    });

    // Remove active class after a delay
    setTimeout(() => {
        image.classList.remove('active');
        image.style.transform = `translate(-50%, -50%) scale(0.5) rotate(0deg)`;
    }, 1500); // 1.5 seconds trail time
}

const distanceFromLast = (x, y) => {
    return Math.hypot(x - last.x, y - last.y);
}

// Pre-create image elements to avoid DOM creation on mousemove
const imageElements = images.map(src => {
    const img = document.createElement('img');
    img.src = src;
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
