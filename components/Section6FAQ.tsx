import React from 'react';
import { useTranslation } from '../i18n';

interface Section6FAQProps {
  onNavigate?: (path: string) => void;
}

export default function Section6FAQ({ onNavigate }: Section6FAQProps) {
  const { language } = useTranslation();

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, path: string) => {
    if (onNavigate) {
      e.preventDefault();
      onNavigate(path);
    }
  };

  const getFaqs = () => {
    switch (language) {
      case 'en':
        return {
          title: 'Frequently Asked Questions (FAQ)',
          subtitle: 'Answers to key questions about our cleaning services and conditions.',
          items: [
            {
              q: 'How much does move-out cleaning cost in the Canton of Schaffhausen?',
              a: 'Costs depend on apartment size and number of rooms. A 2.5-room apartment starts from approx. CHF 590, a 3.5-room apartment from approx. CHF 780. All prices include cleaning products, travel, and handover guarantee (excl. VAT).'
            },
            {
              q: 'What happens if issues are raised during apartment handover?',
              a: 'If the property management raises any points during handover, our Handover Guarantee applies. Our team re-cleans the affected areas immediately at no extra cost until the handover protocol is signed.'
            },
            {
              q: 'In which regions does Kraken PFM operate?',
              a: 'Our core area includes the entire Canton of Schaffhausen, the Winterthur region, and the Zurich economic area. Thanks to central logistics, we ensure punctual operations and fair conditions in all three regions.'
            },
            {
              q: 'How short-notice can I book a cleaning appointment?',
              a: 'We generally recommend booking 1–2 weeks in advance. For urgent moves or emergencies, we organize operations based on availability within 24 to 48 hours.'
            },
            {
              q: 'Is the cleaning staff insured and legally registered?',
              a: 'Yes, without exception. All employees are fully employed, insured for social security, and covered by our commercial liability insurance against property damage.'
            },
            {
              q: 'Do I need to be personally present during cleaning?',
              a: 'No. A key handover at the start and for handover is sufficient. You can hand over the key in advance, place it in a key deposit, or bring it personally.'
            },
            {
              q: 'What cleaning supplies and equipment does the team bring?',
              a: 'We bring all required professional equipment (industrial vacuums, pressure washers, steam cleaners) and eco-friendly products. Learn more on our sustainability page.',
              hasLink: true,
              linkText: 'More about sustainability',
              linkUrl: '/sustainability'
            },
            {
              q: 'How do office cleaning contracts work?',
              a: 'We offer flexible service agreements without lock-in contracts. Cleaning intervals (daily, weekly, monthly) are customized to your schedule and adjustable with short notice.'
            },
            {
              q: 'What does the emergency and express cleaning service cover?',
              a: 'Our emergency service assists with unexpected incidents such as water damage, event cleanup, or urgent clearouts. We are reachable 24/7 via phone and WhatsApp.'
            },
            {
              q: 'In which languages can customer support be contacted?',
              a: 'Our founder and support team assist you in German, English, Spanish, French, Italian, and Portuguese for seamless communication.'
            }
          ]
        };
      case 'fr':
        return {
          title: 'Foire Aux Questions (FAQ)',
          subtitle: 'Réponses aux questions clés sur nos services de nettoyage et nos conditions.',
          items: [
            {
              q: 'Combien coûte un nettoyage de fin de bail dans le canton de Schaffhouse ?',
              a: 'Les tarifs dépendent de la surface et du nombre de pièces. Un 2.5 pièces débute dès CHF 590, un 3.5 pièces dès CHF 780. Tous les prix incluent le matériel, les déplacements et la garantie de remise.'
            },
            {
              q: 'Que se passe-t-il si la gérance fait des remarques lors de la remise ?',
              a: 'Si la gérance signale des points lors de la remise, notre garantie de remise s\'applique. Notre équipe nettoie immédiatement les zones concernées sans frais supplémentaires.'
            },
            {
              q: 'Dans quelles régions intervient Kraken PFM ?',
              a: 'Notre zone principale comprend l\'ensemble du canton de Schaffhouse, la région de Winterthour et le secteur économique de Zurich.'
            },
            {
              q: 'Sous quel délai puis-je réserver un nettoyage ?',
              a: 'Nous recommandons de réserver 1 à 2 semaines à l\'avance. En caso d\'urgence, nous organisons une intervention en 24 à 48 heures selon les disponibilités.'
            },
            {
              q: 'Le personnel est-il assuré et déclaré ?',
              a: 'Oui, sans exception. Tous les collaborateurs sont sous contrat, assurés aux assurances sociales et couverts par notre assurance responsabilité civile.'
            },
            {
              q: 'Dois-je être présent(e) pendant le nettoyage ?',
              a: 'Non. Une remise des clés au début et lors de la remise du logement suffit.'
            },
            {
              q: 'Quel matériel et quels produits l\'équipe apporte-t-elle ?',
              a: 'Nous apportons l\'ensemble des équipements professionnels et des produits écologiques nécessaires. En savoir plus sur notre page développement durable.',
              hasLink: true,
              linkText: 'En savoir plus sur le développement durable',
              linkUrl: '/sustainability'
            },
            {
              q: 'Comment fonctionnent les contrats de nettoyage de bureaux ?',
              a: 'Nous proposons des contrats de service flexibles sans engagement de longue durée, adaptés à vos horaires.'
            },
            {
              q: 'Que couvre le service de nettoyage d\'urgence et express ?',
              a: 'Notre service d\'urgence intervient lors d\'incidents imprévus (dégâts des eaux, événements, débarras urgent). Joignable 24/7 par téléphone et WhatsApp.'
            },
            {
              q: 'En quelles langues le service client peut-il être contacté ?',
              a: 'Notre fondateur et l\'équipe support vous répondent en allemand, anglais, espagnol, français, italien et portugais.'
            }
          ]
        };
      case 'it':
        return {
          title: 'Domande Frequenti (FAQ)',
          subtitle: 'Risposte alle domande principali sui nostri servizi di pulizia e sulle condizioni.',
          items: [
            {
              q: 'Quanto costa una pulizia di fine locazione nel Cantone di Sciaffusa?',
              a: 'I costi dipendono dalle dimensioni dell\'appartamento e dal numero di stanze. Un appartamento da 2.5 locali parte da ca. CHF 590, uno da 3.5 da ca. CHF 780. Tutti i prezzi includono prodotti, trasporto e garanzia.'
            },
            {
              q: 'Cosa succede se l\'appartamento viene contestato alla consegna?',
              a: 'Se l\'amministrazione riscontra difetti durante la consegna, si attiva la nostra garanzia di consegna. Il team pulisce subito le aree interessate senza costi aggiuntivi.'
            },
            {
              q: 'In quali regioni opera Kraken PFM?',
              a: 'La nostra area principale comprende l\'intero Cantone di Sciaffusa, la regione di Winterthur e l\'area di Zurigo.'
            },
            {
              q: 'Con quanto preavviso posso prenotare un intervento?',
              a: 'Consigliamo di prenotare 1-2 settimane prima. Per emergenze organiziamo interventi anche entro 24-48 ore.'
            },
            {
              q: 'Il personale di pulizia è assicurato e in regola?',
              a: 'Sì, senza eccezioni. Tutti i dipendenti sono regolarmente assunti, assicurati ed al coperto della nostra assicurazione di responsabilità civile.'
            },
            {
              q: 'Devo essere presente di persona durante la pulizia?',
              a: 'No. È sufficiente la consegna delle chiavi all\'inizio e per l\'ispezione finale.'
            },
            {
              q: 'Che prodotti e macchinari porta il team?',
              a: 'Portiamo tutte le attrezzature professionali e prodotti ecologici necessari. Scoprite di più sulla nostra pagina sostenibilità.',
              hasLink: true,
              linkText: 'Altro sulla sostenibilità',
              linkUrl: '/sustainability'
            },
            {
              q: 'Come funzionano i contratti per la pulizia uffici?',
              a: 'Offriamo accordi di servizio flessibili senza vincoli pluriennali, adatti alle vostre esigenze aziendali.'
            },
            {
              q: 'Cosa copre il servizio di pulizia di emergenza ed express?',
              a: 'Il nostro servizio d\'emergenza interviene per imprevisti come danni d\'acqua o sgomberi urgenti. Raggiungibili 24/7 via telefono e WhatsApp.'
            },
            {
              q: 'In quali lingue è disponibile il servizio clienti?',
              a: 'Il nostro fondatore e il team di supporto vi assistono in tedesco, inglese, spagnolo, francese, italiano e portoghese.'
            }
          ]
        };
      case 'es':
        return {
          title: 'Preguntas Frecuentes (FAQ)',
          subtitle: 'Respuestas a las preguntas clave sobre nuestros servicios de limpieza y condiciones.',
          items: [
            {
              q: '¿Cuánto cuesta una limpieza de fin de alquiler en el cantón de Schaffhausen?',
              a: 'Los precios varían según el tamaño del apartamento y número de estancias. Un piso de 2.5 habitaciones parte de aprox. CHF 590, uno de 3.5 habitaciones de aprox. CHF 780. Todos los precios incluyen productos, transporte y garantía de entrega.'
            },
            {
              q: '¿Qué ocurre si la inmobiliaria pone objeciones en la entrega del piso?',
              a: 'Si la administración inmobiliaria señala algún detalle en la entrega, se activa nuestra Garantía de Entrega. Nuestro equipo repasa inmediatamente las zonas afectadas sin coste adicional.'
            },
            {
              q: '¿En qué regiones opera Kraken PFM?',
              a: 'Nuestra zona principal abarca todo el cantón de Schaffhausen, la región de Winterthur y el área económica de Zúrich.'
            },
            {
              q: '¿Con cuánta antelación debo reservar una limpieza?',
              a: 'Recomendamos reservar con 1-2 semanas de antelación. Para mudanzas urgentes u emergencias, organizamos servicios en 24 a 48 horas según disponibilidad.'
            },
            {
              q: '¿El personal de limpieza está asegurado y contratado legalmente?',
              a: 'Sí, sin excepción. Todos los empleados están contratados, registrados en la seguridad social y cubiertos por nuestro seguro de responsabilidad civil.'
            },
            {
              q: '¿Tengo que estar presente en persona durante la limpieza?',
              a: 'No. Una entrega de llaves al inicio y al final de la entrega del inmueble es totalmente suficiente.'
            },
            {
              q: '¿Qué productos de limpieza y equipos trae el equipo?',
              a: 'Traemos todo el equipo profesional necesario (aspiradoras industriales, máquinas de vapor) y productos respetuosos con el medio ambiente.',
              hasLink: true,
              linkText: 'Más sobre sostenibilidad',
              linkUrl: '/sustainability'
            },
            {
              q: '¿Cómo funcionan los contratos de limpieza de oficinas?',
              a: 'Ofrecemos acuerdos de servicio flexibles sin contratos permanentes, adaptados totalmente a los horarios de su empresa.'
            },
            {
              q: '¿Qué cubre el servicio de limpieza urgente y exprés?',
              a: 'Atendemos imprevistos como fugas de agua, limpiezas post-eventos o vaciados urgentes. Disponibles 24/7 por teléfono y WhatsApp.'
            },
            {
              q: '¿En qué idiomas atienden el servicio de atención al cliente?',
              a: 'Nuestro fundador y el equipo de soporte atienden en alemán, inglés, español, francés, italiano y portugués para una comunicación fluida.'
            }
          ]
        };
      case 'pt':
        return {
          title: 'Perguntas Frequentes (FAQ)',
          subtitle: 'Respostas às principais dúvidas sobre os nossos serviços de limpeza e condições.',
          items: [
            {
              q: 'Quanto custa uma limpeza de fim de contrato no Cantão de Schaffhausen?',
              a: 'Os custos dependem da área e número de divisões. Um apartamento de 2.5 divisões começa a partir de aprox. CHF 590, um de 3.5 a partir de CHF 780. Inclui produtos, deslocação e garantia de entrega.'
            },
            {
              q: 'O que acontece se o apartamento for contestado na entrega?',
              a: 'Se a imobiliária assinalar algum ponto na entrega, a nossa Garantia de Entrega é ativada. A nossa equipa limpa de imediato as áreas afetadas sem custos adicionais.'
            },
            {
              q: 'Em que regiões opera a Kraken PFM?',
              a: 'A nossa área principal abrange todo o cantão de Schaffhausen, a região de Winterthur e a área económica de Zurique.'
            },
            {
              q: 'Com que antecedência posso agendar uma limpeza?',
              a: 'Recomendamos agendar com 1 a 2 semanas de antecedência. Para urgências, organizamos serviços em 24 a 48 horas conforme disponibilidade.'
            },
            {
              q: 'A equipa de limpeza está segurada e registada?',
              a: 'Sim, sem exceções. Todos os colaboradores estão contratados, inscritos na segurança social e cobertos pelo nosso seguro de responsabilidade civil.'
            },
            {
              q: 'Preciso de estar presente durante a limpeza?',
              a: 'Não. A entrega das chaves no início e na inspeção final é perfeitamente suficiente.'
            },
            {
              q: 'Que equipamentos e produtos de limpeza a equipa traz?',
              a: 'Trazemos todos os equipamentos profissionais e produtos ecológicos necessários. Saiba mais na nossa página de sustentabilidade.',
              hasLink: true,
              linkText: 'Saber mais sobre sustentabilidade',
              linkUrl: '/sustainability'
            },
            {
              q: 'Como funcionam os contratos de limpeza de escritórios?',
              a: 'Oferecemos acordos de serviço flexíveis sem contratos de fidelização longa, adaptados aos seus horários.'
            },
            {
              q: 'O que cobre o serviço de limpeza de urgência e expresso?',
              a: 'Atendemos imprevistos como fugas de água, eventos ou desocupações urgentes. Disponíveis 24/7 por telefone e WhatsApp.'
            },
            {
              q: 'Em que idiomas está disponível o apoio ao cliente?',
              a: 'O nosso fundador e a equipa prestam apoio em alemão, inglês, espanhol, francês, italiano e português.'
            }
          ]
        };
      case 'de':
      case 'de-CH':
      default:
        return {
          title: 'Häufige Fragen (FAQ)',
          subtitle: 'Antworten auf die wichtigsten Fragen rund um unsere Reinigungsservices und Konditionen.',
          items: [
            {
              q: 'Was kostet eine Umzugsreinigung im Kanton Schaffhausen?',
              a: 'Die Kosten richten sich nach Wohnungsgrösse und Raumanzahl. Eine 2.5-Zimmer-Wohnung startet ab ca. CHF 590, eine 3.5-Zimmer-Wohnung ab ca. CHF 780. Alle Preise beinhalten Reinigungsmittel, Anfahrt und die verbindliche Abgabegarantie (Preise ohne MwSt.).'
            },
            {
              q: 'Was passiert, wenn die Wohnung bei der Übergabe bemängelt wird?',
              a: 'Sollte die Liegenschaftsverwaltung bei der Wohnungsabnahme einzelne Stellen beanstanden, greift unsere Abgabetermin-Garantie. Unser Team reinigt die betreffenden Bereiche unverzüglich und ohne zusätzliche Kosten nach, bis das Übergabeprotokoll unterzeichnet ist.'
            },
            {
              q: 'In welchen Regionen führt Kraken PFM Reinigungen durch?',
              a: 'Unser Kerngebiet umfasst den gesamten Kanton Schaffhausen, die Region Winterthur sowie den Wirtschaftsraum Zürich. Dank unserer zentralen Logistik sichern wir in allen drei Regionen pünktliche Einsätze und faire Konditionen.'
            },
            {
              q: 'Wie kurzfristig kann ich einen Reinigungstermin buchen?',
              a: 'Standardmässig empfehlen wir eine Buchung 1–2 Wochen im Voraus. Bei dringenden Umzügen oder Notfällen organisieren wir Einsätze nach Verfügbarkeit auch innerhalb von 24 bis 48 Stunden.'
            },
            {
              q: 'Ist das Reinigungspersonal versichert und sozialrechtlich angemeldet?',
              a: 'Ja, ausnahmslos. Sämtliche Mitarbeiter sind fest angestellt, sozialversichert und über unsere Betriebshaftpflichtversicherung gegen allfällige Sachschäden abgesichert. Wir lehnen Schwarzarbeit strikt ab.'
            },
            {
              q: 'Muss ich während der Reinigung persönlich anwesend sein?',
              a: 'Nein. Eine Schlüsselübergabe zu Beginn und zur Abnahme reicht völlig aus. Sie können uns den Schlüssel vorab übergeben, per Schlüsseldepot bereitstellen oder persönlich vorbeibringen.'
            },
            {
              q: 'Welche Reinigungsmittel und Geräte bringt das Team mit?',
              a: 'Wir bringen alle erforderlichen Profi-Geräte (Industriesauger, Hochdruckreiniger, Dampfgeräte) sowie umweltschonende Reinigungsmittel komplett mit. Erfahren Sie mehr dazu auf unserer Nachhaltigkeitsseite.',
              hasLink: true,
              linkText: 'Mehr zur Nachhaltigkeit',
              linkUrl: '/sustainability'
            },
            {
              q: 'Wie funktionieren Verträge für die Unterhaltsreinigung von Büros?',
              a: 'Wir bieten flexible Servicevereinbarungen ohne Knebelverträge. Die Reinigungsintervalle (täglich, wöchentlich, monatlich) werden exakt an Ihren Betriebsablauf angepasst und sind mit kurzen Fristen anpassbar.'
            },
            {
              q: 'Was deckt der Notfall- und Express-Reinigungsservice ab?',
              a: 'Unser Notfalldienst hilft bei unvorhergesehenen Zwischenfällen wie Wasserschäden, Verschmutzungen nach Events oder dringenden Räumungen. Wir sind rund um die Uhr telefonisch und via WhatsApp erreichbar.'
            },
            {
              q: 'In welchen Sprachen kann der Kundenservice kontaktiert werden?',
              a: 'Unser Gründer und das Kundenserviceteam betreuen Sie mehrsprachig auf Deutsch, Englisch, Spanisch, Französisch und Italienisch für eine reibungslose Kommunikation.'
            }
          ]
        };
    }
  };

  const faqData = getFaqs();

  return (
    <section className="py-12 md:py-16 bg-white border-b border-slate-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#032B59] tracking-tight mb-3">
            {faqData.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {faqData.subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {faqData.items.map((item, idx) => (
            <details key={idx} className="group bg-slate-50 rounded-2xl border border-slate-200 p-5 font-sans text-slate-800 transition-all [&_summary::-webkit-details-marker]:hidden hover:border-blue-300">
              <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-[#032B59] cursor-pointer list-none select-none">
                <span>{item.q}</span>
                <span className="ml-2 text-blue-600 group-open:rotate-180 transition-transform font-bold text-lg">
                  ↓
                </span>
              </summary>
              <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/60 pt-3">
                <p>{item.a}</p>
                {item.hasLink && (
                  <p className="mt-2">
                    <a 
                      href={item.linkUrl} 
                      onClick={(e) => handleLinkClick(e, item.linkUrl)}
                      className="inline-flex items-center gap-1 text-xs sm:text-sm font-bold text-[#032B59] hover:text-blue-700 hover:underline cursor-pointer"
                    >
                      {item.linkText} →
                    </a>
                  </p>
                )}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

