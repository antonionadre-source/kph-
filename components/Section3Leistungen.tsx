import React from 'react';
import { useTranslation } from '../i18n';

interface Section3LeistungenProps {
  onNavigate?: (path: string) => void;
}

export default function Section3Leistungen({ onNavigate }: Section3LeistungenProps) {
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
          headerTitle: 'Our Services at a Glance',
          headerSub: 'Clearly defined cleaning processes with fixed standards for private and commercial clients.',
          detailsLink: 'View details →',
          items: [
            {
              title: 'Move-out Cleaning',
              icon: '📦',
              text: 'Thorough end-of-tenancy cleaning including oven, extractor hood, windows, and blinds. Includes handover guarantee: if the landlord requests touch-ups, we re-clean immediately free of charge.',
              link: '/services'
            },
            {
              title: 'Maintenance Cleaning',
              icon: '🧹',
              text: 'Regular care of private homes and properties at fixed intervals (weekly, bi-weekly). Includes damp wiping of floors, sanitary descaling, and dust removal according to clear checklists.',
              link: '/services'
            },
            {
              title: 'Office Cleaning',
              icon: '🏢',
              text: 'Professional cleaning for workplaces, meeting rooms, kitchens, and sanitary facilities using color-coded microfiber systems to prevent cross-contamination.',
              link: '/services'
            },
            {
              title: 'Facility Management',
              icon: '🛠️',
              text: 'Holistic property care for residential and commercial buildings. Includes weekly stairwell cleaning, building inspection, craftsman coordination, and waste container management.',
              link: '/services'
            },
            {
              title: 'Garden Care',
              icon: '🌿',
              text: 'Seasonal maintenance for outdoor areas. We take care of lawn mowing, hedge trimming, weed removal on walkways, and professional disposal of green waste.',
              link: '/services'
            },
            {
              title: 'Exterior & Facade Cleaning',
              icon: '🚿',
              text: 'Gentle high-pressure cleaning for terraces, paving stones, driveways, and facade bases. Removes moss, algae, and weather residue using rotor nozzles.',
              link: '/services'
            },
            {
              title: 'Disposal & Clearance',
              icon: '🚛',
              text: 'Professional clearance of basements, attics, offices, or whole apartments. We sort wood, metal, electronics, and waste according to Swiss environmental standards.',
              link: '/services'
            },
            {
              title: 'Vehicle Detailing',
              icon: '🚗',
              text: 'In-depth interior and exterior cleaning for cars and fleet vehicles. Includes upholstery deep-cleaning, ozone treatment for odors, and leather care.',
              link: '/services'
            }
          ]
        };
      case 'fr':
        return {
          headerTitle: 'Aperçu de nos prestations',
          headerSub: 'Processus de nettoyage clairement définis avec des normes fixes pour clients privés et professionnels.',
          detailsLink: 'Voir les détails →',
          items: [
            {
              title: 'Nettoyage de remise de bail',
              icon: '📦',
              text: 'Nettoyage complet avec garantie de remise : four, hottes, fenêtres et stores. Intervention corrective immédiate et gratuite en caso de besoin.',
              link: '/services'
            },
            {
              title: 'Nettoyage d\'entretien',
              icon: '🧹',
              text: 'Entretien régulier de résidences privées et locaux à intervalles fixes (hebdomadaire, bimensuel) selon une liste de contrôle stricte.',
              link: '/services'
            },
            {
              title: 'Nettoyage de bureaux',
              icon: '🏢',
              text: 'Nettoyage professionnel de locaux de travail, salles de réunion et sanitaires avec des chiffons microfibres à code couleur.',
              link: '/services'
            },
            {
              title: 'Conciergerie & FM',
              icon: '🛠️',
              text: 'Prise en charge globale d\'immeubles d\'habitation et administratifs : cages d\'escalier, installations techniques et containers à ordures.',
              link: '/services'
            },
            {
              title: 'Entretien de jardins',
              icon: '🌿',
              text: 'Travaux saisonniers d\'extérieur : tonte de pelouse, taille de haies, désherbage d\'allées et évacuation des déchets verts.',
              link: '/services'
            },
            {
              title: 'Nettoyage extérieur & façades',
              icon: '🚿',
              text: 'Nettoyage haute pression doux des terrasses, dalles et façades. Élimination des mousses et dépôts sans détériorer les matériaux.',
              link: '/services'
            },
            {
              title: 'Débarras & Évacuation',
              icon: '🚛',
              text: 'Rangement et débarras professionnel de caves, greniers et bureaux avec tri sélectif conforme aux normes écologiques suisses.',
              link: '/services'
            },
            {
              title: 'Esthétique automobile',
              icon: '🚗',
              text: 'Nettoyage intérieur et extérieur approfondi de véhicules particuliers et de flottes : traitement à l\'ozone et soin des sièges.',
              link: '/services'
            }
          ]
        };
      case 'it':
        return {
          headerTitle: 'I nostri servizi in sintesi',
          headerSub: 'Processi di pulizia chiaramente definiti con standard fissi per clienti privati e commerciali.',
          detailsLink: 'Mostra dettagli →',
          items: [
            {
              title: 'Pulizia di fine locazione',
              icon: '📦',
              text: 'Pulizia finale completa con garanzia di consegna per forni, cappe, finestre e tapparelle. Rilevamento immediato in caso di necessità.',
              link: '/services'
            },
            {
              title: 'Pulizia di manutenzione',
              icon: '🧹',
              text: 'Cura regolare di abitazioni e immobili a intervalli fissi (settimanale o quindicinale) sulla base di checklist dettagliate.',
              link: '/services'
            },
            {
              title: 'Pulizia uffici',
              icon: '🏢',
              text: 'Pulizia professionale per uffici, sale riunioni e servizi igienici con panni in microfibra codificati per colore.',
              link: '/services'
            },
            {
              title: 'Custodia & FM',
              icon: '🛠️',
              text: 'Gestione completa di stabili residenziali e commerciali: pulizia vano scale, impianti e contenitori dei rifiuti.',
              link: '/services'
            },
            {
              title: 'Cura del giardino',
              icon: '🌿',
              text: 'Manutenzione stagionale degli spazi esterni: taglio dell\'erba, potatura siepi, diserbo viali e smaltimento scarti vegetali.',
              link: '/services'
            },
            {
              title: 'Pulizia esterni e facciate',
              icon: '🚿',
              text: 'Pulizia ad alta pressione delicata per terrazze, pavimentazioni e facciate contro muffa, alghe e depositi atmosferici.',
              link: '/services'
            },
            {
              title: 'Sgombero e smaltimento',
              icon: '🚛',
              text: 'Sgombero professionale di cantine, soffitte e uffici con separazione e smaltimento secondo gli standard ambientali svizzeri.',
              link: '/services'
            },
            {
              title: 'Dettaglio veicoli',
              icon: '🚗',
              text: 'Pulizia approfondita interna ed esterna per auto e flotte aziendali, con trattamento all\'ozono anti-odore e cura della pelle.',
              link: '/services'
            }
          ]
        };
      case 'es':
        return {
          headerTitle: 'Nuestros Servicios',
          headerSub: 'Procesos de limpieza claramente definidos con estándares fijos para clientes privados y comerciales.',
          detailsLink: 'Ver detalles →',
          items: [
            {
              title: 'Limpieza de Fin de Alquiler',
              icon: '📦',
              text: 'Limpieza exhaustiva con garantía de entrega para hornos, campanas, ventanas y persianas. Correcciones gratuitas e inmediatas si el propietario lo requiere.',
              link: '/services'
            },
            {
              title: 'Limpieza Regular',
              icon: '🧹',
              text: 'Mantenimiento periódico para hogares e inmuebles en intervalos fijos (semanal o quincenal) siguiendo listas de verificación rigurosas.',
              link: '/services'
            },
            {
              title: 'Limpieza de Oficinas',
              icon: '🏢',
              text: 'Limpieza profesional de puestos de trabajo, salas de reuniones y aseos mediante sistemas de paños codificados por color.',
              link: '/services'
            },
            {
              title: 'Mantenimiento de Edificios & FM',
              icon: '🛠️',
              text: 'Atención integral para inmuebles residenciales y comerciales: limpieza de zonas comunes, inspección técnica y contenedores.',
              link: '/services'
            },
            {
              title: 'Jardinería',
              icon: '🌿',
              text: 'Trabajos de mantenimiento exterior: corte de césped, poda de setos, eliminación de malas hierbas y retirada de residuos orgánicos.',
              link: '/services'
            },
            {
              title: 'Limpieza Exterior y Fachadas',
              icon: '🚿',
              text: 'Limpieza de alta presión para terrazas, suelos exteriores y fachadas. Elimina verdín y moho respetando los materiales.',
              link: '/services'
            },
            {
              title: 'Desalojo y Retirada',
              icon: '🚛',
              text: 'Vaciado profesional de trasteros, buhardillas u oficinas con clasificación y entrega en centros de reciclaje homologados en Suiza.',
              link: '/services'
            },
            {
              title: 'Detallado de Vehículos',
              icon: '🚗',
              text: 'Limpieza profunda interior y exterior de automóviles y flotas comerciales: desinfección con ozono y cuidado de tapicería.',
              link: '/services'
            }
          ]
        };
      case 'pt':
        return {
          headerTitle: 'Nossos Serviços',
          headerSub: 'Processos de limpeza claramente definidos com padrões fixos para clientes privados e comerciais.',
          detailsLink: 'Ver detalhes →',
          items: [
            {
              title: 'Limpeza de Fim de Contrato',
              icon: '📦',
              text: 'Limpeza minuciosa com garantia de entrega para fornos, exaustores, janelas e estores. Correções gratuitas e imediatas se solicitado.',
              link: '/services'
            },
            {
              title: 'Limpeza de Manutenção',
              icon: '🧹',
              text: 'Cuidado regular de habitações privadas e propriedades em intervalos fixos (semanal ou quinzenal) com listas de verificação.',
              link: '/services'
            },
            {
              title: 'Limpeza de Escritórios',
              icon: '🏢',
              text: 'Limpeza profissional de locais de trabalho, salas de reunião e instalações sanitárias com panos codificados por cores.',
              link: '/services'
            },
            {
              title: 'Manutenção de Edifícios & FM',
              icon: '🛠️',
              text: 'Gestão integral de imóveis residenciais e comerciais: escadas, inspeção técnica e gestão de contentores de lixo.',
              link: '/services'
            },
            {
              title: 'Jardinagem',
              icon: '🌿',
              text: 'Manutenção sazonal em áreas exteriores: corte de relva, poda de sebes, remoção de ervas daninhas e descarte verde.',
              link: '/services'
            },
            {
              title: 'Limpeza Exterior e Fachadas',
              icon: '🚿',
              text: 'Limpeza a alta pressão para terraços, pisos exteriores e fachadas. Remoção de musgo e sujidade respeitando os materiais.',
              link: '/services'
            },
            {
              title: 'Desocupação e Eliminação',
              icon: '🚛',
              text: 'Desocupação profissional de caves, sótãos e escritórios com separação ecológica segundo as normas suíças.',
              link: '/services'
            },
            {
              title: 'Estética Automóvel',
              icon: '🚗',
              text: 'Limpeza profunda interior e exterior para carros e frotas empresariais: tratamento com ozono e cuidado dos estofos.',
              link: '/services'
            }
          ]
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          headerTitle: 'Unsere Leistungen im Überblick',
          headerSub: 'Klar definierte Reinigungsprozesse mit festen Standards für private und gewerbliche Kunden.',
          detailsLink: 'Details anzeigen →',
          items: [
            {
              title: 'Umzugsreinigung',
              icon: '📦',
              text: 'Gründliche Endreinigung von Mietwohnungen und Häusern inklusive Backofen-, Dampfabzug-, Fenster- und Storenreinigung. Wir arbeiten mit fester Abgabetermin-Garantie: Sollte die Liegenschaftsverwaltung bei der Wohnungsabnahme Nachbesserungen fordern, reinigen unsere Mitarbeiter umgehend kostenlos nach.',
              link: '/services'
            },
            {
              title: 'Unterhaltsreinigung',
              icon: '🧹',
              text: 'Regelmässige Pflege von Privathaushalten und Liegenschaften in festen Intervallen (wöchentlich, zweiwöchentlich). Beinhaltet das feuchte Wischen von Bodenbelägen, Sanitärhygiene mit gezieltem Entkalken sowie das Entstauben zugänglicher Oberflächen nach klaren Checklisten ohne Verzug.',
              link: '/services'
            },
            {
              title: 'Büroreinigung',
              icon: '🏢',
              text: 'Professionelle Gebäudereinigung für Arbeitsplätze, Sitzungszimmer, Kaffeeküchen und Sanitäranlagen. Wir verwenden farblich getrennte Mikrofaser-Tuchsysteme zur Vermeidung von Kreuzkontaminationen und reinigen flexibel am späten Nachmittag oder vor Arbeitsbeginn.',
              link: '/services'
            },
            {
              title: 'Hauswartung & FM',
              icon: '🛠️',
              text: 'Ganzheitliche Betreuung von Wohn- und Gewerbeliegenschaften. Beinhaltet die wöchentliche Treppenhausreinigung, Kontrolle der Haustechnik, Koordination von Handwerkern sowie die Saison-Bereitstellung der Abfallcontainer für eine gepflegte Umgebung.',
              link: '/services'
            },
            {
              title: 'Gartenpflege',
              icon: '🌿',
              text: 'Saisonale Unterhaltsarbeiten im Aussenbereich von Liegenschaften. Wir übernehmen den fachgerechten Rasenschnitt, das Schneiden von Hecken und Sträuchern, Unkrautentfernung auf Gehwegflächen sowie den fachgerechten Abtransport aller organischen Grünabfälle.',
              link: '/services'
            },
            {
              title: 'Aussen- & Fassadenreinigung',
              icon: '🚿',
              text: 'Schonende Hochdruck- und Oberflächenreinigung von Terrassen, Gehwegplatten, Garageneinfahrten und Fassadensockeln. Entfernt Moos, Algen und witterungsbedingte Ablagerungen ohne Beschädigung der Bausubstanz unter Einsatz professioneller Rotordüsen.',
              link: '/services'
            },
            {
              title: 'Entsorgung & Räumung',
              icon: '🚛',
              text: 'Fachgerechte Räumung von Kellern, Estrichräumen, Büros oder ganzen Wohnungen. Wir sortieren Sperrmüll, Holz, Metall und Elektrogeräte nach Schweizer Umweltschutzstandards und liefern alle Wertstoffe direkt bei zertifizierten regionalen Entsorgungszentren ab.',
              link: '/services'
            },
            {
              title: 'Fahrzeugaufbereitung',
              icon: '🚗',
              text: 'Eingehende Innen- und Aussenreinigung für Personenwagen und Firmenflotten. Umfasst Nass-Tiefenreinigung von Polstern und Teppichen, Ozonbehandlung gegen Gerüche sowie die Pflege von Leder und Armaturen für Werterhalt und gepflegten Gesamteindruck.',
              link: '/services'
            }
          ]
        };
    }
  };

  const tData = getT();

  return (
    <section className="py-12 md:py-16 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mb-3">
            {tData.headerTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {tData.headerSub}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {tData.items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all">
              <div>
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="text-lg font-bold text-[#032B59] mb-2">{item.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">{item.text}</p>
              </div>
              <a 
                href={item.link} 
                onClick={(e) => handleLinkClick(e, item.link)}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#032B59] hover:text-blue-700 hover:underline transition-colors mt-auto cursor-pointer"
              >
                {tData.detailsLink}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center flex justify-center">
          <button
            onClick={() => onNavigate && onNavigate('consultation')}
            className="bg-gradient-to-r from-[#4ade80] to-[#2dd4bf] text-[#002d5b] hover:from-[#3feb73] hover:to-[#1ecdb6] px-8 py-4 rounded-full font-black text-xs sm:text-sm uppercase tracking-wider shadow-xl shadow-emerald-500/10 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer whitespace-nowrap"
          >
            <span>
              {language === 'en' ? 'Request a Free Quote' :
               language === 'fr' ? 'Demander un devis gratuit' :
               language === 'it' ? 'Richiedi preventivo gratuito' :
               language === 'es' ? 'Solicitar presupuesto gratis' :
               language === 'pt' ? 'Solicitar orçamento gratuito' :
               'Kostenlose Offerte anfordern'}
            </span>
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

