/** Repeat the current visual task only while the scene's owner permits motion. */
export function createSceneAutoplay(scope, { play, stop, intervalMs = 7000 }) {
  let active = false;
  let disposed = false;
  let timer;
  let generation = 0;

  function cancel() {
    generation++;
    scope.clearTimeout(timer);
    timer = undefined;
  }

  function run() {
    if (!active || disposed || scope.disposed) return;
    const current = generation;
    play();
    // A play callback may pause, replay or dispose its owner synchronously.
    if (!active || disposed || scope.disposed || current !== generation) return;
    timer = scope.timeout(() => {
      timer = undefined;
      if (current === generation) run();
    }, intervalMs);
  }

  const controller = {
    setActive(value) {
      if (disposed || scope.disposed || active === Boolean(value)) return;
      active = Boolean(value);
      cancel();
      if (active) run();
      else stop();
    },
    replay() {
      if (!active || disposed || scope.disposed) return;
      cancel();
      run();
    },
  };

  scope.cleanup(() => {
    if (disposed) return;
    disposed = true;
    active = false;
    cancel();
    stop();
  });
  return controller;
}
