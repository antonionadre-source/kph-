import React from 'react';
import { useTranslation } from '../i18n';

interface Section4UmzugsreinigungProps {
  onNavigate?: (path: string) => void;
}

export default function Section4Umzugsreinigung({ onNavigate }: Section4UmzugsreinigungProps) {
  const { language } = useTranslation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const getT = () => {
    switch (language) {
      case 'en':
        return {
          badge: 'Worry-free Relocation',
          title: 'Move-out Cleaning with Handover Guarantee in Schaffhausen & Winterthur',
          p1: 'Swiss property management companies inspect extremely thoroughly during official handovers. Encrustations in the oven, greasy residue in extractor filters, limescale in bathrooms, and dust in window frames or blind slats frequently lead to complaints and potential rental deposit deductions.',
          p2: 'With the Handover Guarantee from Kraken PFM, you eliminate this risk completely. We perform the entire final cleaning according to official inspection criteria. If the property management highlights any issue during inspection, our team rectifies it immediately free of charge.',
          boxTitle: 'What we guaranteed thoroughly clean:',
          items: [
            '• Fridge & freezer defrosted',
            '• Oven & baking trays degreased',
            '• Extractor hood & metal filter',
            '• Bathrooms fully descaled',
            '• Windows including frames & sills',
            '• Blinds, shutters & balcony areas'
          ],
          btn: 'Calculate move-out cleaning online'
        };
      case 'fr':
        return {
          badge: 'Changement de logement sans souci',
          title: 'Nettoyage de fin de bail avec garantie de remise à Schaffhouse & Winterthour',
          p1: 'Lors de l\'état des lieux de sortie, les gérances immobilières suisses procèdent à une inspection rigoureuse. Incrustations dans le four, dépôts gras sur la hotte, traces de calcaire ou poussière dans les fenêtres entraînent fréquemment des réserves et des retenues sur le dépôt de garantie.',
          p2: 'Avec la garantie de remise de Kraken PFM, vous éliminez entièrement ce risque. Nous réalisons le nettoyage final selon les critères officiels. Si la gérance émet une remarque, notre équipe intervient immédiatement et gratuitement.',
          boxTitle: 'Ce que nous nettoyons scrupuleusement :',
          items: [
            '• Réfrigérateur & congélateur dégivrés',
            '• Four & plaques dégraissés',
            '• Hotte d\'aspiration & filtre métallique',
            '• Sanitaires entièrement détartrés',
            '• Fenêtres, cadres & rebords',
            '• Stores, volets & balcons'
          ],
          btn: 'Calculer le nettoyage en ligne'
        };
      case 'it':
        return {
          badge: 'Trasloco senza pensieri',
          title: 'Pulizia di fine locazione con garanzia di consegna a Sciaffusa e Winterthur',
          p1: 'Durante la consegna ufficiale dell\'appartamento, le amministrazioni immobiliari svizzere controllano in modo estremamente rigoroso. Croste nel forno, grasso nei filtri della cappa, calcare in bagno e polvere nei serramenti causano spesso contestazioni.',
          p2: 'Con la garanzia di consegna di Kraken PFM eliminate completamente questo rischio. Eseguiamo la pulizia finale completa secondo i criteri ufficiali di ispezione. Se l\'amministrazione riscontra qualche difetto, interveniamo subito gratuitamente.',
          boxTitle: 'Cosa puliamo con garanzia di precisione:',
          items: [
            '• Frigorifero & freezer sbrinati',
            '• Forno & teglie sgrassati',
            '• Cappa & filtro metallico',
            '• Servizi igienici totalmente decalcificati',
            '• Finestre compresi telai & scanalature',
            '• Tapparelle, persiane & balconi'
          ],
          btn: 'Calcola la pulizia online'
        };
      case 'es':
        return {
          badge: 'Cambio de Vivienda Sin Preocupaciones',
          title: 'Limpieza de fin de alquiler con garantía de entrega en Schaffhausen y Winterthur',
          p1: 'En la entrega oficial de la vivienda, las empresas inmobiliarias suizas inspeccionan minuciosamente. La incrustación en el horno, grasa en los filtros de la campana, marcas de cal en baños y polvo en rieles de ventanas suelen causar objeciones y retenciones del depósito de alquiler.',
          p2: 'Con la Garantía de Entrega de Kraken PFM elimina este riesgo por completo. Realizamos la limpieza final completa según los criterios oficiales. Si el propietario o la agencia señala algún punto durante la inspección, nuestro equipo lo rectifica de inmediato sin costo adicional.',
          boxTitle: 'Lo que garantizamos dejar impoluto:',
          items: [
            '• Nevera y congelador descongelados',
            '• Horno y bandejas desengrasados',
            '• Campana extractor y filtro metálico',
            '• Sanitarios totalmente descalcificados',
            '• Ventanas, marcos y rieles',
            '• Persianas, toldos y balcón'
          ],
          btn: 'Calcular limpieza online'
        };
      case 'pt':
        return {
          badge: 'Mudança de Casa Sem Preocupações',
          title: 'Limpeza de fim de contrato com garantia de entrega em Schaffhausen e Winterthur',
          p1: 'Na entrega oficial do apartamento, as imobiliárias suíças inspecionam minuciosamente. Gordura no forno, resíduos na horta de exaustão, calcário na casa de banho e poeira nas caixilharias de janelas causam frequentemente reclamações e cortes no depósito de caução.',
          p2: 'Com a Garantia de Entrega da Kraken PFM elimina este risco completamente. Efetuamos a limpeza final de acordo com os critérios oficiais. Se a administração assinalar algum ponto na inspeção, a nossa equipa limpa de imediato sem custos adicionais.',
          boxTitle: 'O que garantimos limpar minuciosamente:',
          items: [
            '• Frigorífico e congelador desgelados',
            '• Forno e tabuleiros desengordurados',
            '• Exaustor e filtro metálico',
            '• Casas de banho descalcificadas',
            '• Janelas incluindo caixilhos e calhas',
            '• Estores, persianas e varandas'
          ],
          btn: 'Calcular limpeza online'
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          badge: 'Sorgenfreier Wohnungswechsel',
          title: 'Umzugsreinigung mit Abgabegarantie in Schaffhausen und Winterthur',
          p1: 'Bei der offiziellen Wohnungsabnahme prüfen Schweizer Immobilienverwaltungen extrem genau. Verkrustungen im Backofen, fettige Ablagerungen im Dampfabzugfilter, Kalkspuren an Armaturen in Dusche und Bad sowie Staub in den Fensterfalzen, Storenlamellen oder Rollladenkästen führen häufig zu Beanstandungen. Wenn Nachreinigungen verlangt werden, drohen Abzüge vom Mietzinsdepot oder Verzögerungen bei der Übergabe.',
          p2: 'Mit der Abgabetermin-Garantie von Kraken PFM eliminieren Sie dieses Risiko vollständig. Wir übernehmen die komplette Endreinigung nach offiziellen Abnahmekriterien. Sollte die Verwaltung bei der gemeinsamen Inspektion einzelne Punkte bemängeln, ist unser Einsatzleiter direkt vor Ort oder reinigt innerhalb kürzester Zeit kostenfrei nach.',
          boxTitle: 'Was wir garantiert gründlich reinigen:',
          items: [
            '• Kühl- & Gefrierschrank entfrostet',
            '• Backofen & Bleche entfettet',
            '• Dampfabzug & Metallfilter',
            '• Sanitäranlagen komplett entkalkt',
            '• Fenster samt Rahmen & Falzen',
            '• Storen, Läden & Balkonflächen'
          ],
          btn: 'Umzugsreinigung online berechnen'
        };
    }
  };

  const tData = getT();

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center text-xs font-bold uppercase tracking-wider text-[#032B59] bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              {tData.badge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mt-3 mb-4">
              {tData.title}
            </h2>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-4">
              {tData.p1}
            </p>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-6">
              {tData.p2}
            </p>
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 mb-6">
              <h3 className="text-xs font-bold uppercase text-[#032B59] tracking-wider mb-3">{tData.boxTitle}</h3>
              <ul className="text-xs sm:text-sm text-slate-700 grid grid-cols-2 gap-2 font-medium">
                {tData.items.map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={(e) => { e.preventDefault(); if (onNavigate) onNavigate('consultation'); }}
                className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] px-6 py-3.5 sm:px-7 sm:py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-emerald-500/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
              >
                <span>
                  {language === 'en' ? 'Request a Free Quote' :
                   language === 'fr' ? 'Demander un devis gratuit' :
                   language === 'it' ? 'Richiedi preventivo gratuito' :
                   language === 'es' ? 'Solicitar presupuesto gratis' :
                   language === 'pt' ? 'Solicitar orçamento gratuito' :
                   'Kostenlose Offerte anfordern'}
                </span>
              </button>

              <a
                href="/quote"
                onClick={(e) => handleLinkClick(e, '/quote')}
                className="bg-transparent border-2 border-[#032B59] text-[#032B59] hover:bg-[#032B59]/5 px-6 py-3.5 rounded-full font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap active:scale-95"
              >
                {tData.btn}
              </a>
            </div>
          </div>

          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-md">
            <img
              src="/kai-imagen-1.webp"
              alt="Umzugsreinigung mit Abgabegarantie - Kraken PFM"
              className="w-full h-full object-cover"
              loading="lazy"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

