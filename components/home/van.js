import { createHomeScope } from './lifecycle.js';
export function initTransit(homeRoot, t = source => source) {
    const scope = createHomeScope();
    const byId = id => homeRoot.querySelector('#' + id);
    'use strict';
    const section = byId('umzug');
    if (!section)
        return;
    const tabs = [...section.querySelectorAll('[role="tab"]')];
    const panels = tabs.map(tab => byId(tab.getAttribute('aria-controls')));
    const steps = [...section.querySelectorAll('[data-cargo-step]')];
    const frame = byId('cargoFrame');
    const incoming = byId('cargoIncoming');
    const visual = byId('cargoVisual');
    const measurementPanel = byId('cargoMeasurements');
    const status = byId('cargoStatus');
    const progress = byId('cargoProgress');
    const play = byId('cargoPlay');
    const playLabel = byId('cargoPlayLabel');
    const measures = byId('cargoMeasures');
    const autoplay = byId('vanAutoplay');
    const autoplayLabel = byId('vanAutoplayLabel');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const descriptions = [
        'Alles beginnt mit einem freien Laderaum.',
        'Zuerst die Kartons. Kompakt und gut zugänglich.',
        'Dazu zwei Stühle – sorgfältig eingeplant.',
        'Zum Schluss ein geschütztes, zerlegtes Möbelstück.'
    ];
    const imageDescriptions = [
        'leerem Laderaum', 'mehreren Kraken-Umzugskartons',
        'Kraken-Umzugskartons und zwei Stühlen',
        'Kraken-Umzugskartons, zwei Stühlen und geschützten Möbelteilen'
    ];
    let activeTab = 0;
    let stage = 0;
    let playing = false;
    let started = false;
    let userPaused = false;
    let inView = false;
    let timer = null;
    let transitionTimer = null;
    let playPointerIntent = null;
    function autoEnabled() {
        return !userPaused && !reducedMotion.matches;
    }
    function canAutoplay() {
        return autoEnabled() && inView && !document.hidden;
    }
    function updateAutoplay() {
        const enabled = autoEnabled();
        autoplay.classList.toggle('is-playing', enabled);
        autoplay.disabled = reducedMotion.matches;
        autoplayLabel.textContent = t(reducedMotion.matches
            ? 'Bewegung reduziert' : enabled ? 'Automatik pausieren' : 'Automatisch abspielen');
        autoplay.setAttribute('aria-label', t(reducedMotion.matches
            ? 'Automatik ist wegen reduzierter Bewegung deaktiviert'
            : enabled ? 'Automatische Transit-Ansichten pausieren' : 'Automatische Transit-Ansichten starten'));
        autoplay.title = t(reducedMotion.matches ? 'Bewegung reduziert' : enabled ? 'Pause' : 'Play');
        status.setAttribute('aria-live', enabled ? 'off' : 'polite');
        section.dataset.autoplay = enabled ? 'running' : 'paused';
    }
    function updatePlay() {
        play.classList.toggle('is-playing', playing);
        playLabel.textContent = t(reducedMotion.matches
            ? stage === 3 ? 'Leeren Laderaum ansehen' : 'Beladung komplett ansehen'
            : playing ? 'Pause' : stage === 3 ? 'Noch einmal' : started && stage > 0 ? 'Weiterladen' : 'Laden ansehen');
        play.setAttribute('aria-label', playing ? t('Ladeanimation pausieren') : playLabel.textContent);
    }
    function stop() {
        scope.clearTimeout(timer);
        timer = null;
        scope.clearTimeout(transitionTimer);
        transitionTimer = null;
        frame.dataset.frame = String(stage);
        incoming.classList.remove('is-visible');
        playing = false;
        updatePlay();
    }
    function pauseAutoplay() {
        userPaused = true;
        stop();
        updateAutoplay();
    }
    function queueAutoplay() {
        scope.clearTimeout(timer);
        timer = null;
        if (!canAutoplay())
            return;
        playing = activeTab === 1 && stage < 3;
        updatePlay();
        const delay = activeTab === 0 ? 6000 : stage === 3 ? 3600 : 1850;
        timer = scope.timeout(() => {
            timer = null;
            if (!canAutoplay()) {
                stop();
                return;
            }
            if (activeTab === 0) {
                activateTab(1);
                started = true;
                renderStage(0, false);
            }
            else if (stage < 3) {
                renderStage(stage + 1);
            }
            else {
                activateTab(0);
                renderStage(0, false);
            }
            queueAutoplay();
        }, delay);
    }
    function syncVisibility() {
        stop();
        queueAutoplay();
    }
    function renderStage(next, animate = true) {
        scope.clearTimeout(transitionTimer);
        incoming.classList.remove('is-visible');
        frame.dataset.frame = String(stage);
        stage = next;
        if (animate && !reducedMotion.matches && !document.hidden) {
            incoming.dataset.frame = String(stage);
            void incoming.offsetWidth;
            incoming.classList.add('is-visible');
            transitionTimer = scope.timeout(() => {
                frame.dataset.frame = String(stage);
                incoming.classList.remove('is-visible');
            }, 320);
        }
        else
            frame.dataset.frame = String(stage);
        steps.forEach((button, index) => button.setAttribute('aria-pressed', String(index === stage)));
        status.textContent = t(descriptions[stage]);
        progress.style.width = `${(stage + 1) * 25}%`;
        visual.setAttribute('aria-label', t('Illustrative Ansicht eines offenen Kraken Ford Transit mit {cargo}. Keine massstabsgetreue Kapazitätsangabe.', { cargo: t(imageDescriptions[stage]) }));
        updatePlay();
    }
    function setMeasures(show) {
        visual.hidden = show;
        measurementPanel.hidden = !show;
        measures.setAttribute('aria-pressed', String(show));
        measures.setAttribute('aria-expanded', String(show));
        measures.textContent = t(show ? 'Zur Ladeansicht' : 'Innenmasse ansehen');
        status.textContent = show
            ? t('Laderaum: 255,5 cm lang, maximal 177,5 cm breit und 140,6 cm hoch. Zwischen den Radkästen bleiben 139 cm.')
            : t(descriptions[stage]);
    }
    function nextStage() {
        if (!playing || activeTab !== 1 || document.hidden || !inView) {
            stop();
            return;
        }
        renderStage(stage + 1);
        if (stage === 3) {
            playing = false;
            timer = null;
            updatePlay();
        }
        else
            timer = scope.timeout(nextStage, 1850);
    }
    function start() {
        stop();
        setMeasures(false);
        if (reducedMotion.matches) {
            renderStage(stage === 3 ? 0 : 3, false);
            return;
        }
        started = true;
        if (stage === 3)
            renderStage(0);
        playing = true;
        updatePlay();
        timer = scope.timeout(nextStage, 1850);
    }
    function activateTab(index, focus = false) {
        stop();
        if (index === 0) setMeasures(false);
        activeTab = index;
        tabs.forEach((tab, current) => {
            tab.setAttribute('aria-selected', String(current === index));
            tab.tabIndex = current === index ? 0 : -1;
            panels[current].hidden = current !== index;
            panels[current].inert = current !== index;
        });
        if (focus)
            tabs[index].focus();
    }
    tabs.forEach((tab, index) => {
        scope.on(tab, 'click', () => { pauseAutoplay(); activateTab(index); });
        scope.on(tab, 'keydown', event => {
            let next;
            if (event.key === 'ArrowRight')
                next = (index + 1) % tabs.length;
            else if (event.key === 'ArrowLeft')
                next = (index + tabs.length - 1) % tabs.length;
            else if (event.key === 'Home')
                next = 0;
            else if (event.key === 'End')
                next = tabs.length - 1;
            else
                return;
            event.preventDefault();
            pauseAutoplay();
            activateTab(next, true);
        });
    });
    steps.forEach((button, index) => scope.on(button, 'click', () => {
        pauseAutoplay();
        setMeasures(false);
        renderStage(index);
    }));
    scope.on(play, 'pointerdown', () => { playPointerIntent = playing; });
    scope.on(play, 'pointercancel', () => { playPointerIntent = null; });
    scope.on(play, 'click', event => {
        const wasPlaying = event.detail > 0 ? playPointerIntent ?? playing : playing;
        playPointerIntent = null;
        pauseAutoplay();
        if (!wasPlaying)
            start();
    });
    scope.on(measures, 'click', () => {
        const show = measures.getAttribute('aria-pressed') !== 'true';
        pauseAutoplay();
        if (show)
            renderStage(0);
        setMeasures(show);
    });
    scope.on(autoplay, 'click', () => {
        if (reducedMotion.matches)
            return;
        if (autoEnabled())
            pauseAutoplay();
        else {
            userPaused = false;
            stop();
            setMeasures(false);
            updateAutoplay();
            queueAutoplay();
        }
    });
    // Keep a panel in place while a visitor uses its controls or keyboard focus.
    scope.on(section, 'focusin', event => {
        if (event.target !== autoplay)
            pauseAutoplay();
    });
    scope.on(section, 'pointerdown', event => {
        const control = event.target.closest('button, a, input, select, textarea');
        if (control && control !== autoplay)
            pauseAutoplay();
    });
    scope.on(document, 'visibilitychange', syncVisibility);
    scope.on(reducedMotion, 'change', () => {
        stop();
        renderStage(stage, false);
        updateAutoplay();
        queueAutoplay();
    });
    scope.on(homeRoot, 'kraken:languagechange', () => {
        renderStage(stage, false);
        setMeasures(!measurementPanel.hidden);
        updateAutoplay();
    });
    const observer = scope.observer(entries => {
        const visible = entries[0].isIntersecting && entries[0].intersectionRatio >= .1;
        if (visible === inView)
            return;
        inView = visible;
        syncVisibility();
    }, { threshold: [0, .1] });
    observer.observe(section.querySelector('.van-panels'));
    updateAutoplay();
    updatePlay();
    return () => scope.dispose();
}
