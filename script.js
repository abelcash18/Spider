(() => {
  const spider = document.querySelector('.spider-cursor');
  if (!spider) return;

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let spiderX = mouseX;
  let spiderY = mouseY;

  // Customize this: lower = smoother/slower, higher = snappier/faster.
  const followSpeed = 0.16;

  window.addEventListener('mousemove', (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  function animateSpider() {
    spiderX += (mouseX - spiderX) * followSpeed;
    spiderY += (mouseY - spiderY) * followSpeed;

    spider.style.transform = `translate3d(${spiderX}px, ${spiderY}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(animateSpider);
  }

  animateSpider();
})();
