import type { HomeService } from '../../src/home/calculator';

export type AboutTranslator = (source: string) => string;

export const aboutHelpServices: Record<HomeService, { title: string; description: string; button: string }> = {
  windows: { title: 'Klare Sicht. Ein gutes Gefühl.', description: 'Einzelne Fenster oder Ihre ganze Wohnung: Beschreiben Sie uns im Rechner, wo Sie klare Sicht wünschen.', button: 'Fensterreinigung planen' },
  end: { title: 'Bereit für die Wohnungsabgabe.', description: 'Teilen Sie uns mit, welche Wohnung Sie abgeben. Wir planen die Reinigung und besprechen den Umfang persönlich.', button: 'Umzugsreinigung planen' },
  regular: { title: 'Mehr Zeit für Ihren Alltag.', description: 'Ein gepflegtes Zuhause in Ihrem Rhythmus. Erzählen Sie uns von Ihrer Wohnung und der gewünschten Regelmässigkeit.', button: 'Regelmässige Reinigung planen' },
  deep: { title: 'Sorgfalt bis ins Detail.', description: 'Wenn Ihr Zuhause mehr Aufmerksamkeit braucht: Beschreiben Sie uns die Räume und Ihre besonderen Wünsche.', button: 'Grundreinigung planen' },
  moving: { title: 'Kleine Umzüge. Gut vorbereitet.', description: 'Ein paar Möbel oder eine kleine Wohnung? Planen Sie Abholort, Ziel und was mitkommen soll direkt im Rechner.', button: 'Kleinen Umzug planen' },
};

const isService = (key: unknown): key is HomeService => typeof key === 'string' && Object.hasOwn(aboutHelpServices, key);
const primaryClick = (event: MouseEvent) => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

/** Enhance the readable server HTML, with one lifecycle for every listener and observer. */
export function initAboutInteractions(root: HTMLElement, t: AboutTranslator): () => void {
  const cleanup: (() => void)[] = [];
  const frames = new Set<number>();
  const abort = new AbortController();
  let disposed = false;
  let updateKaiVisibility = () => {};
  const listen = (target: EventTarget, name: string, listener: EventListener) => {
    target.addEventListener(name, listener);
    cleanup.push(() => target.removeEventListener(name, listener));
  };
  const later = (callback: () => void) => {
    const id = requestAnimationFrame(() => {
      frames.delete(id);
      if (!disposed) callback();
    });
    frames.add(id);
  };
  const rememberAttribute = (element: Element, name: string) => {
    const previous = element.getAttribute(name);
    cleanup.push(() => previous === null ? element.removeAttribute(name) : element.setAttribute(name, previous));
  };

  const groups: { panels: HTMLElement[]; tabs: HTMLAnchorElement[]; activate: (index: number, focus?: boolean) => void }[] = [];
  let restoringSelection = false;
  root.querySelectorAll<HTMLElement>('[data-about-tabs]').forEach(group => {
    const tabs = [...group.querySelectorAll<HTMLAnchorElement>('[data-about-tab]')];
    const panels = tabs.map(tab => root.querySelector<HTMLElement>(tab.hash));
    if (!tabs.length || panels.some(panel => !panel)) return;
    const validPanels = panels as HTMLElement[];
    const list = tabs[0].parentElement!;
    const previouslyEnhanced = group.classList.contains('is-enhanced');
    group.classList.add('is-enhanced');
    cleanup.push(() => group.classList.toggle('is-enhanced', previouslyEnhanced));
    ['role', 'aria-orientation'].forEach(attribute => rememberAttribute(list, attribute));
    list.setAttribute('role', 'tablist');
    list.setAttribute('aria-orientation', 'horizontal');
    tabs.forEach((tab, index) => {
      ['role', 'aria-controls', 'aria-selected', 'tabindex'].forEach(attribute => rememberAttribute(tab, attribute));
      const panel = validPanels[index];
      ['role', 'aria-labelledby', 'tabindex', 'hidden'].forEach(attribute => rememberAttribute(panel, attribute));
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', panel.id);
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
    });
    const sharedKaiButton = group.querySelector<HTMLElement>('[data-kai-shared-cta]');
    if (sharedKaiButton) rememberAttribute(sharedKaiButton, 'hidden');
    function activate(index: number, focus = false) {
      if (index < 0 || index >= tabs.length) return;
      group.dataset.aboutSelected = validPanels[index].id;
      tabs.forEach((tab, item) => {
        const active = item === index;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        validPanels[item].hidden = !active;
      });
      if (sharedKaiButton) sharedKaiButton.hidden = validPanels[index].id === 'kai-help';
      if (focus) tabs[index].focus({ preventScroll: true });
      later(updateKaiVisibility);
    }
    listen(list, 'keydown', ((event: KeyboardEvent) => {
      if (!(event.target instanceof Element)) return;
      const tab = event.target.closest<HTMLAnchorElement>('[data-about-tab]');
      const index = tabs.indexOf(tab!);
      if (index < 0 || event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === ' ') {
        event.preventDefault();
        tab!.click();
        return;
      }
      let next: number;
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault();
      activate(next, true);
      // Arrow navigation keeps its no-scroll behaviour while exposing the current chapter URL.
      const url = new URL(window.location.href);
      url.hash = validPanels[next].id;
      window.history.replaceState(window.history.state, '', url);
    }) as EventListener);
    const requested = validPanels.findIndex(panel => '#' + panel.id === window.location.hash);
    const previous = validPanels.findIndex(panel => panel.id === group.dataset.aboutSelected);
    if (previous >= 0) restoringSelection = true;
    activate(previous >= 0 ? previous : requested >= 0 ? requested : 0);
    groups.push({ panels: validPanels, tabs, activate });
  });

  function revealFragment(hash: string, scroll = false) {
    groups.forEach(({ panels, activate }) => {
      const index = panels.findIndex(panel => '#' + panel.id === hash);
      if (index < 0) return;
      activate(index);
      if (scroll) later(() => panels[index].scrollIntoView({ block: 'start' }));
    });
  }
  const openHashTarget = () => revealFragment(window.location.hash, true);
  listen(window, 'hashchange', openHashTarget);
  listen(window, 'popstate', openHashTarget);
  // Enhanced tabs change content in place; normal chapter links still navigate.
  listen(root, 'click', ((event: MouseEvent) => {
    if (!primaryClick(event) || !(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || !root.contains(link)) return;
    const group = groups.find(item => item.tabs.includes(link));
    if (group) {
      event.preventDefault();
      group.activate(group.tabs.indexOf(link));
      if (window.location.hash !== link.hash) {
        const url = new URL(window.location.href);
        url.hash = link.hash;
        window.history.pushState(window.history.state, '', url);
      }
      return;
    }
    revealFragment(link.hash, window.location.hash === link.hash);
  }) as EventListener);
  // A language effect restart must not reopen or scroll to an older fragment.
  if (window.location.hash && !restoringSelection) openHashTarget();

  const helpPanel = root.querySelector<HTMLElement>('#kai-help');
  if (helpPanel) {
    const studio = helpPanel.querySelector<HTMLElement>('#kaiHelpVisual');
    const choices = [...helpPanel.querySelectorAll<HTMLAnchorElement>('[data-help-choice]')];
    const scenes = new Map([...helpPanel.querySelectorAll<HTMLElement>('[data-help-scene]')].map(scene => [scene.dataset.helpScene!, scene]));
    const title = helpPanel.querySelector<HTMLElement>('[data-help-title]');
    const description = helpPanel.querySelector<HTMLElement>('[data-help-description]');
    const calculator = helpPanel.querySelector<HTMLAnchorElement>('[data-help-calculator]');
    const status = helpPanel.querySelector<HTMLElement>('[data-help-status]');
    const loading = helpPanel.querySelector<HTMLElement>('[data-help-loading]');
    const fallback = helpPanel.querySelector<HTMLElement>('[data-help-image-fallback]');
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let selectedService: HomeService = isService(root.dataset.helpService) ? root.dataset.helpService : 'windows';
    let visibleService = 'windows';
    let requestNumber = 0;

    if (studio && title && description && calculator && status && loading && fallback) {
      function updateSelection(key: HomeService) {
        root.dataset.helpService = key;
        choices.forEach(choice => {
          const selected = choice.dataset.service === key;
          choice.classList.toggle('is-selected', selected);
          choice.setAttribute('aria-pressed', String(selected));
        });
        title!.textContent = t(aboutHelpServices[key].title);
        description!.textContent = t(aboutHelpServices[key].description);
        calculator!.textContent = t(aboutHelpServices[key].button);
        calculator!.dataset.service = key;
      }
      async function imageReady(image: HTMLImageElement) {
        image.loading = 'eager';
        if (image.complete && image.naturalWidth > 0) return true;
        if (typeof image.decode === 'function') {
          try { await image.decode(); return image.naturalWidth > 0; } catch { return false; }
        }
        return new Promise<boolean>(resolve => {
          const finish = (success: boolean) => {
            image.removeEventListener('load', onLoad);
            image.removeEventListener('error', onError);
            abort.signal.removeEventListener('abort', onAbort);
            resolve(success);
          };
          const onLoad = () => finish(true);
          const onError = () => finish(false);
          const onAbort = () => finish(false);
          image.addEventListener('load', onLoad, { once: true });
          image.addEventListener('error', onError, { once: true });
          abort.signal.addEventListener('abort', onAbort, { once: true });
          if (image.complete) finish(image.naturalWidth > 0);
        });
      }
      async function selectService(key: HomeService, notify = false) {
        selectedService = key;
        const currentRequest = ++requestNumber;
        updateSelection(key);
        status!.textContent = t(aboutHelpServices[key].title);
        if (notify) root.dispatchEvent(new CustomEvent('kraken:servicechange', { bubbles: true, detail: { service: key } }));
        const scene = scenes.get(key);
        const image = scene?.querySelector<HTMLImageElement>('img');
        if (!scene || !image) return;
        const needsLoading = !(image.complete && image.naturalWidth > 0);
        studio!.setAttribute('aria-busy', String(needsLoading));
        loading!.hidden = !needsLoading;
        const ready = await imageReady(image);
        if (disposed || currentRequest !== requestNumber) return;
        studio!.setAttribute('aria-busy', 'false');
        loading!.hidden = true;
        fallback!.hidden = ready;
        scenes.forEach(item => {
          item.hidden = !ready || item !== scene;
          item.classList.remove('is-entering');
        });
        if (ready) {
          if (visibleService !== key && !motionPreference.matches && !helpPanel!.hidden) scene.classList.add('is-entering');
          visibleService = key;
        } else {
          status!.textContent = t('Ihre Auswahl ist bereit. Das Bild konnte gerade nicht geladen werden.');
        }
      }
      choices.forEach(choice => {
        ['role', 'aria-controls', 'aria-pressed'].forEach(attribute => rememberAttribute(choice, attribute));
        choice.setAttribute('role', 'button');
        choice.setAttribute('aria-controls', 'kaiHelpVisual kaiHelpSelection');
      });
      listen(helpPanel, 'click', ((event: MouseEvent) => {
        if (!primaryClick(event) || !(event.target instanceof Element)) return;
        const choice = event.target.closest<HTMLAnchorElement>('[data-help-choice]');
        if (!choice || !helpPanel.contains(choice) || !isService(choice.dataset.service)) return;
        event.preventDefault();
        void selectService(choice.dataset.service, true);
      }) as EventListener);
      listen(helpPanel, 'keydown', ((event: KeyboardEvent) => {
        if (event.key !== ' ' || !(event.target instanceof Element)) return;
        const choice = event.target.closest<HTMLAnchorElement>('[data-help-choice]');
        if (!choice) return;
        event.preventDefault();
        choice.click();
      }) as EventListener);
      listen(window, 'kraken:servicechange', ((event: CustomEvent<{ service?: unknown }>) => {
        const key = event.detail?.service;
        if (isService(key) && key !== selectedService) void selectService(key);
      }) as EventListener);
      scenes.forEach(scene => {
        listen(scene, 'animationend', () => scene.classList.remove('is-entering'));
        const image = scene.querySelector<HTMLImageElement>('img');
        if (!image) return;
        listen(image, 'error', () => {
          if (scene.dataset.helpScene !== selectedService) return;
          scene.hidden = true;
          fallback.hidden = false;
          loading.hidden = true;
          studio.setAttribute('aria-busy', 'false');
          status.textContent = t('Ihre Auswahl ist bereit. Das Bild konnte gerade nicht geladen werden.');
        });
      });
      updateSelection(selectedService);
      // Validate the initial frame too: its cached failure may precede hydration listeners.
      void selectService(selectedService);
      updateKaiVisibility = () => {
        if (disposed) return;
        const bounds = helpPanel.getBoundingClientRect();
        const visible = !helpPanel.hidden && helpPanel.getClientRects().length > 0 && bounds.bottom > 0 && bounds.top < window.innerHeight;
        document.body.classList.toggle('kraken-about-help-in-view', visible);
      };
      cleanup.push(() => document.body.classList.remove('kraken-about-help-in-view'));
      if ('IntersectionObserver' in window) {
        const warmImages = new IntersectionObserver(entries => {
          if (disposed || !entries.some(entry => entry.isIntersecting)) return;
          void selectService(selectedService);
          scenes.forEach(scene => {
            const image = scene.querySelector<HTMLImageElement>('img');
            if (image) image.loading = 'eager';
          });
          warmImages.disconnect();
        });
        warmImages.observe(studio);
        const visibility = new IntersectionObserver(updateKaiVisibility, { threshold: 0 });
        visibility.observe(helpPanel);
        cleanup.push(() => { warmImages.disconnect(); visibility.disconnect(); });
      } else {
        listen(window, 'scroll', updateKaiVisibility);
        listen(window, 'resize', updateKaiVisibility);
      }
      updateKaiVisibility();
    }
  }

  const dialog = root.querySelector<HTMLDialogElement>('#comicDialog');
  const viewerImage = dialog?.querySelector<HTMLImageElement>('#comicDialogImage');
  const viewerTitle = dialog?.querySelector<HTMLElement>('#comicDialogTitle');
  const viewerCaption = dialog?.querySelector<HTMLElement>('#comicDialogCaption');
  const closeButton = dialog?.querySelector<HTMLButtonElement>('[data-comic-close]');
  if (dialog && typeof dialog.showModal === 'function' && viewerImage && viewerTitle && viewerCaption && closeButton) {
    let opener: HTMLAnchorElement | null = null;
    listen(root, 'click', ((event: MouseEvent) => {
      if (!primaryClick(event) || !(event.target instanceof Element)) return;
      const link = event.target.closest<HTMLAnchorElement>('[data-comic-open]');
      if (!link || !root.contains(link)) return;
      event.preventDefault();
      opener = link;
      viewerImage.src = link.href;
      viewerImage.alt = link.querySelector('img')?.alt || '';
      viewerTitle.textContent = link.dataset.comicTitle || 'The Legend of Kai';
      viewerCaption.textContent = link.dataset.comicCaption || '';
      if (!dialog.open) dialog.showModal();
      document.body.classList.add('kraken-about-viewer-open');
      closeButton.focus({ preventScroll: true });
    }) as EventListener);
    listen(closeButton, 'click', () => dialog.close());
    listen(dialog, 'click', ((event: MouseEvent) => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    }) as EventListener);
    listen(dialog, 'close', () => {
      document.body.classList.remove('kraken-about-viewer-open');
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    });
    cleanup.push(() => {
      if (dialog.open) dialog.close();
      document.body.classList.remove('kraken-about-viewer-open');
    });
  }

  return () => {
    disposed = true;
    abort.abort();
    frames.forEach(cancelAnimationFrame);
    frames.clear();
    cleanup.reverse().forEach(dispose => dispose());
  };
}
