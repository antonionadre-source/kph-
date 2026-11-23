/**
 * Keep fixed controls above mobile keyboards and inside the visible viewport.
 * @param {HTMLElement} element
 * @param {EventTarget & { innerHeight: number, visualViewport?: (EventTarget & { height: number, offsetTop: number }) | null }} [source]
 */
export function bindVisualViewport(element, source = window) {
  const viewport = source.visualViewport;
  const properties = ['--kraken-viewport-height', '--kraken-viewport-top', '--kraken-viewport-bottom'];
  const previous = properties.map(name => element.style.getPropertyValue(name));
  let disposed = false;
  const update = () => {
    if (disposed) return;
    const layoutHeight = Number.isFinite(source.innerHeight) && source.innerHeight > 0 ? source.innerHeight : 1;
    const height = viewport && Number.isFinite(viewport.height) && viewport.height > 0 ? viewport.height : layoutHeight;
    const top = viewport && Number.isFinite(viewport.offsetTop) ? Math.max(0, viewport.offsetTop) : 0;
    const values = [height, top, Math.max(0, layoutHeight - height - top)];
    properties.forEach((name, index) => {
      const value = `${Math.round(values[index] * 100) / 100}px`;
      if (element.style.getPropertyValue(name) !== value) element.style.setProperty(name, value);
    });
  };
  source.addEventListener('resize', update, { passive: true });
  source.addEventListener('orientationchange', update, { passive: true });
  viewport?.addEventListener('resize', update, { passive: true });
  viewport?.addEventListener('scroll', update, { passive: true });
  update();
  return () => {
    disposed = true;
    source.removeEventListener('resize', update);
    source.removeEventListener('orientationchange', update);
    viewport?.removeEventListener('resize', update);
    viewport?.removeEventListener('scroll', update);
    properties.forEach((name, index) => {
      if (previous[index]) element.style.setProperty(name, previous[index]);
      else element.style.removeProperty(name);
    });
  };
}
