document.addEventListener("DOMContentLoaded", () => {
    // 1. Physics-based floating for geometric shapes
    const shapes = document.querySelectorAll('[data-geo]');

    shapes.forEach((shape, index) => {
        // Each shape gets its own animation parameters for organic feel
        const amplitude = 6 + Math.random() * 6;  // 6-12px float range
        const period = 3000 + Math.random() * 2000; // 3-5s per cycle
        const phase = Math.random() * Math.PI * 2;  // Random start phase

        let startTime = null;
        let mouseInfluenceX = 0;
        let mouseInfluenceY = 0;
        let currentMouseX = 0;
        let currentMouseY = 0;

        function animate(timestamp) {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;

            // Gentle sine wave floating
            const floatY = Math.sin((elapsed / period) * Math.PI * 2 + phase) * amplitude;
            const floatX = Math.cos((elapsed / (period * 1.3)) * Math.PI * 2 + phase) * (amplitude * 0.4);

            // Smooth lerp toward mouse influence
            mouseInfluenceX += (currentMouseX - mouseInfluenceX) * 0.03;
            mouseInfluenceY += (currentMouseY - mouseInfluenceY) * 0.03;

            shape.style.transform = `translate(${floatX + mouseInfluenceX}px, ${floatY + mouseInfluenceY}px)`;

            requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);

        // Subtle hover bounce
        shape.addEventListener('mouseenter', () => {
            currentMouseY = -12; // Gentle lift
        });

        shape.addEventListener('mouseleave', () => {
            currentMouseX = 0;
            currentMouseY = 0;
        });
    });

    // 2. Mouse parallax for whole geo-canvas
    const canvas = document.querySelector('.geo-canvas');
    if (canvas) {
        canvas.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const mouseX = e.clientX - rect.left - centerX;
            const mouseY = e.clientY - rect.top - centerY;

            shapes.forEach((shape, i) => {
                const depth = 0.02 + (i * 0.008); // Different depths for parallax
                shape.style.setProperty('--px', `${mouseX * depth}px`);
                shape.style.setProperty('--py', `${mouseY * depth}px`);
            });
        });
    }

    // 3. Copy Email to Clipboard
    const emailBtn = document.querySelector('.email-copy-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const originalText = emailBtn.textContent;

            navigator.clipboard.writeText('haitang.36038@qq.com').then(() => {
                emailBtn.classList.add('copied');
                emailBtn.textContent = '已复制！✓';

                setTimeout(() => {
                    emailBtn.classList.remove('copied');
                    emailBtn.textContent = originalText;
                }, 2000);
            });
        });
    }
});
