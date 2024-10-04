document.querySelector('body').addEventListener('mousemove', (e) => {
    e.currentTarget.style.setProperty('--x', `${e.clientX}px`);
    e.currentTarget.style.setProperty('--y', `${e.clientY}px`);
  });
  
  function setLinksPositions() {
    document.querySelectorAll('a').forEach((a) => {
      const bounding = a.getBoundingClientRect();
      
      a.style.setProperty('--positionX', `${bounding.x}px`);
      a.style.setProperty('--positionY', `${bounding.y}px`);
    });
  }
  
  window.addEventListener('scroll', setLinksPositions); 
  window.addEventListener('load', setLinksPositions);
  window.addEventListener('resize', setLinksPositions);
  