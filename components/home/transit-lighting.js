import { createHomeScope } from './lifecycle.js';

/** Follow the actual artwork and icon positions, including stacked phone layouts. */
export function initTransitLighting(section) {
  const scope = createHomeScope();
  const stage = section.querySelector('.moving-inner');
  const art = section.querySelector('.moving-art');
  const beams = section.querySelector('.transit-headlight-beams');
  const icons = [...section.querySelectorAll('.move-features .icon')];
  if (!stage || !art || !beams || icons.length !== 4) return () => scope.dispose();
  let frame = 0;
  function positionLights() {
    frame = 0;
    if (scope.disposed) return;
    const box = stage.getBoundingClientRect();
    const image = art.getBoundingClientRect();
    if (!box.width || !box.height || !image.width) return;
    beams.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
    icons.forEach((icon, index) => {
      const target = icon.getBoundingClientRect();
      // The rightmost 724px cell is rendered as a width-sized square,
      // vertically centred inside the existing rectangular atlas crop.
      const lampX = index === 0 ? 49 : 223;
      const origin = {
        x: image.left - box.left + image.width * lampX / 724,
        y: image.top - box.top + (image.height - image.width) / 2 + image.width * 364 / 724,
      };
      const end = { x: target.left - box.left + target.width / 2, y: target.top - box.top + target.height / 2 };
      const dx = end.x - origin.x, dy = end.y - origin.y;
      const length = Math.hypot(dx, dy) || 1;
      const spread = Math.min(22, target.width * .65);
      const normal = { x: -dy / length * spread, y: dx / length * spread };
      const cone = beams.querySelector(`[data-light-cone="${index}"]`);
      cone?.setAttribute('d', `M${origin.x} ${origin.y} L${end.x + normal.x} ${end.y + normal.y} Q${end.x + dx * .035} ${end.y + dy * .035} ${end.x - normal.x} ${end.y - normal.y} Z`);
      const gradient = beams.querySelector(`[data-light-gradient="${index}"]`);
      gradient?.setAttribute('x1', origin.x);
      gradient?.setAttribute('y1', origin.y);
      gradient?.setAttribute('x2', end.x);
      gradient?.setAttribute('y2', end.y);
    });
  }
  function schedule() {
    if (!frame && !scope.disposed) frame = requestAnimationFrame(positionLights);
  }
  const home = section.closest('.kraken-home');
  if (home) scope.on(home, 'kraken:languagechange', schedule);
  if (typeof ResizeObserver !== 'undefined') {
    const resize = new ResizeObserver(schedule);
    [stage, art, ...icons].forEach(element => resize.observe(element));
    const copy = section.querySelector('.moving-copy');
    if (copy) resize.observe(copy);
    scope.cleanup(() => resize.disconnect());
  } else scope.on(window, 'resize', schedule, { passive: true });
  scope.cleanup(() => cancelAnimationFrame(frame));
  document.fonts?.ready.then(schedule);
  schedule();
  return () => scope.dispose();
}
