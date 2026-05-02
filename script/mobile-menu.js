(function () {
  document.addEventListener('DOMContentLoaded', () => {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const navbar = document.querySelector('.navbar');
    
    if (menuBtn && navbar) {
      menuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navbar.classList.toggle('menu-open');
        const icon = menuBtn.querySelector('i');
        if (navbar.classList.contains('menu-open')) {
          icon.classList.remove('fa-bars');
          icon.classList.add('fa-times');
        } else {
          icon.classList.remove('fa-times');
          icon.classList.add('fa-bars');
        }
      });
      
      // Close menu when a link is clicked
      const links = navbar.querySelectorAll('.nav-links a');
      links.forEach(link => {
        link.addEventListener('click', () => {
          navbar.classList.remove('menu-open');
          const icon = menuBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        });
      });

      // Close menu when clicking outside
      document.addEventListener('click', (e) => {
        if (navbar.classList.contains('menu-open') && !navbar.contains(e.target)) {
          navbar.classList.remove('menu-open');
          const icon = menuBtn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
          }
        }
      });
    }
  });
})();
