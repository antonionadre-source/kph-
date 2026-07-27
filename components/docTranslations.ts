import { Language } from '../i18n';

export interface GDPRTranslation {
  title: string;
  badge: string;
  subtitle: string;
  introTitle: string;
  introP1: string;
  collectTitle: string;
  collectP1: string;
  collectItems: string[];
  basisTitle: string;
  basisP1: string;
  basisItems: string[];
  retentionTitle: string;
  retentionInfrastructure: string;
  retentionCollaboration: string;
  retentionDuration: string;
  retentionStorage: string;
  retentionSharing: string;
  retentionTime: string;
  rightsTitle: string;
  rightsP1: string;
  disclaimerTitle: string;
  estimatesTitle: string;
  estimatesP1: string;
  liabilityTitle: string;
  liabilityP1: string;
  ipTitle: string;
  ipP1: string;
  usageTitle: string;
  usageText: string;
  trademarksTitle: string;
  trademarksText: string;
  verificationTitle: string;
  lastUpdate: string;
}

export interface TermsTranslation {
  title: string;
  description: string;
  sections: { title: string; content: string }[];
  verificationTitle: string;
  lastUpdated: string;
  companyInfo: string;
  backHome: string;
}

export interface HSETranslation {
  title: string;
  intro: string;
  badge: string;
  sec1Title: string;
  sec1P1: string;
  uvgTitle: string;
  uvgText: string;
  vuvTitle: string;
  vuvText: string;
  vuvList: string[];
  ekasTitle: string;
  ekasText: string;
  sec2Title: string;
  sec2P1: string;
  sec2List: string[];
  isoTitle: string;
  isoText: string;
  sec3Title: string;
  sec3Intro: string;
  riskTitle: string;
  riskText: string;
  riskList: string[];
  ramsTitle: string;
  ramsText: string;
  ramsList: string[];
  sec4Title: string;
  sec4Intro: string;
  reqTitle: string;
  sec4List: string[];
  trainingTitle: string;
  trainingText: string;
  trainingList: string[];
  sec5Title: string;
  sec5Intro: string;
  sec5List: string[];
  tbtTitle: string;
  tbtText: string;
  tbtList: string[];
  modulesTitle: string;
  modulesText: string;
  modulesList: string[];
  sec6Title: string;
  envTitle: string;
  envText: string;
  envList: string[];
  wasteTitle: string;
  wasteText: string;
  wasteList: string[];
  co2Title: string;
  co2List: string[];
  sec7Title: string;
  sec7Intro: string;
  sec7List: string[];
  sec7Footer: string;
}

export interface CareersTranslation {
  title: string;
  subtitle: string;
  badge: string;
  positionsTitle: string;
  cleanerTitle: string;
  cleanerLocation: string;
  cleanerType: string;
  applyButton: string;
  formTitle: string;
  formName: string;
  formEmail: string;
  formPhone: string;
  formPosition: string;
  formCV: string;
  uploadPlaceholder: string;
  fileLimit: string;
  formMessage: string;
  formSubmit: string;
  formSubmitting: string;
  successTitle: string;
  successText: string;
  backButton: string;
  placeholderPositionName: string;
}

// English Dictionary
const enGDPR: GDPRTranslation = {
  title: 'Privacy Policy & GDPR/nFADP Compliance',
  badge: 'Swiss nFADP Compliant',
  subtitle: 'Compliance & Intellectual Property',
  introTitle: 'Introduction',
  introP1: 'At Kraken Properties and Facilities Management ("Kraken"), we take your privacy seriously. This policy explains how we process personal data in accordance with the Swiss Federal Act on Data Protection (nFADP) and the EU General Data Protection Regulation (GDPR).',
  collectTitle: 'Data We Collect & Purpose',
  collectP1: 'We collect data to provide professional property services. This includes:',
  collectItems: [
    'Identification Data: Name, address, email, and phone number (for service execution).',
    'Property Data: Photos, videos, and square footage (for accurate quoting and validation).',
    'Financial Data: We use PCI-DSS compliant third-party processors. Kraken does not store full credit card numbers.',
    'Technical Data: IP addresses and cookies (for website optimization).'
  ],
  basisTitle: 'Legal Basis for Processing',
  basisP1: 'We process your data based on:',
  basisItems: [
    'Contractual Necessity: To provide the quotes and services you requested.',
    'Legal Obligation: For tax and accounting purposes in Switzerland.',
    'Legitimate Interest: To improve our service quality and ensure property security.'
  ],
  retentionTitle: 'Data Retention & Third Parties',
  retentionInfrastructure: 'Infrastructure',
  retentionCollaboration: 'Collaboration',
  retentionDuration: 'Duration',
  retentionStorage: 'Storage: Data is stored on secure servers, prioritizing Swiss or European locations.',
  retentionSharing: 'Sharing: We only share data with Specialized Partners (e.g. licensed professionals) or cloud service providers. We never sell data.',
  retentionTime: 'Retention: We keep client data for the duration of the business relationship and for 10 years thereafter (Swiss statutory requirement for accounting).',
  rightsTitle: 'Your Rights',
  rightsP1: 'You have the right to access, correct, or delete your data. You may also withdraw consent for marketing at any time. To exercise these rights, contact kai@krakenpfm.ch.',
  disclaimerTitle: 'Legal Disclaimer & Intellectual Property',
  estimatesTitle: 'Accuracy of Estimates',
  estimatesP1: 'The "Smart Booking" calculator provides non-binding estimates. A binding contract is only formed upon written confirmation and/or the provision of media (photos/videos). Kraken reserves the right to adjust pricing based on actual on-site conditions.',
  liabilityTitle: 'Limitation of Liability',
  liabilityP1: 'While Kraken maintains a CHF 10 Million Liability Insurance, our digital liability is limited. We are not responsible for technical errors on the booking platform, damage caused by external links, or inaccurate information provided by the client.',
  ipTitle: 'Intellectual Property (IP)',
  ipP1: 'All content, including the Kraken mascot, logo, and "Smart Booking" logic, is the exclusive property of Kraken Properties and Facilities Management.',
  usageTitle: 'Usage Rights',
  usageText: 'You may not copy, reproduce, or "frame" our website content for commercial purposes without written consent.',
  trademarksTitle: 'Trademarks',
  trademarksText: 'The name "Kraken" and its associated visual brand are protected under Swiss Trademark Law.',
  verificationTitle: 'Kraken Verification',
  lastUpdate: 'Last Update: January 2025 | Seewadelstrasse 3, 8203 Schaffhausen'
};

const enTerms: TermsTranslation = {
  title: 'General Terms & Conditions (AGB)',
  description: 'These General Terms and Conditions govern all professional cleaning, moving, maintenance, and facility management services provided by Kraken Properties and Facilities Management.',
  sections: [
    {
      title: "1. Scope of Application & Definitions",
      content: "These T&Cs apply to all services provided by Kraken Properties and Facilities Management ('Kraken', 'we') to private clients ('Consumers') and business clients ('B2B Clients'), including end-of-tenancy, deep, and recurring cleaning, moving, detailing, gardening, exterior cleaning, pest control, and facility management. Deviating terms apply only if accepted in writing."
    },
    {
      title: "2. Offers, Estimates & Contract Conclusion",
      content: "Contracts are concluded when a client confirms an offer or booking. scope is defined in the booking confirmation. Estimates from our online calculator are preliminary. Incorrect info entitles Kraken to adjust pricing. Precision Media Quote involves a non-refundable CHF 15.00 review fee, fully credited against the final invoice upon acceptance. Express Binding Booking requires a 15% deposit."
    },
    {
      title: "3. Prices, VAT & Surcharges",
      content: "3.1 All prices are stated in Swiss Francs (CHF). Kraken is not currently registered in the VAT (MWST) register pursuant to Art. 10 MWSTG; therefore, prices do not include VAT and no VAT is invoiced. In the event of a future registration, prices will be adjusted in accordance with the law, subject to the notice period provided in clause 7.4. Extra work due to undisclosed conditions is billed at CHF 90.00/hour/person. Sundays/holidays incur a 50% surcharge; express bookings (<24h notice) incur a 25% surcharge. Third-party costs (landfills, parking) are invoiced at cost."
    },
    {
      title: "4. Travel Fees & Multi-Service Bundling",
      content: "A standard travel fee of CHF 45.00 applies per assignment. Bundling discount: CHF 25.00 if booking 1 main + 1 additional or 2+ additional services; CHF 0.00 (free travel) if booking 1 main + 2+ additional or 2+ main services."
    },
    {
      title: "5. Payment Terms & Default",
      content: "Payments are processed via secure Revolut Business links, bank transfer, or QR-bill. Balance is due within 7 days of invoice. Default interest of 5% p.a. applies, plus reminder fees of CHF 20.00 (2nd reminder) and CHF 50.00 (3rd reminder). Collection costs are borne by the client."
    },
    {
      title: "6. Cancellations, Rescheduling & No-Shows",
      content: "Cancellations must be in writing. Fees: >48 hours notice: free; <48 hours: 50% of price; <12 hours, no-show, or cancellation at door: 100% of price plus travel fee. One free rescheduling is permitted >24 hours prior, subject to availability."
    },
    {
      title: "7. Recurring Services, SLAs & Termination",
      content: "Recurring plans are indefinite. Termination: 30 days notice to end of month (7 days during 2-month trial). Skipping sessions requires 48 hours notice. B2B SLAs follow agreed SLA terms or 3 months notice. Price adjustments can occur once yearly with 60 days notice."
    },
    {
      title: "8. End-of-Tenancy Cleaning — Handover Guarantee",
      content: "Includes free rectification of landlord-identified cleaning deficiencies. Valid if: (a) notified in writing within 24h of inspection with protocol/photos; (b) inspection is within 72h of cleaning; (c) property remained unoccupied. Does not cover wear and tear, structural defects, or excluded items."
    },
    {
      title: "9. Moving & Transport Services",
      content: "Client must provide an accurate inventory. Excluded items (cash, jewelry, valuables, hazard substances, live plants/animals) are not liable. Kraken is liable for goods packed by itself. Content of client-packed boxes is excluded. Liability is limited to actual market value, max CHF 5,000.00 per event. Hidden damage must be reported within 3 days."
    },
    {
      title: "10. Car Detailing",
      content: "Pre-existing damage will be documented. Kraken is not liable for deterioration of worn, brittle, or improperly pre-treated materials. Client must remove personal valuables prior to service."
    },
    {
      title: "11. Gardening, Exterior, Façade & Gutter Cleaning",
      content: "Outdoor services are weather-dependent. Postponements due to weather or safety do not trigger default or cancellation fees. Client must disclose known hazards (fragile roofs, wasp nests). Green waste disposal is charged at cost unless included."
    },
    {
      title: "12. Pest Control — Warranty",
      content: "Includes a 30-day re-treatment warranty for treated species/areas. Conditional on following preparation and follow-up instructions. Does not cover re-infestation from neighbors or structural conditions client failed to remedy."
    },
    {
      title: "13. Waste Management",
      content: "Waste is disposed of compliant with Swiss environmental laws. Standard disposal fees are charged at cost. Undisclosed hazardous waste entitles Kraken to suspend work and bill additional safe handling costs."
    },
    {
      title: "14. Client Responsibilities, Access & Waiting Time",
      content: "Client must provide access, water, electricity, heating, and elevator. Failure to provide access is treated as a no-show cancellation. Access delays >15 minutes are billed at CHF 90.00/hour/person in 15-minute increments. Handed keys are stored anonymously and securely."
    },
    {
      title: "15. Complaints & Notification of Defects",
      content: "Inspect work on completion. Visible defects must be reported within 48h; hidden defects within 48h of discovery (max 7 days post-completion). Primary remedy is rectification. Proportionate invoice withholding is allowed only for affected parts."
    },
    {
      title: "16. Liability & Insurance",
      content: "Kraken maintains business liability insurance up to CHF 10 million. Kraken is liable only for direct damage from proven fault. Liability for indirect/consequential damage, lost profit, or loss of use is excluded. Lost key liability is limited to standard replacement cost."
    },
    {
      title: "17. Subcontractors, Specialized Partners & Right of Refusal",
      content: "Kraken may engage qualified third-party specialists but remains the sole contractual partner. Kraken reserves the right to refuse or terminate service if conditions pose safety or health risks."
    },
    {
      title: "18. Non-Solicitation of Staff",
      content: "Client shall not directly or indirectly employ Kraken staff deployed at their premises during the contract and for 6 months after. Breach triggers a CHF 5,000.00 compensation fee per employee."
    },
    {
      title: "19. Force Majeure",
      content: "Neither party is liable for delays or non-performance caused by events beyond reasonable control (natural disasters, strikes, pandemic, power failures). Obligations are suspended for the duration. If lasting >30 days, either party may withdraw."
    },
    {
      title: "20. Data Protection & Documentation",
      content: "We process personal data compliant with the Swiss Federal Act on Data Protection (revFADP) and GDPR. Before/after photos may be taken for quality control and insurance. Marketing use of photos requires prior consent."
    },
    {
      title: "21. Amendments & Severability",
      content: "Kraken may amend these T&Cs with 30 days notice. Non-objection constitutes acceptance. If any provision is invalid, the remaining provisions remain unaffected and are replaced with a valid clause closest to the economic purpose."
    },
    {
      title: "22. Governing Law & Jurisdiction",
      content: "All contracts are governed exclusively by Swiss substantive law, excluding CISG. Place of jurisdiction is Schaffhausen, Switzerland. Mandatory consumer places of jurisdiction remain reserved."
    }
  ],
  verificationTitle: 'Verification & Compliance',
  lastUpdated: 'Version 2.0 — Effective 16.07.26',
  companyInfo: 'Kraken Properties and Facilities Management Gomes Mendes | Seewadelstrasse 3, 8203 Schaffhausen, Switzerland',
  backHome: 'Back to Home'
};

const enHSE: HSETranslation = {
  title: 'Health, Safety & Environment (HSE)',
  intro: 'Our commitment to safety is uncompromising. We adhere to the strictest Swiss and international standards to ensure the well-being of our team, clients, and the environment.',
  badge: 'Swiss Precision, Global Standard',
  sec1Title: 'Swiss Legal Compliance',
  sec1P1: 'We operate in strict accordance with Swiss safety laws.',
  uvgTitle: 'UVG (Accident Insurance Act)',
  uvgText: 'Mandatory accident insurance coverage for all employees.',
  vuvTitle: 'VUV (Accident Prevention Ordinance)',
  vuvText: 'Detailed technical and organizational measures:',
  vuvList: ['Workplace safety', 'Equipment maintenance', 'Personal Protective Equipment', 'Safety signage'],
  ekasTitle: 'EKAS Guidelines',
  ekasText: 'Implementation of Federal Coordination Commission for Occupational Safety directives.',
  sec2Title: 'Suva & ISO Standards',
  sec2P1: 'We partner with Suva to implement best practices in occupational safety.',
  sec2List: [
    'Suva "Safety Charter" signatory',
    'ISO 45001 alignment (Occupational Health and Safety)',
    'ISO 14001 alignment (Environmental Management)'
  ],
  isoTitle: 'Integrated Management System',
  isoText: 'Our internal processes are modelled on ISO frameworks to ensure continuous improvement and audit readiness.',
  sec3Title: 'Risk Management',
  sec3Intro: 'Proactive identification and mitigation of hazards.',
  riskTitle: 'Risk Assessments',
  riskText: 'Conducted for every site and task type.',
  riskList: ['Slip, Trip, Fall hazards', 'Chemical handling risks', 'Ergonomic assessments', 'Electrical safety'],
  ramsTitle: 'RAMS (Risk Assessment & Method Statement)',
  ramsText: 'For complex projects, we produce detailed RAMS documents.',
  ramsList: ['Step-by-step safety procedures', 'Emergency protocols', 'Responsible persons'],
  sec4Title: 'Chemical Safety (COSHH / ChemV)',
  sec4Intro: 'Responsible handling of cleaning agents.',
  reqTitle: 'Requirements',
  sec4List: [
    'Compliance with ChemV (Chemicals Ordinance)',
    'Safety Data Sheets (SDS) available on site',
    'Proper labeling and storage',
    'Eco-friendly, non-toxic alternatives preferred'
  ],
  trainingTitle: 'Staff Training',
  trainingText: 'Regular training on chemical handling and spill response.',
  trainingList: ['Dosing instructions', 'Mixing prohibitions', 'First aid for exposure', 'Disposal protocols'],
  sec5Title: 'Instruction & Competence',
  sec5Intro: 'A well-trained team is a safe team.',
  sec5List: ['Onboarding Induction', 'Regular Refresher Courses', 'Specialized Equipment Training'],
  tbtTitle: 'Toolbox Talks (TBT)',
  tbtText: 'Short, focused safety briefings delivered regularly on site.',
  tbtList: ['Ladder safety', 'Manual handling', 'Electrical cord safety', 'Lone working'],
  modulesTitle: 'E-Learning Modules',
  modulesText: 'Digital training platform for core safety concepts.',
  modulesList: ['Fire safety awareness', 'Infection control', 'Waste management', 'Customer safety'],
  sec6Title: 'ESG & Environment',
  envTitle: 'Environmental Stewardship',
  envText: 'Minimizing our ecological footprint:',
  envList: [
    'Biodegradable cleaning agents',
    'Microfiber technology to reduce water use',
    'Energy-efficient equipment',
    'Electric vehicle fleet transition'
  ],
  wasteTitle: 'Waste Management',
  wasteText: 'Strict separation and recycling protocols:',
  wasteList: ['Recycling of plastic, paper, glass, metal', 'Safe disposal of hazardous waste', 'Reduction of single-use plastics'],
  co2Title: 'Carbon Neutrality',
  co2List: ['Tracking carbon emissions', 'Offsetting initiatives', 'Sustainable procurement policy'],
  sec7Title: 'Continuous Improvement',
  sec7Intro: 'Safety is a journey, not a destination. We continuously review and improve our HSE performance.',
  sec7List: ['Regular Safety Audits', 'Incident Reporting & Investigation', 'Feedback Loops'],
  sec7Footer: 'Our goal is Zero Harm. Everyone goes home safe, every day.'
};

const enCareers: CareersTranslation = {
  title: 'Join Our Team',
  subtitle: 'Build your future with Kraken Properties. We are always looking for dedicated professionals.',
  badge: 'Talent Acquisition',
  positionsTitle: 'Open Positions',
  cleanerTitle: 'Cleaning Specialist',
  cleanerLocation: 'Schaffhausen / Zurich',
  cleanerType: 'Part-time / Full-time',
  applyButton: 'Apply for this role →',
  formTitle: 'Apply Now',
  formName: 'Full Name',
  formEmail: 'Email Address',
  formPhone: 'Phone Number',
  formPosition: 'Position Applied For',
  formCV: 'Upload CV / Resume',
  uploadPlaceholder: 'Click to upload or drag and drop',
  fileLimit: 'PDF, DOC up to 5MB',
  formMessage: 'Cover Letter / Message',
  formSubmit: 'Submit Application',
  formSubmitting: 'Sending Pipeline...',
  successTitle: 'Application Received',
  successText: 'Thank you for your application! We will review your CV and get back to you soon.',
  backButton: 'Back to Home',
  placeholderPositionName: 'e.g. Cleaning Specialist'
};

// Spanish Dictionary
const esGDPR: GDPRTranslation = {
  title: 'Política de Privacidad y Cumplimiento de LPD/RGPD',
  badge: 'Cumple con la nLPD suiza',
  subtitle: 'Cumplimiento y Propiedad Intelectual',
  introTitle: 'Introducción',
  introP1: 'En Kraken Properties and Facilities Management ("Kraken"), nos tomamos muy en serio su privacidad. Esta política explica cómo procesamos los datos personales de acuerdo con la Ley Federal Suiza sobre Protección de Datos (nLPD) y el Reglamento General de Protección de Datos de la UE (RGPD).',
  collectTitle: 'Datos que recopilamos y su finalidad',
  collectP1: 'Recopilamos datos para proporcionar servicios inmobiliarios profesionales. Esto incluye:',
  collectItems: [
    'Datos de identificación: nombre, dirección, correo electrónico y número de teléfono (para ejecutar servicios).',
    'Datos de propiedad: fotos, videos y metros cuadrados (para presupuestos y validación precisos).',
    'Datos financieros: utilizamos procesadores de pago que cumplen con PCI-DSS. Kraken no almacena números de tarjeta de crédito.',
    'Datos técnicos: direcciones IP y cookies (para la optimización de la web).'
  ],
  basisTitle: 'Base jurídica del tratamiento',
  basisP1: 'Procesamos sus datos en función de:',
  basisItems: [
    'Necesidad contractual: para proporcionar los presupuestos y servicios que solicitó.',
    'Obligación legal: a efectos fiscales y contables en Suiza.',
    'Interés legítimo: para mejorar la calidad de nuestro servicio y garantizar la seguridad.'
  ],
  retentionTitle: 'Retención de datos y terceros',
  retentionInfrastructure: 'Infraestructura',
  retentionCollaboration: 'Colaboración',
  retentionDuration: 'Duración',
  retentionStorage: 'Almacenamiento: los datos se guardan en servidores seguros, priorizando ubicaciones suizas o europeas.',
  retentionSharing: 'Intercambio: solo compartimos datos con socios especializados o proveedores de servicios en la nube. Nunca vendemos datos.',
  retentionTime: 'Retención: conservamos los datos del cliente durante la relación comercial y durante los 10 años siguientes (requisito legal suizo de contabilidad).',
  rightsTitle: 'Sus derechos',
  rightsP1: 'Tiene derecho a acceder, corregir o eliminar sus datos personales. También puede retirar el consentimiento para publicidad en cualquier momento. Para ejercer estos derechos, contacte a kai@krakenpfm.ch.',
  disclaimerTitle: 'Descargo de responsabilidad legal y propiedad intelectual',
  estimatesTitle: 'Precisión de los presupuestos',
  estimatesP1: 'La calculadora de "Smart Booking" proporciona estimaciones no vinculantes. Un contrato vinculante solo se formaliza tras la confirmación por escrito y/o la provisión de archivos multimedia. Kraken se reserva el derecho de ajustar los precios en función de las condiciones reales del lugar.',
  liabilityTitle: 'Limitación de responsabilidad',
  liabilityP1: 'Aunque Kraken mantiene un seguro de responsabilidad civil por valor de 10 millones de CHF, nuestra responsabilidad digital está limitada. No somos responsables de los errores técnicos en la plataforma, daños por enlaces externos o datos incorrectos facilitados por el cliente.',
  ipTitle: 'Propiedad intelectual (PI)',
  ipP1: 'Todo el contenido, incluyendo la mascota Kraken, el logotipo y la lógica de "Smart Booking", es propiedad exclusiva de Kraken Properties and Facilities Management.',
  usageTitle: 'Derechos de uso',
  usageText: 'No puede copiar, reproducir ni reproducir mediante "marcos" el contenido de nuestro sitio web para fines comerciales sin consentimiento por escrito.',
  trademarksTitle: 'Marcas registradas',
  trademarksText: 'El nombre "Kraken" y su marca visual asociada están protegidos por la Ley Suiza de Marcas.',
  verificationTitle: 'Verificación de Kraken',
  lastUpdate: 'Última actualización: Enero 2025 | Seewadelstrasse 3, 8203 Schaffhausen'
};

const esTerms: TermsTranslation = {
  title: 'Condiciones Generales de Contratación (CGC)',
  description: 'Estas Condiciones Generales regulan todos los servicios profesionales de limpieza, mudanza, mantenimiento y gestión de instalaciones prestados por Kraken Properties and Facilities Management.',
  sections: [
    {
      title: "1. Ámbito de Aplicación y Definiciones",
      content: "Estas CGC se aplican a todos los servicios prestados por Kraken Properties and Facilities Management ('Kraken', 'nosotros') a clientes privados ('Consumidores') y corporativos ('Clientes B2B'), incluyendo limpieza de final de arrendamiento, profunda, recurrente, mudanza, detallado, jardinería, exterior, control de plagas y gestión de propiedades. Condiciones divergentes se aplican solo si se aceptan por escrito."
    },
    {
      title: "2. Ofertas, Estimaciones y Formalización del Contrato",
      content: "El contrato se formaliza al confirmar un presupuesto o reserva. Las estimaciones de la calculadora online son preliminares. Información incorrecta autoriza a Kraken a ajustar precios. La opción Precision Media Quote conlleva una tasa no reembolsable de 15,00 CHF por revisión técnica, reembolsable al 100% en la factura final en caso de aceptación. Reserva Express requiere un depósito del 15%."
    },
    {
      title: "3. Precios, IVA y Recargos",
      content: "3.1 Todos los precios se indican en francos suizos (CHF). Kraken no está actualmente inscrita en el registro del IVA (MWST) conforme al Art. 10 LIVA; por lo tanto, los precios no incluyen IVA y no se factura IVA. En caso de inscripción futura, los precios se ajustarán conforme a la ley con el preaviso previsto en la cláusula 7.4. Trabajo extra por condiciones no declaradas se cobrará a 90,00 CHF/hora/persona. Domingos/festivos conllevan recargo del 50%; reservas express (<24h de aviso), un 25%. Costes de terceros (vertedero, estacionamiento) se facturan al coste."
    },
    {
      title: "4. Tasas de Viaje y Paquetes Multiservicio",
      content: "Se aplica una tarifa estándar de viaje de 45,00 CHF por asignación. Descuento por paquete: 25,00 CHF si contrata 1 servicio principal + 1 adicional o 2+ adicionales; 0,00 CHF (gratis) si contrata 1 principal + 2+ adicionales o 2+ principales."
    },
    {
      title: "5. Condiciones de Pago y Mora",
      content: "Pagos vía enlaces de Revolut Business, transferencia o QR-bill. El saldo vence a los 7 días de la factura. Mora automática tras vencer plazo, con un interés anual del 5% y cargos por reclamación de 20,00 CHF (2ª reclamación) y 50,00 CHF (3ª reclamación). Costes de cobro a cargo del cliente."
    },
    {
      title: "6. Cancelaciones, Aplazamientos y No Presentación",
      content: "Cancelaciones por escrito. Tasas: >48 horas de antelación: gratis; <48 horas: 50% del importe; <12 horas, no presentación o cancelación en puerta: 100% del presupuesto más tarifa de viaje. Un aplazamiento gratuito es permitido >24 horas antes, según disponibilidad."
    },
    {
      title: "7. Servicios Recurrentes, SLAs y Rescisión",
      content: "Planes recurrentes de plazo indefinido. Rescisión: aviso de 30 días a fin de mes (7 días en periodo de prueba de 2 meses). Omitir sesiones requiere 48h de aviso. Contratos B2B con SLA se rigen por los términos pactados o aviso de 3 meses. Ajustes de precios anuales con aviso de 60 días."
    },
    {
      title: "8. Limpieza de Final de Arrendamiento — Garantía de Entrega",
      content: "Garantía de entrega (Wohnungsabgabe): subsanación gratuita de deficiencias. Válido si: (a) notificado por escrito en 24h tras inspección con protocolo/fotos; (b) inspección en 72h tras limpieza; (c) propiedad desocupada e inutilizada. No cubre daños estructurales, desgaste o áreas excluidas."
    },
    {
      title: "9. Servicios de Mudanza y Transporte",
      content: "El cliente debe dar un inventario preciso. Excluidos del transporte sin pacto escrito: efectivo, joyas, armas, químicos, plantas/animales. Kraken responde de bienes embalados por su personal; se excluye contenido de cajas embaladas por el cliente. Responsabilidad limitada al valor actual de mercado, máx 5.000,00 CHF por evento. Daños ocultos deben reportarse en 3 días."
    },
    {
      title: "10. Detallado de Vehículos (Car Detailing)",
      content: "Daños existentes documentados previamente. Kraken no es responsable de daños preexistentes o del desgaste de materiales viejos, quebradizos o previamente mal tratados. Retirar objetos personales antes del servicio."
    },
    {
      title: "11. Jardinería, Limpieza Exterior, de Fachadas y Canalones",
      content: "Servicios al aire libre dependen del clima. Aplazamientos por clima o seguridad no constituyen mora ni tasas. Informar peligros (techos frágiles, avispas). Retirada de residuos verdes se factura al coste salvo pacto."
    },
    {
      title: "12. Control de Plagas — Garantía",
      content: "Garantía de re-tratamiento de 30 días para especies y áreas tratadas. Sujeto a seguir instrucciones de preparación y seguimiento. Excluye reinfestación de vecinos o fallos estructurales no corregidos por el cliente."
    },
    {
      title: "13. Gestión de Residuos",
      content: "Eliminación conforme a leyes ambientales suizas. Tasas de eliminación se facturan al coste. Residuos peligrosos ocultos autorizan a Kraken a suspender el trabajo y cobrar costes extra por gestión conforme."
    },
    {
      title: "14. Responsabilidades del Cliente, Acceso y Tiempos de Espera",
      content: "Facilitar acceso, agua, electricidad, calefacción y ascensor. No dar acceso se penaliza al 100%. Retrasos >15 min facturados a 90,00 CHF/hora/persona en bloques de 15 min. Las llaves se guardan de forma segura y anónima."
    },
    {
      title: "15. Quejas y Notificación de Defectos",
      content: "Inspeccionar al finalizar. Defectos visibles en 48h; ocultos en 48h tras descubrimiento (máx 7 días post-servicio). Remedio primario es la rectificación. Retenciones parciales solo permitidas para la sección afectada."
    },
    {
      title: "16. Responsabilidad Civil y Seguros",
      content: "Seguro de responsabilidad civil de hasta 10 millones de CHF. Kraken responde solo de daños directos por culpa probada. Se excluyen daños indirectos, lucro cesante o pérdida de uso. Llaves perdidas limitadas al coste de copia estándar."
    },
    {
      title: "17. Subcontratistas, Socios Especializados y Derecho de Rechazo",
      content: "Kraken puede contratar terceros cualificados pero sigue siendo el único socio contractual. Kraken puede rechazar o suspender el servicio si hay riesgos de seguridad o salud."
    },
    {
      title: "18. No Solicitud de Personal",
      content: "El cliente no contratará personal de Kraken que trabaje en sus locales durante el contrato y 6 meses después. Incumplimiento conlleva indemnización de 5.000,00 CHF por empleado."
    },
    {
      title: "19. Fuerza Mayor",
      content: "Ninguna parte responde de retrasos o incumplimientos por causas fuera de control (desastres, huelgas, pandemias, fallos eléctricos). Obligaciones suspendidas; si dura >30 días, se puede rescindir."
    },
    {
      title: "20. Protección de Datos y Documentación",
      content: "Procesamiento de datos conforme a la Ley Suiza de Protección de Datos (revDSG) y el RGPD. Fotos de antes/después para control de calidad y seguros. Uso comercial de fotos requiere consentimiento previo."
    },
    {
      title: "21. Modificaciones y Divisibilidad",
      content: "Kraken puede modificar estas CGC con aviso de 30 días. No oponerse implica aceptación. Si una cláusula es inválida, el resto sigue vigente y la inválida se reemplaza por otra que cumpla el mismo fin económico."
    },
    {
      title: "22. Legislación Aplicable y Jurisdicción",
      content: "Todos los contratos se rigen por el derecho suizo, excluyendo la CISG. Fuero exclusivo en Schaffhausen, Suiza. Se reservan los fueros de consumo obligatorios."
    }
  ],
  verificationTitle: 'Verificación y Conformidad',
  lastUpdated: 'Versión 2.0 — Entrada en vigor: 16.07.26',
  companyInfo: 'Kraken Properties and Facilities Management Gomes Mendes | Seewadelstrasse 3, 8203 Schaffhausen, Suiza',
  backHome: 'Volver al Inicio'
};

const esHSE: HSETranslation = {
  title: 'Seguridad, Salud y Medio Ambiente (HSE)',
  intro: 'Nuestro compromiso con la seguridad es absoluto. Nos adherimos a las normas más estrictas, tanto suizas como internacionales, para garantizar el bienestar de nuestro equipo, de los clientes y del medio ambiente.',
  badge: 'Precisión Suiza, Estándar Global',
  sec1Title: 'Cumplimiento de la legislación suiza',
  sec1P1: 'Trabajamos en estricta conformidad con las leyes de seguridad suizas.',
  uvgTitle: 'UVG (Ley de seguro de accidentes)',
  uvgText: 'Cobertura del seguro de accidentes obligatorio para todos los trabajadores.',
  vuvTitle: 'VUV (Ordenanza sobre prevención de accidentes)',
  vuvText: 'Medidas organizativas y técnicas detalladas:',
  vuvList: ['Seguridad en el puesto de trabajo', 'Mantenimiento de maquinaria y equipos', 'Equipos de Protección Individual (EPI)', 'Señalización de seguridad'],
  ekasTitle: 'Directrices de EKAS',
  ekasText: 'Aplicación de las directivas de la Comisión Federal de Coordinación para la Seguridad en el Trabajo.',
  sec2Title: 'Normativas Suva e ISO',
  sec2P1: 'Trabajamos en colaboración con Suva para aplicar las mejores prácticas sobre prevención de riesgos laborales.',
  sec2List: [
    'Signatario del "Charter de Seguridad" de Suva',
    'Alineación de nuestros procesos con ISO 45001 (Salud y Seguridad en el Trabajo)',
    'Alineación de nuestros procesos con ISO 14001 (Gestión Ambiental)'
  ],
  isoTitle: 'Sistema de Gestión Integrada',
  isoText: 'Nuestros procesos internos están estructurados sobre los marcos de trabajo de las normas ISO para garantizar la mejora continua.',
  sec3Title: 'Gestión de Riesgos',
  sec3Intro: 'Identificación activa y mitigación sistemática de los peligros.',
  riskTitle: 'Evaluación de Riesgos',
  riskText: 'Evaluación realizada para cada cliente y tipo de tarea.',
  riskList: ['Riesgos de resbalones, tropiezos y caídas', 'Riesgos en el uso de productos químicos', 'Evaluación ergonómica', 'Seguridad en instalaciones eléctricas'],
  ramsTitle: 'RAMS (Evaluaciones de Riesgo y Declaración de Métodos)',
  ramsText: 'Para proyectos de alta complejidad, redactamos informes técnicos RAMS exhaustivos.',
  ramsList: ['Instrucciones de seguridad paso a paso', 'Protocolos para situaciones de emergencia', 'Responsables del proyecto'],
  sec4Title: 'Seguridad Química (MSDS / ChemV)',
  sec4Intro: 'Uso y almacenamiento seguro y responsable de productos químicos y de limpieza.',
  reqTitle: 'Requisitos obligatorios',
  sec4List: [
    'Cumplimiento con ChemV (Ordenanza sobre productos químicos)',
    'Fichas de Datos de Seguridad (FDS/SDS) accesibles sobre el terreno',
    'Etiquetado sistemático y almacenamiento seguro',
    'Priorización de productos ecológicos y biodegradables'
  ],
  trainingTitle: 'Capacitación del personal',
  trainingText: 'Formación continua y simulacros sobre manipulación segura y derrames accidentales.',
  trainingList: ['Dosificación reglamentaria', 'Prohibición estricta de mezclas no autorizadas', 'Primeros auxilios ante contacto químico accidental', 'Protocolos ecológicos de eliminación de residuos'],
  sec5Title: 'Formación y Competencia profesional',
  sec5Intro: 'Un equipo correctamente cualificado y capacitado garantiza un servicio seguro.',
  sec5List: ['Formación de integración al incorporarse', 'Cursos de reciclaje periódicos', 'Formación de manejo para maquinaria especializada'],
  tbtTitle: 'Charlas de Seguridad (Toolbox Talks)',
  tbtText: 'Sesiones de repaso breves y directas sobre prevención impartidas regularmente.',
  tbtList: ['Seguridad en uso de escaleras de mano', 'Ergonomía de manipulación de cargas', 'Seguridad en cableado eléctrico', 'Procedimientos para trabajos aislados'],
  modulesTitle: 'Plataforma de Formación Digital',
  modulesText: 'Material didáctico e-learning interactivo para el personal.',
  modulesList: ['Prevención contra incendios', 'Control de agentes infecciosos', 'Clasificación sostenible de residuos', 'Seguridad en la interacción con usuarios'],
  sec6Title: 'Criterios ESG y Sostenibilidad',
  envTitle: 'Responsabilidad Ambiental',
  envText: 'Reducción sistemática de la huella de carbono y el impacto ecológico:',
  envList: [
    'Uso de agentes de limpieza con certificación ecológica',
    'Tecnología de microfibra avanzada para optimizar el agua consumida',
    'Maquinaria certificada de alta eficiencia energética',
    'Transición gradual hacia una flota de vehículos corporativos eléctricos'
  ],
  wasteTitle: 'Gestión Sostenible de Residuos',
  wasteText: 'Protocolo estricto de separación de basuras y reciclaje:',
  wasteList: ['Clasificación de plástico, cartón, vidrio y metales', 'Retirada de componentes químicos peligrosos', 'Eliminación progresiva del plástico de un solo uso'],
  co2Title: 'Compromiso de Neutralidad Climática',
  co2List: ['Seguimiento del nivel de emisiones generadas', 'Medidas activas de compensación de gases nocivos', 'Política de compras sostenible'],
  sec7Title: 'Mejora continua en prevención',
  sec7Intro: 'El cuidado del personal y el entorno es un proceso en constante evolución. Evaluamos y optimizamos nuestras políticas continuamente.',
  sec7List: ['Auditorías de prevención presenciales', 'Registro concienzudo de incidencias y análisis exhaustivo', 'Canales de comunicación y propuesta activos'],
  sec7Footer: 'Nuestra meta es Cero Incidentes. Que todo el mundo regrese sano y salvo a casa cada día.'
};

const esCareers: CareersTranslation = {
  title: 'Únase a Nuestro Equipo',
  subtitle: 'Construya su futuro profesional junto a Kraken Properties. Siempre buscamos a especialistas con vocación técnica.',
  badge: 'Adquisición de Talento',
  positionsTitle: 'Puestos Vacantes',
  cleanerTitle: 'Especialista en Limpieza Técnica',
  cleanerLocation: 'Schaffhausen / Zúrich',
  cleanerType: 'Tiempo Parcial / Tiempo Completo',
  applyButton: 'Postular para esta vacante →',
  formTitle: 'Presentar Candidatura',
  formName: 'Nombre Completo',
  formEmail: 'Correo Electrónico',
  formPhone: 'Número de Teléfono',
  formPosition: 'Puesto de Interés',
  formCV: 'Enviar Currículum (CV / Hoja de Vida)',
  uploadPlaceholder: 'Arrastre su archivo aquí o haga clic para cargarlo',
  fileLimit: 'Formatos PDF, DOC de hasta 5 MB',
  formMessage: 'Carta de motivación / Comentarios',
  formSubmit: 'Enviar Postulación',
  formSubmitting: 'Tramitando datos...',
  successTitle: 'Candidatura Tramitada',
  successText: '¡Agradecemos mucho su interés! Analizaremos sus datos y la documentación aportada y contactaremos con usted.',
  backButton: 'Volver a la Página Principal',
  placeholderPositionName: 'ej. Especialista en Limpieza'
};

// German & Swiss German
const deGDPR: GDPRTranslation = {
  title: 'Datenschutzerklärung & DSG/DSGVO-Konformität',
  badge: 'Schweizer DSG-konform',
  subtitle: 'Konformität & Geistiges Eigentum',
  introTitle: 'Einleitung',
  introP1: 'Bei Kraken Properties and Facilities Management ("Kraken") nehmen wir Ihre Privatsphäre sehr ernst. Diese Erklärung erläutert, wie wir personenbezogene Daten gemäss dem Bundesgesetz über den Datenschutz (DSG) sowie der EU-Datenschutz-Grundverordnung (DSGVO) verarbeiten.',
  collectTitle: 'Erhobene Daten & Verwendungszweck',
  collectP1: 'Wir erheben Daten ausschliesslich zur Erbringung erstklassiger Immobiliendienstleistungen. Dies umfasst:',
  collectItems: [
    'Identifikationsdaten: Name, Postanschrift, E-Mail-Adresse und Telefonnummer (zur Auftragsabwicklung).',
    'Objektdaten: Fotos, Grundrisse und Quadratmeterangaben (für präzise Offerten und Prüfung).',
    'Finanzdaten: Wir nutzen PCI-DSS-konforme Zahlungsdienstleister. Kraken speichert keine Kreditkartennummern auf eigenen Servern.',
    'Technische Nutzungsdaten: IP-Adressen und Cookies (zur Optimierung und Sicherheit der Website).'
  ],
  basisTitle: 'Rechtsgrundlage der Verarbeitung',
  basisP1: 'Die Datenverarbeitung erfolgt gestützt auf:',
  basisItems: [
    'Vertragserfüllung: Zur Bereitstellung der von Ihnen angeforderten Kalkulationen und Services.',
    'Gesetzliche Pflichten: Zur Einhaltung von Steuer- und Buchführungsvorschriften in der Schweiz.',
    'Berechtigtes Interesse: Zur kontinuierlichen Qualitätsverbesserung und Gewährleistung der Objektsicherheit.'
  ],
  retentionTitle: 'Datensicherung & Weitergabe an Dritte',
  retentionInfrastructure: 'Infrastruktur',
  retentionCollaboration: 'Zusammenarbeit',
  retentionDuration: 'Dauer',
  retentionStorage: 'Speicherung: Daten werden auf hochsicheren Servern mit bevorzugtem Standort Schweiz oder Europa gespeichert.',
  retentionSharing: 'Weitergabe: Daten fliessen ausschliesslich an verifizierte Partner (z. B. lizensierte Handwerker) oder Hosting-Provider. Ein Verkauf Ihrer Daten findet niemals statt.',
  retentionTime: 'Aufbewahrungsfrist: Kundendaten werden für die Dauer des Mandats sowie gemäss gesetzlicher Aufbewahrungspflichten für 10 Jahre gesichert (gemäss Schweizer Obligationenrecht).',
  rightsTitle: 'Ihre Rechte',
  rightsP1: 'Sie haben das Recht auf Auskunft, Berichtigung oder Löschung Ihrer Daten. Sie können Werbe-Einwilligungen jederzeit widerrufen. Verwenden Sie hierfür die E-Mail kai@krakenpfm.ch.',
  disclaimerTitle: 'Rechtliche Hinweise & Geistiges Eigentum',
  estimatesTitle: 'Richtigkeit von Schätzungen',
  estimatesP1: 'Der "Smart Booking" Rechner liefert unverbindliche Richtpreise. Ein verbindlicher Vertrag kommt erst durch schriftliche Bestätigung und/oder die Sichtung von Bildmaterial des Objekts zustande. Kraken behält sich das Recht vor, Preise bei abweichenden Bedingungen vor Ort anzupassen.',
  liabilityTitle: 'Haftungsbeschränkung',
  liabilityP1: 'Kraken unterhält eine Betriebshaftpflichtversicherung über CHF 10 Millionen. Die digitale Haftung für Online-Tools ist im gesetzlich zulässigen Rahmen ausgeschlossen. Wir haften nicht für technische Unterbrüche der Plattform oder Falschangaben des Nutzers.',
  ipTitle: 'Geistiges Eigentum (IP)',
  ipP1: 'Alle Inhalte, inklusive das Kraken-Maskottchen, die Bildmarke und die Berechnungslogik des "Smart Booking", sind geistiges Eigentum von Kraken Properties and Facilities Management.',
  usageTitle: 'Nutzungsrechte',
  usageText: 'Inhalte dürfen ohne ausdrückliche schriftliche Genehmigung von Kraken weder kopiert, vervielfältigt noch mittels "Frames" auf Drittplattformen eingebunden werden.',
  trademarksTitle: 'Markenschutz',
  trademarksText: 'Die Marke "Kraken" und zugehörige Logos sind nach Schweizer Markenrecht geschützt.',
  verificationTitle: 'Zertifizierung & Prüfung',
  lastUpdate: 'Letzte Aktualisierung: Januar 2025 | Seewadelstrasse 3, 8203 Schaffhausen'
};

const deTerms: TermsTranslation = {
  title: 'Allgemeine Geschäftsbedingungen (AGB)',
  description: 'Diese Allgemeinen Geschäftsbedingungen regeln alle professionellen Reinigungs-, Umzugs-, Unterhalts- und Facility-Management-Dienstleistungen von Kraken Properties and Facilities Management.',
  sections: [
    {
      title: "1. Geltungsbereich & Definitionen",
      content: "Diese Allgemeinen Geschäftsbedingungen ('AGB') gelten für alle Dienstleistungen von Kraken Properties and Facilities Management ('Kraken', 'wir') an Privatkunden ('Konsumenten') und Geschäftskunden ('B2B-Kunden'), einschliesslich Umzugs-, Tiefen- und regelmässigen Reinigungen, Umzügen, Fahrzeugaufbereitungen, Gartenpflege, Aussenreinigungen, Schädlingsbekämpfung und Facility Management. Abweichende Bedingungen gelten nur bei schriftlicher Akzeptanz."
    },
    {
      title: "2. Angebote, Schätzungen & Vertragsabschluss",
      content: "Ein Vertrag kommt durch die Bestätigung einer Offerte oder Online-Buchung zustande. Der Leistungsumfang definiert sich über die Buchungsbestätigung. Schätzungen des Online-Rechners sind unverbindlich. Unrichtige Angaben berechtigen Kraken zu Preisanpassungen. Die 'Precision Media Quote' beinhaltet eine nicht rückerstattbare Prüfgebühr von CHF 15.00 für Bildmaterial, die bei Annahme zu 100% gutgeschrieben wird. Express-Buchungen erfordern 15% Anzahlung."
    },
    {
      title: "3. Preise, MwSt. & Zuschläge",
      content: "3.1 Alle Preise verstehen sich in Schweizer Franken (CHF). Kraken ist derzeit nicht im MWST-Register gemäss Art. 10 MWSTG eingetragen; daher verstehen sich die Preise ohne MWST und es wird keine MWST in Rechnung gestellt. Im Falle einer zukünftigen Eintragung werden die Preise gesetzeskonform mit der in Ziffer 7.4 vorgesehenen Frist angepasst. Mehraufwand durch unvollständige Angaben wird mit CHF 90.00/Stunde/Person berechnet. Sonntags- und Feiertagsarbeit unterliegt 50% Zuschlag; Express-Buchungen (<24h Frist) 25% Zuschlag. Drittkosten (Entsorgung, Parken) werden zum Einstandspreis berechnet."
    },
    {
      title: "4. Fahrkosten & Kombi-Rabatt (Bundling)",
      content: "Es gilt eine Standard-Anfahrtspauschale von CHF 45.00 pro Auftrag. Kombi-Rabatt: CHF 25.00 bei Buchung von 1 Hauptdienst + 1 Zusatzdienst oder 2+ Zusatzdiensten; CHF 0.00 (kostenlose Anfahrt) bei Buchung von 1 Hauptdienst + 2+ Zusatzdiensten oder 2+ Hauptdiensten."
    },
    {
      title: "5. Zahlungsbedingungen & Verzug",
      content: "Zahlungen erfolgen über Revolut Business Links, Banküberweisung oder QR-Rechnung. Der Restbetrag ist innert 7 Tagen fällig. Bei Zahlungsverzug fallen 5% Verzugszins sowie Mahngebühren von CHF 20.00 (2. Mahnung) und CHF 50.00 (3. Mahnung) an. Inkassokosten gehen zu Lasten des Kunden."
    },
    {
      title: "6. Stornierungen, Terminverschiebungen & Nichterscheinen",
      content: "Stornierungen müssen schriftlich erfolgen. Gebühren: >48h vor Start: kostenlos; <48h: 50% des Preises; <12h, Nichterscheinen oder Absage vor Ort: 100% des Preises zuzüglich Anfahrtspauschale. Eine kostenlose Verschiebung ist >24h vor Start nach Verfügbarkeit zulässig."
    },
    {
      title: "7. Wiederkehrende Dienstleistungen, SLAs & Kündigung",
      content: "Wiederkehrende Pläne laufen auf unbestimmte Zeit. Kündigung: 30 Tage auf Monatsende (7 Tage während der 2-monatigen Probezeit). Terminausfälle erfordern 48h Frist. B2B-SLAs richten sich nach vertraglichen Fristen oder 3 Monaten Kündigungsfrist. Jährliche Preisanpassungen sind mit 60 Tagen Vorankündigung möglich."
    },
    {
      title: "8. Umzugsreinigung — Abnahmegarantie",
      content: "Beinhaltet kostenlose Mängelbehebung bei offizieller Wohnungsübergabe (Abgabeprotokoll). Gültig, wenn: (a) Kraken innert 24h schriftlich mit Protokoll/Fotos benachrichtigt wird; (b) Übergabe innert 72h nach Reinigung stattfindet; (c) Objekt unbewohnt und ungenutzt blieb. Normaler Verschleiss, Schäden oder ausgeschlossene Bereiche sind nicht gedeckt."
    },
    {
      title: "9. Umzugs- & Transportdienstleistungen",
      content: "Der Kunde muss ein genaues Inventar bereitstellen. Bargeld, Schmuck, Gefahrstoffe sowie Pflanzen/Tiere sind vom Transport ohne schriftliche Vereinbarung ausgeschlossen. Kraken haftet für selbst verpackte Güter; für selbst gepackte Kartons des Kunden ist die Haftung ausgeschlossen. Haftung begrenzt auf Zeitwert, max. CHF 5'000.00 pro Ereignis. Verdeckte Schäden sind innert 3 Tagen zu melden."
    },
    {
      title: "10. Fahrzeugaufbereitung (Car Detailing)",
      content: "Vorhandene Schäden werden dokumentiert. Kraken haftet nicht für Vorschäden oder Verschlechterungen an bereits abgenutzten, spröden oder unsachgemäss vorbehandelten Materialien. Wertsachen sind vor dem Service aus dem Fahrzeug zu entfernen."
    },
    {
      title: "11. Garten-, Aussen-, Fassaden- & Dachrinnenreinigung",
      content: "Aussendienste sind witterungsabhängig. Wetter- oder sicherheitsbedingte Verschiebungen begründen keinen Verzug und keine Gebühren. Der Kunde muss Gefahren (zerbrechliche Dächer, Wespennester) melden. Grüngutentsorgung wird zum Einstandspreis berechnet."
    },
    {
      title: "12. Schädlingsbekämpfung — Garantie",
      content: "Beinhaltet 30 Tage Nachbehandlungsgarantie für behandelte Schädlingsarten und Bereiche. Bedingung ist die Einhaltung der Vorbereitungs- und Nachsorgeanweisungen. Ausgeschlossen sind Wiederbefall aus Nachbarquellen oder nicht behobene bauliche Mängel."
    },
    {
      title: "13. Entsorgungsmanagement (Waste Management)",
      content: "Entsorgung erfolgt gemäss Schweizer Umweltrecht. Deponie- und Recyclinggebühren werden zum Einstandspreis berechnet. Nicht deklarierte Gefahrstoffe berechtigen Kraken zur Arbeitseinstellung und Verrechnung von Zusatzkosten für fachgerechte Entsorgung."
    },
    {
      title: "14. Pflichten des Kunden, Zugang & Wartezeiten",
      content: "Der Kunde hat ungehinderten Zugang, Strom, fliessend Wasser, Heizung und Aufzug zu gewährleisten. Fehlender Zugang wird mit 100% verrechnet. Wartezeiten von >15 Minuten werden mit CHF 90.00/Stunde/Person in 15-Minuten-Schritten berechnet. Schlüssel werden sicher und anonymisiert aufbewahrt."
    },
    {
      title: "15. Mängelrügen & Reklamationen",
      content: "Arbeiten sind sofort nach Abschluss zu prüfen. Sichtbare Mängel innerhalb von 48h rügen; verdeckte Mängel innert 48h nach Entdeckung (max. 7 Tage nach Abschluss). Primäres Recht ist Nachbesserung. Rechnungsrückbehalte sind nur anteilig für betroffene Teile zulässig."
    },
    {
      title: "16. Haftung & Versicherung",
      content: "Betriebshaftpflichtversicherung mit Deckung von CHF 10 Millionen. Kraken haftet nur für direkte Schäden durch nachweisbares Verschulden. Die Haftung für indirekte Schäden, entgangenen Gewinn oder Nutzungsausfall ist ausgeschlossen. Schlüsselverlusthaftung ist auf Standard-Ersatzkosten begrenzt."
    },
    {
      title: "17. Subunternehmer, spezialisierte Partner & Ablehnungsrecht",
      content: "Kraken kann qualifizierte Drittspezialisten beiziehen, bleibt jedoch alleiniger Vertragspartner. Kraken behält sich das Recht vor, Arbeiten abzulehnen oder einzustellen, wenn vor Ort unzumutbare Sicherheits- oder Gesundheitsrisiken bestehen."
    },
    {
      title: "18. Abwerbeverbot",
      content: "Der Kunde darf Mitarbeitende von Kraken während der Vertragslaufzeit und für 6 Monate danach weder direkt noch indirekt anstellen. Ein Verstoss zieht eine Konventionalstrafe von CHF 5'000.00 pro Mitarbeitendem nach sich."
    },
    {
      title: "19. Höhere Gewalt (Force Majeure)",
      content: "Keine Partei haftet für Verzögerungen oder Nichterfüllung aufgrund von Ereignissen ausserhalb zumutbarer Kontrolle (Naturkatastrophen, Streiks, Pandemien, Infrastrukturausfälle). Die Pflichten ruhen; dauert das Ereignis >30 Tage, können beide Parteien zurücktreten."
    },
    {
      title: "20. Datenschutz & Dokumentation",
      content: "Datenverarbeitung erfolgt gemäss dem Schweizer Datenschutzgesetz (DSG) und der DSGVO. Vorher-/Nachher-Fotos können zur Qualitätskontrolle und Versicherung erstellt werden. Die werbliche Nutzung von Fotos erfordert die vorherige Zustimmung."
    },
    {
      title: "21. Änderungen & Salvatorische Klausel",
      content: "Kraken kann diese AGB mit einer Frist von 30 Tagen ändern. Nicht-Widerspruch gilt als Genehmigung. Sollte eine Bestimmung ungültig sein, bleibt die Gültigkeit der übrigen unberührt; die ungültige wird durch eine dem wirtschaftlichen Zweck am nächsten kommende ersetzt."
    },
    {
      title: "22. Anwendbares Recht & Gerichtsstand",
      content: "Alle Verträge unterliegen ausschliesslich materiellem Schweizer Recht unter Ausschluss des UN-Kaufrechts (CISG). Gerichtsstand ist Schaffhausen, Schweiz. Zwingende gesetzliche Konsumentengerichtsstände bleiben vorbehalten."
    }
  ],
  verificationTitle: 'Konformität & Compliance',
  lastUpdated: 'Version 2.0 — Gültig ab 16.07.26',
  companyInfo: 'Kraken Properties and Facilities Management Gomes Mendes | Seewadelstrasse 3, 8203 Schaffhausen, Schweiz',
  backHome: 'Zurück zur Startseite'
};

const deHSE: HSETranslation = {
  title: 'Arbeitssicherheit, Gesundheitsschutz & Umwelt (HSE)',
  intro: 'Unser Engagement für Sicherheit und Gesundheitsschutz ist kompromisslos. Wir befolgen strengste Schweizer Standards sowie internationale Richtlinien zum Schutz von Mitarbeitenden und Kunden.',
  badge: 'Schweizer Präzision, Globaler Standard',
  sec1Title: 'Schweizer Gesetzeskonformität',
  sec1P1: 'Unsere betrieblichen Abläufe entsprechen vollumfänglich den gesetzlichen Schweizer Vorschriften.',
  uvgTitle: 'UVG (Unfallversicherungsgesetz)',
  uvgText: 'Obligatorischer Unfallversicherungsschutz für all unsere Mitarbeitenden.',
  vuvTitle: 'VUV (Verordnung über die Unfallverhütung)',
  vuvText: 'Konsequente technische und organisatorische Unfallverhütung:',
  vuvList: ['Sichere Arbeitsplätze', 'Regelmässiger Unterhalt von Maschinen', 'Bereitstellung von PSA (Persönliche Schutzausrüstung)', 'Korrekte Sicherheitskennzeichnung'],
  ekasTitle: 'EKAS-Richtlinien',
  ekasText: 'Sorgfältige Umsetzung aller Vorgaben der Eidgenössischen Koordinationskommission für Arbeitssicherheit.',
  sec2Title: 'Suva & ISO-Standards',
  sec2P1: 'Wir stehen im stetigen Austausch mit der Suva zur Umsetzung bewährter Best-Practice-Methoden.',
  sec2List: [
    'Unterzeichner der Suva "Sicherheits-Charta"',
    'Ausrichtung an ISO 45001 (Arbeitssicherheit & Gesundheitsschutz)',
    'Ausrichtung an ISO 14001 (Umweltmanagement)'
  ],
  isoTitle: 'Integriertes Managementsystem',
  isoText: 'Unsere definierten Prozesse orientieren sich an ISO-Standards für kontinuierliche interne Audits.',
  sec3Title: 'Risikomanagement',
  sec3Intro: 'Präventive Erkennung und sofortige Behebung von Sicherheitsrisiken.',
  riskTitle: 'Gefährdungsbeurteilung',
  riskText: 'Risikoanalyse wird für jedes einzelne Objekt und jede Aufgabe erstellt.',
  riskList: ['Sturz-, Rutsch- und Stolpergefahren', 'Richtiger Umgang mit Gefahrstoffen', 'Ergonomisches Arbeiten', 'Elektrische Anlagensicherheit'],
  ramsTitle: 'RAMS (Gefährdungsanalyse & Arbeitsmethode)',
  ramsText: 'Für anspruchsvolle Projekte erstellen wir detaillierte RAMS-Dokumente.',
  ramsList: ['Detaillierter Sicherheitsablauf', 'Notfall- und Erste-Hilfe-Protokolle', 'Designierte Sicherheitsverantwortliche'],
  sec4Title: 'Umgang mit Chemikalien (ChemV / COSHH)',
  sec4Intro: 'Verantwortungsvoller Umgang mit Reinigungsmitteln.',
  reqTitle: 'Vorgaben',
  sec4List: [
    'Einhaltung der Schweizer Chemikalienverordnung (ChemV)',
    'Sicherheitsdatenblätter (SDB) vor Ort jederzeit griffbereit',
    'Klare Etikettierung und sichere, verschlossene Lagerung',
    'Bevorzugung von ökologischen, biologisch abbaubaren Zusätzen'
  ],
  trainingTitle: 'Mitarbeiter-Schulung',
  trainingText: 'Regelmässige Weiterbildungen im Gefahrstoffbereich und Notfallverhalten.',
  trainingList: ['Exakte Dosierungsanweisungen', 'Striktes Verbot von gefährlichen Produktmischungen', 'Erste Hilfe bei versehentlichem Schleimhautkontakt', 'Fachgerechte, umweltschonende Entsorgung'],
  sec5Title: 'Instruktion & Fachkompetenz',
  sec5Intro: 'Ein exzellent geschultes Team garantiert unfallfreie Abläufe.',
  sec5List: ['Umfangreiche Einführung neuer Angestellter', 'Regelmässige interne Auffrischungskurse', 'Ausbildung an Spezialmaschinen'],
  tbtTitle: 'Kurzschulungen vor Ort (Toolbox Talks)',
  tbtText: 'Fokussierte und regelmässige Sicherheitsbelehrungen direkt auf der Baustelle.',
  tbtList: ['Sicherer Stand auf Leitern', 'Rückenschonendes Heben', 'Sichtprüfung von Elektrokabeln', 'Verhaltensregeln bei Alleinarbeit'],
  modulesTitle: 'Digitales Schulungsportal',
  modulesText: 'E-Learning-Kurse für das gesamte Personal.',
  modulesList: ['Betrieblicher Brandschutz', 'Hygiene- und Infektionsschutz', 'Nachhaltige Abfalltrennung', 'Deeskalation und Kundensicherheit'],
  sec6Title: 'ESG & Umweltschutz',
  envTitle: 'Ökologische Verantwortung',
  envText: 'Minimierung unseres CO2-Fussabdrucks:',
  envList: [
    'Biologische, zertifizierte Reinigungskonzentrate',
    'Einsatz modernster Mikrofaser-Technologie zur Wassereinsparung',
    'Energieeffiziente Reinigungsgeräte',
    'Kontinuierliche Umstellung der Fahrzeugflotte auf Elektromobilität'
  ],
  wasteTitle: 'Abfall- und Wertstoffmanagement',
  wasteText: 'Richtlinien zur Mülltrennung und Werkstoffkreis-Rückführung:',
  wasteList: ['Trennung von PET, Papier, Glas, Metallen', 'Fachgerechte Sonderabfall-Entsorgung', 'Verzicht auf Einweg-Plastikgeschirr'],
  co2Title: 'Klimaneutralitäts-Ziel',
  co2List: ['Erfassung und Monitoring von Treibhausgasen', 'Aktive CO2-Kompensation für Fahrtwege', 'Nachhaltige Beschaffungspolitik bei Lieferanten'],
  sec7Title: 'Kontinuierlicher Verbesserungsprozess',
  sec7Intro: 'Arbeitssicherheit ist ein dynamischer Prozess. Wir evaluieren und optimieren unsere Reglemente fortlaufend.',
  sec7List: ['Sicherheitsaudits direkt beim Einsatz', 'Konsequentes Incident-Reporting und Ursachenforschung', 'Offene Rückmeldeschleifen'],
  sec7Footer: 'Unser oberstes Ziel ist Null Unfälle. Alle sollen täglich gesund nach Hause zurückkehren.'
};

const deCareers: CareersTranslation = {
  title: 'Werden Sie Teil unseres Teams',
  subtitle: 'Gestalten Sie Ihre berufliche Zukunft bei Kraken Properties. Wir suchen fortlaufend engagierte Fachkräfte.',
  badge: 'Karriere & Jobs',
  positionsTitle: 'Offene Stellen',
  cleanerTitle: 'Spezialist in der Liegenschaftspflege / Reinigung',
  cleanerLocation: 'Schaffhausen / Zürich',
  cleanerType: 'Teilzeit / Vollzeit',
  applyButton: 'Jetzt online bewerben →',
  formTitle: 'Online-Bewerbungsformular',
  formName: 'Vollständiger Name',
  formEmail: 'E-Mail-Adresse',
  formPhone: 'Telefonnummer',
  formPosition: 'Gewünschte Stelle',
  formCV: 'Lebenslauf hochladen (CV / Portfolio)',
  uploadPlaceholder: 'Datei per Drag-and-Drop ablegen oder hier klicken',
  fileLimit: 'PDF-/DOC-Dateien bis maximal 5MB',
  formMessage: 'Kurzes Motivationsschreiben / Nachricht',
  formSubmit: 'Bewerbung absenden',
  formSubmitting: 'Daten werden übermittelt...',
  successTitle: 'Bewerbung eingegangen',
  successText: 'Vielen Dank für Ihre Bewerbung! Wir prüfen Ihre Unterlagen sorgfältig und kontaktieren Sie zeitnah.',
  backButton: 'Zurück zur Hauptseite',
  placeholderPositionName: 'z.B. Spezialist Reinigung'
};

// French Dictionary
const frGDPR: GDPRTranslation = {
  title: 'Politique de Confidentialité et Conformité LPD/RGPD',
  badge: 'Conforme à la LPD suisse',
  subtitle: 'Conformité & Propriété Intellectuelle',
  introTitle: 'Introduction',
  introP1: 'Chez Kraken, nous prenons votre vie privée très au sérieux. Cette charte explique comment nous traitons vos données personnelles conformément à la Loi fédérale sur la protection des données (LPD) et au Règlement général sur la protection des données (RGPD) de l\'Union Européenne.',
  collectTitle: 'Données collectées & Finalités',
  collectP1: 'Nous collectons des informations pour fournir des services immobiliers professionnels. Ces données incluent :',
  collectItems: [
    'Données d\'identification : Nom, adresse, e-mail et numéro de téléphone (nécessaires à l\'exécution des interventions).',
    'Données de propriété : Photos, plans et superficie en m² (permettant un chiffrage et une validation exacts).',
    'Données financières : Nous utilisons des prestataires certifiés PCI-DSS. Kraken ne stocke aucune coordonnée de carte bancaire sur ses propres serveurs.',
    'Données techniques : Adresses IP et cookies (pour optimiser l\'utilisation du site web).'
  ],
  basisTitle: 'Base légale du traitement',
  basisP1: 'Le traitement de vos données repose sur :',
  basisItems: [
    'L\'exécution contractuelle : Fournir les devis et services que vous sollicitez.',
    'L\'obligation légale : À des fins comptables et fiscales obligatoires en Suisse.',
    'L\'intérêt légitime : Afin d\'améliorer la qualité du service client et d\'assurer la sécurité des chantiers.'
  ],
  retentionTitle: 'Sécurité, conservation & Transferts',
  retentionInfrastructure: 'Infrastructure',
  retentionCollaboration: 'Collaboration',
  retentionDuration: 'Durée',
  retentionStorage: 'Stockage : Vos données sont conservées sur des infrastructures sécurisées basées de préférence en Suisse ou au sein de l\'Espace Économique Européen.',
  retentionSharing: 'Partage : Nous partageons uniquement les données avec des partenaires agréés (ex. électriciens qualifiés) ou des hébergeurs de serveurs. Vos données ne sont jamais vendues.',
  retentionTime: 'Conservation : Nous archivons les dossiers durant toute la relation commerciale et les conservons pendant 10 ans après la fin du contrat (obligation légale suisse pour la comptabilité).',
  rightsTitle: 'Vos droits',
  rightsP1: 'Vous bénéficiez d\'un droit d\'accès, de rectification et d\'effacement de vos informations privées. Vous pouvez également refuser l\'utilisation commerciale de vos données par courriel sur kai@krakenpfm.ch.',
  disclaimerTitle: 'Mentions Légales & Propriété Intellectuelle',
  estimatesTitle: 'Précision des tarifs estimés',
  estimatesP1: 'L\'outil "Smart Booking" fournit des approximations de prix non contractuelles. L\'engagement définitif n\'Intervient qu\'à la confirmation écrite de Kraken et/ou après examen de vos visuels. Kraken se réserve d\'ajuster le devis selon la configuration physique constatée.',
  liabilityTitle: 'Limitation de responsabilité',
  liabilityP1: 'Kraken possède une couverture responsabilité civile d\'un montant de CHF 10 millions. Notre responsabilité concernant les services numériques est limitée aux dysfonctionnements techniques majeurs. Nous ne répondons pas des erreurs de saisie client.',
  ipTitle: 'Propriété Intellectuelle (PI)',
  ipP1: 'Tous les éléments, la mascotte Kraken, la charte graphique et l\'algorithme de chiffrage constituant le site web sont la propriété matérielle exclusive de Kraken Properties and Facilities Management.',
  usageTitle: 'Droits d\'auteur',
  usageText: 'Toute reproduction ou copie non agréée par écrit de notre contenu pour un but commercial est strictement interdite.',
  trademarksTitle: 'Protection des marques',
  trademarksText: 'La marque verbale et visuelle "Kraken" fait l\'objet d\'une protection légale sous l\'autorité du droit des marques suisse.',
  verificationTitle: 'Registre et Autorité',
  lastUpdate: 'Dernière mise à jour : Janvier 2025 | Seewadelstrasse 3, 8203 Schaffhausen'
};

const frTerms: TermsTranslation = {
  title: 'Conditions Générales de Vente (CGV)',
  description: 'Les présentes Conditions Générales régissent l\'ensemble des prestations professionnelles de nettoyage, déménagement, maintenance et gestion de bâtiments proposées par Kraken Properties and Facilities Management.',
  sections: [
    {
      title: "1. Champ d'Application & Définitions",
      content: "Les présentes CGV s'appliquent à tous les services fournis par Kraken Properties and Facilities Management ('Kraken', 'nous') aux clients privés ('Consommateurs') et commerciaux ('Clients B2B'), y compris nettoyage de fin de bail, nettoyage en profondeur, récurrent, déménagement, esthétique automobile, jardinage, nettoyage extérieur, lutte contre les nuisibles et intendance. Toute dérogation requiert un accord écrit."
    },
    {
      title: "2. Offres, Estimations & Conclusion de Contrat",
      content: "Un contrat est conclu dès confirmation d'une offre ou réservation. Les estimations de la calculatrice en ligne sont provisoires. Des informations incorrectes autorisent Kraken à ajuster le prix. La Precision Media Quote comporte des frais d'examen non remboursables de CHF 15.00, crédités à 100% sur la facture finale en cas d'acceptation. Réservation Express requiert un acompte de 15%."
    },
    {
      title: "3. Tarifs, TVA & Majorations",
      content: "3.1 Tous les prix sont indiqués en francs suisses (CHF). Kraken n'est pas actuellement inscrite au registre de la TVA (MWST) conformément à l'art. 10 LTVA ; par conséquent, les prix ne comprennent pas la TVA et aucune TVA n'est facturée. En cas d'inscription future, les prix seront ajustés conformément à la loi avec le préavis prévu à la clause 7.4. Tout surcroît de travail lié à des conditions non déclarées sera facturé CHF 90.00/heure/personne. Le travail dominical et les jours fériés subissent une majoration de 50%; les réservations express (<24h de préavis), une majoration de 25%. Les décharges et stationnements sont facturés au prix coûtant."
    },
    {
      title: "4. Forfaits de Déplacement & Offres Groupées",
      content: "Un forfait de transport standard de CHF 45.00 s'applique par intervention. Réduction d'offre groupée: CHF 25.00 pour l'achat d'un service principal + 1 option ou 2+ options; CHF 0.00 (frais de transport offerts) pour l'achat d'un service principal + 2+ options ou 2+ services principaux."
    },
    {
      title: "5. Modalités de Règlement & Retards",
      content: "Règlements sécurisés via liens Revolut Business, virement ou QR-facture. Le solde est exigible sous 7 jours dès facturation. Tout retard entraîne un intérêt moratoire légal de 5% par an et des frais de sommation de CHF 20.00 (2e rappel) et CHF 50.00 (3e rappel). Les frais de recouvrement incombent au client."
    },
    {
      title: "6. Annulations, Reports & Non-Présentation",
      content: "Toute annulation doit être formulée par écrit. Indemnités: préavis >48 heures: gratuit; <48 heures: 50% du prix; <12 heures, non-présentation ou annulation sur place: 100% du devis avec le forfait de transport. Un report gratuit est toléré >24 heures avant l'intervention, selon nos disponibilités."
    },
    {
      title: "7. Prestations Récurrentes, SLAs & Résiliation",
      content: "Les contrats récurrents sont à durée indéterminée. Résiliation: préavis de 30 jours pour la fin d'un mois (7 jours pendant la période d'essai de 2 mois). Annulation de session isolée exige 48h de préavis. Les contrats B2B avec SLA suivent les conditions convenues ou 3 mois de préavis. Ajustements de prix annuels avec préavis de 60 jours."
    },
    {
      title: "8. Nettoyage de Fin de Bail — Garantie de Remise",
      content: "Comprend la rectification gratuite de toute lacune signalée par le bailleur lors de l'état des lieux officiel (Abgabeprotokoll). Conditions: (a) notification écrite sous 24h avec protocole/photos; (b) visite d'état des lieux sous 72h après nettoyage; (c) logement resté inoccupé et inutilisé. Exclut l'usure normale, défauts du bâtiment et éléments exclus."
    },
    {
      title: "9. Services de Déménagement & Logistique",
      content: "Le client s'engage à fournir un inventaire exact. Espèces, bijoux, armes, produits dangereux et plantes/animaux sont exclus sans accord écrit préalable. Kraken répond des objets emballés par ses soins; l'exclusion s'applique au contenu des cartons préparés par le client. Garantie limitée à la valeur vénale réelle, max CHF 5'000.00 par événement. Sinistres cachés à annoncer sous 3 jours."
    },
    {
      title: "10. Préparation de Véhicules (Car Detailing)",
      content: "Les défauts préexistants sont consignés. Kraken décline toute responsabilité pour l'altération de pièces usées, cassantes ou ayant subi un mauvais traitement antérieur. Le client est tenu de vider le véhicule de tout objet de valeur."
    },
    {
      title: "11. Jardinage, Nettoyages Extérieurs, Façades & Gouttières",
      content: "Les interventions extérieures dépendent de la météo. Les reports météorologiques ou sécuritaires ne constituent pas un retard et n'engendrent aucun frais. Le client signale les dangers connus (toits fragiles, guêpiers). L'évacuation des déchets verts est facturée au coût réel, sauf disposition contraire."
    },
    {
      title: "12. Traitement Anti-Nuisibles — Garantie",
      content: "Garantie de retraitement de 30 jours pour les espèces et zones ciblées. Conditionnée par le respect rigoureux des instructions de préparation et de suivi. Exclut les réinfestations externes ou défauts structurels non corrigés par le client."
    },
    {
      title: "13. Gestion des Déchets",
      content: "Élimination des résidus conforme aux lois environnementales suisses. Les redevances de déchetterie sont facturées au coût réel. Des déchets dangereux cachés autorisent Kraken à cesser le travail et à facturer les surcoûts de traitement spécialisé."
    },
    {
      title: "14. Devoirs du Client, Accès & Heures d'Attente",
      content: "Garantir le libre accès, l'eau, l'électricité, le chauffage et l'ascenseur. Un défaut d'accès est facturé à 100%. Tout retard d'accès de >15 minutes est majoré à CHF 90.00/heure/personne par tranche de 15 minutes. Les clés remises sont sécurisées anonymement."
    },
    {
      title: "15. Réclamations & Signalement des Défauts",
      content: "Contrôler le travail immédiatement à l'issue. Signaler les défauts apparents sous 48h; cachés sous 48h dès découverte (max 7 jours post-intervention). Le remède primaire est la retouche. Les retenues de factures sont limitées à la section concernée."
    },
    {
      title: "16. Responsabilité & Assurances",
      content: "Assurance responsabilité civile professionnelle couvrant jusqu'à CHF 10 millions. Kraken répond uniquement des dommages directs résultant d'une faute prouvée. Exclut les préjudices indirects, pertes de gain ou privations d'usage. Clés égarées limitées aux seuls frais de reproduction standard."
    },
    {
      title: "17. Sous-traitants, Partenaires Agréés & Droit de Refus",
      content: "Kraken est libre de s'adjoindre des sous-traitants spécialisés mais demeure le seul interlocuteur contractuel. Kraken se réserve d'annuler ou suspendre l'acte si les conditions compromettent la santé ou la sécurité."
    },
    {
      title: "18. Clause de Non-Sollicitation",
      content: "Le client s'interdit d'embaucher, directement ou indirectement, le personnel de Kraken affecté à ses locaux pendant la durée du contrat et durant les 6 mois suivants. Toute infraction entraîne une pénalité forfaitaire de CHF 5'000.00 par employé."
    },
    {
      title: "19. Force Majeure",
      content: "Aucune partie ne répond de retards ou inexécutions consécutifs à des cas de force majeure (catastrophes, grèves, pandémies, coupures d'énergie). Obligations suspendues; si la durée excède 30 jours, chaque partie est en droit de résilier."
    },
    {
      title: "20. Protection des Données & Documentation",
      content: "Traitement confidentiel des données selon la Loi suisse sur la protection des données (LPD) et le RGPD. Des photos de contrôle 'avant/après' peuvent être réalisées pour la qualité et les assurances. Usage publicitaire soumis à accord préalable."
    },
    {
      title: "21. Modifications & Clause de Réserve",
      content: "Kraken se réserve d'ajuster ces CGV sous préavis de 30 jours. L'absence d'opposition vaut acceptation. Si une clause est jugée invalide, les autres demeurent en vigueur, et celle-ci est substituée par la clause la plus proche du but économique visé."
    },
    {
      title: "22. Droit Applicable & Juridiction",
      content: "Tous les contrats sont soumis exclusivement au droit matériel suisse, à l'exclusion de la CIVM. Le for juridique exclusif est à Schaffhouse, en Suisse. Les fors de consommation impératifs sont réservés."
    }
  ],
  verificationTitle: 'Registre et Conformité',
  lastUpdated: 'Version 2.0 — Entrée en vigueur : 16.07.26',
  companyInfo: 'Kraken Properties and Facilities Management Gomes Mendes | Seewadelstrasse 3, 8203 Schaffhausen, Suisse',
  backHome: 'Retour à l\'Accueil'
};

const frHSE: HSETranslation = {
  title: 'Santé, Sécurité au Travail & Environnement (HSE)',
  intro: 'Notre responsabilité pour la sécurité au travail est absolue. Nous suivons attentivement les lois suisses et guides d\'hygiène internationaux pour la préservation des conditions physiques du personnel et des clients.',
  badge: 'Précision Suisse, Standard Global',
  sec1Title: 'Législation et Directives Suisses',
  sec1P1: 'L\'intégralité des pratiques opérationnelles de l\'entreprise s\'implémente sous le contrôle strict de la loi helvétique.',
  uvgTitle: 'LAA (Loi sur l\'assurance-accidents)',
  uvgText: 'Chaque salarié bénéficie d\'une assurance contre les accidents professionnels obligatoire dès l\'embauche.',
  vuvTitle: 'OPA (Ordonnance sur la prévention des accidents)',
  vuvText: 'Directives de sécurité physiques et matérielles :',
  vuvList: ['Sécurisation des zones de travail', 'Contrôle périodique des outils', 'Mise à disposition d\'équipements individuels (EPI)', 'Présence de panneaux signalétiques obligatoires'],
  ekasTitle: 'Instructions CFST',
  ekasText: 'Harmonisation totale de nos méthodes avec les obligations de la Commission fédérale de coordination pour la sécurité au travail.',
  sec2Title: 'Audits et Standards Suva / ISO',
  sec2P1: 'Nous collaborons avec la Suva dans le but d\'adopter les meilleures pratiques de prévention des chutes et d\'accidents.',
  sec2List: [
    'Signataire accrédité de la "Charte de Sécurité" de la Suva',
    'Conformité avec les principes ISO 45001 (Santé et Sécurité du travail)',
    'Conformité avec les principes ISO 14001 (Gestion de l\'impact environnemental)'
  ],
  isoTitle: 'Système de Contrôle Intégré',
  isoText: 'L\'enchaînement de nos services se modélise sur les cadres d\'évaluation ISO.',
  sec3Title: 'Plan de Prévention des Risques',
  sec3Intro: 'Repérage méthodique et mise à disposition rapide de barrières contre les risques physiques.',
  riskTitle: 'Évaluation Initiale sur Site',
  riskText: 'Diagnostic obligatoire du logement effectué avant le début de tout projet.',
  riskList: ['Défauts de sols et risques de chutes', 'Exhaustivité de toxicité des solvants', 'Ergonomie relative aux ports de charges', 'Régularité des installations électriques'],
  ramsTitle: 'Dossiers RAMS (Méthodes d\Intervention)',
  ramsText: 'Pour les opérations d\'importance, un document d\'ingénierie RAMS décrit les modes opératoires.',
  ramsList: ['Sécurisation étape par étape', 'Mesures d\'alerte sanitaire', 'Contrôle par un chef d\'équipe'],
  sec4Title: 'Hygiène Chimique (ODim / ChemV)',
  sec4Intro: 'Encadrement strict de l\'usage de solvants et détergents.',
  reqTitle: 'Exigences',
  sec4List: [
    'Observation de l\'Ordonnance sur les produits chimiques (ODim)',
    'Présence obligatoire des Fiches de Données de Sécurité (FDS) sur site',
    'Récipients dûment marqués et stockés en hauteur',
    'Achat préférentiel d\'agents biologiques neutres'
  ],
  trainingTitle: 'Formation continue des équipes',
  trainingText: 'Séances pratiques d\'utilisation réglementaire et conduite en cas d\'écoulement anormal.',
  trainingList: ['Dosages prescrits', 'Consigne absolue de non-mélange de substances réactives', 'Soins urgents face au contact oculaire', 'Acheminement vers les centres de traitement des déchets'],
  sec5Title: 'Cycles de qualification habilités',
  sec5Intro: 'Une équipe bien formée est le pilier d\'un environnement sécurisé.',
  sec5List: ['Session d\'intégration obligatoire', 'Formations de perfectionnement régulières', 'Candidature qualifiée sur les engins techniques'],
  tbtTitle: 'Minutes Sécurité (Toolbox Talks)',
  tbtText: 'Réunions d\'arbitrage courtes partagées sur le lieu de l\'intervention.',
  tbtList: ['Orientation stable de l\'escabeau', 'Adoption d\'un maintien lombaire droit', 'Inspections préventives de câblages d\'alimentation', 'Dispositifs électroniques dédiés aux isolements des techniciens'],
  modulesTitle: 'Examens Électroniques internes',
  modulesText: 'Contrôles généraux informatiques partagés régulièrement avec le personnel.',
  modulesList: ['Règles du feu', 'Risques épidémiologiques', 'Tri sélectif écoresponsable', 'Communication client respectueuse'],
  sec6Title: 'Objectifs ESG & Écologie',
  envTitle: 'Neutralité Écologique',
  envText: 'Contrôle de l\'empreinte sur les milieux naturels :',
  envList: [
    'Produits biologiques biodégradables',
    'Matériel en microfibre pour limiter la consommation d\'eau douce',
    'Aspiration basse consommation labellisée',
    'Amélioration du parc automobile vers le tout électrique'
  ],
  wasteTitle: 'Revalorisation d\'emballages',
  wasteText: 'Traitement ordonné de l\'évacuation des reliquats de chantiers :',
  wasteList: ['Tri pour recyclage (cartons, verres, plastiques)', 'Neutralisation réglementée d\'agents chimiques', 'Diminution majeure de contenant en plastique jetable'],
  co2Title: 'Neutralité Carbone',
  co2List: ['Calcul analytique de notre volume de pollution', 'Re-plantation compensatoire d\'essences forestières', 'Achat d\'approvisionnements écoresponsables'],
  sec7Title: 'Recherche de Progrès constant',
  sec7Intro: 'La protection est un itinéraire continu. Nous optimisons nos directives d\'HSE d\'après les retours terrains réguliers.',
  sec7List: ['Audits de terrain', 'Formulaires de rapports d\'anomalies', 'Axe d\'amélioration continue'],
  sec7Footer: 'Notre politique se résume à « Zéro Accident ». Pour que chacun rentre indemne et en parfaite santé à son foyer chaque soir.'
};

const frCareers: CareersTranslation = {
  title: 'Rejoignez Notre Équipe',
  subtitle: 'Créez votre développement de carrière de demain auprès de Kraken Properties. Notre équipe engage des techniciens rigoureux.',
  badge: 'Ressources Humaines',
  positionsTitle: 'Postes Disponibles',
  cleanerTitle: 'Opérateur Technique d\Entretien Immobilier',
  cleanerLocation: 'Schaffhouse / Zurich',
  cleanerType: 'Temps Partiel / Temps Plein',
  applyButton: 'Postuler à cet emploi →',
  formTitle: 'Dossier de candidature en ligne',
  formName: 'Nom et Prénom',
  formEmail: 'Adresse Électronique',
  formPhone: 'Numéro de Téléphone',
  formPosition: 'Poste Sollicité',
  formCV: 'Envoyer votre Curriculum Vitae (CV / Annexes)',
  uploadPlaceholder: 'Déposez votre document ou cliquez pour parcourir',
  fileLimit: 'Fichiers PDF, DOC acceptés (limite de 5 Mo)',
  formMessage: 'Message accompagnateur / Motivation',
  formSubmit: 'Déposer ma Candidature',
  formSubmitting: 'Enregistrement en cours...',
  successTitle: 'Dossier Enregistré',
  successText: 'Nous vous remercions pour l\'intérêt porté à notre société ! L\équipe d\'encadrement étudiera votre profil avec intérêt et vous contactera rapidement.',
  backButton: 'Retourner sur le site principal',
  placeholderPositionName: 'ex. Technicien de Nettoyage'
};

// Italian Dictionary
const itGDPR: GDPRTranslation = {
  title: 'Informativa sulla Privacy e Conformità LPD/GDPR',
  badge: 'Conforme alla LPD svizzera',
  subtitle: 'Conformità e Proprietà Intellettuale',
  introTitle: 'Introduzione',
  introP1: 'In Kraken, trattiamo la vostra privacy con la massima serietà. Questa informativa descrive come elaboriamo i dati personali in conformità con la Legge federale svizzera sulla protezione dei dati (LPD) e il Regolamento generale sulla protezione dei dati (GDPR) dell\'UE.',
  collectTitle: 'Dati Raccolti e Finalità',
  collectP1: 'Raccogliamo informazioni al fine di erogare servizi immobiliari professionali, comprensivi di:',
  collectItems: [
    'Dati identificativi: Nome, indirizzo postale, e-mail e numero telefonico (per l\'elaborazione dei contratti).',
    'Dati dell\'immobile: Immagini e prospetti degli spazi (per preventivi precisi ed ispezioni).',
    'Dati finanziari: Ci appoggiamo a operatori di pagamento certificati PCI-DSS. Kraken non conserva dati bancari sui propri server.',
    'Dati di navigazione tecnici: Indirizzi IP e file di cookie (per ottimizzare l\'efficacia del sito web).'
  ],
  basisTitle: 'Base Giuridica del Trattamento',
  basisP1: 'Il trattamento aziendale dei dati personali si fonda su:',
  basisItems: [
    'Adempimenti contrattuali: Per garantire le risposte ai calcoli e alle prenotazioni inoltrate.',
    'Disposizioni di legge: Per l\'assolvimento di norme fiscali e tributarie obbligatorie in Svizzera.',
    'Legittimo interesse: Al fine di elevare costantemente gli indici qualitativi e di tutela della sicurezza.'
  ],
  retentionTitle: 'Conservazione Sicura e Trasmissione a Terzi',
  retentionInfrastructure: 'Infrastruttura',
  retentionCollaboration: 'Collaborazione',
  retentionDuration: 'Durata',
  retentionStorage: 'Conservazione: Le coordinate si trovano memorizzate all\'interno di sistemi protetti situati in Svizzera o in Europa.',
  retentionSharing: 'Trasmissione: I flussi informativi avvengono solo verso collaboratori specializzati o fornitori di rete. Non vendiamo dati.',
  retentionTime: 'Durata della conservazione: I registri sono archiviati per la durata del rapporto commerciale e per ulteriori 10 anni successivi (normativa svizzera sulla contabilità).',
  rightsTitle: 'I Vostri Diritti',
  rightsP1: 'Avete il pieno diritto di richiedere l\'accesso, la correzione o l\'eliminazione dei vostri dati personali dalle nostre banche dati. Contattate kai@krakenpfm.ch per qualsiasi esercizio dei diritti.',
  disclaimerTitle: 'Informazioni Legali e Proprietà Intellettuale',
  estimatesTitle: 'Natura delle stime espresse',
  estimatesP1: 'Il simulatore "Smart Booking" indica stime commerciali non impegnative. Un accordo contrattuale vincolante si instaura solamente previo riscontro scritto da parte dello staff Kraken e/o dopo la verifica del materiale visivo. Kraken si riserva la rettifica del costo qualora vi siano differenze reali sul campo.',
  liabilityTitle: 'Esclusioni e Limiti di Responsabilità',
  liabilityP1: 'Kraken detiene una garanzia assicurativa per la responsabilità civile di CHF 10 milioni. Decliniamo responsabilità per irregolarità derivanti da disservizi informatici e links terzi.',
  ipTitle: 'Diritti di Proprietà Intellettuale (IP)',
  ipP1: 'Tutti i testi descrittivi, la mascotte Kraken, i marchi visivi d\'identità aziendale ed il calcolatore di prezzi "Smart Booking" appartengono pienamente a Kraken Properties and Facilities Management.',
  usageTitle: 'Termini d\'Uso d\'Autore',
  usageText: 'È severamente vietata la replicazione, la copia o l\'Integrazione del nostro materiale web senza una formale approvazione scritta da parte di Kraken.',
  trademarksTitle: 'Marchi e Brevetti',
  trademarksText: 'La parola e la grafica riferite al logo e al nome "Kraken" sono protette dalle vigenti disposizioni del diritto svizzero sui marchi.',
  verificationTitle: 'Certificazioni ed Ispezioni',
  lastUpdate: 'Ultimo aggiornamento: Gennaio 2025 | Seewadelstrasse 3, 8203 Schaffhausen'
};

const itTerms: TermsTranslation = {
  title: 'Condizioni Generali di Contratto (CGC)',
  description: 'Le presenti Condizioni Generali regolano tutti i servizi professionali di pulizia, trasloco, manutenzione e gestione degli immobili forniti da Kraken Properties and Facilities Management.',
  sections: [
    {
      title: "1. Ambito di Applicazione & Definizioni",
      content: "Le presenti CGC si applicano a tutti i servizi forniti da Kraken Properties and Facilities Management ('Kraken', 'noi') a clienti privati ('Consumatori') e aziendali ('Clienti B2B'), inclusi traslochi, pulizie di fine locazione, pulizie profonde, ricorrenti, detailing auto, giardinaggio, pulizia esterna, disinfestazione e facility management. Eventuali deroghe sono valide solo se accettate per iscritto."
    },
    {
      title: "2. Offerte, Stime & Conclusione del Contratto",
      content: "Il contratto si perfeziona con la conferma di un preventivo o di una prenotazione. Le stime del calcolatore online sono indicative. Informazioni errate autorizzano Kraken ad adeguare i prezzi. L'opzione 'Precision Media Quote' prevede una tassa d'esame non rimborsabile di CHF 15.00, accreditata al 100% sulla fattura finale in caso di accettazione. Le prenotazioni Express richiedono un acconto del 15%."
    },
    {
      title: "3. Prezzi, IVA & Maggiorazioni",
      content: "3.1 Tutti i prezzi sono espressi in franchi svizzeri (CHF). Kraken non è attualmente iscritta nel registro dell'IVA (MWST) ai sensi dell'Art. 10 LIVA; pertanto, i prezzi s'intendono IVA esclusa e non viene fatturata alcuna IVA. In caso di futura iscrizione, i prezzi saranno adeguati a norma di legge con il preaviso previsto alla clausola 7.4. Il lavoro extra dovuto a condizioni non dichiarate sarà fatturato a CHF 90.00/ora/persona. Il lavoro domenicale e festivo è soggetto a una maggiorazione del 50%; le prenotazioni express (<24h di preavviso) a una maggiorazione del 25%. Le spese di discarica e parcheggio sono fatturate al costo."
    },
    {
      title: "4. Forfait di Trasporto & Pacchetti Multiservizio",
      content: "Si applica una tariffa standard di trasporto di CHF 45.00 per intervento. Sconto pacchetto: CHF 25.00 in caso di acquisto di 1 servizio principale + 1 opzionale o 2+ opzionali; CHF 0.00 (trasporto gratuito) in caso di acquisto di 1 principale + 2+ opzionali o 2+ servizi principali."
    },
    {
      title: "5. Termini di Pagamento & Mora",
      content: "Pagamenti sicuri tramite link Revolut Business, bonifico o polizza QR. Il saldo è esigibile entro 7 giorni dalla fatturazione. La mora è automatica alla scadenza, con un interesse annuo del 5% e spese di sollecito di CHF 20.00 (2° sollecito) e CHF 50.00 (3° sollecito). Le spese di recupero crediti sono a carico del cliente."
    },
    {
      title: "6. Cancellazioni, Rinvii & Mancata Presentazione",
      content: "Le cancellazioni devono essere formate per iscritto. Penali: preavviso >48 ore: gratuito; <48 ore: 50% del prezzo; <12 ore, mancata presentazione o cancellazione sul posto: 100% del preventivo oltre alla tariffa di trasporto. Un rinvio gratuito è consentito >24 ore prima dell'intervento, previa disponibilità."
    },
    {
      title: "7. Servizi Ricorrenti, SLAs & Risoluzione",
      content: "I contratti ricorrenti sono a tempo indeterminato. Risoluzione: preavviso di 30 giorni per la fine di un mese (7 giorni durante il periodo di prova di 2 mesi). L'annullamento della singola sessione richiede 48h di preavviso. I contratti B2B con SLA seguono le condizioni pattuite o 3 mesi di preavviso. Adeguamenti tariffari annuali con preavviso di 60 giorni."
    },
    {
      title: "8. Pulizia di Fine Locazione — Garanzia di Consegna",
      content: "Include la risoluzione gratuita di qualsiasi lacuna riscontrata dal locatore durante il collaudo ufficiale (Abgabeprotokoll). Condizioni: (a) notifica scritta entro 24h con protocollo/foto; (b) collaudo ufficiale entro 72h dalla pulizia; (c) immobile rimasto sfitto e inutilizzato. Esclude la normale usura, difetti strutturali ed elementi esclusi."
    },
    {
      title: "9. Servizi di Trasloco & Logistica",
      content: "Il cliente si impegna a fornire un inventario preciso. Contanti, gioielli, armi, merci pericolose e piante/animali sono esclusi dal trasporto senza previo accordo scritto. Kraken risponde dei beni imballati dal proprio personale; si esclude il contenuto degli scatoloni imballati dal cliente. Responsabilità limitata al valore reale di mercato, max CHF 5'000.00 per evento. Danni occulti da segnalare entro 3 giorni."
    },
    {
      title: "10. Preparazione dei Veicoli (Car Detailing)",
      content: "I difetti preesistenti vengono registrati. Kraken declina ogni responsabilità per l'usura o il danneggiamento di parti deteriorate, fragili o che hanno subito trattamenti errati in precedenza. Il cliente deve svuotare l'auto da oggetti di valore."
    },
    {
      title: "11. Giardinaggio, Pulizia Esterna, Facciate & Grondaie",
      content: "I servizi esterni dipendono dalle condizioni atmosferiche. I rinvii dovuti al meteo o alla sicurezza non costituiscono mora e non comportano spese. Il cliente deve segnalare i pericoli noti (tetti fragili, vespai). Lo smaltimento dei rifiuti verdi è fatturato al costo reale, salvo diversa disposizione."
    },
    {
      title: "12. Trattamento Disinfestazione — Garanzia",
      content: "Garanzia di re-intervento di 30 giorni per le specie e le aree trattate. Condizionata al rispetto rigoroso delle istruzioni di preparazione e monitoraggio. Esclude reinfestazioni esterne o difetti strutturali non corretti dal cliente."
    },
    {
      title: "13. Gestione dei Rifiuti",
      content: "Smaltimento conforme alle leggi ambientali svizzere. Le tariffe di discarica sono fatturate al costo reale. Rifiuti pericolosi non dichiarati autorizzano Kraken a sospendere il lavoro e a fatturare i costi extra per la gestione specialistica."
    },
    {
      title: "14. Doveri del Cliente, Accesso & Tempi d'Attesa",
      content: "Garantire il libero accesso, acqua, elettricità, riscaldamento e ascensore. Il mancato accesso è fatturato al 100%. Ritardi d'accesso superiori a 15 minuti sono maggiorati a CHF 90.00/ora/persona a intervalli di 15 minuti. Le chiavi consegnate sono custodite in modo sicuro e anonimo."
    },
    {
      title: "15. Reclami & Segnalazione dei Difetti",
      content: "Controllare il lavoro immediatamente al termine. Segnalare i difetti visibili entro 48 ore; occulti entro 48 ore dalla scoperta (max 7 giorni post-intervento). Il rimedio primario è la rettifica. Trattenute parziali della fattura sono consentite solo per la sezione interessata."
    },
    {
      title: "16. Responsabilità Civile & Assicurazioni",
      content: "Assicurazione di responsabilità civile professionale con copertura fino a CHF 10 milioni. Kraken risponde unicamente dei danni diretti derivanti da colpa comprovata. Esclude danni indiretti, perdita di profitto o privazione d'uso. La responsabilità per smarrimento chiavi è limitata alle sole spese di riproduzione standard."
    },
    {
      title: "17. Subappaltatori, Partner Specializzati & Diritto di Rifiuto",
      content: "Kraken è libera di avvalersi di subappaltatori specializzati ma rimane l'unico partner contrattuale. Kraken si riserva di annullare o sospendere il servizio se le condizioni compromettono la salute o la sicurezza del personale."
    },
    {
      title: "18. Divieto de Storno del Personale",
      content: "Il cliente si impegna a non assumere, direttamente o indirettamente, il personale di Kraken impiegato presso i propri locali durante il contratto e nei 6 mesi successivi. Qualsiasi violazione comporta una penale di CHF 5'000.00 per dipendente."
    },
    {
      title: "19. Forza Maggiore",
      content: "Nessuna delle parti risponde di ritardi o inadempimenti dovuti a forza maggiore (catastrofi, scioperi, pandemie, interruzioni di corrente). Obblighi sospesi; se la durata supera i 30 giorni, ciascuna parte ha il diritto di recedere."
    },
    {
      title: "20. Protezione dei Dati & Documentazione",
      content: "Trattamento riservato dei dati personali ai sensi della Legge svizzera sulla protezione dei dati (LPD) e del GDPR. Possono essere scattate foto 'prima/dopo' per il controllo qualità e scopi assicurativi. L'uso promozionale delle foto è soggetto a preventivo consenso."
    },
    {
      title: "21. Modifiche & Clausola Salvatoria",
      content: "Kraken si riserva di modificare le presenti CGC con un preavviso di 30 giorni. La mancata opposizione equivale ad accettazione. Se una clausola è dichiarata invalida, le altre rimangono in vigore e quella invalida viene sostituita con la disposizione più vicina allo scopo economico."
    },
    {
      title: "22. Legge Applicabile & Foro Competente",
      content: "Tutti i contratti sono regolati esclusivamente dal diritto svizzero materiale, ad esclusione della CISG. Il foro competente esclusivo è Sciaffusa, Svizzera. Sono fatti salvi i fori di consumo imperativi."
    }
  ],
  verificationTitle: 'Verifica e Conformità',
  lastUpdated: 'Version 2.0 — In vigore dal : 16.07.26',
  companyInfo: 'Kraken Properties and Facilities Management Gomes Mendes | Seewadelstrasse 3, 8203 Schaffhausen, Svizzera',
  backHome: 'Ritorna alla Home page'
};

const itHSE: HSETranslation = {
  title: 'Sicurezza, Salute sul Lavoro & Ambiente (HSE)',
  intro: 'I nostri impegni sui livelli protettivi di salute sul lavoro sono privi di compromessi. Applichiamo rigide norme federali svizzere ed indicazioni internazionali per favorire il benessere fisico dei dipendenti.',
  badge: 'Precisione Svizzera, Standard Globale',
  sec1Title: 'Garanzie di Legge Confederata',
  sec1P1: 'La totalità della routine operativa si attua sotto le indicazioni legislative della Confederazione Svizzera.',
  uvgTitle: 'LAINF (Legge sull\'assicurazione contro gli infortuni)',
  uvgText: 'Copertura infortuni obbligatoria stabilita per ogni risorsa attiva nell\'impresa.',
  vuvTitle: 'OPI (Ordinanza sulla prevenzione degli infortuni)',
  vuvText: 'Attuazione di controlli tecnici ed organizzativi mirati:',
  vuvList: ['Sicurezza del locale operativo', 'Controllo di usura di utensili ed apparecchi', 'Assegnazione di DPI (Dispositivi di Protezione Individuale)', 'Posizionamento di cartelli monitori obbligatori'],
  ekasTitle: 'Linee Guida LAINF (MSSL)',
  ekasText: 'Adempimento integrale a tutte le disposizioni della Commissione federale di coordinamento per la sicurezza sul lavoro.',
  sec2Title: 'Collaborazioni Suva & Strutture ISO',
  sec2P1: 'Siamo in costante coordinamento con la Suva per prevenire sinistri e infortuni.',
  sec2List: [
    'Firmatari della "Carta della Sicurezza" Suva',
    'Procedura idonea ai canoni ISO 45001 (Salute e Sicurezza dei lavoratori)',
    'Procedura idonea ai canoni ISO 14001 (Sostenibilità d\'inserimento nell\'ecosistema)'
  ],
  isoTitle: 'Processo di Qualità Strutturato',
  isoText: 'Tutte le attività di pianificazione sono verificate in base agli standard metodologici delle normative ISO.',
  sec3Title: 'Controllo Sistematico delle Anomalie',
  sec3Intro: 'Ispezioni preventive nei luoghi d\'intervento per eliminare pericoli per l\'incolumità.',
  riskTitle: 'Valutazione dei Rischi sul Cantiere',
  riskText: 'Analisi obbligatoria redatta per ogni immobile prima d\'iniziare.',
  riskList: ['Superfici sdrucciolevoli e pericoli di inciampo', 'Uso attento e dosi per detergenti sensibili', 'Ergonomia di sollevamento carichi pesanti', 'Verifica di integrità di spine e prese elettriche'],
  ramsTitle: 'Progetti RAMS (Metodi Operativi)',
  ramsText: 'Redigiamo relazioni di valutazione RAMS per gli interventi complessi.',
  ramsList: ['Sequenze dettagliate', 'Procedure per incidenti', 'Supervisione del Responsabile'],
  sec4Title: 'Uso dei Prodotti Chimici (ChemV / MSDS)',
  sec4Intro: 'Uso e stoccaggio controllato di solventi chimici per la pulizia.',
  reqTitle: 'Prescrizioni',
  sec4List: [
    'Sorveglianza dell\'ordinanza svizzera sui prodotti chimici (ChemV)',
    'Schede dei Dati di Sicurezza (SDS) obbligatorie dislocate sui cantieri',
    'Identificazione con etichetta e tenuta in posti non accessibili',
    'Uso consigliato di eco-detergenti e biologici biodegradabili'
  ],
  trainingTitle: 'Piani di formazione continua',
  trainingText: 'Corsi pratici in cantiere sulla manipolazione e sulle emergenze chimiche.',
  trainingList: ['Dosi prescritte', 'Divieti di unione di prodotti incompatibili', 'Familiarizzazione con i rimedi oculari', 'Procedure ecologiche di eliminazione residui tossici'],
  sec5Title: 'Formazione e Competenze Professionali',
  sec5Intro: 'Il valore di un team informato riduce a zero gli incidenti aziendali.',
  sec5List: ['Addestramento dei collaboratori neoassunti', 'Audit di aggiornamento periodici', 'Prove di esecuzione per mezzi tecnici semoventi o complessi'],
  tbtTitle: 'Pillole di Prevenzione (Toolbox Talks)',
  tbtText: 'Tendenze di ripasso informative brevi tenute regolarmente.',
  tbtList: ['Posizionamento di scale e trabattelli', 'Sforzi e movimenti per la schiena', 'Integrità dei cavi di alimentazione', 'Controlli per servizi eseguiti individualmente'],
  modulesTitle: 'Corsi E-Learning Aziendali',
  modulesText: 'Aggiornamenti a mezzo computer diffusi tra il personale.',
  modulesList: ['Mezzi antincendio', 'Infezioni e igiene', 'Differenziazione dei rifiuti', 'Accoglienza attenta dei clienti'],
  sec6Title: 'ESG & Impegno Ecologico',
  envTitle: 'Tutela dell\'Ecosistema',
  envText: 'Contenimento dell\'impatto sui territori :',
  envList: [
    'Formula biodegradabile per i detersivi concentrati',
    'Integrazione di panni in microfibra per salvare acqua',
    'Classe A per aspiratori elettrici industriali',
    'Rotazione aziendale dei veicoli verso l\'elettrificazione'
  ],
  wasteTitle: 'Raccolta differenziata',
  wasteText: 'Smantellamento e asporto ecologico dei rifiuti dei cantieri :',
  wasteList: ['Scelta per riciclo (plastica, vetro, metalli)', 'Discarica speciale controllata per inquinanti', 'Riduzione di imballi usa-e-getta in plastica'],
  co2Title: 'Neutralità Climatica',
  co2List: ['Calcoli di emissioni nocive', 'Azioni di forestazione', 'Acquisti solidali da fornitori verdi'],
  sec7Title: 'Verifiche e Miglioramenti Continui',
  sec7Intro: 'La prevenzione è un percorso continuo. Ottimizziamo le nostre regole HSE sulla scorta dei riscontri costruttivi del team.',
  sec7List: ['Ispezioni in campo', 'Segnalazione digitale delle criticità', 'Azioni correttive immediate'],
  sec7Footer: 'Nessun Infortunio è la nostra regola. Per veder tornare a casa le nostre risorse con il sorriso ogni sera.'
};

const itCareers: CareersTranslation = {
  title: 'Lavora Con Noi',
  subtitle: 'Definisci la tua crescita professionale in Svizzera in Kraken Properties. Cerchiamo tecnici precisi.',
  badge: 'Selezioni Personale',
  positionsTitle: 'Posizioni Aperte',
  cleanerTitle: 'Specialista per l\Igiene Immobiliare / Manutenzione',
  cleanerLocation: 'Sciaffusa / Zurigo',
  cleanerType: 'Tempo Parziale / Tempo Pieno',
  applyButton: 'Invia candidatura online →',
  formTitle: 'Modulo di Candidatura',
  formName: 'Nome e Cognome',
  formEmail: 'Posta Elettronica',
  formPhone: 'Numero di Telefono',
  formPosition: 'Posizione Richiesta',
  formCV: 'Invia il tuo Curriculum (CV)',
  uploadPlaceholder: 'Rilascia il documento qui o clicca per caricare',
  fileLimit: 'File supportati: PDF, DOC (limite 5MB)',
  formMessage: 'Lettera di presentazione / Messaggio',
  formSubmit: 'Invia Candidatura',
  formSubmitting: 'Invio dati...',
  successTitle: 'Candidatura Consegnata',
  successText: 'Grazie per l\'interesse dimostrato! I nostri esperti esamineranno le credenziali e vi contatteranno al più presto.',
  backButton: 'Torna alla pagina web principale',
  placeholderPositionName: 'es. Tecnico Pulizie'
};

// Portuguese Dictionary
const ptGDPR: GDPRTranslation = {
  title: 'Política de Privacidade & Conformidade nLPD/RGPD',
  badge: 'Conforme à nLPD suíça',
  subtitle: 'Conformidade & Propriedade Intelectual',
  introTitle: 'Introdução',
  introP1: 'Na Kraken, levamos a sua privacidade muito a sério. Esta política explica como processamos dados pessoais de acordo com a nova Lei Federal Suíça de Proteção de Dados (nLPD) e o Regulamento Geral de Proteção de Dados (RGPD) da UE.',
  collectTitle: 'Dados que Recolhemos & Finalidade',
  collectP1: 'Recolhemos informações para fornecer serviços de manutenção profissional de propriedades. Isto inclui:',
  collectItems: [
    'Dados de identificação: Nome, morada, e-mail e número de telefone (necessários para a execução dos serviços).',
    'Dados da propriedade: Fotografias, plantas e áreas (para orçamentos precisos e validações).',
    'Dados financeiros: Utilizamos processadores em conformidade com PCI-DSS. A Kraken não armazena números de cartões de crédito nos seus servidores.',
    'Dados técnicos: Endereços IP e ficheiros de cookies (para otimizar e assegurar o website).'
  ],
  basisTitle: 'Base Legal do Tratamento',
  basisP1: 'Tratamos os dados de acordo com:',
  basisItems: [
    'Necessidade contratual: Para fornecer as simulações e marcações solicitadas por si.',
    'Obrigações de lei: Para o cumprimento das obrigações fiscais e de contabilidade obrigatórias na Suíça.',
    'Interesse legítimo: Com vista a garantir a qualidade de excelência e a proteção no trabalho.'
  ],
  retentionTitle: 'Segurança, Armazenamento & Parcerias',
  retentionInfrastructure: 'Infraestrutura',
  retentionCollaboration: 'Colaboração',
  retentionDuration: 'Duração',
  retentionStorage: 'Armazenamento: Os dados são guardados em servidores seguros, com primazia de locais na Suíça ou Europa.',
  retentionSharing: 'Partilha: Apenas partilhamos com parceiros validados (ex. canalizadores credenciados) ou provedores de rede. Nunca vendemos dados.',
  retentionTime: 'Conservação: Os registos são arquivados durante as intervenções e por 10 anos após a data da última fatura, conforme requisição legal suíça.',
  rightsTitle: 'Os Seus Direitos',
  rightsP1: 'Tem o direito de requerer o acesso, a alteração ou a remoção total dos seus dados. Poderá anular as inscrições de publicidade a qualquer momento por e-mail no endereço kai@krakenpfm.ch.',
  disclaimerTitle: 'Informações Legais & Propriedade Intelectual',
  estimatesTitle: 'Cálculos de Preço',
  estimatesP1: 'O estimador "Smart Booking" indica custos aproximados não contratuais. O contrato definitivo formaliza-se após concordância escrita e/ou envio de material visual. A Kraken reserva o direito de adaptar custos se as realidades físicas locais diferirem.',
  liabilityTitle: 'Limitação de Responsabilidade',
  liabilityP1: 'Muito embora a Kraken possua um seguro de responsabilidade civil de CHF 10 milhões, a nossa responsabilidade no ambiente digital está salvaguardada em limites. Não respondemos por anomalias de rede externa.',
  ipTitle: 'Direitos Intelectuais (IP)',
  ipP1: 'Todos os textos, a mascotte Kraken, o design visual e o simulador "Smart Booking" são propriedade sob direito exclusivo de Kraken Properties and Facilities Management.',
  usageTitle: 'Termos de Utilização',
  usageText: 'É expressamente interdito efetuar cópias do material do nosso website com intenções de lucro ou publicidade sem concordância e autorização escrita.',
  trademarksTitle: 'Marcas de Proteção',
  trademarksText: 'A designação textual e imagem gráfica representadas pela logo "Kraken" são marcas protegidas sob termo da Lei de Marcas Suíça.',
  verificationTitle: 'Zertificação e Controlos',
  lastUpdate: 'Última atualização: Janeiro 2025 | Seewadelstrasse 3, 8203 Schaffhausen'
};

const ptTerms: TermsTranslation = {
  title: 'Condições Gerais de Contrato (CGC)',
  description: 'Estas Condições Gerais regulam todos os serviços profissionais de limpeza, mudança, manutenção e gestão de instalações prestados pela Kraken Properties and Facilities Management.',
  sections: [
    {
      title: "1. Âmbito de Aplicação & Definições",
      content: "Estas CGC aplicam-se a todos os serviços prestados pela Kraken Properties and Facilities Management ('Kraken', 'nós') a clientes privados ('Consumidores') e corporativos ('Clientes B2B'), incluindo mudanças, limpezas de final de arrendamento, limpezas profundas, recorrentes, detalhe automóvel, jardinagem, limpeza exterior, controlo de pragas e gestão de propriedades. Condições divergentes apenas se aplicam se forem aceites por escrito."
    },
    {
      title: "2. Ofertas, Estimativas & Conclusão do Contrato",
      content: "O contrato é formalizado com a confirmação de um orçamento ou reserva. As estimativas da calculadora online são aproximadas. Informações incorretas autorizam a Kraken a ajustar os preços. A opção 'Precision Media Quote' implica uma taxa não reembolsável de CHF 15.00 para análise técnica, que será creditada a 100% na fatura final em caso de aceitação. A reserva Express requer um depósito de 15%."
    },
    {
      title: "3. Preços, IVA & Sobretaxas",
      content: "3.1 Todos os preços são expressos em francos suíços (CHF). A Kraken não está atualmente inscrita no registo do IVA (MWST) em conformidade com o Art. 10 LIVA; portanto, os preços não incluem IVA e não é faturado IVA. No caso de uma inscrição futura, os preços serão ajustados em conformidade com a lei, com o aviso prévio previsto na cláusula 7.4. Trabalho extra devido a condições não declaradas será faturado a CHF 90.00/hora/pessoa. O trabalho aos domingos e feriados está sujeito a um acréscimo de 50%; as reservas express (<24h de aviso prévio) têm um acréscimo de 25%. Os custos de lixeira e estacionamento são faturados ao preço de custo."
    },
    {
      title: "4. Taxas de Deslocação & Pacotes Multiservício",
      content: "Aplica-se uma taxa padrão de deslocação de CHF 45.00 por intervenção. Desconto de pacote: CHF 25.00 na contratação de 1 serviço principal + 1 complementar ou 2+ complementares; CHF 0.00 (deslocação gratuita) na contratação de 1 principal + 2+ complementares ou 2+ serviços principais."
    },
    {
      title: "5. Condições de Pagamento & Mora",
      content: "Pagamentos seguros via links Revolut Business, transferência ou fatura QR. O saldo restante vence 7 dias após a fatura. A mora é automática após o vencimento, com juros anuais de 5% e taxas de cobrança de CHF 20.00 (2º aviso) e CHF 50.00 (3º aviso). Os custos de cobrança judicial são suportados pelo cliente."
    },
    {
      title: "6. Cancelamentos, Adiamentos & Não-Comparência",
      content: "Os cancelamentos devem ser feitos por escrito. Taxas: aviso >48 horas: gratuito; <48 horas: 50% do valor; <12 horas, não-comparência ou cancelamento no local: 100% do orçamento mais taxa de deslocação. É permitido um adiamento gratuito com aviso >24 horas, sujeito a disponibilidade."
    },
    {
      title: "7. Serviços Recorrentes, SLAs & Rescisão",
      content: "Os planos recorrentes são por tempo indeterminado. Rescisão: aviso prévio de 30 dias para o fim de um mês (7 dias no período de experiência de 2 meses). Cancelar uma sessão individual exige 48h de aviso prévio. Os contratos B2B com SLA regem-se pelas condições acordadas ou aviso prévio de 3 meses. Ajustes anuais de preços com aviso prévio de 60 dias."
    },
    {
      title: "8. Limpeza de Final de Arrendamento — Garantia de Entrega",
      content: "Inclui a correção gratuita de quaisquer deficiências detetadas pelo senhorio na vistoria oficial (Abgabeprotokoll). Condições: (a) comunicado por escrito em 24h com protocolo/fotos; (b) vistoria em até 72h após a limpeza; (c) imóvel mantido desocupado e sem uso. Não cobre desgaste normal, danos estruturais ou áreas excluídas."
    },
    {
      title: "9. Serviços de Mudança & Logística",
      content: "O cliente deve fornecer um inventário preciso. Dinheiro, joias, armas, produtos químicos e plantas/animais estão excluídos do transporte sem acordo prévio por escrito. A Kraken responde por bens embalados pelo seu pessoal; exclui-se o conteúdo de caixas embaladas pelo cliente. Responsabilidade limitada ao valor atual de mercado, no máximo CHF 5'000.00 por sinistro. Danos ocultos devem ser reportados em 3 dias."
    },
    {
      title: "10. Detalhe Automóvel (Car Detailing)",
      content: "Danos existentes são previamente documentados. A Kraken não se responsabiliza por danos preexistentes ou pelo desgaste de materiais antigos, frágeis ou previamente mal tratados. Retirar objetos pessoais antes do serviço."
    },
    {
      title: "11. Jardinagem, Limpeza Exterior, Fachadas & Algerozes",
      content: "Os serviços ao ar livre dependem das condições meteorológicas. Adiamentos por razões de clima ou segurança não constituem mora e não geram taxas. O cliente deve informar sobre perigos (telhados frágeis, ninhos de vespas). A eliminação de resíduos verdes é faturada ao custo real, salvo acordo em contrário."
    },
    {
      title: "12. Controlo de Pragas — Garantia",
      content: "Garantia de re-treatment de 30 dias para as espécies e áreas tratadas. Sujeito ao cumprimento das instruções de preparação e acompanhamento. Exclui reinfestações de vizinhos ou falhas estruturais não corrigidas pelo cliente."
    },
    {
      title: "13. Gestão de Resíduos",
      content: "Eliminação em conformidade com as leis ambientais suíças. As taxas de lixeira são faturadas ao preço de custo. Resíduos perigosos não declarados autorizam a Kraken a suspender os trabalhos e faturar custos adicionais de tratamento especializado."
    },
    {
      title: "14. Deveres do Cliente, Acesso & Tempos de Espera",
      content: "Garantir acesso livre, água, eletricidade, aquecimento e elevador. A falta de acesso é faturada a 100%. Atrasos de acesso >15 min são faturados a CHF 90.00/hora/persona em frações de 15 min. As chaves entregues são guardadas de forma segura e anónima."
    },
    {
      title: "15. Reclamações & Notificação de Defeitos",
      content: "Inspecionar os trabalhos logo após a conclusão. Defeitos visíveis reportados em 48h; ocultos em 48h após a descoberta (máx. 7 dias pós-serviço). A correção é a solução primária. Retenções de faturas são autorizadas apenas para a parte afetada."
    },
    {
      title: "16. Responsabilidade Civil & Seguros",
      content: "Seguro de responsabilidade civil profissional com cobertura de até CHF 10 milhões. A Kraken responde apenas por danos diretos por culpa provada. Excluem-se lucros cessantes, danos indiretos ou perda de uso. Perda de chaves limitada ao custo de cópia padrão."
    },
    {
      title: "17. Subempreiteiros, Parceiros Especializados & Direito de Recusa",
      content: "A Kraken pode subcontratar parceiros qualificados mas permanece como único parceiro contratual. A Kraken reserva o direito de recusar ou suspender o serviço se existirem riscos para a saúde ou segurança das equipas."
    },
    {
      title: "18. Não-Recrutamento de Pessoal",
      content: "O cliente não contratará, direta ou indiretamente, nenhum colaborador da Kraken que atue nos seus imóveis durante o contrato e nos 6 meses seguintes. A infração implica uma indemnização de CHF 5'000.00 por colaborador."
    },
    {
      title: "19. Força Maior",
      content: "Nenhuma das partes responde por atrasos ou incumprimentos decorrentes de eventos fora de controlo (catástrofes, greves, pandemias, falhas de energia). Obrigações suspensas; se durar >30 dias, qualquer parte pode rescindir."
    },
    {
      title: "20. Proteção de Dados & Documentazione",
      content: "Tratamento confidencial de dados pessoais de acordo com a Lei de Proteção de Dados Suíça (LPD) e o RGPD. Fotos 'antes/depois' podem ser feitas para controlo de qualidade e seguros. Uso promocional de fotos exige consentimento prévio."
    },
    {
      title: "21. Alterações & Cláusula de Salvaguarda",
      content: "A Kraken pode alterar estas CGC com aviso prévio de 30 dias. A não objeção implica aceitação. Se alguma cláusula for considerada inválida, as restantes continuam vigentes e a cláusula inválida é substituída por uma equivalente ao fim económico."
    },
    {
      title: "22. Legislação Aplicável & Foro Competente",
      content: "Todos os contratos são regidos exclusivamente pelo direito suíço material, excluindo a CISG. O foro exclusivo é em Schaffhausen, Suíça. Salvaguardam-se os foros de consumo obrigatórios."
    }
  ],
  verificationTitle: 'Verificações e Conformidade',
  lastUpdated: 'Versão 2.0 — Entrada em vigor: 16.07.26',
  companyInfo: 'Kraken Properties and Facilities Management Gomes Mendes | Seewadelstrasse 3, 8203 Schaffhausen, Suíça',
  backHome: 'Regressar à Página de Início'
};

const ptHSE: HSETranslation = {
  title: 'Saúde, Segurança no Trabalho & Ambiente (HSE)',
  intro: 'O nosso compromisso para com a proteção de saúde no trabalho é inabalável. Cumprimos rigorosamente com as diretivas suíças e recomendações de higiene internacionais para o bem-estar do pessoal.',
  badge: 'Precisão Suíça, Padrão Global',
  sec1Title: 'Conformidades com Leis da Suíça',
  sec1P1: 'Toda a rotina operacional da nossa empresa obedece inteiramente às leis suíças.',
  uvgTitle: 'UVG (Seguro Contra Acidentes de Trabalho)',
  uvgText: 'Proteção obrigatória contra acidentes com seguro contratado para cada elemento ativo.',
  vuvTitle: 'VUV (Diretivas de Prevenção de Acidentes)',
  vuvText: 'Procedimentos de organização física e técnica nos locais:',
  vuvList: ['Segurança no posto de intervenção', 'Inspeção técnica e conservação de maquinarias', 'Atribuição preventiva de EPI (Equipamento de Proteção Individual)', 'Afixação de placas de perigo regulamentares'],
  ekasTitle: 'Regras EKAS (CFST)',
  ekasText: 'Cumprimento total de todas as disposições da Comissão Federal de Coordenação para a Segurança no Trabalho.',
  sec2Title: 'Parceria Suva / Enquadramento ISO',
  sec2P1: 'Estamos em permanente sintonia e trabalho conjunto com a Suva para prevenir quedas ou acidentes operacionais.',
  sec2List: [
    'Signatários da "Carta de Segurança" Suva',
    'Adequação aos métodos ISO 45001 (Saúde e Segurança de todos as equipas)',
    'Adequação aos métodos ISO 14001 (Preservação ecológica e ambiental)'
  ],
  isoTitle: 'Sistema Integrado de Controlo',
  isoText: 'Os métodos internos corporativos orientam-se com base nos requisitos padrões das directrizes ISO.',
  sec3Title: 'Plano Ativo de Controlo de Riscos',
  sec3Intro: 'Deteção rápida de irregularidades e perigos físicos nos imóveis.',
  riskTitle: 'Avaliação Preliminar no Terreno',
  riskText: 'Diagnóstico efetuado em cada residência ou escritório antes de se iniciar qualquer atividade.',
  riskList: ['Deteriorações de pisos e perigos de escorregamento', 'Doses controladas e toxicidade de solventes', 'Uso lombar mecânico para portabilidade de pesos', 'Prevenção em tomadas ou ligações aos quadros elétricos'],
  ramsTitle: 'Projetos RAMS (Procedimentos Técnicos)',
  ramsText: 'Descrevemos relatórios técnicos de intervenção RAMS em obras de dimensão ponderada.',
  ramsList: ['Instruções passo a passo de atuação segura', 'Rotas de evacuação e primeiros socorros', 'Supervisão do Chefe de Equipa de intervenção'],
  sec4Title: 'Manuseamento Químico Seguro (ChemV / MSDS)',
  sec4Intro: 'Armazenamento e manuseamento consciente de solventes ou produtos para limpeza química.',
  reqTitle: 'Obrigatoriedades',
  sec4List: [
    'Cumprimento da Portaria de Substâncias Químicas suíça (ChemV)',
    'Fichas de Dados de Segurança (FDS) obrigatórias arquivadas nos locais',
    'Materiais identificados com rótulos em locais adequados',
    'Aposta forte em substâncias de limpeza ecológica biodegradáveis'
  ],
  trainingTitle: 'Formação constante dos recursos',
  trainingText: 'Cursos práticos regulares sobre acidentes de derramamento e primeiros socorros.',
  trainingList: ['Dosagens recomendadas', 'Proibição de misturas não regulamentares de detergentes', 'Aparatos de lavagem ocular médica de urgência', 'Fardamentos específicos de manuseamento técnico'],
  sec5Title: 'Qualificação Profissional',
  sec5Intro: 'Uma equipa qualificada diminui a probabilidade de sinistralidade ativa.',
  sec5List: ['Cursos de integração de entrada', 'Revisões regulares ministradas internamente', 'Instrução para condução de maquinarias de alta pressão'],
  tbtTitle: 'Minutos de Segurança (Toolbox Talks)',
  tbtText: 'Conselhos preventivos sobre perigos, partilhados de forma rápida antes de iniciar.',
  tbtList: ['Posicionamento de escadotes e plataformas', 'Ergonomia para poupar as costas', 'Integridade dos cabos de alimentação elétrica', 'Protocolos para execução isolada em residências'],
  modulesTitle: 'Cursos E-Learning Corporativos',
  modulesText: 'Ensino à distância via computador partilhado e ensinado a todos os colaboradores.',
  modulesList: ['Instruções contra fogo', 'Higiene e contenção de infeções', 'Triagem de desperdício', 'Relação e comunicação segura com o cliente'],
  sec6Title: 'Objectivos ESG & Proteção do Planeta',
  envTitle: 'Neutralidade do Meio Ambiente',
  envText: 'Monitorização da pegada climática e preservação dos recursos naturais:',
  envList: [
    'Solventes com licenças e marcas ecológicas',
    'Sistemas com microfibra para redução drástica de água',
    'Aparelhos com eficiência energética',
    'Rotatividade e avanço de carros para eletricidade'
  ],
  wasteTitle: 'Separação ECO de Resíduos',
  wasteText: 'Tratamento de lixo de forma triada nas intervenções corporativas :',
  wasteList: ['Classificação para reaproveitamento (plástico, cartão, vidro, metais)', 'Centrais de tratamento autorizadas para restos de químicos', 'Anulação gradual de vasilhames ou plásticos de uso limitado'],
  co2Title: 'Neutralidade Climática',
  co2List: ['Controlo de volume de gases estufa emitidos', 'Plantação de florestas', 'Contratos com fornecedores ambientalmente certificados'],
  sec7Title: 'Verificações e Melhoramentos',
  sec7Intro: 'As medidas de segurança no trabalho são evolutivas. Ajustamos os termos operacionais HSE d\'accord com dados das nossas equipas.',
  sec7List: ['Auditorias nos locais', 'Registo digital e ágil de incidentes', 'Ações corretivas instantâneas'],
  sec7Footer: 'Estipulamos a regra de «Zero Acidentes». Para assegurar o regresso de cada colaborador com saúde à sua família todos os dias.'
};

const ptCareers: CareersTranslation = {
  title: 'Candidate-se e Junte-se a Nós',
  subtitle: 'Conquiste o seu futuro técnico de amanhã na Kraken Properties. Admitimos excelentes profissionais.',
  badge: 'Recursos Humanos',
  positionsTitle: 'Vagas de Trabalho',
  cleanerTitle: 'Operador de Higienização de Imóveis / Limpeza Técnica',
  cleanerLocation: 'Schaffhausen / Zurique',
  cleanerType: 'Tempo Parcial / Tempo Inteiro',
  applyButton: 'Enviar candidatura online →',
  formTitle: 'Registo de Candidatura',
  formName: 'Nome e Apelido',
  formEmail: 'Endereço de E-mail',
  formPhone: 'Número de Telefone',
  formPosition: 'Vaga Solicitada',
  formCV: 'Enviar Curriculum Vitae (CV e anexos)',
  uploadPlaceholder: 'Largue o ficheiro aqui ou clique para selecionar',
  fileLimit: 'Sólidos PDF, DOC até ao máximo de 5MB',
  formMessage: 'Apresentação / Motivação',
  formSubmit: 'Submeter Candidatura',
  formSubmitting: 'A registar dados...',
  successTitle: 'Candidatura Enviada',
  successText: 'Agradecemos o seu envio e tempo dedicado! Os especialistas de recursos humanos vão analisar as suas credenciais e dar feedback breve.',
  backButton: 'Volver para o portal principal',
  placeholderPositionName: 'ex. Profissional Limpezas'
};

const translations: Record<Language, { gdpr: GDPRTranslation; terms: TermsTranslation; hse: HSETranslation; careers: CareersTranslation }> = {
  'en': { gdpr: enGDPR, terms: enTerms, hse: enHSE, careers: enCareers },
  'de': { gdpr: deGDPR, terms: deTerms, hse: deHSE, careers: deCareers },
  'de-CH': { gdpr: deGDPR, terms: deTerms, hse: deHSE, careers: deCareers },
  'es': { gdpr: esGDPR, terms: esTerms, hse: esHSE, careers: esCareers },
  'fr': { gdpr: frGDPR, terms: frTerms, hse: frHSE, careers: frCareers },
  'it': { gdpr: itGDPR, terms: itTerms, hse: itHSE, careers: itCareers },
  'pt': { gdpr: ptGDPR, terms: ptTerms, hse: ptHSE, careers: ptCareers },
};

export function getGDPRTranslation(lang: Language): GDPRTranslation {
  return (translations[lang] || translations['en']).gdpr;
}

export function getTermsTranslation(lang: Language): TermsTranslation {
  return (translations[lang] || translations['en']).terms;
}

export function getHSETranslation(lang: Language): HSETranslation {
  return (translations[lang] || translations['en']).hse;
}

export function getCareersTranslation(lang: Language): CareersTranslation {
  return (translations[lang] || translations['en']).careers;
}
