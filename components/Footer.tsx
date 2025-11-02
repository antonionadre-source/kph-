import React from 'react';
import { useTranslation } from '../i18n';
import { WhatsAppIcon } from './icons';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer id="contact" className="bg-[#002D5B] text-white py-12">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">{t('footer.title')}</h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">{t('footer.subtitle')}</p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <a href="mailto:Sales@krakenfm.co" className="bg-white text-[#002D5B] px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg">
            {t('footer.email')}
          </a>
          <a 
            href="https://wa.me/41772076947" 
            target="_blank" 
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="bg-white text-[#002D5B] p-3.5 rounded-full hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg flex items-center justify-center"
          >
            <WhatsAppIcon className="w-6 h-6" />
          </a>
        </div>
        <div className="mt-12 border-t border-white/20 pt-8">
          <p className="text-gray-300">{t('footer.copyright', { year: new Date().getFullYear() })}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;