import test from 'node:test';
import assert from 'node:assert/strict';
import { createHomeScope } from '../components/home/lifecycle.js';
import { createSceneAutoplay } from '../components/home/scene-autoplay.js';

function fixture(context, onPlay) {
  context.mock.timers.enable({ apis: ['setTimeout'] });
  const previousWindow = globalThis.window;
  globalThis.window = { setTimeout, clearTimeout };
  const scope = createHomeScope();
  let plays = 0;
  let stops = 0;
  const controller = createSceneAutoplay(scope, {
    play: () => { plays++; onPlay?.(controller, scope, plays); },
    stop: () => { stops++; },
  });
  context.after(() => { scope.dispose(); globalThis.window = previousWindow; });
  return { scope, controller, get plays() { return plays; }, get stops() { return stops; } };
}

test('an eligible scene starts without a click and repeats on the default cadence', context => {
  const state = fixture(context);
  state.controller.setActive(true);
  assert.equal(state.plays, 1);
  context.mock.timers.tick(6999);
  assert.equal(state.plays, 1);
  context.mock.timers.tick(1);
  assert.equal(state.plays, 2);
  context.mock.timers.tick(7000);
  assert.equal(state.plays, 3);
});

test('reconciling an already active scene does not restart it or add a second loop', context => {
  const state = fixture(context);
  state.controller.setActive(true);
  context.mock.timers.tick(2000);
  state.controller.setActive(true);
  state.controller.setActive(true);
  assert.equal(state.plays, 1);
  context.mock.timers.tick(5000);
  assert.equal(state.plays, 2);
  context.mock.timers.tick(7000);
  assert.equal(state.plays, 3);
});

test('replaying a selected task replaces the old deadline instead of duplicating it', context => {
  const state = fixture(context);
  state.controller.setActive(true);
  context.mock.timers.tick(2000);
  state.controller.replay();
  assert.equal(state.plays, 2);
  context.mock.timers.tick(5000);
  assert.equal(state.plays, 2);
  context.mock.timers.tick(2000);
  assert.equal(state.plays, 3);
});

test('pausing cancels future work; becoming eligible resumes immediately with one loop', context => {
  const state = fixture(context);
  state.controller.setActive(true);
  context.mock.timers.tick(2000);
  state.controller.setActive(false);
  assert.equal(state.stops, 1);
  context.mock.timers.tick(100000);
  assert.equal(state.plays, 1);
  state.controller.setActive(true);
  assert.equal(state.plays, 2);
  context.mock.timers.tick(7000);
  assert.equal(state.plays, 3);
});

test('replay cannot start a scene which is paused or has never become eligible', context => {
  const state = fixture(context);
  state.controller.replay();
  state.controller.setActive(false);
  context.mock.timers.tick(100000);
  assert.equal(state.plays, 0);
  state.controller.setActive(true);
  state.controller.setActive(false);
  state.controller.replay();
  context.mock.timers.tick(100000);
  assert.equal(state.plays, 1);
});

test('disposing the owning homepage stops the task and prevents later restarts', context => {
  const state = fixture(context);
  state.controller.setActive(true);
  state.scope.dispose();
  assert.equal(state.stops, 1);
  state.controller.setActive(true);
  state.controller.replay();
  state.scope.dispose();
  context.mock.timers.tick(100000);
  assert.equal(state.plays, 1);
  assert.equal(state.stops, 1);
});

test('a task which deactivates its scene while playing cannot reschedule itself', context => {
  const state = fixture(context, controller => controller.setActive(false));
  state.controller.setActive(true);
  assert.equal(state.stops, 1);
  context.mock.timers.tick(100000);
  assert.equal(state.plays, 1);
});

test('disposing during a repeated task cannot leave another timeout behind', context => {
  const state = fixture(context, (_controller, scope, plays) => { if (plays === 2) scope.dispose(); });
  state.controller.setActive(true);
  context.mock.timers.tick(7000);
  assert.equal(state.plays, 2);
  assert.equal(state.stops, 1);
  context.mock.timers.tick(100000);
  assert.equal(state.plays, 2);
});

test('a StrictMode-style replacement leaves only the new homepage animation active', context => {
  const state = fixture(context);
  state.controller.setActive(true);
  state.scope.dispose();
  const secondScope = createHomeScope();
  let secondPlays = 0;
  const second = createSceneAutoplay(secondScope, { play: () => secondPlays++, stop: () => {} });
  context.after(() => secondScope.dispose());
  second.setActive(true);
  context.mock.timers.tick(7000);
  assert.equal(state.plays, 1);
  assert.equal(secondPlays, 2);
  secondScope.dispose();
});
