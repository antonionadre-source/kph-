import React from 'react';
import { useTranslation } from '../i18n';

interface Section2EinsatzgebieteProps {
  onNavigate?: (path: string) => void;
}

export default function Section2Einsatzgebiete({ onNavigate }: Section2EinsatzgebieteProps) {
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
          title: 'Where we work — Schaffhausen, Winterthur and Zurich',
          subtitle: 'Regional operational teams with clearly structured routes for rapid response times and reliable execution on site.',
          shTitle: 'Canton of Schaffhausen (Headquarters)',
          shDesc: 'As our local anchor point, we cover the entire Canton of Schaffhausen with the shortest travel times. Our scope ranges from historic old town buildings to family home neighborhoods and commercial parks. Thanks to direct proximity, we organize maintenance cleaning, glass cleaning, and emergency calls with maximum flexibility.',
          shLabel: 'Covered Municipalities:',
          shBtn: 'More about cleaning in Schaffhausen →',
          wiTitle: 'Winterthur Region',
          wiDesc: 'In the Winterthur region, our focus is on end-of-tenancy cleaning with a handover guarantee and recurring stairwell cleaning for property managers. Due to high tenant turnover in urban districts, we offer short-notice scheduling and standardized handover protocols.',
          wiLabel: 'Covered City Districts & Towns:',
          wiBtn: 'More about cleaning in Winterthur →',
          zhTitle: 'Zurich Region',
          zhDesc: 'For commercial and business clients in the Zurich metropolitan area, we provide specialized teams for office cleaning outside regular business hours. We ensure discreet access, complete key management, and strict compliance with security guidelines.',
          zhLabel: 'Covered Business Hubs:',
          zhBtn: 'More about cleaning in Zurich →'
        };
      case 'fr':
        return {
          title: 'Où nous intervenons — Schaffhouse, Winterthour et Zurich',
          subtitle: 'Équipes régionales d\'intervention aux parcours structurés pour des délais de réponse rapides et une exécution fiable.',
          shTitle: 'Canton de Schaffhouse (Siège social)',
          shDesc: 'Point d\'ancrage local, nous couvrons l\'ensemble du canton de Schaffhouse avec des temps de déplacement réduits. Notre champ d\'action s\'étend des bâtiments historiques de la vieille ville aux quartiers résidentiels et zones commerciales.',
          shLabel: 'Communes couvertes :',
          shBtn: 'En savoir plus sur le nettoyage à Schaffhouse →',
          wiTitle: 'Région de Winterthour',
          wiDesc: 'À Winterthour, notre priorité porte sur les nettoyages de fin de bail avec garantie de remise et l\'entretien régulier des cages d\'escalier. Nous proposons des interventions rapides et des protocoles d\'état des lieux standardisés.',
          wiLabel: 'Quartiers et localités couverts :',
          wiBtn: 'En savoir plus sur le nettoyage à Winterthour →',
          zhTitle: 'Région de Zurich',
          zhDesc: 'Pour les professionnels de la métropole zurichoise, nous mettons à disposition des équipes spécialisées dans le nettoyage de bureaux en dehors des heures de travail. Accès discret et gestion des clés garantis.',
          zhLabel: 'Zones d\'activités couvertes :',
          zhBtn: 'En savoir plus sur le nettoyage à Zurich →'
        };
      case 'it':
        return {
          title: 'Dove operiamo — Sciaffusa, Winterthur e Zurigo',
          subtitle: 'Team operativi regionali con percorsi strutturati per tempi di risposta rapidi ed esecuzione affidabile in loco.',
          shTitle: 'Cantone di Sciaffusa (Sede principale)',
          shDesc: 'Come nostro punto di ancoraggio locale, copriamo l\'intero Cantone di Sciaffusa con tempi di arrivo minimi. Dagli edifici storici del centro ai quartieri residenziali e alle aree commerciali.',
          shLabel: 'Comuni coperti:',
          shBtn: 'Scopri di più sulla pulizia a Sciaffusa →',
          wiTitle: 'Regione di Winterthur',
          wiDesc: 'Nella regione di Winterthur ci concentriamo sulle pulizie di fine locazione con garanzia di consegna e pulizia periodica dei vani scale per le amministrazioni immobiliari.',
          wiLabel: 'Quartieri e località coperte:',
          wiBtn: 'Scopri di più sulla pulizia a Winterthur →',
          zhTitle: 'Regione di Zurigo',
          zhDesc: 'Per i clienti commerciali nell\'area metropolitana di Zurigo, offriamo team specializzati per la pulizia degli uffici fuori dall\'orario di lavoro, con gestione sicura delle chiavi.',
          zhLabel: 'Aree commerciali coperte:',
          zhBtn: 'Scopri di più sulla pulizia a Zurigo →'
        };
      case 'es':
        return {
          title: 'Dónde trabajamos — Schaffhausen, Winterthur y Zúrich',
          subtitle: 'Equipos de servicio regional con rutas estructuradas para tiempos de respuesta rápidos y ejecución confiable in situ.',
          shTitle: 'Cantón de Schaffhausen (Sede Principal)',
          shDesc: 'Como punto de anclaje local, cubrimos todo el cantón de Schaffhausen con tiempos de llegada mínimos. Desde edificios históricos en el casco antiguo hasta zonas residenciales y parques comerciales.',
          shLabel: 'Municipios cubiertos:',
          shBtn: 'Más sobre limpieza en Schaffhausen →',
          wiTitle: 'Región de Winterthur',
          wiDesc: 'En la región de Winterthur nos especializamos en limpiezas de fin de alquiler con garantía de entrega y mantenimiento de escaleras para administraciones de propiedades.',
          wiLabel: 'Distritos y localidades cubiertas:',
          wiBtn: 'Más sobre limpieza en Winterthur →',
          zhTitle: 'Región de Zúrich',
          zhDesc: 'Para clientes comerciales e industriales en el área metropolitana de Zúrich, ofrecemos equipos especializados en limpieza de oficinas fuera del horario laboral, con gestión segura de llaves.',
          zhLabel: 'Áreas comerciales cubiertas:',
          zhBtn: 'Más sobre limpieza en Zúrich →'
        };
      case 'pt':
        return {
          title: 'Onde trabalhamos — Schaffhausen, Winterthur e Zurique',
          subtitle: 'Equipas regionais de serviço com rotas estruturadas para tempos de resposta rápidos e execução fiável no local.',
          shTitle: 'Cantão de Schaffhausen (Sede Principal)',
          shDesc: 'Como ponto de ancoragem local, cobrimos todo o cantão de Schaffhausen com os tempos de deslocação mais curtos. Da cidade antiga histórica aos bairros residenciais e parques comerciais.',
          shLabel: 'Municípios cobertos:',
          shBtn: 'Mais sobre limpeza em Schaffhausen →',
          wiTitle: 'Região de Winterthur',
          wiDesc: 'Na região de Winterthur, o nosso foco centra-se nas limpezas de fim de contrato com garantia de entrega e manutenção de escadas para gestores imobiliários.',
          wiLabel: 'Distritos e localidades cobertas:',
          wiBtn: 'Mais sobre limpeza em Winterthur →',
          zhTitle: 'Região de Zurique',
          zhDesc: 'Para clientes comerciais na área metropolitana de Zurique, disponibilizamos equipas especializadas para limpeza de escritórios fora do horário de expediente, com gestão segura de chaves.',
          zhLabel: 'Áreas comerciais cobertas:',
          zhBtn: 'Mais sobre limpeza em Zurique →'
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          title: 'Wo wir arbeiten — Schaffhausen, Winterthur und Zürich',
          subtitle: 'Regionale Einsatzteams mit klar strukturierten Routen für rasche Reaktionszeiten und verlässliche Ausführung vor Ort.',
          shTitle: 'Kanton Schaffhausen (Hauptsitz)',
          shDesc: 'Als lokaler Verankerungspunkt betreuen wir den gesamten Kanton Schaffhausen mit kürzesten Anfahrtszeiten. Das Einsatzspektrum reicht von historischen Altbauliegenschaften in der Altstadt über Einfamilienhaus-Quartiere bis zu Gewerbearealen. Dank direkter Nähe organisieren wir Unterhaltsreinigungen, periodische Glasreinigungen und Notfalleinsätze äusserst flexibel.',
          shLabel: 'Abgedeckte Gemeinden:',
          shBtn: 'Mehr über Reinigung in Schaffhausen →',
          wiTitle: 'Region Winterthur',
          wiDesc: 'In der Region Winterthur liegt unser Schwerpunkt auf Umzugsreinigungen für Wohnblöcke mit Abgabegarantie sowie der regelmässigen Treppenhausreinigung für Verwaltungsliegenschaften. Durch die hohe Mieterfluktuation in urbanen Stadtkreisen bieten wir kurzfristige Terminvergabe und standardisierte Abnahmeprotokolle zur Entlastung von Verwaltung und Mieterschaft.',
          wiLabel: 'Abgedeckte Stadtkreise & Orte:',
          wiBtn: 'Mehr über Reinigung in Winterthur →',
          zhTitle: 'Region Zürich',
          zhDesc: 'Für Geschäfts- und Gewerbekunden in der Metropolregion Zürich stellen wir spezialisierte Teams für Büroreinigungen ausserhalb der regulären Arbeitszeiten bereit. Wir sichern diskreten Zugang, lückenlose Schlüsselverwaltung und exakte Einhaltung von Sicherheitsrichtlinien in modernen Bürokomplexen, Praxen und Verkaufslokalen.',
          zhLabel: 'Abgedeckte Wirtschaftsräume:',
          zhBtn: 'Mehr über Reinigung in Zürich →'
        };
    }
  };

  const text = getT();

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mb-3">
            {text.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {text.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Kanton Schaffhausen */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
            <div>
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5">
                <img
                  src="/schaffhausen-1.webp"
                  alt="Gebäudereinigung und Hauswartung im Kanton Schaffhausen"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#032B59] mb-3">{text.shTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {text.shDesc}
              </p>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">{text.shLabel}</span>
                <ul className="text-xs text-slate-700 font-medium grid grid-cols-2 gap-1.5">
                  <li>• Schaffhausen</li>
                  <li>• Neuhausen am Rheinfall</li>
                  <li>• Thayngen</li>
                  <li>• Stein am Rhein</li>
                  <li>• Beringen</li>
                  <li>• Schleitheim</li>
                </ul>
              </div>
            </div>
            <a
              href="/reinigung/kanton-schaffhausen"
              onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
              className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl bg-[#032B59] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              {text.shBtn}
            </a>
          </div>

          {/* Region Winterthur */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
            <div>
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5">
                <img
                  src="/winterthur.webp"
                  alt="Umzugsreinigung und Büroreinigung in der Region Winterthur"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#032B59] mb-3">{text.wiTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {text.wiDesc}
              </p>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">{text.wiLabel}</span>
                <ul className="text-xs text-slate-700 font-medium grid grid-cols-2 gap-1.5">
                  <li>• Winterthur Stadt</li>
                  <li>• Wülflingen &amp; Töss</li>
                  <li>• Seen &amp; Oberwinterthur</li>
                  <li>• Elgg</li>
                  <li>• Illnau-Effretikon</li>
                  <li>• Umgebung Winterthur</li>
                </ul>
              </div>
            </div>
            <a
              href="/reinigung/region-winterthur"
              onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
              className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl bg-[#032B59] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              {text.wiBtn}
            </a>
          </div>

          {/* Region Zürich */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 flex flex-col justify-between hover:border-blue-300 transition-all shadow-xs">
            <div>
              <div className="relative h-44 w-full rounded-xl overflow-hidden mb-5">
                <img
                  src="/zurich.webp"
                  alt="Büroreinigung und Unterhaltsreinigung in der Region Zürich"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#032B59] mb-3">{text.zhTitle}</h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {text.zhDesc}
              </p>
              <div className="mb-6">
                <span className="text-xs font-bold uppercase text-slate-500 tracking-wider block mb-2">{text.zhLabel}</span>
                <ul className="text-xs text-slate-700 font-medium grid grid-cols-2 gap-1.5">
                  <li>• Zürich Stadt</li>
                  <li>• Kloten &amp; Flughafen</li>
                  <li>• Bülach &amp; Dielsdorf</li>
                  <li>• Opfikon &amp; Glattbrugg</li>
                  <li>• Regensdorf</li>
                  <li>• Dübendorf</li>
                </ul>
              </div>
            </div>
            <a
              href="/reinigung/region-zuerich"
              onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
              className="inline-flex items-center justify-center w-full py-3.5 px-6 rounded-xl bg-[#032B59] hover:bg-blue-900 text-white text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md cursor-pointer active:scale-95"
            >
              {text.zhBtn}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

