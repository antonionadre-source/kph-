import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App';
import { I18nProvider, detectLanguage, preloadLanguage } from './i18n';
import { AuthProvider } from './components/Auth';

async function bootstrap() {
  const element = document.getElementById('root');
  if (!element) throw new Error('Application root is missing.');
  const language = detectLanguage();
  await preloadLanguage(language).catch(() => undefined);
  document.documentElement.lang = language.startsWith('de') ? 'de' : language;
  ReactDOM.createRoot(element).render(
    <React.StrictMode><I18nProvider><AuthProvider><App /></AuthProvider></I18nProvider></React.StrictMode>
  );
}
void bootstrap();
