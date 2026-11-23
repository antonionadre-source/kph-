import { createHomeScope } from './lifecycle.js';
import { requestKaiOpen } from '../../src/kai/open.ts';

export function initApprovedHome(homeRoot, openCalculator, t = source => source) {
  const scope = createHomeScope();
  const $ = (selector, root = homeRoot) => root.querySelector(selector);
  const $$ = (selector, root = homeRoot) => [...root.querySelectorAll(selector)];
  const services = {
    windows: { name: 'Fensterreinigung', hint: 'Klare Sicht für Ihr Zuhause. Erzählen Sie uns von Ihren Fenstern.', hotspot: 'windows' },
    end: { name: 'Umzugsreinigung', hint: 'Ihre Wohnung wird abgegeben? Wir planen die Reinigung mit Ihnen.', hotspot: 'floor' },
    regular: { name: 'Regelmässige Reinigung', hint: 'Einfach mehr Zeit für Sie. Gemeinsam finden wir den passenden Rhythmus.', hotspot: 'floor' },
    deep: { name: 'Grundreinigung', hint: 'Wenn Ihr Zuhause etwas mehr Aufmerksamkeit braucht.', hotspot: 'floor' },
    moving: { name: 'Kleiner Umzug', hint: 'Möbel, Kartons, ein neuer Anfang. Planen wir Ihren kleinen Umzug.', hotspot: 'moving' }
  };
  let service = null;
  function chooseService(key, announce = true) {
    if (!services[key]) return;
    const changed = service !== key;
    service = key;
    $$('.service-option').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.service === key)));
    $('#serviceHint').textContent = t(services[key].hint);
    $$('.scene-hotspot').forEach(hotspot => {
      const active = hotspot.dataset.hotspot === services[key].hotspot;
      hotspot.classList.toggle('is-active', active);
      hotspot.classList.remove('just-selected');
      if (active && changed) { void hotspot.offsetWidth; hotspot.classList.add('just-selected'); }
    });
    homeRoot.dispatchEvent(new CustomEvent('kraken:servicechange', { detail: { service: key } }));
    if (announce) $('#globalStatus').textContent = t('{service} ausgewählt.', { service: t(services[key].name) });
  }
  $$('[data-service]').forEach(control => scope.on(control, 'click', () => chooseService(control.dataset.service)));
  $$('[data-calculator]').forEach(link => scope.on(link, 'click', event => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    openCalculator(link.dataset.service || service);
  }));
  $$('[data-open-kai]').forEach(button => scope.on(button, 'click', () => {
    requestKaiOpen(service, button);
  }));
  const menuToggle = $('#menuToggle');
  const mobileNav = $('#mobileNav');
  function closeMenu() {
    mobileNav.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', t('Menü öffnen'));
    $('use', menuToggle).setAttribute('href', '#i-menu');
  }
  scope.on(menuToggle, 'click', () => {
    const open = menuToggle.getAttribute('aria-expanded') !== 'true';
    mobileNav.hidden = !open;
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', t(open ? 'Menü schliessen' : 'Menü öffnen'));
    $('use', menuToggle).setAttribute('href', open ? '#i-close' : '#i-menu');
  });
  $$('a', mobileNav).forEach(link => scope.on(link, 'click', closeMenu));
  scope.on(document, 'keydown', event => {
    if (event.key === 'Escape' && !mobileNav.hidden) { closeMenu(); menuToggle.focus(); }
  });
  scope.on(matchMedia('(min-width: 1081px)'), 'change', event => { if (event.matches) closeMenu(); });
  function refreshLanguage() {
    $$('a[href^="/"]').forEach(link => {
      const url = new URL(link.getAttribute('href'), window.location.origin);
      url.searchParams.set('lang', homeRoot.lang || 'de-CH');
      link.setAttribute('href', url.pathname + url.search + url.hash);
    });
    menuToggle.setAttribute('aria-label', t(mobileNav.hidden ? 'Menü öffnen' : 'Menü schliessen'));
    if (service) chooseService(service, false);
    else $('#serviceHint').textContent = t('Was dürfen wir Ihnen abnehmen? Wählen Sie Ihren Service.');
  }
  scope.on(homeRoot, 'kraken:languagechange', refreshLanguage);
  refreshLanguage();
  return () => scope.dispose();
}
