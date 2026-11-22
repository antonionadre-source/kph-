import { createHomeScope } from './lifecycle.js';
import { resolveKaiState } from './scene-state.js';
export function initApartmentScene(homeRoot) {
    const scope = createHomeScope();
    const byId = id => homeRoot.querySelector('#' + id);
    'use strict';
    const canvas = byId('sceneCanvas');
    const dialog = byId('sceneDialog');
    if (!canvas || !dialog)
        return;
    const $ = selector => homeRoot.querySelector(selector);
    const openButton = $('#sceneOpen');
    const kai = $('#sceneKai');
    const room = $('#sceneRoom');
    const landscape = $('#sceneLandscape');
    const controls = [...dialog.querySelectorAll('[data-scene-control]')];
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    const overrides = { season: 'auto', celebration: 'auto', phase: 'auto', weather: 'auto', clothing: 'auto', motion: 'auto' };
    const seasonNames = { spring: 'Frühling', summer: 'Sommer', autumn: 'Herbst', winter: 'Winter' };
    const weatherNames = { sun: 'Sonne', cloudy: 'Wolken', rain: 'Regen', snow: 'Schnee', sleet: 'Schneeregen', fog: 'Nebel', unknown: 'Wetter nicht verfügbar' };
    const phaseNames = { dawn: 'Morgen', day: 'Tag', evening: 'Abend', night: 'Nacht' };
    const holidayNames = { none: 'ohne Fest', christmas: 'Weihnachten', newyear: 'Neujahr' };
    const dateFormatter = new Intl.DateTimeFormat('de-CH', {
        timeZone: 'Europe/Zurich', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    const timeFormatter = new Intl.DateTimeFormat('de-CH', {
        timeZone: 'Europe/Zurich', hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
    });
    let weatherData = null;
    let weatherLoading = true;
    let weatherRequest = null;
    let nextFetchAt = 0;
    let weatherTimer = null;
    let clockTimer = null;
    let taskStartTimer = null;
    let taskEndTimer = null;
    let lastOpener = null;
    let selectedService = 'moving';
    function zurichParts(date) {
        return Object.fromEntries(dateFormatter.formatToParts(date)
            .filter(part => part.type !== 'literal')
            .map(part => [part.type, Number(part.value)]));
    }
    function seasonFor(month) {
        return month >= 3 && month <= 5 ? 'spring'
            : month >= 6 && month <= 8 ? 'summer'
                : month >= 9 && month <= 11 ? 'autumn' : 'winter';
    }
    function celebrationFor({ month, day }) {
        if (month === 12 && day >= 1 && day <= 26)
            return 'christmas';
        if ((month === 12 && day >= 27) || (month === 1 && day <= 6))
            return 'newyear';
        return 'none';
    }
    function phaseFor({ hour, minute }, season) {
        // Seasonal lighting bands, not an assertion of exact astronomical sunrise.
        const [morning, evening] = { spring: [7, 20], summer: [6, 21], autumn: [7, 18], winter: [8, 17] }[season];
        const time = hour + minute / 60;
        if (time < morning - .75 || time >= evening + .5)
            return 'night';
        if (time < morning + .5)
            return 'dawn';
        if (time >= evening - 1)
            return 'evening';
        return 'day';
    }
    function currentObservation(now) {
        if (!weatherData || weatherData.available === false || !Array.isArray(weatherData.timeseries))
            return null;
        const validUntil = Date.parse(weatherData.validUntil);
        if (!Number.isFinite(validUntil) || now.getTime() > validUntil)
            return null;
        const reports = weatherData.timeseries.filter(report => {
            const reportedAt = Date.parse(report.time);
            return Number.isFinite(reportedAt) && reportedAt <= now.getTime() + 60000;
        }).sort((a, b) => Date.parse(b.time) - Date.parse(a.time));
        const observation = reports[0];
        if (!observation || now.getTime() - Date.parse(observation.time) > 90 * 60000)
            return null;
        return observation;
    }
    function conditionFor(observation) {
        if (!observation)
            return 'unknown';
        const symbol = String(observation.symbolCode || '').toLowerCase();
        if (symbol.includes('sleet'))
            return 'sleet';
        if (symbol.includes('snow'))
            return 'snow';
        if (symbol.includes('rain'))
            return 'rain';
        if (symbol.includes('fog'))
            return 'fog';
        if (symbol === 'clearsky' || symbol === 'fair')
            return 'sun';
        if (symbol.includes('cloudy'))
            return 'cloudy';
        return 'unknown';
    }
    function updateScene() {
        const now = new Date();
        const parts = zurichParts(now);
        const automaticSeason = seasonFor(parts.month);
        const season = overrides.season === 'auto' ? automaticSeason : overrides.season;
        const celebration = overrides.celebration === 'auto' ? celebrationFor(parts) : overrides.celebration;
        const phase = overrides.phase === 'auto' ? phaseFor(parts, automaticSeason) : overrides.phase;
        const observation = currentObservation(now);
        const observedWeather = conditionFor(observation);
        const weather = overrides.weather === 'auto' ? observedWeather : overrides.weather;
        const kaiState = resolveKaiState({ phase, temperatureC: observation?.temperatureC, clothing: overrides.clothing, service: selectedService });
        const preview = Object.values(overrides).some(value => value !== 'auto');
        Object.assign(canvas.dataset, { season, celebration, phase, weather, clothing: kaiState.clothing, lights: kaiState.lightsOn ? 'on' : 'off' });
        canvas.classList.toggle('is-paused', document.hidden || overrides.motion === 'still');
        const roomSource = kaiState.lightsOn ? '/home-approved/assets/hero-room-day-v4.webp' : '/home-approved/assets/hero-room-night-v4.webp';
        if (room.getAttribute('src') !== roomSource)
            room.src = roomSource;
        if (kai.dataset.task !== kaiState.task) {
            stopTask();
            kai.dataset.task = kaiState.task;
        }
        const positions = { spring: [0, 0], summer: [-627, 0], autumn: [0, -627], winter: [-627, -627] };
        landscape.setAttribute('x', positions[season][0]);
        landscape.setAttribute('y', positions[season][1]);
        const clock = timeFormatter.format(now);
        const temperature = observation && Number.isFinite(observation.temperatureC)
            ? `${Math.round(observation.temperatureC)} °C` : null;
        $('#sceneCityTime').textContent = `Zürich · ${clock}${temperature && overrides.weather === 'auto' ? ` · ${temperature}` : ''}`;
        $('#sceneShortStatus').textContent = preview ? 'Vorschau · Szene entdecken' : 'Szene entdecken';
        openButton.classList.toggle('is-preview', preview);
        openButton.setAttribute('aria-label', `${preview ? 'Vorschau. ' : ''}Zürich, ${clock}${temperature ? `, ${temperature}` : ''}. Jahreszeit, Stimmung und Wetterbild entdecken.`);
        $('#sceneMode').textContent = preview ? 'Vorschau – Ihre Szene' : 'Automatisch · passend zu Zürich';
        $('#scenePreviewExplanation').textContent = preview
            ? `${seasonNames[season]} · ${holidayNames[celebration]} · ${phaseNames[phase]} · ${weatherNames[weather]}. Ihre Auswahl verändert nur die Illustration.`
            : 'Dieses Zuhause folgt den Jahreszeiten, Festtagen und der Ortszeit. Kai zieht sich passend zur Temperatur an. Entdecken Sie die verschiedenen Stimmungen.';
        $('#sceneKaiNote').textContent = phase === 'night'
            ? 'Lichter aus, Kai ruht mit seiner Decke. Ihre Anfrage können Sie jederzeit vorbereiten. Bei Tag nimmt Kai die ausgewählte Aufgabe wieder auf.'
            : kaiState.clothing === 'warm'
                ? `Kai trägt Jacke, Mütze und Handschuhe.${overrides.clothing === 'auto' ? ' Die warme Kleidung erscheint bei gemeldeten Temperaturen unter 8 °C.' : ' Sie sehen die ausgewählte Kleidungsvariante.'} Wählen Sie im Zuhause eine Aufgabe aus.`
                : 'Kai trägt sein leichtes Kraken-Polo. Wählen Sie Fenster, Böden oder Umzug aus und sehen Sie ihm bei der Arbeit zu.';
        const weatherStatus = $('#sceneWeatherStatus');
        const delayed = observation && (weatherData.stale === true || now.getTime() - Date.parse(observation.time) > 45 * 60000);
        if (observation) {
            weatherStatus.textContent = `Wetter: Zürich-Flughafen · ${weatherNames[observedWeather]}${temperature ? `, ${temperature}` : ''} · Stand ${timeFormatter.format(new Date(observation.time))}`;
        }
        else {
            weatherStatus.textContent = weatherLoading ? 'Wetter: Zürich-Flughafen · wird geladen …' : 'Wetter: Zürich-Flughafen · zurzeit nicht verfügbar';
        }
        $('#sceneWeatherDelayed').hidden = !delayed;
        $('#sceneWeatherExplanation').textContent = observation
            ? 'Die Szene illustriert die gemeldeten Wetterbedingungen. Die Station am Flughafen dient als regionale Orientierung.'
            : 'Bis aktuelle Wetterdaten verfügbar sind, bleibt das Wetterbild neutral. Jahreszeit und Ortszeit passen sich weiterhin automatisch an.';
        canvas.setAttribute('aria-label', `Eine gemütliche Wohnung im ${seasonNames[season]}, ${phaseNames[phase]}.${phase === 'night' ? ' Die Lampen sind ausgeschaltet. Kai ruht unter einer Decke.' : ` Kai ${kaiState.task === 'windows' ? 'reinigt das Fenster' : kaiState.task === 'mop' ? 'wischt den Boden' : 'trägt einen Umzugskarton'}${kaiState.clothing === 'warm' ? ' in warmer Arbeitskleidung' : ' im Kraken-Polo'}.`}${celebration !== 'none' ? ` Dekoration zu ${holidayNames[celebration]}.` : ''}${weather !== 'unknown' ? ` Vor dem Fenster: ${weatherNames[weather]}.` : ''}${preview ? ' Illustrative Vorschau.' : ''}`);
        updateWeatherIcon(weather, phase);
    }
    function updateWeatherIcon(weather, phase) {
        const paths = {
            sun: phase === 'night' ? '<path d="M18 14.5A7 7 0 0 1 9.5 6 7 7 0 1 0 18 14.5Z"/>' : '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5"/>',
            cloudy: '<path d="M6 17a4 4 0 0 1-.5-8 6 6 0 0 1 11.4-1.1A4.5 4.5 0 1 1 18 17Z"/>',
            rain: '<path d="M6 14a3.5 3.5 0 0 1-.5-7 5.5 5.5 0 0 1 10.3-1A4 4 0 1 1 17 14H6Zm1 3-1 3m6-3-1 3m6-3-1 3"/>',
            snow: '<path d="M12 3v18M4.2 7.5l15.6 9M4.2 16.5l15.6-9M9 5l3 3 3-3M9 19l3-3 3 3M4.5 11l4-1-1-4M16.5 18l-1-4 4-1M7.5 18l1-4-4-1M19.5 11l-4-1 1-4"/>',
            fog: '<path d="M5 8h14M3 12h18M5 16h14M8 20h8"/>',
            unknown: '<circle cx="12" cy="12" r="8"/><path d="M12 7v5l3 2"/>'
        };
        $('#sceneWeatherIcon').innerHTML = paths[weather === 'sleet' ? 'snow' : weather] || paths.unknown;
    }
    function scheduleWeather() {
        scope.clearTimeout(weatherTimer);
        if (document.hidden)
            return;
        weatherTimer = scope.timeout(fetchWeather, Math.max(1000, nextFetchAt - Date.now()));
    }
    async function fetchWeather() {
        if (scope.disposed || document.hidden || weatherRequest)
            return;
        if (Date.now() < nextFetchAt) {
            scheduleWeather();
            return;
        }
        const abort = scope.abortController();
        const timeout = scope.timeout(() => abort.abort(), 8000);
        weatherRequest = abort;
        try {
            const response = await fetch('/api/weather/zurich', { signal: abort.signal, headers: { Accept: 'application/json' } });
            if (!response.ok)
                throw new Error('Weather unavailable');
            const payload = await response.json();
            if (payload.available === false || !Array.isArray(payload.timeseries))
                throw new Error('Weather unavailable');
            weatherData = payload;
            const serverRefreshAt = Date.parse(payload.nextRefreshAt);
            nextFetchAt = Number.isFinite(serverRefreshAt) && serverRefreshAt > Date.now()
                ? Math.min(serverRefreshAt, Date.now() + 20 * 60000)
                : Date.now() + 20 * 60000;
        }
        catch (_) {
            // Keep an existing report only until its explicit validity limit.
            nextFetchAt = Date.now() + 5 * 60000 + Math.random() * 30000;
        }
        finally {
            scope.clearTimeout(timeout);
            weatherLoading = false;
            weatherRequest = null;
            if (!scope.disposed) {
                updateScene();
                scheduleWeather();
            }
        }
    }
    function tickClock() {
        scope.clearTimeout(clockTimer);
        updateScene();
        if (!document.hidden)
            clockTimer = scope.timeout(tickClock, 60000 - Date.now() % 60000 + 50);
    }
    function stopTask() {
        scope.clearTimeout(taskStartTimer);
        scope.clearTimeout(taskEndTimer);
        kai.classList.remove('is-working', 'is-changing', 'is-settled');
        canvas.classList.remove('is-window-cleaning');
    }
    function showTask(service) {
        const task = service === 'windows' ? 'windows' : service === 'moving' ? 'moving' : ['end', 'regular', 'deep'].includes(service) ? 'mop' : null;
        if (!task)
            return;
        selectedService = service;
        const changed = kai.dataset.task !== task;
        updateScene();
        if (canvas.dataset.phase === 'night')
            return;
        stopTask();
        if (reducedMotion.matches || document.hidden || overrides.motion === 'still') {
            kai.dataset.task = task;
            return;
        }
        if (changed)
            kai.classList.add('is-changing');
        taskStartTimer = scope.timeout(() => {
            kai.dataset.task = task;
            kai.classList.remove('is-changing');
            void kai.offsetWidth;
            kai.classList.add('is-working');
            canvas.classList.toggle('is-window-cleaning', task === 'windows');
            taskEndTimer = scope.timeout(() => {
                kai.classList.remove('is-working');
                kai.classList.toggle('is-settled', task === 'moving');
                canvas.classList.remove('is-window-cleaning');
            }, 2750);
        }, changed ? 140 : 0);
    }
    function createPrecipitation() {
        const namespace = 'http://www.w3.org/2000/svg';
        for (let index = 0; index < 24; index++) {
            const x = 555 + (index * 83) % 350;
            const y = 170 + (index * 71) % 300;
            const rain = document.createElementNS(namespace, 'line');
            for (const [key, value] of Object.entries({ x1: x, y1: y, x2: x - 4, y2: y + 23 }))
                rain.setAttribute(key, value);
            rain.style.setProperty('--fall-time', `${.95 + (index % 5) * .13}s`);
            rain.style.setProperty('--fall-delay', `${-(index * .21)}s`);
            $('#sceneRain').append(rain);
            const snow = document.createElementNS(namespace, 'circle');
            snow.setAttribute('cx', x);
            snow.setAttribute('cy', y);
            snow.setAttribute('r', 1.5 + (index % 4) * .6);
            snow.style.setProperty('--fall-time', `${4.3 + (index % 5) * .6}s`);
            snow.style.setProperty('--fall-delay', `${-(index * .61)}s`);
            $('#sceneSnow').append(snow);
        }
    }
    scope.on(openButton, 'click', () => {
        lastOpener = document.activeElement;
        dialog.showModal();
        document.body.classList.add('kraken-home-scene-dialog-open');
    });
    dialog.querySelectorAll('[data-scene-close]').forEach(button => scope.on(button, 'click', () => dialog.close()));
    scope.on(dialog, 'click', event => {
        if (event.target !== dialog)
            return;
        const rect = dialog.getBoundingClientRect();
        if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
            dialog.close();
    });
    scope.on(dialog, 'close', () => {
        document.body.classList.remove('kraken-home-scene-dialog-open');
        if (lastOpener && lastOpener.isConnected)
            lastOpener.focus({ preventScroll: true });
    });
    controls.forEach(control => scope.on(control, 'change', () => {
        overrides[control.dataset.sceneControl] = control.value;
        if (control.dataset.sceneControl === 'motion' && control.value === 'still')
            stopTask();
        updateScene();
    }));
    scope.on($('#sceneReset'), 'click', () => {
        controls.forEach(control => { control.value = 'auto'; overrides[control.dataset.sceneControl] = 'auto'; });
        updateScene();
    });
    scope.on(homeRoot, 'kraken:servicechange', event => showTask(event.detail?.service));
    scope.on(document, 'visibilitychange', () => {
        canvas.classList.toggle('is-paused', document.hidden || overrides.motion === 'still');
        if (document.hidden) {
            scope.clearTimeout(clockTimer);
            scope.clearTimeout(weatherTimer);
            stopTask();
        }
        else {
            tickClock();
            if (Date.now() >= nextFetchAt)
                fetchWeather();
            else
                scheduleWeather();
        }
    });
    scope.on(reducedMotion, 'change', () => { if (reducedMotion.matches)
        stopTask(); });
    const kaiImage = new Image();
    scope.on(kaiImage, 'load', () => kai.classList.add('is-ready'));
    kaiImage.src = '/home-approved/assets/kai-tasks.webp';
    // Warm and night variants are requested by their CSS only when they are needed.
    scope.cleanup(() => { if (dialog.open)
        dialog.close(); document.body.classList.remove('kraken-home-scene-dialog-open'); $('#sceneRain').replaceChildren(); $('#sceneSnow').replaceChildren(); kaiImage.src = ''; });
    createPrecipitation();
    tickClock();
    fetchWeather();
    return () => scope.dispose();
}
