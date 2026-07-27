import React, { useState } from 'react';
import { 
  SERVICE_MODAL_DATA, 
  DIFFERENTIATION_MATRIX_DATA, 
  MATRIX_SUMMARY_RULE, 
  EXTRAS_MASTER_DATA,
  ServiceModalInfo 
} from './serviceModalData';

export interface ServiceDetailsModalProps {
  type: string; // service id or extra id
  initialTab?: 'details' | 'matrix';
  onClose: () => void;
  onSelectService?: (serviceId: string) => void;
  language?: string;
}

const getServiceIcon = (id: string): string => {
  switch (id) {
    case 'moving':
    case 'moving-furniture':
      return '🚚';
    case 'gardening':
      return '🌿';
    case 'exterior-cleaning':
      return '🧽';
    case 'gutter-cleaning':
      return '🏠';
    case 'car-detailing':
      return '🚗';
    case 'pest-control':
      return '🛡️';
    case 'waste-management':
      return '♻️';
    case 'deep-cleaning':
      return '✨';
    case 'daily-cleaning':
      return '📅';
    case 'end-of-tenancy':
    default:
      return '🧹';
  }
};

export const ServiceDetailsModal: React.FC<ServiceDetailsModalProps> = ({
  type,
  initialTab = 'details',
  onClose,
  language = 'es'
}) => {
  const [activeTab, setActiveTab] = useState<'details' | 'matrix'>(initialTab);

  // Normalize service key (e.g. 'moving-furniture' -> 'moving')
  const serviceKey = type === 'moving-furniture' ? 'moving' : type;

  const lang = (language === 'de-CH' ? 'de' : (language || 'es')) as 'es' | 'en' | 'de' | 'fr' | 'it' | 'pt';

  const isExtra = Boolean(EXTRAS_MASTER_DATA[serviceKey]);
  const extraInfo = EXTRAS_MASTER_DATA[serviceKey];
  const serviceInfo: ServiceModalInfo | undefined = SERVICE_MODAL_DATA[serviceKey] || SERVICE_MODAL_DATA['end-of-tenancy'];

  const getLangText = (obj: Record<string, string> | undefined, fallback: string = ''): string => {
    if (!obj) return fallback;
    return obj[lang] || obj['es'] || obj['en'] || fallback;
  };

  const isCoreCleaningOnly = ['end-of-tenancy', 'deep-cleaning', 'daily-cleaning'].includes(serviceKey);

  // Translations for modal UI elements
  const detailTab = { es: '📋 Detalle', de: '📋 Details', en: '📋 Details', fr: '📋 Détails', it: '📋 Dettagli', pt: '📋 Detalhes' }[lang] || '📋 Details';
  const matrixTab = { es: '📊 Matriz Comparativa', de: '📊 Vergleichsmatrix', en: '📊 Comparison Matrix', fr: '📊 Matrice Comparative', it: '📊 Matrice Comparativa', pt: '📊 Matriz Comparativa' }[lang] || '📊 Comparison Matrix';
  const subtitleText = { es: '¿Qué está incluido y qué no en esta modalidad?', de: 'Was ist in diesem Service enthalten und was nicht?', en: 'What is included and excluded in this service option?', fr: 'Qu\'est-ce qui est inclus et exclu dans cette option ?', it: 'Cosa è incluso ed escluso in questa opzione?', pt: 'O que está incluído e excluído nesta opção?' }[lang] || 'What is included and excluded in this service option?';
  const positioningTitle = { es: 'Línea de Posicionamiento', de: 'Positionierung & Zweck', en: 'Positioning & Purpose', fr: 'Positionnement & Objectif', it: 'Posizionamento e Scopo', pt: 'Linha de Posicionamento' }[lang] || 'Positioning & Purpose';
  const includedBadge = { es: 'INCLUIDO', de: 'INKLUSIVE', en: 'INCLUDED', fr: 'INCLUS', it: 'INCLUSO', pt: 'INCLUÍDO' }[lang] || 'INCLUDED';
  const complementBadge = { es: 'complemento', de: 'Zusatzleistung', en: 'add-on', fr: 'complément', it: 'complemento', pt: 'complemento' }[lang] || 'add-on';
  const exclusionsTitle = { es: 'NO INCLUIDO Y CONDICIONES DEL SERVICIO', de: 'NICHT INBEGRIFFEN & BEDINGUNGEN', en: 'NOT INCLUDED & SERVICE CONDITIONS', fr: 'NON INCLUS & CONDITIONS DU SERVICE', it: 'NON INCLUSO E CONDIZIONI DEL SERVIZIO', pt: 'NÃO INCLUÍDO E CONDIÇÕES DO SERVIÇO' }[lang] || 'NOT INCLUDED & SERVICE CONDITIONS';
  const guaranteeTitle = { es: 'Nota de Garantía & Servicio', de: 'Garantie- & Servicehinweis', en: 'Guarantee & Service Note', fr: 'Note de Garantie & Service', it: 'Nota di Garanzia e Servizio', pt: 'Nota de Garantia e Serviço' }[lang] || 'Guarantee & Service Note';
  const goldenRuleTitle = { es: 'Regla de Oro de Selección', de: 'Goldene Auswahlregel', en: 'Golden Selection Rule', fr: 'Règle d\'or de sélection', it: 'Regola d\'Oro di Selezione', pt: 'Regra de Ouro de Seleção' }[lang] || 'Golden Selection Rule';
  const extraIncludesTitle = { es: '¿Qué incluye esta tarea extra?', de: 'Was beinhaltet diese Extra-Leistung?', en: 'What does this extra task include?', fr: 'Que comprend ce service supplémentaire ?', it: 'Cosa include questo servizio extra?', pt: 'O que inclui esta tarefa extra?' }[lang] || 'What does this extra task include?';
  const limitIncludedText = { es: 'Límite incluido:', de: 'Inbegriffene Grenze:', en: 'Included limit:', fr: 'Limite incluse :', it: 'Limite incluso:', pt: 'Limite incluído:' }[lang] || 'Included limit:';
  const footerNote = { es: 'Muster & Estándares conforme a la normativa suiza de limpieza y entrega.', de: 'Muster & Standards gemäss Schweizer Reinigungs- und Übergabevorschriften.', en: 'Standards compliant with Swiss cleaning and property handover guidelines.', fr: 'Normes conformes aux directives suisses de nettoyage et de remise.', it: 'Standard conformi alle direttive svizzere di pulizia e consegna.', pt: 'Normas em conformidade com as diretrizes suíças de limpeza e entrega.' }[lang] || 'Standards compliant with Swiss cleaning and property handover guidelines.';
  const closeBtnText = { es: 'Entendido', de: 'Verstanden', en: 'Got it', fr: 'Compris', it: 'Ho capito', pt: 'Entendido' }[lang] || 'Got it';

  const matrixHeaders = {
    es: { dimension: 'Criterio / Dimensión', eot: 'Fin de Contrato', deep: 'Limpieza Profunda', recurrent: 'Limpieza Recurrente', moving: 'Mudanza & Transporte' },
    de: { dimension: 'Kriterium / Dimension', eot: 'Umzugsreinigung', deep: 'Tiefenreinigung', recurrent: 'Unterhaltsreinigung', moving: 'Umzug & Transport' },
    en: { dimension: 'Criteria / Dimension', eot: 'End of Tenancy', deep: 'Deep Cleaning', recurrent: 'Regular Cleaning', moving: 'Moving & Transport' },
    fr: { dimension: 'Critère / Dimension', eot: 'Fin de Bail', deep: 'Nettoyage Profond', recurrent: 'Nettoyage Régulier', moving: 'Déménagement & Transport' },
    it: { dimension: 'Criterio / Dimensione', eot: 'Fine Locazione', deep: 'Pulizia Profonda', recurrent: 'Pulizia Ricorrente', moving: 'Trasloco e Trasporto' },
    pt: { dimension: 'Critério / Dimensão', eot: 'Fim de Contrato', deep: 'Limpeza Profunda', recurrent: 'Limpeza Recorrente', moving: 'Mudança e Transporte' }
  }[lang] || { dimension: 'Criteria / Dimension', eot: 'End of Tenancy', deep: 'Deep Cleaning', recurrent: 'Regular Cleaning', moving: 'Moving & Transport' };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl flex flex-col max-h-[92vh] overflow-hidden border border-slate-100">
        
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-slate-100 bg-slate-50/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#002D5B] text-white flex items-center justify-center shrink-0 shadow-md">
              <span className="text-xl">{isExtra ? '✨' : getServiceIcon(serviceKey)}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black text-[#002D5B]">
                  {isExtra 
                    ? getLangText(extraInfo?.title, 'Detail') 
                    : getLangText(serviceInfo?.title, 'Service Details')}
                </h3>
                {serviceInfo?.subTitle && !isExtra && (
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 text-[11px] font-bold">
                    {serviceInfo.subTitle}
                  </span>
                )}
                {serviceInfo?.badge && !isExtra && (
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold">
                    {getLangText(serviceInfo.badge)}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {isExtra 
                  ? `${extraInfo?.priceText} · ${extraInfo?.durationText} · ${getLangText(extraInfo?.limit)}` 
                  : subtitleText}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* View Mode Tabs (Only for core services) */}
            {!isExtra && isCoreCleaningOnly && (
              <div className="flex items-center gap-1 bg-slate-200/60 p-1 rounded-xl shrink-0 mr-1">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                    activeTab === 'details'
                      ? 'bg-[#002D5B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {detailTab}
                </button>
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`px-3 py-1.5 rounded-lg transition-all text-xs font-bold ${
                    activeTab === 'matrix'
                      ? 'bg-[#002D5B] text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {matrixTab}
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-200/70 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition-colors font-bold text-lg"
              title="Close"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Main Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto custom-scrollbar flex-1 bg-slate-50 space-y-6">

          {/* EXTRA DETAILS VIEW */}
          {isExtra && extraInfo && (
            <div className="space-y-6">
              <div className="bg-amber-50/90 border border-amber-200/80 rounded-2xl p-4 flex items-start gap-3">
                <div className="text-2xl">ℹ️</div>
                <div>
                  <h4 className="font-bold text-amber-900 text-sm">
                    {getLangText(extraInfo.subTitle)}
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-1">
                    <strong>{limitIncludedText}</strong> {getLangText(extraInfo.limit)}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs">
                <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3 text-[#002D5B] border-b pb-2 border-slate-100">
                  {extraIncludesTitle}
                </h4>
                <ul className="space-y-2.5">
                  {extraInfo.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start text-xs sm:text-sm text-slate-700 leading-relaxed">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold mr-2.5 shrink-0 mt-0.5">✓</span>
                      <span>{getLangText(bullet)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* SERVICE DETAILS VIEW */}
          {!isExtra && activeTab === 'details' && serviceInfo && (
            <div className="space-y-6">

              {/* Positioning Callout Line */}
              <div className="bg-[#002D5B]/5 border-l-4 border-l-[#007bff] p-4 rounded-r-2xl">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-black uppercase tracking-wider text-[#007bff]">
                    {positioningTitle}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-800 font-semibold italic leading-relaxed">
                  «{getLangText(serviceInfo.positioning)}»
                </p>
              </div>

              {/* Included Sections Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {serviceInfo.sections.map((section, sIdx) => (
                  <div
                    key={sIdx}
                    className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/70 shadow-2xs hover:shadow-xs transition-shadow"
                  >
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100">
                      <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-[#002D5B]">
                        {getLangText(section.title)}
                      </h4>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100">
                        {includedBadge}
                      </span>
                    </div>

                    <ul className="space-y-2">
                      {section.items.map((item, iIdx) => {
                        const text = getLangText(item.text);
                        // Format nicely
                        const formattedText = text ? (text.charAt(0).toUpperCase() + text.slice(1) + (text.endsWith('.') ? '' : '.')) : '';
                        return (
                          <li key={iIdx} className="flex items-start text-xs sm:text-sm text-slate-700 leading-relaxed">
                            <span className="w-4 h-4 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[10px] font-bold mr-2 shrink-0 mt-0.5">
                              ✓
                            </span>
                            <span>
                              {formattedText}
                              {item.isComplement && (
                                <span className="ml-1.5 text-[10px] font-bold px-1.5 py-0.5 bg-amber-50 text-amber-700 rounded border border-amber-200">
                                  {complementBadge}
                                </span>
                              )}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Conditions & NOT INCLUDED Box */}
              {serviceInfo.exclusions && serviceInfo.exclusions.length > 0 && (
                <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 border border-slate-800 shadow-sm">
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-800">
                    <span className="text-base">⛔</span>
                    <h4 className="font-black text-xs uppercase tracking-wider text-rose-400">
                      {exclusionsTitle}
                    </h4>
                  </div>
                  <ul className="space-y-2">
                    {serviceInfo.exclusions.map((ex, exIdx) => {
                      const text = getLangText(ex);
                      const formattedText = text ? (text.charAt(0).toUpperCase() + text.slice(1) + (text.endsWith('.') ? '' : '.')) : '';
                      return (
                        <li key={exIdx} className="flex items-start text-xs sm:text-sm text-slate-300 leading-relaxed">
                          <span className="w-4 h-4 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center text-[10px] font-bold mr-2 shrink-0 mt-0.5">
                            ✕
                          </span>
                          <span>{formattedText}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {/* Guarantee or Recommendation Callout */}
              {serviceInfo.guaranteeNote && (
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-2xl p-4 flex items-start gap-3">
                  <div className="text-xl">🛡️</div>
                  <div>
                    <h5 className="font-bold text-emerald-900 text-xs uppercase tracking-wider">
                      {guaranteeTitle}
                    </h5>
                    <p className="text-xs sm:text-sm text-emerald-900/90 mt-1 leading-relaxed font-medium">
                      {getLangText(serviceInfo.guaranteeNote)}
                    </p>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* DIFFERENTIATION MATRIX VIEW */}
          {!isExtra && activeTab === 'matrix' && (
            <div className="space-y-6">

              {/* Golden Summary Rule Box */}
              <div className="bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-amber-500/10 border border-amber-300/60 rounded-2xl p-4 sm:p-5 text-center">
                <span className="text-amber-700 text-xs font-black uppercase tracking-widest block mb-1">
                  {goldenRuleTitle}
                </span>
                <p className="text-xs sm:text-base font-bold text-slate-900 italic leading-relaxed">
                  {getLangText(MATRIX_SUMMARY_RULE)}
                </p>
              </div>

              {/* Differentiation Table */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#002D5B] text-white font-bold text-[11px] uppercase tracking-wider">
                        <th className="p-3.5 border-b border-slate-700 min-w-[140px]">{matrixHeaders.dimension}</th>
                        <th className={`p-3.5 border-b border-slate-700 min-w-[150px] ${serviceKey === 'end-of-tenancy' ? 'bg-[#007bff]/40 ring-2 ring-blue-400 font-black' : ''}`}>{matrixHeaders.eot}</th>
                        <th className={`p-3.5 border-b border-slate-700 min-w-[150px] ${serviceKey === 'deep-cleaning' ? 'bg-[#007bff]/40 ring-2 ring-blue-400 font-black' : ''}`}>{matrixHeaders.deep}</th>
                        <th className={`p-3.5 border-b border-slate-700 min-w-[150px] ${serviceKey === 'daily-cleaning' ? 'bg-[#007bff]/40 ring-2 ring-blue-400 font-black' : ''}`}>{matrixHeaders.recurrent}</th>
                        <th className={`p-3.5 border-b border-slate-700 min-w-[150px] ${serviceKey === 'moving' || serviceKey === 'moving-furniture' ? 'bg-[#007bff]/40 ring-2 ring-blue-400 font-black' : ''}`}>{matrixHeaders.moving}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                      {DIFFERENTIATION_MATRIX_DATA.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-slate-50/50' : 'bg-white'}>
                          <td className="p-3.5 font-bold text-slate-900 bg-slate-100/60">
                            {getLangText(row.dimension)}
                          </td>
                          <td className={`p-3.5 font-semibold ${serviceKey === 'end-of-tenancy' ? 'bg-blue-100/60 text-[#002D5B] font-bold' : ''}`}>
                            {getLangText(row.eot)}
                          </td>
                          <td className={`p-3.5 ${serviceKey === 'deep-cleaning' ? 'bg-blue-100/60 text-[#002D5B] font-bold' : ''}`}>
                            {getLangText(row.deep)}
                          </td>
                          <td className={`p-3.5 ${serviceKey === 'daily-cleaning' ? 'bg-blue-100/60 text-[#002D5B] font-bold' : ''}`}>
                            {getLangText(row.recurrent)}
                          </td>
                          <td className={`p-3.5 ${serviceKey === 'moving' || serviceKey === 'moving-furniture' ? 'bg-blue-100/60 text-[#002D5B] font-bold' : ''}`}>
                            {getLangText(row.moving)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between gap-4 shrink-0">
          <p className="text-xs text-slate-400 hidden sm:block font-medium">
            {footerNote}
          </p>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-2.5 bg-[#002D5B] hover:bg-[#001D3D] text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-colors ml-auto"
          >
            {closeBtnText}
          </button>
        </div>

      </div>
    </div>
  );
};

export default ServiceDetailsModal;
