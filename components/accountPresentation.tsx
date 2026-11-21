import React from 'react';

const copy = {
  de: { loginTitle: 'Ihre Dienstleistungen im Blick.', loginBody: 'Prüfen Sie Status und Details Ihrer eigenen Anfragen in Ihrem Kundenbereich.', registerTitle: 'Beginnen wir mit dem Wesentlichen.', registerBody: 'Erstellen Sie Ihren Zugang und speichern Sie Kontakt- und Immobiliendaten in vier Schritten.', items: ['Eigene Anfragen', 'Immobiliendaten', 'Serviceübersichten'] },
  en: { loginTitle: 'Your services, clearly organised.', loginBody: 'View the status and details of your own requests in your client space.', registerTitle: 'Start with the essentials.', registerBody: 'Create your access and save your contact and property details in four steps.', items: ['Your requests', 'Property details', 'Service summaries'] },
  fr: { loginTitle: 'Vos services, en toute clarté.', loginBody: 'Consultez le statut et les détails de vos propres demandes dans votre espace client.', registerTitle: 'Commençons par l’essentiel.', registerBody: 'Créez votre accès et enregistrez vos coordonnées et votre bien en quatre étapes.', items: ['Vos demandes', 'Détails du bien', 'Récapitulatifs des services'] },
  it: { loginTitle: 'I tuoi servizi, con chiarezza.', loginBody: 'Consulta lo stato e i dettagli delle tue richieste nella tua area clienti.', registerTitle: 'Iniziamo dall’essenziale.', registerBody: 'Crea il tuo accesso e salva i dati di contatto e dell’immobile in quattro passaggi.', items: ['Le tue richieste', 'Dati dell’immobile', 'Riepiloghi dei servizi'] },
  es: { loginTitle: 'Tus servicios, con claridad.', loginBody: 'Consulta el estado y los detalles de tus propias solicitudes en tu espacio de cliente.', registerTitle: 'Empecemos por lo esencial.', registerBody: 'Crea tu acceso y guarda los datos de contacto e inmueble en cuatro pasos.', items: ['Tus solicitudes', 'Datos del inmueble', 'Resúmenes de servicios'] },
  pt: { loginTitle: 'Os seus serviços, com clareza.', loginBody: 'Consulte o estado e os detalhes dos seus próprios pedidos na área de cliente.', registerTitle: 'Comecemos pelo essencial.', registerBody: 'Crie o seu acesso e guarde os dados de contacto e do imóvel em quatro passos.', items: ['Os seus pedidos', 'Dados do imóvel', 'Resumos dos serviços'] },
} as const;

export function AccountIntro({ language, mode }: { language: string; mode: 'login' | 'register' }) {
  const text = copy[language.split('-')[0] as keyof typeof copy] || copy.de;
  return <aside className="kraken-auth-intro hidden lg:flex min-w-0 flex-col justify-center gap-7 rounded-3xl bg-[#eef7f5] p-8 xl:p-10">
    <img src="/mascota-kraken-homepage-800.webp" width="192" height="192" alt="" loading="lazy" decoding="async" style={{ width: 192, height: 192, maxWidth: '100%' }} className="object-contain" />
    <div><p className="mb-3 text-sm font-semibold text-[#087f73]">Kraken PFM</p><h2 className="max-w-sm text-3xl font-semibold leading-tight text-[#082b45]">{mode === 'login' ? text.loginTitle : text.registerTitle}</h2><p className="mt-4 max-w-sm text-base leading-relaxed text-[#526574]">{mode === 'login' ? text.loginBody : text.registerBody}</p></div>
    <ul className="space-y-3 text-base text-[#082b45]">{text.items.map(item => <li key={item} className="flex items-center gap-3"><span aria-hidden="true" className="h-2 w-2 rounded-full bg-[#087f73]" />{item}</li>)}</ul>
  </aside>;
}
