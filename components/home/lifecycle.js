// Every homepage mount owns its listeners, observers, timers and fetches.
// This also makes React StrictMode and navigation away/back safe.
export function createHomeScope() {
  let disposed = false;
  const cleanups = [];
  const timers = new Set();
  const scope = {
    get disposed() { return disposed; },
    cleanup(fn) { cleanups.push(fn); },
    on(target, type, listener, options) {
      target.addEventListener(type, listener, options);
      cleanups.push(() => target.removeEventListener(type, listener, options));
    },
    timeout(callback, delay, ...args) {
      if (disposed) return undefined;
      const id = window.setTimeout(() => {
        timers.delete(id);
        if (!disposed) callback(...args);
      }, delay);
      timers.add(id);
      return id;
    },
    clearTimeout(id) {
      window.clearTimeout(id);
      timers.delete(id);
    },
    observer(callback, options) {
      const observer = new IntersectionObserver((...args) => {
        if (!disposed) callback(...args);
      }, options);
      cleanups.push(() => observer.disconnect());
      return observer;
    },
    abortController() {
      const controller = new AbortController();
      cleanups.push(() => controller.abort());
      return controller;
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      for (const timer of timers) window.clearTimeout(timer);
      timers.clear();
      for (const cleanup of cleanups.reverse()) cleanup();
    },
  };
  return scope;
}
