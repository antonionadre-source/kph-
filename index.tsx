import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { I18nProvider } from './i18n';
import { AuthProvider } from './components/Auth';

// Suppress and handle benign development WebSocket errors from the Vite HMR client in sandboxed preview environments
if (typeof window !== 'undefined') {
  window.addEventListener('unhandledrejection', (event) => {
    try {
      const reason = event.reason;
      if (reason) {
        const msg = typeof reason === 'string' 
          ? reason 
          : (reason.message || (reason.toString && reason.toString()) || '');
        if (
          /websocket|ws|vite|hmr/i.test(msg) ||
          msg.indexOf('WebSocket closed without opened') !== -1 ||
          msg.indexOf('failed to connect') !== -1
        ) {
          console.warn('Prevented unhandled rejection from development WebSocket:', reason);
          event.preventDefault();
          event.stopPropagation();
        }
      }
    } catch (e) {
      // Resilient
    }
  });

  window.addEventListener('error', (event) => {
    try {
      const msg = event.message || (event.error && event.error.message) || '';
      if (
        /websocket|ws|vite|hmr/i.test(msg) ||
        msg.indexOf('WebSocket closed without opened') !== -1 ||
        msg.indexOf('failed to connect') !== -1
      ) {
        console.warn('Prevented error event from development WebSocket:', msg);
        event.preventDefault();
        event.stopPropagation();
      }
    } catch (e) {
      // Resilient
    }
  }, true);
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const appEl = (
  <React.StrictMode>
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  </React.StrictMode>
);

if (rootElement.hasChildNodes()) {
  ReactDOM.hydrateRoot(rootElement, appEl);
} else {
  const root = ReactDOM.createRoot(rootElement);
  root.render(appEl);
}