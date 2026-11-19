import React from 'react';
import { useTranslation } from '../i18n';

interface Section5PreiseProps {
  onNavigate?: (path: string) => void;
}

export default function Section5Preise({ onNavigate }: Section5PreiseProps) {
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
          title: 'How much does cleaning cost in the Schaffhausen region?',
          subtitle: 'Transparent pricing with no hidden costs. Learn how our quotes are calculated.',
          desc: 'The cost of professional cleaning depends on net living area, number of bathrooms, degree of soiling, and specific extra services (such as balconies, conservatories, or garages). Travel times within Schaffhausen, Winterthur, and Zurich are included in the calculation.',
          guidelinesTitle: 'Orientation Guidelines (non-binding):',
          opt1: '2.5-room apartment',
          p1: 'from CHF 590',
          opt2: '3.5-room apartment',
          p2: 'from CHF 780',
          opt3: '4.5-room apartment',
          p3: 'from CHF 980',
          inc: 'Incl. Handover Guarantee',
          note: 'Note: All prices are non-binding estimates without VAT.',
          btn: 'Calculate exact price in real-time calculator →'
        };
      case 'fr':
        return {
          title: 'Combien coûte un nettoyage dans la région de Schaffhouse ?',
          subtitle: 'Tarification transparente sans frais cachés. Découvrez comment nos devis sont calculés.',
          desc: 'Le coût d\'un nettoyage professionnel dépend de la surface habitable nette, du nombre de salles de bains, du niveau d\'encrassement et des prestations complémentaires (balcons, vérandas, garages). Les trajets à Schaffhouse, Winterthour et Zurich sont inclus.',
          guidelinesTitle: 'Valeurs indicatives (non contractuelles) :',
          opt1: 'Appartement 2.5 pièces',
          p1: 'dès CHF 590',
          opt2: 'Appartement 3.5 pièces',
          p2: 'dès CHF 780',
          opt3: 'Appartement 4.5 pièces',
          p3: 'dès CHF 980',
          inc: 'Garantie de remise incluse',
          note: 'Remarque : Tous les prix indiqués sont des valeurs indicatives sans TVA.',
          btn: 'Calculer le prix exact avec le configurateur →'
        };
      case 'it':
        return {
          title: 'Quanto costa una pulizia nella regione di Sciaffusa?',
          subtitle: 'Prezzi trasparenti senza costi nascosti. Scoprite come vengono calcolati i nostri preventivi.',
          desc: 'I costi per una pulizia professionale dipendono dalla superficie abitabile netta, dal numero di bagni, dal grado di sporco e da servizi aggiuntivi (balconi, giardini d\'inverno, garage). I tempi di viaggio a Sciaffusa, Winterthur e Zurigo sono inclusi.',
          guidelinesTitle: 'Valori orientativi (non vincolanti):',
          opt1: 'Appartamento da 2.5 locali',
          p1: 'da CHF 590',
          opt2: 'Appartamento da 3.5 locali',
          p2: 'da CHF 780',
          opt3: 'Appartamento da 4.5 locali',
          p3: 'da CHF 980',
          inc: 'Garanzia di consegna inclusa',
          note: 'Nota: Tutti i prezzi indicati sono orientativi senza IVA.',
          btn: 'Calcola il prezzo esatto nel configuratore →'
        };
      case 'es':
        return {
          title: '¿Cuánto cuesta una limpieza en la región de Schaffhausen?',
          subtitle: 'Precios transparentes sin costes ocultos. Descubra cómo se calculan nuestros presupuestos.',
          desc: 'Los costes de una limpieza profesional dependen de la superficie útil, el número de baños, el grado de suciedad y servicios adicionales específicos (como balcones, terrazas o garajes). Los trayectos en Schaffhausen, Winterthur y Zúrich están incluidos.',
          guidelinesTitle: 'Valores orientativos (sin compromiso):',
          opt1: 'Apartamento de 2.5 habitaciones',
          p1: 'desde CHF 590',
          opt2: 'Apartamento de 3.5 habitaciones',
          p2: 'desde CHF 780',
          opt3: 'Apartamento de 4.5 habitaciones',
          p3: 'desde CHF 980',
          inc: 'Garantía de entrega incluida',
          note: 'Nota: Todos los precios son orientativos y sin IVA.',
          btn: 'Calcular precio exacto en el configurador en tiempo real →'
        };
      case 'pt':
        return {
          title: 'Quanto custa uma limpeza na região de Schaffhausen?',
          subtitle: 'Preços transparentes sem custos ocultos. Saiba como são calculados os nossos orçamentos.',
          desc: 'Os custos de uma limpeza profissional dependem da área útil, do número de casas de banho, do grau de sujidade e de serviços adicionais (varandas, marquises ou garagens). Os tempos de deslocação em Schaffhausen, Winterthur e Zurique estão incluídos.',
          guidelinesTitle: 'Valores orientativos (sem compromisso):',
          opt1: 'Apartamento de 2.5 divisões',
          p1: 'desde CHF 590',
          opt2: 'Apartamento de 3.5 divisões',
          p2: 'desde CHF 780',
          opt3: 'Apartamento de 4.5 divisões',
          p3: 'desde CHF 980',
          inc: 'Garantia de entrega incluída',
          note: 'Nota: Todos os preços são estimativas sem IVA.',
          btn: 'Calcular preço exato no configurador em tempo real →'
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          title: 'Was kostet eine Reinigung in der Region Schaffhausen?',
          subtitle: 'Transparente Preisgestaltung ohne versteckte Nebenkosten. Erfahren Sie, wie sich unsere Offerten zusammensetzen.',
          desc: 'Die Kosten für eine professionelle Reinigung hängen von der Nettowohnfläche, der Anzahl Nasszellen, dem Grad der Verschmutzung sowie spezifischen Zusatzleistungen (wie Balkon-, Wintergarten- oder Einstellhallenreinigung) ab. Anfahrtswege innerhalb der Regionen Schaffhausen, Winterthur und Zürich fliessen kalkulatorisch ein.',
          guidelinesTitle: 'Orientierende Richtwerte (unverbindlich):',
          opt1: '2.5-Zimmer-Wohnung',
          p1: 'ab CHF 590',
          opt2: '3.5-Zimmer-Wohnung',
          p2: 'ab CHF 780',
          opt3: '4.5-Zimmer-Wohnung',
          p3: 'ab CHF 980',
          inc: 'Inkl. Abgabetermin-Garantie',
          note: 'Hinweis: Alle Preisangaben verstehen sich als unverbindliche Richtwerte ohne MwSt. (Nicht MWST-pflichtig).',
          btn: 'Exakten Preis im Echtzeit-Konfigurator berechnen →'
        };
    }
  };

  const tData = getT();

  return (
    <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mb-3">
            {tData.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {tData.subtitle}
          </p>
        </div>

        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8">
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed mb-6">
            {tData.desc}
          </p>

          <h3 className="text-xs sm:text-sm font-bold text-[#032B59] uppercase tracking-wider mb-4">{tData.guidelinesTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">{tData.opt1}</span>
              <span className="text-lg sm:text-xl font-bold text-[#032B59]">{tData.p1}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 block mt-1">{tData.inc}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">{tData.opt2}</span>
              <span className="text-lg sm:text-xl font-bold text-[#032B59]">{tData.p2}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 block mt-1">{tData.inc}</span>
            </div>
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <span className="text-xs text-slate-500 font-semibold block">{tData.opt3}</span>
              <span className="text-lg sm:text-xl font-bold text-[#032B59]">{tData.p3}</span>
              <span className="text-[10px] sm:text-xs text-slate-400 block mt-1">{tData.inc}</span>
            </div>
          </div>

          <p className="text-xs text-slate-500 italic mb-6">
            {tData.note}
          </p>

          <div className="text-center">
            <a
              href="/quote"
              onClick={(e) => handleLinkClick(e, '/quote')}
              className="inline-flex items-center justify-center py-3.5 px-8 rounded-xl bg-[#032B59] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              {tData.btn}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

