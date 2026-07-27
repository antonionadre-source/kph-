// ==========================================
// Mock DOM Environment for Node.js SSR / Pre-rendering
// ==========================================

const safeAtob = function(str: string) {
  return Buffer.from(str, 'base64').toString('binary');
};
const safeBtoa = function(str: string) {
  return Buffer.from(str, 'binary').toString('base64');
};

(globalThis as any).atob = safeAtob;
(globalThis as any).btoa = safeBtoa;
(global as any).atob = safeAtob;
(global as any).btoa = safeBtoa;
(globalThis as any).self = globalThis;

const mockLocalStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {},
  length: 0,
  key: () => null,
};

const mockWindow = {
  SSR: true,
  location: {
    pathname: '/',
    search: '',
    hostname: 'krakenpfm.ch',
    port: '',
    href: 'https://krakenpfm.ch/',
  },
  localStorage: mockLocalStorage,
  sessionStorage: mockLocalStorage,
  navigator: {
    language: 'de-CH',
  },
  addEventListener: () => {},
  removeEventListener: () => {},
  scrollTo: () => {},
  dispatchEvent: () => true,
  URL: {
    createObjectURL: () => '',
    revokeObjectURL: () => '',
  },
  atob: safeAtob,
  btoa: safeBtoa,
  self: null as any,
  // Firebase CDN global bindings
  db: {
    collection: () => ({
      doc: () => ({
        get: () => Promise.resolve({ exists: false }),
        set: () => Promise.resolve(),
      }),
    }),
  },
  auth: {
    onAuthStateChanged: () => () => {},
  },
};

const mockDocument = {
  title: '',
  querySelector: () => null,
  querySelectorAll: () => [] as any,
  createElement: () => ({ setAttribute: () => {}, appendChild: () => {}, style: {} }),
  head: { appendChild: () => {} },
  body: { appendChild: () => {} },
};

// Bind to both global and globalThis to ensure any reference (window.xxx or plain window) succeeds
mockWindow.self = mockWindow;
(globalThis as any).window = mockWindow;
(globalThis as any).document = mockDocument;
(globalThis as any).localStorage = mockLocalStorage;
(globalThis as any).sessionStorage = mockLocalStorage;

try {
  Object.defineProperty(globalThis, 'navigator', {
    value: mockWindow.navigator,
    writable: true,
    configurable: true,
  });
} catch (e) {
  (globalThis as any).navigator = mockWindow.navigator;
}

// Avoid CSS-related style crash
(globalThis as any).CSS = {
  supports: () => false,
};

console.log('🌐 Browser Mock DOM environment initialized successfully.');
export {};
