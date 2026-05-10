/**
 * Custom Cursor — dot + ring
 * Only activates on pointer-fine devices.
 */
(function () {
  "use strict";

  if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

  const dot = document.createElement("div");
  dot.id = "cursor-dot";
  const arrow = document.createElement("i");
  arrow.className = "fa-solid fa-arrow-right cursor-arrow";
  arrow.setAttribute("aria-hidden", "true");
  dot.appendChild(arrow);

  const ring = document.createElement("div");
  ring.id = "cursor-ring";

  document.body.appendChild(dot);
  document.body.appendChild(ring);

  if (typeof FontAwesome !== "undefined" && FontAwesome.dom && FontAwesome.dom.i2svg) {
    FontAwesome.dom.i2svg({ node: dot });
  }

  document.documentElement.classList.add("custom-cursor");

  let mouseX = -100;
  let mouseY = -100;
  let ringX = -100;
  let ringY = -100;
  let isVisible = false;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + "px";
    dot.style.top = mouseY + "px";

    if (!isVisible) {
      isVisible = true;
      dot.classList.remove("hidden");
      ring.classList.remove("hidden");
    }
  });

  document.addEventListener("mouseleave", () => {
    isVisible = false;
    dot.classList.add("hidden");
    ring.classList.add("hidden");
  });

  const INTERACTIVE = "a, button, [data-cursor-hover], input, textarea, select, [role='button']";
  let hovered = null;

  function isIgnored(el) {
    return el.closest("[data-cursor-ignore]") !== null;
  }

  document.addEventListener("mouseover", (e) => {
    const target = e.target.closest(INTERACTIVE);
    if (target && target !== hovered && !isIgnored(target)) {
      hovered = target;
      ring.classList.add("hover");
      dot.classList.add("hover");
    }
  });

  document.addEventListener("mouseout", (e) => {
    if (!hovered) return;
    const related = e.relatedTarget;
    if (!related || !related.closest(INTERACTIVE) || isIgnored(related)) {
      hovered = null;
      ring.classList.remove("hover");
      dot.classList.remove("hover");
    }
  });

  document.addEventListener("mousedown", (e) => {
    if (e.button === 0) ring.classList.add("clicking");
  });

  document.addEventListener("mouseup", () => {
    ring.classList.remove("clicking");
  });

  function animate() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = ringX + "px";
    ring.style.top = ringY + "px";
    requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      dot.classList.add("hidden");
      ring.classList.add("hidden");
    } else if (isVisible) {
      dot.classList.remove("hidden");
      ring.classList.remove("hidden");
    }
  });
})();
