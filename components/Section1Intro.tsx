import React from 'react';
import { useTranslation } from '../i18n';

interface Section1IntroProps {
  onNavigate?: (path: string) => void;
}

export default function Section1Intro({ onNavigate }: Section1IntroProps) {
  const { language } = useTranslation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const getTData = () => {
    switch (language) {
      case 'en':
        return {
          h2Title: 'Facility Management & Professional Cleaning',
          narrative: (
            <>
              Your operational partner for professional{' '}
              <a 
                href="/reinigung/kanton-schaffhausen" 
                onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
                className="font-semibold text-[#032B59] border-b border-[#032B59] hover:text-blue-700 transition-colors cursor-pointer"
              >
                cleaning in Schaffhausen
              </a>
              , the{' '}
              <a 
                href="/reinigung/region-winterthur" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Winterthur region
              </a>
              , and{' '}
              <a 
                href="/reinigung/region-zuerich" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Zurich
              </a>
              . Delivering Swiss quality, transparent fixed prices, and high reliability for residential and commercial properties.
            </>
          ),
          promises: [
            {
              emoji: '🏢',
              title: 'Facility Management',
              desc: 'Structured maintenance for residential & commercial real estate.'
            },
            {
              emoji: '✨',
              title: 'Commercial Cleaning',
              desc: 'Tailored intervals for offices, clinics, and businesses.'
            },
            {
              emoji: '🛡️',
              title: 'Handover Guarantee',
              desc: 'Move-out cleaning with guaranteed 100% acceptance.'
            },
            {
              emoji: '📍',
              title: 'Local & Transparent',
              desc: 'Fast service across Schaffhausen, Winterthur, and Zurich.'
            }
          ]
        };
      case 'fr':
        return {
          h2Title: 'Facility Management & Nettoyage Professionnel',
          narrative: (
            <>
              Votre partenaire opérationnel pour le{' '}
              <a 
                href="/reinigung/kanton-schaffhausen" 
                onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
                className="font-semibold text-[#032B59] border-b border-[#032B59] hover:text-blue-700 transition-colors cursor-pointer"
              >
                nettoyage à Schaffhouse
              </a>
              , la{' '}
              <a 
                href="/reinigung/region-winterthur" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                région de Winterthour
              </a>
              {' '}et{' '}
              <a 
                href="/reinigung/region-zuerich" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Zurich
              </a>
              . Qualité suisse, tarifs fixes transparents et service réactif pour logements et locaux commerciaux.
            </>
          ),
          promises: [
            {
              emoji: '🏢',
              title: 'Facility Management',
              desc: 'Gestion et conciergerie structurées d\'immeubles.'
            },
            {
              emoji: '✨',
              title: 'Nettoyage Régulier',
              desc: 'Fréquences sur mesure pour bureaux et cabinets.'
            },
            {
              emoji: '🛡️',
              title: 'Garantie de Remise',
              desc: 'Nettoyage de fin de bail avec garantie 100%.'
            },
            {
              emoji: '📍',
              title: 'Ancrage Local',
              desc: 'Déplacements rapides et prix fixes sans surcharges.'
            }
          ]
        };
      case 'it':
        return {
          h2Title: 'Facility Management e Pulizia Professionale',
          narrative: (
            <>
              Il vostro partner operativo per la{' '}
              <a 
                href="/reinigung/kanton-schaffhausen" 
                onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
                className="font-semibold text-[#032B59] border-b border-[#032B59] hover:text-blue-700 transition-colors cursor-pointer"
              >
                pulizia a Sciaffusa
              </a>
              , la{' '}
              <a 
                href="/reinigung/region-winterthur" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                regione di Winterthur
              </a>
              {' '}e{' '}
              <a 
                href="/reinigung/region-zuerich" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Zurigo
              </a>
              . Qualità svizzera, prezzi fissi e trasparenza per immobili residenziali e commerciali.
            </>
          ),
          promises: [
            {
              emoji: '🏢',
              title: 'Facility Management',
              desc: 'Manutenzione strutturata per case e uffici.'
            },
            {
              emoji: '✨',
              title: 'Pulizie Commerciali',
              desc: 'Servizi ordinari su misura per uffici e studi.'
            },
            {
              emoji: '🛡️',
              title: 'Garanzia di Consegna',
              desc: 'Fine locazione con garanzia di consegna al 100%.'
            },
            {
              emoji: '📍',
              title: 'Servizio Locale',
              desc: 'Interventi rapidi a Sciaffusa, Winterthur e Zurigo.'
            }
          ]
        };
      case 'es':
        return {
          h2Title: 'Facility Management y Limpieza Profesional',
          narrative: (
            <>
              Su proveedor operativo para la{' '}
              <a 
                href="/reinigung/kanton-schaffhausen" 
                onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
                className="font-semibold text-[#032B59] border-b border-[#032B59] hover:text-blue-700 transition-colors cursor-pointer"
              >
                limpieza en Schaffhausen
              </a>
              , la{' '}
              <a 
                href="/reinigung/region-winterthur" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                región de Winterthur
              </a>
              {' '}y{' '}
              <a 
                href="/reinigung/region-zuerich" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Zúrich
              </a>
              . Calidad suiza, precios fijos y máxima transparencia para inmuebles residenciales y comerciales.
            </>
          ),
          promises: [
            {
              emoji: '🏢',
              title: 'Facility Management',
              desc: 'Mantenimiento estructurado de residencias y comercios.'
            },
            {
              emoji: '✨',
              title: 'Limpieza Comercial',
              desc: 'Planes a medida para oficinas, clínicas y locales.'
            },
            {
              emoji: '🛡️',
              title: 'Garantía de Entrega',
              desc: 'Limpieza de fin de alquiler con entrega garantizada.'
            },
            {
              emoji: '📍',
              title: 'Atención Local',
              desc: 'Respuesta rápida en Schaffhausen, Winterthur y Zúrich.'
            }
          ]
        };
      case 'pt':
        return {
          h2Title: 'Gestão de Instalações e Limpeza Profissional',
          narrative: (
            <>
              O seu parceiro para{' '}
              <a 
                href="/reinigung/kanton-schaffhausen" 
                onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
                className="font-semibold text-[#032B59] border-b border-[#032B59] hover:text-blue-700 transition-colors cursor-pointer"
              >
                limpeza em Schaffhausen
              </a>
              , a{' '}
              <a 
                href="/reinigung/region-winterthur" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                região de Winterthur
              </a>
              {' '}e{' '}
              <a 
                href="/reinigung/region-zuerich" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Zurique
              </a>
              . Qualidade suíça, preços fixos e transparência para imóveis residenciais e comerciais.
            </>
          ),
          promises: [
            {
              emoji: '🏢',
              title: 'Facility Management',
              desc: 'Manutenção estruturada para residências e escritórios.'
            },
            {
              emoji: '✨',
              title: 'Limpeza Comercial',
              desc: 'Soluções sob medida para escritórios e clínicas.'
            },
            {
              emoji: '🛡️',
              title: 'Garantia de Entrega',
              desc: 'Fim de contrato com garantia total de aprovação.'
            },
            {
              emoji: '📍',
              title: 'Atendimento Local',
              desc: 'Serviço rápido em Schaffhausen, Winterthur e Zurique.'
            }
          ]
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          h2Title: 'Facility Management & Professionelle Reinigung',
          narrative: (
            <>
              Ihr verlässlicher Partner für{' '}
              <a 
                href="/reinigung/kanton-schaffhausen" 
                onClick={(e) => handleLinkClick(e, '/reinigung/kanton-schaffhausen')}
                className="font-semibold text-[#032B59] border-b border-[#032B59] hover:text-blue-700 transition-colors cursor-pointer"
              >
                Reinigung in Schaffhausen
              </a>
              , der{' '}
              <a 
                href="/reinigung/region-winterthur" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-winterthur')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Region Winterthur
              </a>
              {' '}und{' '}
              <a 
                href="/reinigung/region-zuerich" 
                onClick={(e) => handleLinkClick(e, '/reinigung/region-zuerich')}
                className="text-slate-800 border-b border-slate-300 hover:text-blue-900 transition-colors cursor-pointer"
              >
                Zürich
              </a>
              . Schweizer Qualität, faire Fixpreise und höchste Zuverlässigkeit für Wohn- und Gewerbeimmobilien.
            </>
          ),
          promises: [
            {
              emoji: '🏢',
              title: 'Facility Management',
              desc: 'Strukturierte Liegenschaftsbetreuung & Hauswartung.'
            },
            {
              emoji: '✨',
              title: 'Unterhaltsreinigung',
              desc: 'Massgeschneiderte Sauberkeit für Büros und Praxen.'
            },
            {
              emoji: '🛡️',
              title: 'Abgabegarantie',
              desc: 'Umzugsreinigung mit 100% Abnahmegarantie.'
            },
            {
              emoji: '📍',
              title: 'Regionale Präsenz',
              desc: 'Schnelle Einsatzzeiten in Schaffhausen, Winterthur & Zürich.'
            }
          ]
        };
    }
  };

  const tData = getTData();

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header & Short Narrative */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mb-3">
            {tData.h2Title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {tData.narrative}
          </p>
        </div>

        {/* 4 Cards in Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tData.promises.map((promise, idx) => (
            <div 
              key={idx} 
              className="bg-slate-50 rounded-2xl p-4 border border-slate-200 hover:border-blue-300 hover:shadow-xs transition-all duration-200 group flex items-start gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-[#032B59] flex items-center justify-center text-lg shrink-0 transition-colors duration-200">
                <span className="group-hover:scale-110 transition-transform duration-200 leading-none">
                  {promise.emoji}
                </span>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm font-bold text-[#032B59] group-hover:text-blue-900 transition-colors mb-1 tracking-tight">
                  {promise.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed font-normal m-0">
                  {promise.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}



