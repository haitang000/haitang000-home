document.addEventListener("DOMContentLoaded", () => {
    // 1. Material Design Ripple Effect
    const rippleElements = document.querySelectorAll('[data-ripple]');

    rippleElements.forEach(element => {
        element.addEventListener('click', function (e) {
            const rect = this.getBoundingClientRect();
            let x, y;

            // Handle keyboard vs mouse click
            if (e.clientX !== 0 && e.clientY !== 0) {
                x = e.clientX - rect.left;
                y = e.clientY - rect.top;
            } else {
                x = rect.width / 2;
                y = rect.height / 2;
            }

            const ripple = document.createElement('span');
            ripple.className = 'md-ripple';
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;

            this.appendChild(ripple);

            setTimeout(() => {
                ripple.remove();
            }, 600); // 600ms matches CSS animation
        });
    });

    // 2. Copy Email to Clipboard Feature
    const emailBtn = document.querySelector('.email-copy-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const icon = emailBtn.querySelector('.contact-icon');
            const originalIconClass = icon.className;
            const label = emailBtn.querySelector('.play-label');
            const originalLabelText = label.textContent;

            navigator.clipboard.writeText('haitang.36038@qq.com').then(() => {
                emailBtn.classList.add('copied');
                icon.className = 'fas fa-check contact-icon';
                label.textContent = '已复制！';

                setTimeout(() => {
                    emailBtn.classList.remove('copied');
                    icon.className = originalIconClass;
                    label.textContent = originalLabelText;
                }, 2000);
            });
        });
    }
});
