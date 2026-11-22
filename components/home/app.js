import { createHomeScope } from './lifecycle.js';
const calculatorUrl = '/quote';
import { siteConfig } from './site-config.js';
export function initApprovedHome(homeRoot, openCalculator) {
    const scope = createHomeScope();
    const byId = id => homeRoot.querySelector('#' + id);
    'use strict';
    const services = {
        windows: { name: 'Fensterreinigung', hint: 'Klare Sicht für Ihr Zuhause. Erzählen Sie uns von Ihren Fenstern.', hotspot: 'windows' },
        end: { name: 'Umzugsreinigung', hint: 'Ihre Wohnung wird abgegeben? Wir planen die Reinigung mit Ihnen.', hotspot: 'floor' },
        regular: { name: 'Regelmässige Reinigung', hint: 'Einfach mehr Zeit für Sie. Gemeinsam finden wir den passenden Rhythmus.', hotspot: 'floor' },
        deep: { name: 'Grundreinigung', hint: 'Wenn Ihr Zuhause etwas mehr Aufmerksamkeit braucht.', hotspot: 'floor' },
        moving: { name: 'Kleiner Umzug', hint: 'Möbel, Kartons, ein neuer Anfang. Planen wir Ihren kleinen Umzug.', hotspot: 'moving' }
    };
    const state = { service: null };
    const $ = (selector, root = homeRoot) => root.querySelector(selector);
    const $$ = (selector, root = homeRoot) => [...root.querySelectorAll(selector)];
    const kaiDialog = $('#kaiDialog');
    let lastKaiOpener = null;
    let heroIsVisible = true;
    const instagram = $('[data-instagram]');
    if (instagram && siteConfig.instagramUrl) {
        instagram.href = siteConfig.instagramUrl;
        instagram.removeAttribute('aria-disabled');
        instagram.removeAttribute('tabindex');
        instagram.classList.remove('is-pending');
    }
    function announce(message) { $('#globalStatus').textContent = message; }
    function syncLauncher() { $('#kaiLauncher').hidden = heroIsVisible || kaiDialog.open; }
    function syncBodyLock() {
        document.body.classList.toggle('kraken-home-modal-open', kaiDialog.open);
        syncLauncher();
    }
    function chooseService(key, { announceChange = true } = {}) {
        if (!services[key])
            return;
        const changed = state.service !== key;
        state.service = key;
        $$('.service-option, .kai-service-options button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.service === key)));
        $('#serviceHint').textContent = services[key].hint;
        $('#kaiContext').textContent = services[key].hint;
        $('#kaiContext').classList.remove('is-error');
        $$('.scene-hotspot').forEach(hotspot => {
            const active = hotspot.dataset.hotspot === services[key].hotspot;
            hotspot.classList.toggle('is-active', active);
            hotspot.classList.remove('just-selected');
            if (active && changed) {
                void hotspot.offsetWidth;
                hotspot.classList.add('just-selected');
            }
        });
        homeRoot.dispatchEvent(new CustomEvent('kraken:servicechange', { detail: { service: key } }));
        if (announceChange)
            announce(`${services[key].name} ausgewählt.`);
    }
    $$('[data-service]').forEach(control => scope.on(control, 'click', () => chooseService(control.dataset.service)));
    $$('[data-calculator]').forEach(link => {
        link.href = calculatorUrl;
        scope.on(link, 'click', event => {
            // Modified clicks keep the native link behavior (new tab/window).
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey)
                return;
            event.preventDefault();
            openCalculator(link.dataset.service || state.service);
        });
    });
    $$('[data-open-kai]').forEach(button => scope.on(button, 'click', () => {
        lastKaiOpener = button;
        kaiDialog.returnValue = '';
        $('#kaiContext').classList.remove('is-error');
        $('#kaiContext').textContent = state.service ? services[state.service].hint : 'Welche Aufgabe dürfen wir Ihnen abnehmen?';
        kaiDialog.showModal();
        syncBodyLock();
    }));
    scope.on($('#closeKai'), 'click', () => kaiDialog.close('close'));
    scope.on(kaiDialog, 'close', () => {
        syncBodyLock();
        if (lastKaiOpener?.isConnected)
            (lastKaiOpener.hidden ? $('.button-kai') : lastKaiOpener).focus({ preventScroll: true });
    });
    const menuToggle = $('#menuToggle');
    const mobileNav = $('#mobileNav');
    function closeMenu() {
        mobileNav.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Menü öffnen');
        $('use', menuToggle).setAttribute('href', '#i-menu');
    }
    scope.on(menuToggle, 'click', () => {
        const open = menuToggle.getAttribute('aria-expanded') !== 'true';
        mobileNav.hidden = !open;
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Menü schliessen' : 'Menü öffnen');
        $('use', menuToggle).setAttribute('href', open ? '#i-close' : '#i-menu');
    });
    $$('a', mobileNav).forEach(link => scope.on(link, 'click', closeMenu));
    scope.on(document, 'keydown', event => {
        if (event.key === 'Escape' && !mobileNav.hidden) {
            closeMenu();
            menuToggle.focus();
        }
    });
    scope.on(matchMedia('(min-width: 1081px)'), 'change', event => { if (event.matches)
        closeMenu(); });
    $('#copyrightYear').textContent = new Date().getFullYear();
    scope.cleanup(() => { if (kaiDialog.open)
        kaiDialog.close(); document.body.classList.remove('kraken-home-modal-open'); });
    syncLauncher();
    if ('IntersectionObserver' in window) {
        const heroObserver = scope.observer(entries => {
            heroIsVisible = entries[0].isIntersecting;
            syncLauncher();
        }, { threshold: 0, rootMargin: '16px' });
        heroObserver.observe($('.hero'));
    }
    else {
        const updateHeroVisibility = () => {
            const bounds = $('.hero').getBoundingClientRect();
            heroIsVisible = bounds.bottom > -16 && bounds.top < innerHeight + 16;
            syncLauncher();
        };
        scope.on(window, 'scroll', updateHeroVisibility, { passive: true });
        scope.on(window, 'resize', updateHeroVisibility);
        updateHeroVisibility();
    }
    return () => scope.dispose();
}
