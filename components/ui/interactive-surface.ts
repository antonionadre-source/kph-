import type React from 'react';

/** Small pointer-only depth effect. Touch scrolling and reduced-motion stay native. */
export function tiltSurface(event: React.PointerEvent<HTMLElement>) {
  if (event.pointerType !== 'mouse' || !window.matchMedia('(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
  const element = event.currentTarget, box = element.getBoundingClientRect();
  if (!box.width || !box.height) return;
  element.style.setProperty('--tilt-x', `${-((event.clientY - box.top) / box.height - .5) * 5}deg`);
  element.style.setProperty('--tilt-y', `${((event.clientX - box.left) / box.width - .5) * 6}deg`);
}
export function resetSurface(event: React.PointerEvent<HTMLElement>) {
  event.currentTarget.style.removeProperty('--tilt-x');
  event.currentTarget.style.removeProperty('--tilt-y');
}
