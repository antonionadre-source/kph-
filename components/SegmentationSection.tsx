import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from '../i18n';
import { Home, Building2, Check, ChevronRight, Star, ChevronLeft, ShieldCheck, Trash2, Plus, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const starContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2
    }
  }
};

const starVariants = {
  hidden: { opacity: 0, scale: 0, rotate: -25 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 12 }
  }
};

interface SegmentationSectionProps {
  onNavigate: (page: string) => void;
}

const SegmentationSection: React.FC<SegmentationSectionProps> = ({ onNavigate }) => {
  const { t, language } = useTranslation();

  const mt = (en: string, es: string, de: string = en, fr: string = en, it: string = en, pt: string = en) => {
    if (language === 'es') return es;
    if (language === 'de' || language === 'de-CH') return de;
    if (language === 'fr') return fr;
    if (language === 'it') return it;
    if (language === 'pt') return pt;
    return en;
  };

  const getServiceLabel = (id: string) => {
    switch (id) {
      case 'gardening': return mt('Gardening', 'Jardinería', 'Gartenpflege', 'Jardinage', 'Giardinaggio', 'Jardinagem');
      case 'exterior-cleaning': return mt('Exterior cleaning', 'Limpieza exterior', 'Aussenreinigung', 'Nettoyage extérieur', 'Pulizia esterni', 'Limpeza exterior');
      case 'gutter-cleaning': return mt('Gutter cleaning', 'Canalones', 'Dachrinnenreinigung', 'Nettoyage gouttières', 'Pulizia grondaie', 'Limpeza de calhas');
      case 'pest-control': return mt('Pest control', 'Control de plagas', 'Schädlingsbekämpfung', 'Déparasitage', 'Disinfestazione', 'Controlo de pragas');
      case 'waste-management': return mt('Waste management', 'Eliminación de residuos', 'Entsorgung', 'Gestion des déchets', 'Smaltimento rifiuti', 'Eliminação de resíduos');
      case 'car-detailing': return mt('Car detailing', 'Car detailing', 'Fahrzeugaufbereitung', 'Esthétique auto', 'Dettaglio auto', 'Estética automóvel');
      case 'deep-cleaning': return mt('Deep cleaning', 'Limpieza a fondo', 'Tiefenreinigung', 'Nettoyage en profondeur', 'Pulizia profonda', 'Limpeza profunda');
      case 'regular-cleaning': return mt('Regular cleaning', 'Limpieza diaria', 'Unterhaltsreinigung', 'Nettoyage régulier', 'Pulizia ordinaria', 'Limpeza diária');
      case 'furniture-moving': return mt('Furniture moving', 'Mudanzas y muebles', 'Möbeltransport', 'Déménagement meuble', 'Trasloco mobili', 'Mudança de móveis');
      case 'end-of-tenancy': return mt('End of tenancy', 'Fin de alquiler', 'Umzugsreinigung', 'Remise d’état', 'Consegna chiavi', 'Fim de aluguer');
      default: return '';
    }
  };

  const getServiceDetails = (srv: {
    id: string;
    size?: string;
    condition?: string;
    hours?: string;
    distance?: string;
    addonsCount?: number;
  }) => {
    const addonsCount = srv.addonsCount || 0;
    const size = srv.size || 'M';
    const condition = srv.condition || 'Estándar';
    const hours = srv.hours || '4';
    const distance = srv.distance || 'Cerca';

    const addonSuffix = `${addonsCount} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;

    switch (srv.id) {
      case 'gardening': {
        const condStr = condition === 'Cuidado' 
          ? mt('Regularly maintained', 'Cuidado', 'Gepflegt', 'Entretenu', 'Curato', 'Cuidado') 
          : condition === 'Descuidado' 
          ? mt('Neglected', 'Descuidado', 'Verwildert', 'Négligé', 'Incolto', 'Descuidado') 
          : mt('Very neglected', 'Muy descuidado', 'Sehr verwildert', 'Très négligé', 'Molto incolto', 'Muito descuidado');
        return `${size} • ${condStr} • ${addonSuffix}`;
      }
      case 'exterior-cleaning': {
        const condStr = condition === 'Estándar' 
          ? mt('Standard soiling', 'Suciedad estándar', 'Standard', 'Salissure standard', 'Sporco standard', 'Sujidade padrão') 
          : condition === 'Sucia' 
          ? mt('Dirty', 'Sucio', 'Verschmutzt', 'Sale', 'Sporco', 'Suja') 
          : mt('Heavy soiling', 'Muy sucio', 'Sehr verschmutzt', 'Très sale', 'Molto sporco', 'Muito suja');
        return `${size} • ${condStr} • ${addonSuffix}`;
      }
      case 'gutter-cleaning': {
        const textFloors = size === '1' 
          ? mt('1 floor', '1 planta', '1 Stockwerk', '1 étage', '1 piano', '1 piso')
          : size === '2'
          ? mt('2 floors', '2 plantas', '2 Stockwerke', '2 étages', '2 piani', '2 pisos')
          : mt('3 floors', '3 plantas', '3 Stockwerke', '3 étages', '3 piani', '3 pisos');
        return `${textFloors} • ${addonSuffix}`;
      }
      case 'pest-control': {
        const levelStr = condition === 'Leve' 
          ? mt('Light infestation', 'Infestación leve', 'Leichter Befall', 'Infestation légère', 'Lieve infestazione', 'Infestação leve') 
          : condition === 'Moderada' 
          ? mt('Moderate infestation', 'Infestación moderada', 'Mittlerer Befall', 'Infestation modérée', 'Infestazione moderata', 'Infestação moderata') 
          : mt('Severe infestation', 'Infestación severa', 'Starker Befall', 'Infestation grave', 'Grave infestazione', 'Infestação grave');
        return `${levelStr} • ${addonSuffix}`;
      }
      case 'waste-management': {
        const m3Str = size === 'S' ? '1-2' : size === 'M' ? '3-5' : size === 'L' ? '6-10' : '+10';
        return `${size} (~${m3Str} m³) • ${addonSuffix}`;
      }
      case 'car-detailing': {
        const sizeStr = size === 'Compacto' 
          ? mt('Compact', 'Compacto', 'Kompaktwagen', 'Citadine', 'Compatta', 'Compacto') 
          : size === 'Sedán' 
          ? mt('Sedan', 'Sedán', 'Limousine', 'Berline', 'Berlina', 'Sedan') 
          : mt('SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4');
        return `${sizeStr} • ${addonSuffix}`;
      }
      case 'deep-cleaning': {
        const condStr = condition === 'Estándar' 
          ? mt('Standard', 'Estándar', 'Standard', 'Standard', 'Standard', 'Padrão') 
          : condition === 'Sucia' 
          ? mt('Dirty', 'Sucia', 'Verschmutzt', 'Sale', 'Sporca', 'Suja') 
          : mt('Heavy', 'Muy sucia', 'Sehr verschmutzt', 'Très sale', 'Molto sporca', 'Muito suja');
        return `${size} • ${condStr} • ${addonSuffix}`;
      }
      case 'regular-cleaning': {
        return `${size} • ${hours}h • ${addonSuffix}`;
      }
      case 'furniture-moving': {
        const distStr = distance === 'Cerca' 
          ? mt('Local (<10km)', 'Local (<10km)', 'Lokal (<10km)', 'Local (<10km)', 'Locale (<10km)', 'Local (<10km)') 
          : distance === 'Media' 
          ? mt('Medium (10-50km)', 'Media (10-50km)', 'Mittel (10-50km)', 'Moyen (10-50km)', 'Media (10-50km)', 'Média (10-50km)') 
          : mt('Long (>50km)', 'Lejos (>50km)', 'Weit (>50km)', 'Longue (>50km)', 'Lungo (>50km)', 'Longe (>50km)');
        return `${size} • ${distStr} • ${addonSuffix}`;
      }
      case 'end-of-tenancy': {
        const condStr = condition === 'Estándar' 
          ? mt('Standard', 'Estándar', 'Standard', 'Standard', 'Standard', 'Padrão') 
          : condition === 'Sucia' 
          ? mt('Dirty', 'Sucia', 'Verschmutzt', 'Sale', 'Sporca', 'Suja') 
          : mt('Heavy', 'Muy sucia', 'Sehr verschmutzt', 'Très sale', 'Molto sporca', 'Muito suja');
        return `${size} • ${condStr} • ${addonSuffix}`;
      }
      default:
        return '';
    }
  };

  const processSteps = [
    {
      number: '01',
      title: t('segment.process.step1.title'),
      desc: t('segment.process.step1.desc')
    },
    {
      number: '02',
      title: t('segment.process.step2.title'),
      desc: t('segment.process.step2.desc')
    },
    {
      number: '03',
      title: t('segment.process.step3.title'),
      desc: t('segment.process.step3.desc')
    },
    {
      number: '04',
      title: t('segment.process.step4.title'),
      desc: t('segment.process.step4.desc')
    },
    {
      number: '05',
      title: t('segment.process.step5.title'),
      desc: t('segment.process.step5.desc')
    }
  ];

  const [sliderX, setSliderX] = useState(50);
  const [isSliding, setIsSliding] = useState(false);
  const sliderRef = useRef<HTMLDivElement>(null);

  // Autoplay Autopilot Mode for B2C Demo
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);
  const [demoStep, setDemoStep] = useState<number>(0);

  const userInteract = () => {
    setIsDemoActive(false);
  };

  useEffect(() => {
    if (!isDemoActive) return;

    const interval = setInterval(() => {
      setDemoStep(prev => {
        const nextStep = (prev + 1) % 16;
        
        // Execute the visual automated interactions
        switch (nextStep) {
          case 0:
            setActiveServiceId('gardening');
            setGardenSize('S');
            setGardenCondition('Cuidado');
            setGardenAddons([]);
            break;
          case 1:
            setAddedServices(current => {
              const base = 180;
              const details = `S - Cuidado - 0 add-ons`;
              const item = {
                id: 'gardening',
                key: 'gardening',
                label: mt('Gardening', 'Jardinería', 'Gartenpflege', 'Jardinage', 'Giardinaggio', 'Jardinagem'),
                details,
                price: base,
                icon: '🌿',
                size: 'S',
                condition: 'Cuidado',
                addonsCount: 0
              };
              const filtered = current.filter(x => x.id !== 'gardening');
              return [...filtered, item];
            });
            break;
          case 2:
            setActiveServiceId('deep-cleaning');
            setDeepSize('M');
            setDeepCondition('Sucia');
            setDeepAddons(['ventanas']);
            break;
          case 3:
            setAddedServices(current => {
              const details = `M - Sucia - 1 add-on`;
              const item = {
                id: 'deep-cleaning',
                key: 'deep-cleaning',
                label: mt('Deep cleaning', 'Limpieza a fondo', 'Tiefenreinigung', 'Nettoyage en profondeur', 'Pulizia profonda', 'Limpeza profunda'),
                details,
                price: Math.round(450 * 1.3) + 120,
                icon: '✨',
                size: 'M',
                condition: 'Sucia',
                addonsCount: 1
              };
              const filtered = current.filter(x => x.id !== 'deep-cleaning');
              return [...filtered, item];
            });
            break;
          case 4:
            setActiveServiceId('regular-cleaning');
            setRegularSize('M');
            setRegularHours('6');
            setRegularAddons(['planchado']);
            break;
          case 5:
            setAddedServices(current => {
              const details = `M - 6h - 1 add-on`;
              const item = {
                id: 'regular-cleaning',
                key: 'regular-cleaning',
                label: mt('Regular cleaning', 'Limpieza diaria', 'Unterhaltsreinigung', 'Nettoyage régulier', 'Pulizia ordinaria', 'Limpeza diária'),
                details,
                price: Math.round(160 * 1.4) + 60,
                icon: '🧹',
                size: 'M',
                hours: '6',
                addonsCount: 1
              };
              const filtered = current.filter(x => x.id !== 'regular-cleaning');
              return [...filtered, item];
            });
            break;
          case 6:
            setActiveServiceId('furniture-moving');
            setMovingSize('M');
            setMovingDistance('Cerca');
            setMovingAddons(['embalaje']);
            break;
          case 7:
            setAddedServices(current => {
              const details = `M - Cerca - 1 add-on`;
              const item = {
                id: 'furniture-moving',
                key: 'furniture-moving',
                label: mt('Furniture moving', 'Mudanzas y muebles', 'Möbeltransport', 'Déménagement meuble', 'Trasloco mobili', 'Mudança de móveis'),
                details,
                price: Math.round(850 * 1.0) + 250,
                icon: '🚚',
                size: 'M',
                distance: 'Cerca',
                addonsCount: 1
              };
              const filtered = current.filter(x => x.id !== 'furniture-moving');
              return [...filtered, item];
            });
            break;
          case 8:
            setActiveServiceId('end-of-tenancy');
            setTenancySize('M');
            setTenancyCondition('Estándar');
            setTenancyAddons(['garantia']);
            break;
          case 9:
            setAddedServices(current => {
              const details = `M - Estándar - 1 add-on`;
              const item = {
                id: 'end-of-tenancy',
                key: 'end-of-tenancy',
                label: mt('End of tenancy', 'Fin de alquiler', 'Umzugsreinigung', 'Remise d’état', 'Consegna chiavi', 'Fim de aluguer'),
                details,
                price: Math.round(680 * 1.0) + 190,
                icon: '🔑',
                size: 'M',
                condition: 'Estándar',
                addonsCount: 1
              };
              const filtered = current.filter(x => x.id !== 'end-of-tenancy');
              return [...filtered, item];
            });
            break;
          case 10:
            setActiveServiceId('exterior-cleaning');
            setExteriorSize('M');
            setExteriorCondition('Sucia');
            setExteriorAddons(['sellado']);
            break;
          case 11:
            setAddedServices(current => {
              const details = `M - Sucia - 1 add-on`;
              const item = {
                id: 'exterior-cleaning',
                key: 'exterior-cleaning',
                label: mt('Exterior cleaning', 'Limpieza exterior', 'Aussenreinigung', 'Nettoyage extérieur', 'Pulizia esterni', 'Limpeza exterior'),
                details,
                price: Math.round(320 * 1.2) + 180,
                icon: '💧',
                size: 'M',
                condition: 'Sucia',
                addonsCount: 1
              };
              const filtered = current.filter(x => x.id !== 'exterior-cleaning');
              return [...filtered, item];
            });
            break;
          case 12:
            setActiveServiceId('pest-control');
            setPestLevel('Moderada');
            setPestAddons(['preventivo']);
            break;
          case 13:
            setAddedServices(current => {
              const details = `Moderada - 1 add-on`;
              const item = {
                id: 'pest-control',
                key: 'pest-control',
                label: mt('Pest control', 'Control de plagas', 'Schädlingsbekämpfung', 'Déparasitage', 'Disinfestazione', 'Controlo de pragas'),
                details,
                price: Math.round(250 * 1.4) + 100,
                icon: '🐜',
                condition: 'Moderada',
                addonsCount: 1
              };
              const filtered = current.filter(x => x.id !== 'pest-control');
              return [...filtered, item];
            });
            break;
          case 14:
            setActiveServiceId('gardening');
            setGardenSize('XL');
            setGardenCondition('Muy descuidado');
            setGardenAddons(['setos', 'poda', 'residuos']);
            break;
          case 15:
            // Clear to start fresh
            setAddedServices([
              {
                id: 'gardening',
                key: 'gardening',
                label: mt('Gardening', 'Jardinería', 'Gartenpflege', 'Jardinage', 'Giardinaggio', 'Jardinagem'),
                details: 'XL - Muy descuidado - 3 add-ons',
                price: Math.round(1100 * 1.6) + 120 + 210 + 80,
                icon: '🌿',
                size: 'XL',
                condition: 'Muy descuidado',
                addonsCount: 3
              }
            ]);
            break;
          default:
            break;
        }

        return nextStep;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isDemoActive, language]);

  // Configuration UI state
  const [activeServiceId, setActiveServiceId] = useState<'gardening' | 'exterior-cleaning' | 'gutter-cleaning' | 'pest-control' | 'waste-management' | 'car-detailing' | 'deep-cleaning' | 'regular-cleaning' | 'furniture-moving' | 'end-of-tenancy'>('gardening');
  
  // Gardening State
  const [gardenSize, setGardenSize] = useState<'S' | 'M' | 'L' | 'XL'>('L');
  const [gardenCondition, setGardenCondition] = useState<'Cuidado' | 'Descuidado' | 'Muy descuidado'>('Descuidado');
  const [gardenAddons, setGardenAddons] = useState<string[]>(['setos', 'poda']);

  // Exterior Cleaning State
  const [exteriorSize, setExteriorSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [exteriorCondition, setExteriorCondition] = useState<'Estándar' | 'Sucia' | 'Muy sucia'>('Estándar');
  const [exteriorAddons, setExteriorAddons] = useState<string[]>(['sellado']);

  // Gutter Cleaning State
  const [gutterSize, setGutterSize] = useState<'1' | '2' | '3'>('2');
  const [gutterAddons, setGutterAddons] = useState<string[]>(['preventiva', 'antihojas']);

  // Pest Control State
  const [pestLevel, setPestLevel] = useState<'Leve' | 'Moderada' | 'Intensa'>('Moderada');
  const [pestAddons, setPestAddons] = useState<string[]>([]);

  // Waste Management State
  const [wasteVolume, setWasteVolume] = useState<'S' | 'M' | 'L' | 'XL'>('S');
  const [wasteAddons, setWasteAddons] = useState<string[]>([]);

  // Car Detailing State
  const [carSize, setCarSize] = useState<'Compacto' | 'Sedán' | 'SUV/4x4'>('SUV/4x4');
  const [carAddons, setCarAddons] = useState<string[]>(['completo', 'ceramico']);

  // Deep Cleaning State
  const [deepSize, setDeepSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [deepCondition, setDeepCondition] = useState<'Estándar' | 'Sucia' | 'Muy sucia'>('Estándar');
  const [deepAddons, setDeepAddons] = useState<string[]>(['ventanas']);

  // Regular Cleaning State
  const [regularSize, setRegularSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [regularHours, setRegularHours] = useState<'2' | '4' | '6' | '8'>('4');
  const [regularAddons, setRegularAddons] = useState<string[]>(['planchado']);

  // Furniture Moving State
  const [movingSize, setMovingSize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [movingDistance, setMovingDistance] = useState<'Cerca' | 'Media' | 'Lejos'>('Cerca');
  const [movingAddons, setMovingAddons] = useState<string[]>(['embalaje']);

  // End of Tenancy State
  const [tenancySize, setTenancySize] = useState<'S' | 'M' | 'L' | 'XL'>('M');
  const [tenancyCondition, setTenancyCondition] = useState<'Estándar' | 'Sucia' | 'Muy sucia'>('Estándar');
  const [tenancyAddons, setTenancyAddons] = useState<string[]>(['garantia']);

  // Added Services in B2C project quote
  const [addedServices, setAddedServices] = useState<Array<{
    id: string;
    key: string;
    label: string;
    details: string;
    price: number;
    icon: string;
    size?: string;
    condition?: string;
    hours?: string;
    distance?: string;
    addonsCount?: number;
  }>>([
    {
      id: 'gardening',
      key: 'gardening',
      label: 'Jardinería',
      details: 'L - Descuidado - 2-add-ons',
      price: 1240,
      icon: '🌿',
      size: 'L',
      condition: 'Descuidado',
      addonsCount: 2
    },
    {
      id: 'exterior-cleaning',
      key: 'exterior-cleaning',
      label: 'Limpieza exterior',
      details: 'Terraza + fachada - Sellado',
      price: 680,
      icon: '💧',
      size: 'M',
      condition: 'Estándar',
      addonsCount: 1
    },
    {
      id: 'car-detailing',
      key: 'car-detailing',
      label: 'Car detailing',
      details: 'SUV - Completo - Cerámica 3 años',
      price: 540,
      icon: '🚗',
      size: 'SUV/4x4',
      addonsCount: 2
    }
  ]);

  const getActiveServicePrice = () => {
    switch(activeServiceId) {
      case 'gardening': {
        const base = gardenSize === 'S' ? 180 : gardenSize === 'M' ? 420 : gardenSize === 'L' ? 700 : 1100;
        const mult = gardenCondition === 'Cuidado' ? 1.0 : gardenCondition === 'Descuidado' ? 1.3 : 1.6;
        let addonsSum = 0;
        if (gardenAddons.includes('setos')) addonsSum += 120;
        if (gardenAddons.includes('poda')) addonsSum += 210;
        if (gardenAddons.includes('residuos')) addonsSum += 80;
        return Math.round(base * mult) + addonsSum;
      }
      case 'exterior-cleaning': {
        const base = exteriorSize === 'S' ? 150 : exteriorSize === 'M' ? 320 : exteriorSize === 'L' ? 500 : 850;
        const mult = exteriorCondition === 'Estándar' ? 1.0 : exteriorCondition === 'Sucia' ? 1.2 : 1.5;
        let addonsSum = 0;
        if (exteriorAddons.includes('basica')) addonsSum += 180;
        if (exteriorAddons.includes('antimanchas')) addonsSum += 120;
        if (exteriorAddons.includes('sellado')) addonsSum += 180;
        return Math.round(base * mult) + addonsSum;
      }
      case 'gutter-cleaning': {
        const base = gutterSize === '1' ? 120 : gutterSize === '2' ? 240 : 360;
        let addonsSum = 0;
        if (gutterAddons.includes('preventiva')) addonsSum += 120;
        if (gutterAddons.includes('antihojas')) addonsSum += 160;
        if (gutterAddons.includes('juntas')) addonsSum += 190;
        return base + addonsSum;
      }
      case 'pest-control': {
        const base = pestLevel === 'Leve' ? 180 : pestLevel === 'Moderada' ? 250 : 380;
        const mult = pestLevel === 'Leve' ? 1.0 : pestLevel === 'Moderada' ? 1.4 : 1.8;
        let addonsSum = 0;
        if (pestAddons.includes('preventivo')) addonsSum += 100;
        if (pestAddons.includes('gel')) addonsSum += 120;
        if (pestAddons.includes('certificado')) addonsSum += 150;
        return Math.round(base * mult) + addonsSum;
      }
      case 'waste-management': {
        const base = wasteVolume === 'S' ? 120 : wasteVolume === 'M' ? 240 : wasteVolume === 'L' ? 480 : 790;
        let addonsSum = 0;
        if (wasteAddons.includes('desmantelamiento')) addonsSum += 150;
        if (wasteAddons.includes('postvaciado')) addonsSum += 130;
        if (wasteAddons.includes('reciclaje')) addonsSum += 90;
        return base + addonsSum;
      }
      case 'car-detailing': {
        const base = carSize === 'Compacto' ? 180 : carSize === 'Sedán' ? 240 : 320;
        let addonsSum = 0;
        if (carAddons.includes('completo')) addonsSum += 150;
        if (carAddons.includes('ceramico')) addonsSum += 150;
        if (carAddons.includes('lavado')) addonsSum += 80;
        return base + addonsSum;
      }
      case 'deep-cleaning': {
        const base = deepSize === 'S' ? 220 : deepSize === 'M' ? 450 : deepSize === 'L' ? 750 : 1200;
        const mult = deepCondition === 'Estándar' ? 1.0 : deepCondition === 'Sucia' ? 1.3 : 1.6;
        let addonsSum = 0;
        if (deepAddons.includes('ventanas')) addonsSum += 120;
        if (deepAddons.includes('horno')) addonsSum += 90;
        if (deepAddons.includes('desinfeccion')) addonsSum += 110;
        return Math.round(base * mult) + addonsSum;
      }
      case 'regular-cleaning': {
        const base = regularSize === 'S' ? 90 : regularSize === 'M' ? 160 : regularSize === 'L' ? 240 : 320;
        const hoursMult = regularHours === '2' ? 0.8 : regularHours === '4' ? 1.0 : regularHours === '6' ? 1.4 : 1.8;
        let addonsSum = 0;
        if (regularAddons.includes('planchado')) addonsSum += 45;
        if (regularAddons.includes('balcon')) addonsSum += 40;
        if (regularAddons.includes('neveras')) addonsSum += 60;
        return Math.round(base * hoursMult) + addonsSum;
      }
      case 'furniture-moving': {
        const base = movingSize === 'S' ? 450 : movingSize === 'M' ? 850 : movingSize === 'L' ? 1400 : 2200;
        const distMult = movingDistance === 'Cerca' ? 1.0 : movingDistance === 'Media' ? 1.3 : 1.7;
        let addonsSum = 0;
        if (movingAddons.includes('embalaje')) addonsSum += 220;
        if (movingAddons.includes('desmontaje')) addonsSum += 140;
        if (movingAddons.includes('seguro')) addonsSum += 90;
        return Math.round(base * distMult) + addonsSum;
      }
      case 'end-of-tenancy': {
        const base = tenancySize === 'S' ? 380 : tenancySize === 'M' ? 680 : tenancySize === 'L' ? 1100 : 1800;
        const mult = tenancyCondition === 'Estándar' ? 1.0 : tenancyCondition === 'Sucia' ? 1.3 : 1.6;
        let addonsSum = 0;
        if (tenancyAddons.includes('garantia')) addonsSum += 150;
        if (tenancyAddons.includes('carpets')) addonsSum += 110;
        if (tenancyAddons.includes('bano')) addonsSum += 80;
        return Math.round(base * mult) + addonsSum;
      }
      default:
        return 0;
    }
  };

  const getActiveServiceDetails = () => {
    switch(activeServiceId) {
      case 'gardening': {
        const condStr = gardenCondition === 'Cuidado' 
          ? mt('Regularly maintained', 'Cuidado', 'Gepflegt', 'Entretenu', 'Curato', 'Cuidado') 
          : gardenCondition === 'Descuidado' 
          ? mt('Neglected', 'Descuidado', 'Verwildert', 'Négligé', 'Incolto', 'Descuidado') 
          : mt('Very neglected', 'Muy descuidado', 'Sehr verwildert', 'Très négligé', 'Molto incolto', 'Muito descuidado');
        return `${gardenSize} • ${condStr} • ${gardenAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      case 'exterior-cleaning': {
        const condStr = exteriorCondition === 'Estándar' 
          ? mt('Standard soiling', 'Suciedad estándar', 'Standard', 'Salissure standard', 'Sporco standard', 'Sujidade padrão') 
          : exteriorCondition === 'Sucia' 
          ? mt('Dirty', 'Sucio', 'Verschmutzt', 'Sale', 'Sporco', 'Suja') 
          : mt('Heavy soiling', 'Muy sucio', 'Sehr verschmutzt', 'Très sale', 'Molto sporco', 'Muito suja');
        return `${exteriorSize} • ${condStr} • ${exteriorAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      case 'gutter-cleaning':
        return `${gutterSize} ${mt('floor(s)', 'planta(s)', 'Stockwerk(e)', 'étage(s)', 'piano/i', 'piso(s)')} • ${gutterAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      case 'pest-control': {
        const levelStr = pestLevel === 'Leve' 
          ? mt('Light infestation', 'Infestación leve', 'Leichter Befall', 'Infestation légère', 'Lieve infestazione', 'Infestação leve') 
          : pestLevel === 'Moderada' 
          ? mt('Moderate infestation', 'Infestación moderada', 'Mittlerer Befall', 'Infestation modérée', 'Infestazione moderata', 'Infestação moderata') 
          : mt('Severe infestation', 'Infestación severa', 'Starker Befall', 'Infestation grave', 'Grave infestazione', 'Infestação grave');
        return `${levelStr} • ${pestAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      case 'waste-management':
        return `${wasteVolume} (~${wasteVolume === 'S' ? '1-2' : wasteVolume === 'M' ? '3-5' : wasteVolume === 'L' ? '6-10' : '+10'} m³) • ${wasteAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      case 'car-detailing': {
        const sizeStr = carSize === 'Compacto' 
          ? mt('Compact', 'Compacto', 'Kompaktwagen', 'Citadine', 'Compatta', 'Compacto') 
          : carSize === 'Sedán' 
          ? mt('Sedan', 'Sedán', 'Limousine', 'Berline', 'Berlina', 'Sedan') 
          : mt('SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4');
        return `${sizeStr} • ${carAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      case 'deep-cleaning': {
        const condStr = deepCondition === 'Estándar' 
          ? mt('Standard', 'Estándar', 'Standard', 'Standard', 'Standard', 'Padrão') 
          : deepCondition === 'Sucia' 
          ? mt('Dirty', 'Sucia', 'Verschmutzt', 'Sale', 'Sporca', 'Suja') 
          : mt('Heavy', 'Muy sucia', 'Sehr verschmutzt', 'Très sale', 'Molto sporca', 'Muito suja');
        return `${deepSize} • ${condStr} • ${deepAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      case 'regular-cleaning':
        return `${regularSize} • ${regularHours}h • ${regularAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      case 'furniture-moving': {
        const distStr = movingDistance === 'Cerca' 
          ? mt('Local (<10km)', 'Local (<10km)', 'Lokal (<10km)', 'Local (<10km)', 'Locale (<10km)', 'Local (<10km)') 
          : movingDistance === 'Media' 
          ? mt('Medium (10-50km)', 'Media (10-50km)', 'Mittel (10-50km)', 'Moyen (10-50km)', 'Media (10-50km)', 'Média (10-50km)') 
          : mt('Long (>50km)', 'Lejos (>50km)', 'Weit (>50km)', 'Longue (>50km)', 'Lungo (>50km)', 'Longe (>50km)');
        return `${movingSize} • ${distStr} • ${movingAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      case 'end-of-tenancy': {
        const condStr = tenancyCondition === 'Estándar' 
          ? mt('Standard', 'Estándar', 'Standard', 'Standard', 'Standard', 'Padrão') 
          : tenancyCondition === 'Sucia' 
          ? mt('Dirty', 'Sucia', 'Verschmutzt', 'Sale', 'Sporca', 'Suja') 
          : mt('Heavy', 'Muy sucia', 'Sehr verschmutzt', 'Très sale', 'Molto sporca', 'Muito suja');
        return `${tenancySize} • ${condStr} • ${tenancyAddons.length} ${mt('addon(s)', 'extra(s)', 'Zusatz', 'option(s)', 'servizio/i aggiuntivo/i', 'extra(s)')}`;
      }
      default:
        return '';
    }
  };

  const handleAddOrUpdateQuote = () => {
    const serviceLabels: Record<string, string> = {
      'gardening': mt('Gardening', 'Jardinería', 'Gartenpflege', 'Jardinage', 'Giardinaggio', 'Jardinagem'),
      'exterior-cleaning': mt('Exterior cleaning', 'Limpieza exterior', 'Aussenreinigung', 'Nettoyage extérieur', 'Pulizia esterni', 'Limpeza exterior'),
      'gutter-cleaning': mt('Gutter cleaning', 'Canalones', 'Dachrinnenreinigung', 'Nettoyage gouttières', 'Pulizia grondaie', 'Limpeza de calhas'),
      'pest-control': mt('Pest control', 'Control de plagas', 'Schädlingsbekämpfung', 'Déparasitage', 'Disinfestazione', 'Controlo de pragas'),
      'waste-management': mt('Waste management', 'Eliminación de residuos', 'Entsorgung', 'Gestion des déchets', 'Smaltimento rifiuti', 'Eliminação de resíduos'),
      'car-detailing': mt('Car detailing', 'Car detailing', 'Fahrzeugaufbereitung', 'Esthétique auto', 'Dettaglio auto', 'Estética automóvel'),
      'deep-cleaning': mt('Deep cleaning', 'Limpieza a fondo', 'Tiefenreinigung', 'Nettoyage en profondeur', 'Pulizia profonda', 'Limpeza profunda'),
      'regular-cleaning': mt('Regular cleaning', 'Limpieza diaria', 'Unterhaltsreinigung', 'Nettoyage régulier', 'Pulizia ordinaria', 'Limpeza diária'),
      'furniture-moving': mt('Furniture moving', 'Mudanzas y muebles', 'Möbeltransport', 'Déménagement meuble', 'Trasloco mobili', 'Mudança de móveis'),
      'end-of-tenancy': mt('End of tenancy', 'Fin de alquiler', 'Umzugsreinigung', 'Remise d’état', 'Consegna chiavi', 'Fim de aluguer')
    };

    const serviceIcons: Record<string, string> = {
      'gardening': '🌿',
      'exterior-cleaning': '💧',
      'gutter-cleaning': '🍂',
      'pest-control': '🐜',
      'waste-management': '🗑️',
      'car-detailing': '🚗',
      'deep-cleaning': '✨',
      'regular-cleaning': '🧹',
      'furniture-moving': '🚚',
      'end-of-tenancy': '🔑'
    };

    const getActiveServiceParams = () => {
      switch (activeServiceId) {
        case 'gardening':
          return {
            size: gardenSize,
            condition: gardenCondition,
            addonsCount: gardenAddons.length
          };
        case 'exterior-cleaning':
          return {
            size: exteriorSize,
            condition: exteriorCondition,
            addonsCount: exteriorAddons.length
          };
        case 'gutter-cleaning':
          return {
            size: gutterSize,
            addonsCount: gutterAddons.length
          };
        case 'pest-control':
          return {
            condition: pestLevel,
            addonsCount: pestAddons.length
          };
        case 'waste-management':
          return {
            size: wasteVolume,
            addonsCount: wasteAddons.length
          };
        case 'car-detailing':
          return {
            size: carSize,
            addonsCount: carAddons.length
          };
        case 'deep-cleaning':
          return {
            size: deepSize,
            condition: deepCondition,
            addonsCount: deepAddons.length
          };
        case 'regular-cleaning':
          return {
            size: regularSize,
            hours: regularHours,
            addonsCount: regularAddons.length
          };
        case 'furniture-moving':
          return {
            size: movingSize,
            distance: movingDistance,
            addonsCount: movingAddons.length
          };
        case 'end-of-tenancy':
          return {
            size: tenancySize,
            condition: tenancyCondition,
            addonsCount: tenancyAddons.length
          };
        default:
          return {
            addonsCount: 0
          };
      }
    };

    const params = getActiveServiceParams();
    const newLabel = serviceLabels[activeServiceId];
    const newDetails = getActiveServiceDetails();
    const newPrice = getActiveServicePrice();
    const newIcon = serviceIcons[activeServiceId];

    setAddedServices(prev => {
      const idx = prev.findIndex(item => item.id === activeServiceId);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = {
          ...updated[idx],
          ...params,
          details: newDetails,
          price: newPrice
        };
        return updated;
      } else {
        return [
          ...prev,
          {
            id: activeServiceId,
            key: activeServiceId,
            label: newLabel,
            details: newDetails,
            price: newPrice,
            icon: newIcon,
            ...params
          }
        ];
      }
    });
  };

  const handleRemoveQuote = (id: string) => {
    setAddedServices(prev => prev.filter(item => item.id !== id));
  };

  const handleSlideMove = (clientX: number) => {
    if (!sliderRef.current) return;
    const rect = sliderRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderX(percentage);
  };

  const handleSlideMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsSliding(true);
    handleSlideMove(e.clientX);
  };

  const handleSlideTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      handleSlideMove(e.touches[0].clientX);
    }
  };

  useEffect(() => {
    const handleGlobalMouseUp = () => {
      setIsSliding(false);
    };
    
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (isSliding) {
        handleSlideMove(e.clientX);
      }
    };

    if (isSliding) {
      window.addEventListener('mouseup', handleGlobalMouseUp);
      window.addEventListener('mousemove', handleGlobalMouseMove);
    }

    return () => {
      window.removeEventListener('mouseup', handleGlobalMouseUp);
      window.removeEventListener('mousemove', handleGlobalMouseMove);
    };
  }, [isSliding]);

  return (
    <>
      <section id="segmentation-section" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">

        {/* Animated Social Proof Banner */}
        <div className="flex flex-col items-center justify-center text-center mb-16 max-w-2xl mx-auto px-4">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={starContainerVariants}
            className="flex items-center gap-1.5 mb-3"
          >
            {[...Array(5)].map((_, i) => (
              <motion.div key={i} variants={starVariants}>
                <Star className="w-6 h-6 fill-amber-400 text-amber-400 filter drop-shadow-[0_2px_4px_rgba(251,191,36,0.25)]" />
              </motion.div>
            ))}
          </motion.div>
          
          {/* Brand Accurate Google reviews source */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-amber-50/50 border border-amber-100/60 hover:border-amber-200 transition-all rounded-full px-4 py-1.5 mb-4 text-xs shadow-sm select-none"
          >
            <div className="flex items-center font-semibold tracking-tight text-slate-700 gap-1.5">
              <span className="flex items-center gap-0.5 font-black text-sm select-none">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </span>
              <span className="w-1 h-1 bg-amber-300 rounded-full" />
              <div className="flex items-center gap-0.5 text-amber-700 font-black bg-amber-100 hover:bg-amber-200/80 transition-colors rounded-md px-2 py-0.5 text-[11px]">
                <span>5/5</span>
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500 shrink-0" />
              </div>
              <span className="w-1 h-1 bg-amber-300 rounded-full" />
              <span className="text-slate-500 font-bold">{t('segment.socialProof.source')}</span>
            </div>
          </motion.div>

          <motion.p 
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="text-slate-700 text-base md:text-lg font-black tracking-tight leading-relaxed select-none"
          >
            {t('segment.socialProof.text')}
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="w-16 h-1 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full mt-4"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-5xl mx-auto mb-24">
          {/* Private Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative bg-[#020617] rounded-[1.5rem] overflow-hidden flex flex-col md:flex-row h-full min-h-[380px] md:min-h-[310px]"
          >
            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between relative z-10">
              <div>
                <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center mb-3 border border-blue-500/30">
                  <Home className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-blue-400/60 text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 block">
                  {t('segment.private.badge')}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-white mb-2 tracking-tight leading-[1.1]">
                  {t('segment.private.title_part1')} <br />
                  <span className="text-blue-500">{t('segment.private.title_part2')}</span>
                </h2>
                <p className="text-slate-400 text-[10px] leading-relaxed mb-4 max-w-xs">
                  {t('segment.private.desc')}
                </p>

                <ul className="space-y-1.5 mb-6">
                  {[
                    t('segment.private.bullet1'),
                    t('segment.private.bullet2'),
                    t('segment.private.bullet3'),
                    t('segment.private.bullet4')
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-white/90 text-[10px] font-bold">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => onNavigate('services-page')}
                className="flex items-center gap-2 text-emerald-400 font-black uppercase text-[9px] tracking-widest hover:gap-4 transition-all group/btn"
              >
                {t('segment.private.cta')}
                <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
            
            <div 
              onClick={() => onNavigate('services-page')}
              className="h-44 md:h-auto md:w-1/2 relative overflow-hidden cursor-pointer"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent md:bg-gradient-to-r md:from-[#020617] z-10"></div>
              <img 
                src="/portada-interior-apartamento.webp" 
                alt={t('segment.private.alt')}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>

          {/* Commercial Card */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="group relative bg-slate-50 rounded-[1.5rem] overflow-hidden flex flex-col md:flex-row h-full min-h-[380px] md:min-h-[310px] border border-slate-100"
          >
            <div className="flex-1 p-5 md:p-6 flex flex-col justify-between relative z-10">
              <div>
                <div className="w-8 h-8 bg-blue-600/10 rounded-lg flex items-center justify-center mb-3 border border-blue-500/20">
                  <Building2 className="w-4 h-4 text-[#002d5b]" />
                </div>
                <span className="text-slate-400 text-[8px] font-black uppercase tracking-[0.3em] mb-1.5 block">
                  {t('segment.commercial.badge')}
                </span>
                <h2 className="text-xl md:text-2xl font-black text-[#002d5b] mb-2 tracking-tight leading-[1.1]">
                  {t('segment.commercial.title_part1')} <br />
                  <span className="text-blue-600">{t('segment.commercial.title_part2')}</span>
                </h2>
                <p className="text-slate-500 text-[10px] leading-relaxed mb-4 max-w-xs">
                  {t('segment.commercial.desc')}
                </p>

                <ul className="space-y-1.5 mb-6">
                  {[
                    t('segment.commercial.bullet1'),
                    t('segment.commercial.bullet2'),
                    t('segment.commercial.bullet3'),
                    t('segment.commercial.bullet4')
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-slate-700 text-[10px] font-bold">
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                        <Check className="w-2 h-2 text-white" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <button 
                onClick={() => onNavigate('commercial-quote')}
                className="flex items-center gap-2 text-emerald-600 font-black uppercase text-[9px] tracking-widest hover:gap-4 transition-all group/btn"
              >
                {t('segment.commercial.cta')}
                <ChevronRight className="w-3 h-3 transition-transform group-hover/btn:translate-x-1" />
              </button>
            </div>
            
            <div className="h-44 md:h-auto md:w-1/2 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-transparent to-transparent md:bg-gradient-to-r md:from-slate-50 z-10"></div>
              <img 
                src="/oficina-moderna-homepage.webp" 
                alt={t('segment.commercial.alt')}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
              />
            </div>
          </motion.div>
        </div>

        {/* Process Section */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest mb-6">
              {t('segment.process.badge')}
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-[#002d5b] tracking-tight">
              {t('segment.process.title_part1')} <span className="text-blue-600">{t('segment.process.title_part2')}</span>
            </h2>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="absolute top-10 left-0 right-0 h-px bg-slate-200 hidden md:block"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-12 relative z-10">
              {processSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full bg-white border border-slate-100 shadow-xl shadow-blue-900/5 flex items-center justify-center mb-8 relative z-10 group hover:scale-110 transition-transform">
                    <span className="text-xl font-black text-[#002d5b]">{step.number}</span>
                  </div>
                  <h3 className="text-lg font-black text-[#002d5b] mb-3 tracking-tight">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-[160px]">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>

        {/* B2C Interactive Quote Builder Section */}
        <section id="b2c-quote-builder" className="py-12 md:py-16 bg-slate-50 relative overflow-hidden border-t border-b border-slate-100 select-none">
      {/* Background Decorative Blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-45 -right-45 w-[350px] h-[350px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-45 -left-45 w-[350px] h-[350px] bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-25"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        
        {/* Header Block with no manual toggle button */}
        <div className="text-center mb-8 max-w-2xl mx-auto">
          <span className="inline-block px-3 py-1 rounded-full bg-blue-100/60 text-[#007bff] text-[8px] font-black uppercase tracking-widest mb-4 border border-blue-200/50">
            {mt('B2C - REAL-TIME CALCULATOR', 'B2C - CALCULADORA EN TIEMPO REAL', 'B2C - ECHTZEIT-RECHNER', 'B2C - CALCULATEUR TEMPS RÉEL', 'B2C - CALCOLO TEMPO REALE', 'B2C - CALCULADORA EM TEMPO REAL')}
          </span>
          <h2 className="text-2xl md:text-3xl font-black text-[#002d5b] tracking-tight leading-tight mb-3">
            {mt('Forget blind quotes.', 'Olvídese de los presupuestos a ciegas.', 'Vergessen Sie Blind-Offerten.', "Oubliez les devis à l'aveugle.", 'Dimentica i preventivi alla cieca.', 'Esqueça os orçamentos às cegas.')}{' '}
            <span className="text-[#007bff]">
              {mt('Instant B2C calculation.', 'Cálculo B2C al instante.', 'Sofortige B2C Berechnung.', 'Calcul B2C instantané.', 'Calcolo B2C all’istante.', 'Cálculo B2C instantâneo.')}
            </span>
          </h2>
          <p className="text-[11px] text-slate-500 font-bold leading-relaxed mb-6">
            {mt(
              'Select custom options below. Watch the live interactive autopilot simulate Swiss quotes, or pause to customize your own perfect service solution in CHF.',
              'Seleccione opciones a continuación. Vea la demo automática simular presupuestos suizos en tiempo real, o pulse cualquier opción para diseñar el suyo propio en CHF.',
              'Wählen Sie Optionen. Sehen Sie die Autopilot-Demo zur Simulation von Schweizer Offerten oder pausieren Sie, um Ihre eigene Offerte in CHF anzupassen.',
              'Sélectionnez des options. Regardez le pilote automatique simuler les tarifs suisses, ou cliquez pour configurer votre propre devis en CHF.',
              'Seleziona le opzioni. Guarda l’autopilota simulare tariffe svizzere, o premi per configurare il tuo preventivo personalizzato in CHF.',
              'Selecione as opções. Assista ao piloto automático simular orçamentos suíços em tempo real ou clique para personalizar o seu próprio em CHF.'
            )}
          </p>
        </div>

        {/* Main Columns Grid: Left configurable form (shrunk), Right live summary (shrunk) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-8 items-stretch">
          
          {/* Left Configurable Form Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-[0_10px_30px_rgba(0,0,0,0.015)] flex flex-col justify-between relative overflow-hidden transition-all duration-300">
            <div>
              {/* Dynamic Header based on activeServiceId */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl filter drop-shadow-sm select-none">
                    {activeServiceId === 'gardening' && '🌿'}
                    {activeServiceId === 'exterior-cleaning' && '💧'}
                    {activeServiceId === 'gutter-cleaning' && '🍂'}
                    {activeServiceId === 'pest-control' && '🐜'}
                    {activeServiceId === 'waste-management' && '🗑️'}
                    {activeServiceId === 'car-detailing' && '🚗'}
                    {activeServiceId === 'deep-cleaning' && '✨'}
                    {activeServiceId === 'regular-cleaning' && '🧹'}
                    {activeServiceId === 'furniture-moving' && '🚚'}
                    {activeServiceId === 'end-of-tenancy' && '🔑'}
                  </span>
                  <div>
                    <h4 className="font-extrabold text-[#002d5b] text-sm sm:text-base tracking-tight leading-none mb-0.5">
                      {activeServiceId === 'gardening' && mt('Gardening', 'Jardinería', 'Gartenpflege', 'Jardinage', 'Giardinaggio', 'Jardinagem')}
                      {activeServiceId === 'exterior-cleaning' && mt('Exterior cleaning', 'Limpieza exterior', 'Aussenreinigung', 'Nettoyage extérieur', 'Pulizia esterni', 'Limpeza exterior')}
                      {activeServiceId === 'gutter-cleaning' && mt('Gutter cleaning', 'Canalones', 'Dachrinnenreinigung', 'Nettoyage gouttières', 'Pulizia grondaie', 'Limpeza de calhas')}
                      {activeServiceId === 'pest-control' && mt('Pest control', 'Control de plagas', 'Schädlingsbekämpfung', 'Déparasitage', 'Disinfestazione', 'Controlo de pragas')}
                      {activeServiceId === 'waste-management' && mt('Waste management', 'Eliminación de residuos', 'Entsorgung', 'Gestion des déchets', 'Smaltimento rifiuti', 'Eliminação de resíduos')}
                      {activeServiceId === 'car-detailing' && mt('Car detailing', 'Car detailing', 'Fahrzeugaufbereitung', 'Esthétique auto', 'Dettaglio auto', 'Estética automóvel')}
                      {activeServiceId === 'deep-cleaning' && mt('Deep cleaning', 'Limpieza a fondo', 'Tiefenreinigung', 'Nettoyage en profondeur', 'Pulizia profonda', 'Limpeza profunda')}
                      {activeServiceId === 'regular-cleaning' && mt('Regular cleaning', 'Limpieza diaria', 'Unterhaltsreinigung', 'Nettoyage régulier', 'Pulizia ordinaria', 'Limpeza diária')}
                      {activeServiceId === 'furniture-moving' && mt('Furniture moving', 'Mudanzas y muebles', 'Möbeltransport', 'Déménagement meuble', 'Trasloco mobili', 'Mudança de móveis')}
                      {activeServiceId === 'end-of-tenancy' && mt('End of tenancy', 'Fin de alquiler', 'Umzugsreinigung', 'Remise d’état', 'Consegna chiavi', 'Fim de aluguer')}
                    </h4>
                    <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest leading-none">
                      {activeServiceId === 'gardening' && mt('Gardens & parks', 'Jardines & parques', 'Gärten & Parks', 'Jardins & parcs', 'Giardini e parchi', 'Jardins & parques')}
                      {activeServiceId === 'exterior-cleaning' && mt('Terraces & facades', 'Terrazas & fachadas', 'Terrassen & Fassaden', 'Terrasses & façades', 'Terrazze e facciate', 'Terraços & fachadas')}
                      {activeServiceId === 'gutter-cleaning' && mt('Height & sealing', 'Altura & sellado', 'Höhe & Abdichtung', 'Hauteur & étanchéité', 'Altezza e sigillatura', 'Altura & vedação')}
                      {activeServiceId === 'pest-control' && mt('24/7 Urgency', 'Urgencia 24/7', '24/7 Notdienst', 'Urgence 24/7', 'Urgente 24/7', 'Urgência 24/7')}
                      {activeServiceId === 'waste-management' && mt('Guided inventory', 'Inventario guiado', 'Geführtes Inventar', 'Inventaire guidé', 'Inventario guidato', 'Inventário guidado')}
                      {activeServiceId === 'car-detailing' && mt('Virtual garage', 'Garaje virtual', 'Virtuelle Garage', 'Garage virtuel', 'Garage virtuale', 'Garagem virtual')}
                      {activeServiceId === 'deep-cleaning' && mt('Heavy sanitize', 'Sanitización', 'Intensive Hygiene', 'Assainissement', 'Igiene profonda', 'Higienização')}
                      {activeServiceId === 'regular-cleaning' && mt('Broom & dusting', 'Polvo & mantenimiento', 'Staub & Pflege', 'Dépoussiérage', 'Spolvero e cura', 'Pó & manutenção')}
                      {activeServiceId === 'furniture-moving' && mt('Local logistics', 'Logística local', 'Lokale Logistik', 'Logistique locale', 'Logistica locale', 'Logística local')}
                      {activeServiceId === 'end-of-tenancy' && mt('With handover guarantee', 'Garantía de entrega', 'Mit Abgabegarantie', 'Garantie de remise', 'Garanzia consegna', 'Garantia de entrega')}
                    </p>
                  </div>
                </div>

                {/* Pulse Live Badge */}
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[8px] font-black uppercase tracking-wider border border-emerald-100 shadow-xs select-none">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shrink-0"></span>
                  {isDemoActive ? mt('AUTO DEMOING', 'DEMO ACTIVA', 'AUTO DEMO', 'DEMO ACTIVÉE', 'AUTO DEMO', 'DEMO ATIVA') : mt('MANUAL', 'MANUAL', 'MANUELL', 'MANUEL', 'MANUALE', 'MANUAL')}
                </div>
              </div>

              {/* Dynamic Inputs Form */}
              <div className="space-y-4">
                
                {/* 1. Size parameter inputs */}
                <div>
                  <label className="block text-[8px] font-black text-[#002d5b] uppercase tracking-widest mb-1.5 font-sans">
                    {activeServiceId === 'gutter-cleaning' 
                      ? mt('BUILDING HEIGHT', 'ALTURA DEL EDIFICIO', 'GEBÄUDEHÖHE', 'HAUTEUR DU BÂTIMENT', 'ALTEZZA EDIFICIO', 'ALTURA DO EDIFÍCIO') 
                      : activeServiceId === 'car-detailing'
                      ? mt('VEHICLE TYPE', 'TIPO DE VEHÍCULO', 'FAHRZEUGTYP', 'TYPE DE VÉHICULE', 'TIPO DI VEICOLO', 'TIPO DE VEHÍCULO')
                      : activeServiceId === 'pest-control'
                      ? mt('INFESTATION LEVEL', 'NIVEL DE INFESTACIÓN', 'BEFALLSGRAD', 'NIVEAU D\'INFESTATION', 'LIVELLO DI INFESTAZIONE', 'NÍVEL DE INFESTAÇÃO')
                      : mt('PROPERTY SIZE', 'TAMAÑO DE LA PROPIEDAD', 'GRUNDSTÜCKSGRÖSSE', 'TAILLE DE LA PROPRIÉTÉ', 'DIMENSIONE DELLA PROPRIETÀ', 'TAMANHO DA PROPRIEDADE')
                    }
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {activeServiceId === 'gardening' && (
                      ([
                        { id: 'S', label: mt('Small', 'Pequeña', 'Klein', 'Petit', 'Piccola', 'Pequena'), desc: '~100 m²' },
                        { id: 'M', label: mt('Medium', 'Mediana', 'Mittel', 'Moyen', 'Media', 'Média'), desc: '~300 m²' },
                        { id: 'L', label: mt('Large', 'Grande', 'Gross', 'Grand', 'Grande', 'Grande'), desc: '~600 m²' },
                        { id: 'XL', label: mt('X-Large', 'Muy Grande', 'Sehr Gross', 'Très Grand', 'Molto Grande', 'Muito Grande'), desc: '+600 m²' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setGardenSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${gardenSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${gardenSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'exterior-cleaning' && (
                      ([
                        { id: 'S', label: mt('Small', 'Pequeña', 'Klein', 'Petit', 'Piccola', 'Pequena'), desc: '~50 m²' },
                        { id: 'M', label: mt('Medium', 'Mediana', 'Mittel', 'Moyen', 'Media', 'Média'), desc: '~120 m²' },
                        { id: 'L', label: mt('Large', 'Grande', 'Gross', 'Grand', 'Grande', 'Grande'), desc: '~250 m²' },
                        { id: 'XL', label: mt('X-Large', 'Muy Grande', 'Sehr Gross', 'Très Grand', 'Molto Grande', 'Muito Grande'), desc: '+250 m²' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setExteriorSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${exteriorSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${exteriorSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'gutter-cleaning' && (
                      ([
                        { id: '1', label: mt('1 Floor', '1 Planta', '1 Stockwerk', '1 étage', '1 Piano', '1 Piso'), desc: mt('Single-story', 'Una planta', 'Einstöckig', 'Un étage', 'Monopiano', 'Térreo') },
                        { id: '2', label: mt('2 Floors', '2 Plantas', '2 Stockwerke', '2 étages', 'Due piani', '2 Pisos'), desc: mt('Double-story', 'Dos plantas', 'Zweistöckig', 'Deux étages', 'Bipiano', 'Dois andares') },
                        { id: '3', label: mt('3 Floors', '3 Plantas', '3 Stockwerke', '3 étages', 'Tre piani', '3 Pisos'), desc: mt('Triple-story', 'Tres plantas', 'Dreistöckig', 'Trois étages', 'Pluripiano', 'Três andares') }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setGutterSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${gutterSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${gutterSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'pest-control' && (
                      ([
                        { id: 'Leve', label: mt('Light', 'Leve', 'Leicht', 'Léger', 'Lieve', 'Leve'), desc: 'x1.0' },
                        { id: 'Moderada', label: mt('Moderate', 'Moderada', 'Mittel', 'Modéré', 'Moderata', 'Moderada'), desc: 'x1.4' },
                        { id: 'Intensa', label: mt('Severe', 'Intensa', 'Stark', 'Grave', 'Grave', 'Intensa'), desc: 'x1.8' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setPestLevel(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${pestLevel === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${pestLevel === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'waste-management' && (
                      ([
                        { id: 'S', label: 'S', desc: '1 - 2 m³' },
                        { id: 'M', label: 'M', desc: '3 - 5 m³' },
                        { id: 'L', label: 'L', desc: '6 - 10 m³' },
                        { id: 'XL', label: 'XL', desc: '10 m³+' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setWasteVolume(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${wasteVolume === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${wasteVolume === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'car-detailing' && (
                      ([
                        { id: 'Compacto', label: mt('Compact', 'Compacto', 'Kompaktwagen', 'Citadine', 'Compatta', 'Compacto'), desc: 'x1.0' },
                        { id: 'Sedán', label: mt('Sedan', 'Sedán', 'Limousine', 'Berline', 'Berlina', 'Sedan'), desc: 'x1.0' },
                        { id: 'SUV/4x4', label: mt('SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4', 'SUV / 4x4'), desc: 'x1.0' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setCarSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${carSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${carSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'deep-cleaning' && (
                      ([
                        { id: 'S', label: mt('Small', 'Pequeña', 'Klein', 'Petit', 'Piccola', 'Pequena'), desc: '~50 m²' },
                        { id: 'M', label: mt('Medium', 'Mediana', 'Mittel', 'Moyen', 'Media', 'Média'), desc: '~90 m²' },
                        { id: 'L', label: mt('Large', 'Grande', 'Gross', 'Grand', 'Grande', 'Grande'), desc: '~150 m²' },
                        { id: 'XL', label: mt('X-Large', 'Muy Grande', 'Sehr Gross', 'Très Grand', 'Molto Grande', 'Muito Grande'), desc: '+150 m²' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setDeepSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${deepSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${deepSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'regular-cleaning' && (
                      ([
                        { id: 'S', label: mt('Small', 'Pequeña', 'Klein', 'Petit', 'Piccola', 'Pequena'), desc: '~50 m²' },
                        { id: 'M', label: mt('Medium', 'Mediana', 'Mittel', 'Moyen', 'Media', 'Média'), desc: '~90 m²' },
                        { id: 'L', label: mt('Large', 'Grande', 'Gross', 'Grand', 'Grande', 'Grande'), desc: '~150 m²' },
                        { id: 'XL', label: mt('X-Large', 'Muy Grande', 'Sehr Gross', 'Très Grand', 'Molto Grande', 'Muito Grande'), desc: '+150 m²' }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setRegularSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${regularSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${regularSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'furniture-moving' && (
                      ([
                        { id: 'S', label: mt('Small', 'Pequeña', 'Klein', 'Petit', 'Piccola', 'Pequena'), desc: mt('1-2 rooms', '1-2 habs', '1-2 Zim.', '1-2 ch.', '1-2 stanze', '1-2 divisions') },
                        { id: 'M', label: mt('Medium', 'Mediana', 'Mittel', 'Moyen', 'Media', 'Média'), desc: mt('3-4 rooms', '3-4 habs', '3-4 Zim.', '3-4 ch.', '3-4 stanze', '3-4 divisions') },
                        { id: 'L', label: mt('Large', 'Grande', 'Gross', 'Grand', 'Grande', 'Grande'), desc: mt('5-6 rooms', '5-6 habs', '5-6 Zim.', '5-6 ch.', '5-6 stanze', '5-6 divisions') },
                        { id: 'XL', label: mt('X-Large', 'Muy Grande', 'Sehr Gross', 'Très Grand', 'Molto Grande', 'Muito Grande'), desc: mt('+6 rooms', '+6 habs', '+6 Zim.', '+6 ch.', '+6 stanze', '+6 divisions') }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setMovingSize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${movingSize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${movingSize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}

                    {activeServiceId === 'end-of-tenancy' && (
                      ([
                        { id: 'S', label: mt('Small', 'Pequeña', 'Klein', 'Petit', 'Piccola', 'Pequena'), desc: mt('1.5-2.5 rms', '1.5-2.5 habs', '1.5-2.5 Zim.', '1.5-2.5 ch.', '1.5-2.5 st.', '1.5-2.5 div.') },
                        { id: 'M', label: mt('Medium', 'Mediana', 'Mittel', 'Moyen', 'Media', 'Média'), desc: mt('3.5-4.5 rms', '3.5-4.5 habs', '3.5-4.5 Zim.', '3.5-4.5 ch.', '3.5-4.5 st.', '3.5-4.5 div.') },
                        { id: 'L', label: mt('Large', 'Grande', 'Gross', 'Grand', 'Grande', 'Grande'), desc: mt('5.5 rms', '5.5 habs', '5.5 Zim.', '5.5 ch.', '5.5 st.', '5.5 div.') },
                        { id: 'XL', label: mt('X-Large', 'Muy Grande', 'Sehr Gross', 'Très Grand', 'Molto Grande', 'Muito Grande'), desc: mt('+5.5 rms', '+5.5 habs', '+5.5 Zim.', '+5.5 ch.', '+5.5 st.', '+5.5 div.') }
                      ] as const).map((sz) => (
                        <button
                          key={sz.id}
                          onClick={() => { userInteract(); setTenancySize(sz.id); }}
                          className={`py-2 px-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-center ${tenancySize === sz.id ? 'bg-[#002d5b] text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'}`}
                        >
                          <span className="font-black text-[10px] uppercase tracking-wider">{sz.label}</span>
                          <span className={`${tenancySize === sz.id ? 'text-blue-200' : 'text-slate-400'} text-[8px] font-bold mt-0.5`}>{sz.desc}</span>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* 2. Condition multipliers / Secondary parameters */}
                {(activeServiceId === 'gardening' || activeServiceId === 'exterior-cleaning' || activeServiceId === 'deep-cleaning' || activeServiceId === 'end-of-tenancy' || activeServiceId === 'regular-cleaning' || activeServiceId === 'furniture-moving') && (
                  <div>
                    <label className="block text-[8px] font-black text-[#002d5b] uppercase tracking-widest mb-1.5 font-sans">
                      {activeServiceId === 'gardening' && mt('GARDEN CONDITION', 'ESTADO DEL JARDÍN', 'GARTENZUSTAND', 'ÉTAT DU JARDIN', 'STATO DEL GIARDINO', 'ESTADO DO JARDIM')}
                      {activeServiceId === 'exterior-cleaning' && mt('SOILING LEVEL', 'NIVEL DE SUCIEDAD', 'VERSCHMUTZUNGSGRAD', 'NIVEAU DE SALISSURE', 'LIVELLO DI SPORCO', 'NÍVEL DE SUJEIRA')}
                      {activeServiceId === 'deep-cleaning' && mt('SOILING LEVEL', 'NIVEL DE SUCIEDAD', 'VERSCHMUTZUNGSGRAD', 'NIVEAU DE SALISSURE', 'LIVELLO DI SPORCO', 'NÍVEL DE SUJEIRA')}
                      {activeServiceId === 'end-of-tenancy' && mt('APARTMENT CONDITION', 'ESTADO DEL PISO', 'WOHNUNGSZUSTAND', 'ÉTAT DE L\'APPARTEMENT', 'STATO DELL\'APPARTAMENTO', 'ESTADO DO APARTAMENTO')}
                      {activeServiceId === 'regular-cleaning' && mt('DAILY CLEANING HOURS', 'HORAS DE LIMPIEZA', 'REINIGUNGSSTRUNDEN', 'HEURES DE NETTOYAGE', 'ORE DI PULIZIA', 'HORAS DE LIMPEZA')}
                      {activeServiceId === 'furniture-moving' && mt('MOVING DISTANCE', 'DISTANCIA DE MUDANZA', 'UMZUGSDISTANZ', 'DISTANCE DU DÉMÉNAGEMENT', 'DISTANZA TRASLOCO', 'DISTÂNCIA DE MUDANÇA')}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {activeServiceId === 'gardening' && (
                        ([
                          { id: 'Cuidado', label: mt('Cared (1.0)', 'Cuidado (1.0)', 'Gepflegt (1.0)', 'Soigné (1.0)', 'Curato (1.0)', 'Cuidado (1.0)') },
                          { id: 'Descuidado', label: mt('Neglected (1.3)', 'Descuidado (1.3)', 'Verwildert (1.3)', 'Négligé (1.3)', 'Incolto (1.3)', 'Descuidado (1.3)') },
                          { id: 'Muy descuidado', label: mt('Very Neglected (1.6)', 'Muy descuidado (1.6)', 'Sehr verwildert (1.6)', 'Très négligé (1.6)', 'Molto incolto (1.6)', 'Muito descuidado (1.6)') }
                        ] as const).map((cond) => (
                          <button
                            key={cond.id}
                            onClick={() => { userInteract(); setGardenCondition(cond.id); }}
                            className={`py-2 px-2 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider transition-all sm:col-span-1 ${gardenCondition === cond.id ? 'bg-blue-600 text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                          >
                            {cond.label}
                          </button>
                        ))
                      )}

                      {activeServiceId === 'exterior-cleaning' && (
                        ([
                          { id: 'Estándar', label: mt('Standard (1.0)', 'Estándar (1.0)', 'Standard (1.0)', 'Standard (1.0)', 'Standard (1.0)', 'Padrão (1.0)') },
                          { id: 'Sucia', label: mt('Dirty (1.2)', 'Sucia (1.2)', 'Verschmutzt (1.2)', 'Sale (1.2)', 'Sporca (1.2)', 'Suja (1.2)') },
                          { id: 'Muy sucia', label: mt('Heavy (1.5)', 'Muy sucia (1.5)', 'Sehr verschmutzt (1.5)', 'Très sale (1.5)', 'Molto sporca (1.5)', 'Muito suja (1.5)') }
                        ] as const).map((cond) => (
                          <button
                            key={cond.id}
                            onClick={() => { userInteract(); setExteriorCondition(cond.id); }}
                            className={`py-2 px-2 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider transition-all sm:col-span-1 ${exteriorCondition === cond.id ? 'bg-blue-600 text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                          >
                            {cond.label}
                          </button>
                        ))
                      )}

                      {activeServiceId === 'deep-cleaning' && (
                        ([
                          { id: 'Estándar', label: mt('Standard (1.0)', 'Estándar (1.0)', 'Standard (1.0)', 'Standard (1.0)', 'Standard (1.0)', 'Padrão (1.0)') },
                          { id: 'Sucia', label: mt('Dirty (1.3)', 'Sucia (1.3)', 'Verschmutzt (1.3)', 'Sale (1.3)', 'Sporca (1.3)', 'Suja (1.3)') },
                          { id: 'Muy sucia', label: mt('Heavy (1.6)', 'Muy sucia (1.6)', 'Sehr verschmutzt (1.6)', 'Très sale (1.6)', 'Molto sporca (1.6)', 'Muito suja (1.6)') }
                        ] as const).map((cond) => (
                          <button
                            key={cond.id}
                            onClick={() => { userInteract(); setDeepCondition(cond.id); }}
                            className={`py-2 px-2 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider transition-all sm:col-span-1 ${deepCondition === cond.id ? 'bg-blue-600 text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                          >
                            {cond.label}
                          </button>
                        ))
                      )}

                      {activeServiceId === 'end-of-tenancy' && (
                        ([
                          { id: 'Estándar', label: mt('Standard (1.0)', 'Estándar (1.0)', 'Standard (1.0)', 'Standard (1.0)', 'Standard (1.0)', 'Padrão (1.0)') },
                          { id: 'Sucia', label: mt('Dirty (1.3)', 'Sucia (1.3)', 'Verschmutzt (1.3)', 'Sale (1.3)', 'Sporca (1.3)', 'Suja (1.3)') },
                          { id: 'Muy sucia', label: mt('Heavy (1.6)', 'Muy sucia (1.6)', 'Sehr verschmutzt (1.6)', 'Très sale (1.6)', 'Molto sporca (1.6)', 'Muito suja (1.6)') }
                        ] as const).map((cond) => (
                          <button
                            key={cond.id}
                            onClick={() => { userInteract(); setTenancyCondition(cond.id); }}
                            className={`py-2 px-2 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider transition-all sm:col-span-1 ${tenancyCondition === cond.id ? 'bg-blue-600 text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                          >
                            {cond.label}
                          </button>
                        ))
                      )}

                      {activeServiceId === 'regular-cleaning' && (
                        ([
                          { id: '2', label: mt('2 Hours', '2 Horas', '2 Stunden', '2 Heures', '2 Ore', '2 Horas') },
                          { id: '4', label: mt('4 Hours', '4 Horas', '4 Stunden', '4 Heures', '4 Ore', '4 Horas') },
                          { id: '6', label: mt('6 Hours', '6 Horas', '6 Stunden', '6 Heures', '6 Ore', '6 Horas') },
                          { id: '8', label: mt('8 Hours', '8 Horas', '8 Stunden', '8 Heures', '8 Ore', '8 Horas') }
                        ] as const).map((cond) => (
                          <button
                            key={cond.id}
                            onClick={() => { userInteract(); setRegularHours(cond.id); }}
                            className={`py-2 px-2 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider transition-all sm:col-span-1 ${regularHours === cond.id ? 'bg-blue-600 text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                          >
                            {cond.label}
                          </button>
                        ))
                      )}

                      {activeServiceId === 'furniture-moving' && (
                        ([
                          { id: 'Cerca', label: mt('Local (<10km)', 'Local (<10km)', 'Lokal (<10km)', 'Local (<10km)', 'Locale (<10km)', 'Local (<10km)') },
                          { id: 'Media', label: mt('Medium (10-50km)', 'Media (10-50km)', 'Mittel (10-50km)', 'Moyen (10-50km)', 'Media (10-50km)', 'Média (10-50km)') },
                          { id: 'Lejos', label: mt('Long (>50km)', 'Lejos (>50km)', 'Weit (>50km)', 'Longue (>50km)', 'Lungo (>50km)', 'Longe (>50km)') }
                        ] as const).map((cond) => (
                          <button
                            key={cond.id}
                            onClick={() => { userInteract(); setMovingDistance(cond.id); }}
                            className={`py-2 px-2 rounded-xl border text-center text-[10px] font-black uppercase tracking-wider transition-all sm:col-span-1 ${movingDistance === cond.id ? 'bg-blue-600 text-white border-transparent shadow-xs' : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600'}`}
                          >
                            {cond.label}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* 3. Checkboxes sections (Add-ons) */}
                <div>
                  <label className="block text-[8px] font-black text-[#002d5b] uppercase tracking-widest mb-1.5 font-sans">
                    {mt('ADDITIONAL ADD-ONS', 'SERVICIOS ADICIONALES', 'ZUSATZLEISTUNGEN', 'OPTIONS INCLUSIVES', 'SERVIZI AGGIUNTIVI', 'SERVIÇOS ADICIONALES')}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {activeServiceId === 'gardening' && (
                      [
                        { id: 'setos', label: mt('Hedge trimming (45 m) +CHF 120', 'Recorte de setos (45 m) +CHF 120', 'Heckenschnitt (45 m) +CHF 120', 'Taille de haies (45 m) +CHF 120', 'Taglio siepi (45 m) +CHF 120', 'Corte de sebes (45 m) +CHF 120') },
                        { id: 'poda', label: mt('Tree pruning (3 h) +CHF 210', 'Poda de árboles (3 h) +CHF 210', 'Baumpflege (3 h) +CHF 210', "Élagage d'arbres (3 h) +CHF 210", 'Potatura alberi (3 h) +CHF 210', 'Poda de árvores (3 h) +CHF 210') },
                        { id: 'residuos', label: mt('Green waste disposal +CHF 80', 'Eliminación de residuos orgánicos +CHF 80', 'Grüngutentsorgung +CHF 80', 'Élimination des déchets verts +CHF 80', 'Smaltimento rifiuti verdi +CHF 80', 'Eliminação de resíduos verdes +CHF 80') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setGardenAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${gardenAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${gardenAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {gardenAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'exterior-cleaning' && (
                      [
                        { id: 'basica', label: mt('Basic hydro-cleaning +CHF 180', 'Hidrolimpieza básica +CHF 180', 'Grund-Hochdruckreinigung +CHF 180', 'Hydro-nettoyage de base +CHF 180', 'Idropulizia di base +CHF 180', 'Hidrojateamento básico +CHF 180') },
                        { id: 'antimanchas', label: mt('Stain treatment +CHF 120', 'Tratamiento antimanchas +CHF 120', 'Fleckenbehandlung +CHF 120', 'Traitement anti-taches +CHF 120', 'Trattamento antimacchia +CHF 120', 'Tratamiento antimanchas +CHF 120') },
                        { id: 'sellado', label: mt('Protective sealing +CHF 180', 'Sellado protector +CHF 180', 'Schutzversiegelung +CHF 180', 'Scellant protecteur +CHF 180', 'Sigillatura protettiva +CHF 180', 'Selamento protetor +CHF 180') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setExteriorAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${exteriorAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${exteriorAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {exteriorAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'gutter-cleaning' && (
                      [
                        { id: 'preventiva', label: mt('Preventive inspection +CHF 120', 'Limpieza preventiva +CHF 120', 'Präventive Reinigung +CHF 120', 'Nettoyage préventif +CHF 120', 'Pulizia preventiva +CHF 120', 'Limpeza preventiva +CHF 120') },
                        { id: 'antihojas', label: mt('Anti-leaf meshes +CHF 160', 'Redes anti-hojas +CHF 160', 'Laubschutzgitter +CHF 160', 'Grilles anti-feuilles +CHF 160', 'Reti anti-foglie +CHF 160', 'Redes anti-folhas +CHF 160') },
                        { id: 'juntas', label: mt('Joint sealing repair +CHF 190', 'Reparación de juntas +CHF 190', 'Fugenabdichtung +CHF 190', 'Réparation de joints +CHF 190', 'Riparazione giunzioni +CHF 190', 'Reparação de juntas +CHF 190') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setGutterAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${gutterAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${gutterAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {gutterAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'pest-control' && (
                      [
                        { id: 'preventivo', label: mt('Preventive barrier +CHF 100', 'Tratamiento preventivo +CHF 100', 'Präventionsbarriere +CHF 100', 'Barrière préventive +CHF 100', 'Barriera preventiva +CHF 100', 'Barreira preventiva +CHF 100') },
                        { id: 'gel', label: mt('Eco-friendly gel +CHF 120', 'Gel ecológico +CHF 120', 'Öko-Gel Köder +CHF 120', 'Gel éco-responsable +CHF 120', 'Gel ecologico +CHF 120', 'Gel ecológico +CHF 120') },
                        { id: 'certificado', label: mt('Official certificate +CHF 150', 'Certificado oficial +CHF 150', 'Offizieller Nachweis +CHF 150', 'Certificat officiel +CHF 150', 'Certificato ufficiale +CHF 150', 'Certificado oficial +CHF 150') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setPestAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${pestAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${pestAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {pestAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'waste-management' && (
                      [
                        { id: 'desmantelamiento', label: mt('Furniture dismantling +CHF 150', 'Desmantelamiento de muebles +CHF 150', 'Möbel-Demontage +CHF 150', 'Démontage de meubles +CHF 150', 'Smontaggio mobili +CHF 150', 'Desmontagem de móveis +CHF 150') },
                        { id: 'postvaciado', label: mt('Deep post-clearing +CHF 130', 'Limpieza post-vaciado +CHF 130', 'Endreinigung nach Räumung +CHF 130', 'Nettoyage post-débarras +CHF 130', 'Pulizia post-sgombero +CHF 130', 'Limpeza pós-esvaziamento +CHF 130') },
                        { id: 'reciclaje', label: mt('Certified recycling fee +CHF 90', 'Reciclaje certificado +CHF 90', 'Zertifizierte Recyclinggebühr +CHF 90', 'Taxe recyclage certifié +CHF 90', 'Tassa riciclaggio certificato +CHF 90', 'Taxa de reciclagem certificada +CHF 90') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setWasteAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${wasteAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${wasteAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {wasteAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'car-detailing' && (
                      [
                        { id: 'completo', label: mt('Full interior/exterior +CHF 150', 'Completo interior/exterior +CHF 150', 'Komplett Innen & Aussen +CHF 150', 'Complet intérieur & extérieur +CHF 150', 'Completo interno ed esterno +CHF 150', 'Completo interior e exterior +CHF 150') },
                        { id: 'ceramico', label: mt('3-year ceramic coating +CHF 150', 'Cerámica 3 años +CHF 150', '3-Jahre Keramikversiegelung +CHF 150', 'Traitement céramique 3 ans +CHF 150', 'Trattamento ceramico 3 anni +CHF 150', 'Proteção cerâmica 3 anos +CHF 150') },
                        { id: 'lavado', label: mt('Engine bay details +CHF 80', 'Lavado motor +CHF 80', 'Motorraumwäsche +CHF 80', 'Nettoyage compartiment moteur +CHF 80', 'Pulizia vano motore +CHF 80', 'Limpeza do motor +CHF 80') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setCarAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${carAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${carAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {carAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'deep-cleaning' && (
                      [
                        { id: 'ventanas', label: mt('Window cleaning (intensive) +CHF 120', 'Limpieza de cristales (intensiva) +CHF 120', 'Fensterreinigung (intensiv) +CHF 120', 'Nettoyage des vitres (intensif) +CHF 120', 'Pulizia finestre (intensiva) +CHF 120', 'Limpeza de janelas (intensiva) +CHF 120') },
                        { id: 'horno', label: mt('Oven & Kitchen degrease +CHF 90', 'Desengrase de horno y cocina +CHF 90', 'Backofen & Küche entfetten +CHF 90', 'Dégraissage four & cuisine +CHF 90', 'Sgrassaggio forno e cucina +CHF 90', 'Desengorduramento de forno e cozinha +CHF 90') },
                        { id: 'desinfeccion', label: mt('Anti-allergen sanitization +CHF 110', 'Sanitización antialérgenos +CHF 110', 'Antiallergiker-Desinfektion +CHF 110', 'Désinfection anti-allergique +CHF 110', 'Igienizzazione anallergica +CHF 110', 'Higienização antialérgica +CHF 110') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setDeepAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${deepAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${deepAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {deepAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'regular-cleaning' && (
                      [
                        { id: 'planchado', label: mt('Ironing clothes (1 h) +CHF 45', 'Planchado de ropa (1 h) +CHF 45', 'Bügeln (1 h) +CHF 45', 'Repassage de vêtements (1 h) +CHF 45', 'Stiratura vestiti (1 h) +CHF 45', 'Engomar roupas (1 h) +CHF 45') },
                        { id: 'balcon', label: mt('Balcony sweeping & wipe +CHF 40', 'Barrido y limpieza de balcón +CHF 40', 'Balkonreinigung +CHF 40', 'Balayage et nettoyage balcon +CHF 40', 'Pulizia balcone e lavaggio +CHF 40', 'Varrer e limpar varanda +CHF 40') },
                        { id: 'neveras', label: mt('Fridge internal deep wash +CHF 60', 'Lavado interior de nevera +CHF 60', 'Kühlschrank-Innenreinigung +CHF 60', 'Nettoyage interior frigo +CHF 60', 'Lavaggio interno frigorifero +CHF 60', 'Limpeza interna do frigorífico +CHF 60') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setRegularAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${regularAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${regularAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {regularAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'furniture-moving' && (
                      [
                        { id: 'embalaje', label: mt('Packing service (boxes included) +CHF 220', 'Servicio de embalaje (cajas incl.) +CHF 220', 'Verpackungsservice (inkl. Kartons) +CHF 220', 'Service d\'emballage (cartons incl.) +CHF 220', 'Servizio imballaggio (scatole incl.) +CHF 220', 'Serviço de embalagem (caixas incl.) +CHF 220') },
                        { id: 'desmontaje', label: mt('Expert furniture disassembly +CHF 140', 'Desmontaje experto de muebles +CHF 140', 'Möbel-Demontageservice +CHF 140', 'Démontage professionnel de meubles +CHF 140', 'Smontaggio mobili professionale +CHF 140', 'Desmontagem profissional de móveis +CHF 140') },
                        { id: 'seguro', label: mt('Premium transit insurance +CHF 90', 'Seguro de tránsito premium +CHF 90', 'Premium Transportversicherung +CHF 90', 'Assurance transit premium +CHF 90', 'Assicurazione trasporto premium +CHF 90', 'Seguro de trânsito premium +CHF 90') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setMovingAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${movingAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${movingAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {movingAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}

                    {activeServiceId === 'end-of-tenancy' && (
                      [
                        { id: 'garantia', label: mt('Handover guarantee +CHF 150', 'Garantía de entrega certificada +CHF 150', 'Abgabegarantie +CHF 150', 'Garantie de remise clé +CHF 150', 'Garanzia di consegna +CHF 150', 'Garantia de entrega certificada +CHF 150') },
                        { id: 'carpets', label: mt('Shampoo carpet wash +CHF 110', 'Lavado de alfombras con champú +CHF 110', 'Teppich-Nassreinigung +CHF 110', 'Shampoing tapis intensif +CHF 110', 'Lavaggio tappeti professionale +CHF 110', 'Lavagem profunda de carpetes +CHF 110') },
                        { id: 'bano', label: mt('Deep limescale sanitization +CHF 80', 'Descalcificación profunda +CHF 80', 'Entkalkung & Bad-Tiefenreinigung +CHF 80', 'Détartrage et désinfection pièces d\'eau +CHF 80', 'Rimozione calcare profonda +CHF 80', 'Descalcificação profunda +CHF 80') }
                      ].map((ad) => (
                        <div 
                          key={ad.id}
                          onClick={() => { userInteract(); setTenancyAddons(prev => prev.includes(ad.id) ? prev.filter(x => x !== ad.id) : [...prev, ad.id]); }}
                          className={`flex items-center gap-2 p-2 rounded-xl border transition-colors cursor-pointer select-none ${tenancyAddons.includes(ad.id) ? 'bg-blue-50/50 border-blue-200 text-[#002d5b]' : 'bg-white border-slate-200 hover:bg-slate-50/50 text-slate-700'}`}
                        >
                          <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center border transition-all shrink-0 ${tenancyAddons.includes(ad.id) ? 'bg-[#007bff] text-white border-transparent' : 'border-slate-300'}`}>
                            {tenancyAddons.includes(ad.id) && <Check className="w-2.5 h-2.5 text-white" />}
                          </div>
                          <span className="text-[10px] font-bold leading-tight">{ad.label}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom total estimation inside left card */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-slate-400 text-[8px] font-black uppercase tracking-widest leading-none mb-0.5">
                  {mt('Estimated Total', 'Total estimado', 'Geschätzter Betrag', 'Total estimé', 'Totale stimato', 'Total estimado')}
                </p>
                <div className="flex items-baseline gap-1 mt-0.5 leading-none select-none">
                  <span className="text-[#002d5b] text-[10px] font-extrabold">CHF</span>
                  <span className="text-xl font-black text-[#002d5b] tracking-tighter leading-none">{getActiveServicePrice().toLocaleString()}</span>
                  <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider ml-1">{mt('excl. VAT', 'sin IVA', 'ohne MwSt.', 'sans TVA', 'escl. IVA', 'sem IVA')}</span>
                </div>
              </div>
              <button
                onClick={() => { userInteract(); handleAddOrUpdateQuote(); }}
                className="flex items-center justify-center gap-1.5 bg-[#007bff] hover:bg-[#002d5b] text-white px-4 py-2.5 rounded-lg font-black text-[9px] tracking-wider uppercase shadow-xs transition-all active:scale-[0.98]"
              >
                {mt('Add to Quote ➔', 'Añadir al presupuesto ➔', 'Zur Offerte hinzufügen ➔', 'Ajouter au devis ➔', 'Aggiungi al preventivo ➔', 'Adicionar ao orçamento ➔')}
              </button>
            </div>
          </div>

          {/* Right Live Summary Panel Card */}
          <div className="lg:col-span-4 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-lg relative overflow-hidden border border-slate-800 transition-all duration-300">
            {/* Dark Card Decorative Accents */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full filter blur-xl pointer-events-none select-none"></div>
            
            <div className="relative z-10 flex-1 flex flex-col justify-between">
              
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2.5">
                  <h4 className="font-extrabold text-[11px] tracking-tight uppercase tracking-wider text-slate-100">
                    {mt('Your Quote', 'Su presupuesto', 'Ihre Offerte', 'Votre devis', 'Il tuo preventivo', 'Seu orçamento')}
                  </h4>
                  <div className="bg-blue-600/35 border border-blue-500/30 px-2 py-0.5 rounded-full text-blue-300 font-black text-[8px] tracking-wider uppercase">
                    {addedServices.length} {addedServices.length === 1 ? mt('service', 'servicio', 'Service', 'service', 'servizio', 'serviço') : mt('services', 'servicios', 'Services', 'services', 'servizi', 'serviços')}
                  </div>
                </div>

                {/* List of active accumulated items */}
                <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1 flex-1">
                  {addedServices.length === 0 ? (
                    <img 
                      src="/comic-promotion.webp" 
                      alt="Comic Promotion" 
                      className="w-full h-auto max-h-[220px] object-cover rounded-xl" 
                      referrerPolicy="no-referrer" 
                      loading="lazy" 
                    />
                  ) : (
                    addedServices.map((srv) => (
                      <div key={srv.id} className="flex items-center justify-between p-2.5 bg-white/5 border border-white/5 rounded-xl group/item hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2">
                          <span className="text-xl filter drop-shadow-sm shrink-0 select-none pb-0.5">{srv.icon}</span>
                          <div>
                            <h5 className="font-black text-[10px] text-white uppercase tracking-wider leading-tight">
                              {getServiceLabel(srv.id) || srv.label}
                            </h5>
                            <p className="text-[8px] text-slate-400 font-bold tracking-tight lowercase first-letter:uppercase">
                              {getServiceDetails(srv) || srv.details}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black text-slate-200">CHF {srv.price.toLocaleString()}</span>
                          <button
                            onClick={() => { userInteract(); handleRemoveQuote(srv.id); }}
                            className="text-slate-500 hover:text-red-400 p-1 rounded-sm transition-colors"
                          >
                            <Trash2 className="w-3 h-3 shrink-0" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Total Summary Footer of Cart */}
              <div className="mt-4 pt-3 border-t border-slate-800">
                <div className="flex items-center justify-between mb-3 select-none">
                  <span className="text-slate-450 font-black text-[9px] uppercase tracking-widest">{mt('Total Project Cost', 'Total del proyecto', 'Projektsumme', 'Total du projet', 'Totale progetto', 'Total do projeto')}</span>
                  <div className="flex items-baseline gap-0.5 leading-none">
                    <span className="text-slate-400 text-[10px] font-extrabold mr-1">CHF</span>
                    <span className="text-lg sm:text-xl font-black text-[#007bff] tracking-tight leading-none">
                      {addedServices.reduce((sum, s) => sum + s.price, 0).toLocaleString()}
                    </span>
                    <span className="text-[8px] text-slate-400 font-black uppercase tracking-wider ml-1.5">{mt('excl. VAT', 'sin IVA', 'ohne MwSt.', 'sans TVA', 'escl. IVA', 'sem IVA')}</span>
                  </div>
                </div>
                
                <button
                  onClick={() => onNavigate('consultation')}
                  className="w-full flex items-center justify-center gap-1.5 bg-[#007bff] hover:bg-white hover:text-[#002d5b] text-white py-3 rounded-lg font-black text-[9px] tracking-widest uppercase shadow-xs transition-all transform active:scale-[0.98]"
                >
                  {mt('Finalize & Send ➔', 'Finalizar y enviar ➔', 'Abschliessen & Senden ➔', 'Finaliser & Envoyer ➔', 'Finalizza e Invia ➔', 'Finalizar e Enviar ➔')}
                </button>
                <p className="text-[8px] text-center text-slate-500 mt-2 font-semibold uppercase tracking-wider">
                  {mt('Editable • no obligation • same day review', 'Editable • sin compromiso • respuesta el mismo día', 'Anpassbar • unverbindlich • Rückmeldung am selben Tag', 'Modifiable • sans engagement • réponse le jour même', 'Modificabile • senza impegno • risposta in giornata', 'Editável • sem compromisso • resposta no mesmo dia')}
                </p>
              </div>

            </div>
          </div>

        </div>

        {/* Dynamic Service Selector Horizontal Array Grid (10 items) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-12">
          {([
            { id: 'gardening', title: mt('Garden', 'Jardín', 'Garten', 'Jardin', 'Giardino', 'Jardim'), subtitle: mt('Parks', 'Parques', 'Parks', 'Parcs', 'Parchi', 'Parques'), icon: '🌿' },
            { id: 'exterior-cleaning', title: mt('Exterior', 'Exterior', 'Aussen', 'Extérieur', 'Esterno', 'Exterior'), subtitle: mt('Walls', 'Muros', 'Wände', 'Façade', 'Muri', 'Paredes'), icon: '💧' },
            { id: 'gutter-cleaning', title: mt('Gutters', 'Canalones', 'Dachrinnen', 'Gouttières', 'Grondaie', 'Calhas'), subtitle: mt('Sealing', 'Sellado', 'Abdicht.', 'Scellant', 'Sigillo', 'Vedação'), icon: '🍂' },
            { id: 'pest-control', title: mt('Pest', 'Plagas', 'Schädlinge', 'Plagues', 'Plaghe', 'Pragas'), subtitle: mt('Urgent', 'Urgente', 'Notdienst', 'Urgence', 'Urgente', 'Urgente'), icon: '🐜' },
            { id: 'waste-management', title: mt('Waste', 'Residuos', 'Entsorgung', 'Déchets', 'Rifiuti', 'Resíduos'), subtitle: mt('Eco', 'Eco', 'Eco', 'Éco', 'Eco', 'Eco'), icon: '🗑️' },
            { id: 'car-detailing', title: mt('Detailing', 'Detallado', 'Fahrzeug', 'Lavage', 'Lavaggio', 'Lavage'), subtitle: mt('Garage', 'Auto', 'Garage', 'Auto', 'Auto', 'Auto'), icon: '🚗' },
            { id: 'deep-cleaning', title: mt('Deep', 'A fondo', 'Tiefen', 'A fond', 'Fondo', 'Fundo'), subtitle: mt('Sanitize', 'Sanitizar', 'Hygiene', 'Désinfect.', 'Igiene', 'Higienizar'), icon: '✨' },
            { id: 'regular-cleaning', title: mt('Regular', 'Diaria', 'Unterhalt', 'Régulier', 'Pulizia', 'Diária'), subtitle: mt('Dusting', 'Polvo', 'Pflege', 'Poussière', 'Spolv.', 'Pó'), icon: '🧹' },
            { id: 'furniture-moving', title: mt('Moving', 'Mudanza', 'Transport', 'Déménag.', 'Trasloco', 'Mudança'), subtitle: mt('Local', 'Local', 'Lokal', 'Local', 'Locale', 'Local'), icon: '🚚' },
            { id: 'end-of-tenancy', title: mt('Tenancy', 'Fin alquil', 'Umzug', 'Remise', 'Consegna', 'Fim aluq'), subtitle: mt('Handover', 'Entrega', 'Abgabe', 'Remise', 'Consegna', 'Entrega'), icon: '🔑' }
          ] as const).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveServiceId(item.id)}
              className={`p-2.5 rounded-2xl text-center transition-all flex flex-col items-center justify-center shrink-0 leading-none h-[95px] select-none ${activeServiceId === item.id ? 'bg-[#002d5b] text-white border-2 border-transparent shadow-md shadow-blue-900/10 scale-105' : 'bg-white hover:bg-slate-50 border border-slate-200/60 text-slate-700'}`}
            >
              <span className="text-xl filter drop-shadow-sm mb-1 transform hover:scale-110 transition-transform duration-300">{item.icon}</span>
              <h5 className={`font-black uppercase tracking-wider text-[9px] mb-0.5 ${activeServiceId === item.id ? 'text-white' : 'text-[#002d5b]'}`}>{item.title}</h5>
              <p className={`text-[7px] font-bold ${activeServiceId === item.id ? 'text-blue-200' : 'text-slate-400'}`}>{item.subtitle}</p>
            </button>
          ))}
        </div>

        {/* Explanation Three Steps Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 border-t border-slate-200/40 select-none">
          {/* Step 1 */}
          <div className="flex gap-4">
            <span className="text-3xl font-black text-blue-500/20 leading-none tracking-tight">01</span>
            <div>
              <h4 className="font-extrabold text-[#002d5b] text-sm uppercase tracking-wider mb-1.5">
                {mt('Configure your service', 'Configure su servicio', 'Service konfigurieren', 'Configurez votre service', 'Configura il tuo servizio', 'Configure seu serviço')}
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed font-bold">
                {mt(
                  'Adjust parameters, conditions and add-ons. The price is updated in real-time in CHF.',
                  'Ajuste parámetros, condiciones y add-ons. El precio se actualiza en tiempo real en CHF.',
                  'Passen Sie Parameter, Bedingungen und Add-ons an. Der Preis aktualisiert sich in Echtzeit in CHF.',
                  'Ajustez les paramètres, conditions et options. Le prix se met à jour en temps réel en CHF.',
                  'Regola parametri, condizioni e opzioni. Il prezzo si aggiorna in tempo reale in CHF.',
                  'Ajuste parâmetros, condições e opcionais. O preço é atualizado em tempo real em CHF.'
                )}
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex gap-4">
            <span className="text-3xl font-black text-blue-500/20 leading-none tracking-tight">02</span>
            <div>
              <h4 className="font-extrabold text-[#002d5b] text-sm uppercase tracking-wider mb-1.5">
                {mt('Add unlimited services', 'Acumule sin límite', 'Unbegrenzt hinzufügen', 'Cumulez sans limites', 'Accumula senza limiti', 'Acumule sem limites')}
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed font-bold">
                {mt(
                  'Add multiple services to the same quote. Edit or delete any without losing the rest.',
                  'Añada varios servicios al mismo presupuesto. Edite o elimine cualquiera sin perder el resto.',
                  'Fügen Sie der gleichen Offerte mehrere Services hinzu. Bearbeiten oder löschen Sie einzelne ohne Verlust.',
                  'Ajoutez plusieurs services au même devis. Modifiez ou supprimez n’importe lequel sans perdre le reste.',
                  'Aggiungi più servizi allo stesso preventivo. Modifica o elimina senza perdere gli altri.',
                  'Adicione vários serviços ao mesmo orçamento. Edite ou exclua qualquer um sem perder o restante.'
                )}
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex gap-4">
            <span className="text-3xl font-black text-blue-500/20 leading-none tracking-tight">03</span>
            <div>
              <h4 className="font-extrabold text-[#002d5b] text-sm uppercase tracking-wider mb-1.5">
                {mt('Finalize & receive proposal', 'Finalice y reciba propuesta', 'Abschliessen & Angebot erhalten', 'Finalisez & recevez l’offre', 'Finalizza e ricevi proposta', 'Finalize e receba a proposta')}
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed font-bold">
                {mt(
                  'Send your complete configuration. A Kraken manager reviews it and confirms on the same day.',
                  'Envíe su configuración completa. Un gestor Kraken la revisa y le confirma el mismo día.',
                  'Senden Sie Ihre Konfiguration. Ein Kraken-Manager prüft sie und bestätigt am selben Tag.',
                  'Envoyez votre configuration. Un conseiller Kraken l’examine et vous répond le jour même.',
                  'Invia la tua configurazione completa. Un gestore Kraken la esamina e ti risponde lo stesso giorno.',
                  'Envie sua configuração completa. Um gestor Kraken revisará e confirmará no mesmo dia.'
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Static Safety Trust Badges footer */}
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 mt-12 text-[9px] font-black uppercase tracking-widest text-slate-400 border-t border-slate-200/40 pt-8 shadow-xs">
          <span>⚡ {mt('Real-time CHF Quote', 'Precio en CHF en tiempo real', 'Echtzeitpreis in CHF', 'Prix en CHF en temps réel', 'Prezzo in CHF in tempo reale', 'Preço em CHF em tempo real')}</span>
          <span>🗣️ {mt('6 Languages available', '6 idiomas disponibles', '6 Sprachen verfügbar', '6 langues disponibles', '6 lingue disponibili', '6 idiomas disponíveis')}</span>
          <span>🛡️ {mt('Swiss regulation compliant', 'Conforme a normativa suiza', 'Konform mit Richtlinien', 'Conforme normes suisses', 'Conforme normative svizzere', 'Seguro e confiável')}</span>
          <span>🔒 {mt('Legal security lock', 'Bloqueo de seguridad legal', 'Sichere Abwicklung', 'Sécurisé légalement', 'Sicuro e protetto', 'Sem riscos legais')}</span>
          <span>📝 {mt('Editable without loss', 'Editable sin perder datos', 'Bearbeitungsgarantie', 'Modifiable sans perte', 'Modificabile senza perdite', 'Editável sem perder dados')}</span>
          <span>⏱️ {mt('Same day response', 'Respuesta el mismo día', 'Rückmeldung am selben Tag', 'Réponse le jour même', 'Risposta in giornata', 'Resposta no mesmo dia')}</span>
        </div>

      </div>
    </section>

    {/* Before/After Oven Experience Section */}
    <section id="before-after-experience" className="py-16 md:py-24 bg-slate-50/50 relative overflow-hidden border-t border-slate-100">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Sub-header above the card */}
        <div className="text-center mb-12 sm:mb-16 select-none">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-gray-500 uppercase">
            {mt(
              'Trusted by homeowners, tenants & businesses across the region.',
              'De la confianza de propietarios, inquilinos y empresas en toda la región.',
              'Empfohlen von Hauseigentümern, Mietern und Unternehmen in der ganzen Region.',
              'Approuvé par les propriétaires, locataires et entreprises de la région.',
              'Scelto da proprietari, inquilini e aziende in tutta la regione.',
              'Aprovado por proprietários, inquilinos e empresas em toda a região.'
            )}
          </p>
        </div>

        {/* Bento Card Housing the 3 Panels */}
        <div className="max-w-6xl mx-auto bg-white rounded-[2.5rem] border border-slate-200/40 p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.02)] filter backdrop-blur-md">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-center">
            
            {/* Panel 1: Left Description & Checklist */}
            <div className="lg:col-span-3 space-y-5 flex flex-col items-start text-left">
              <span className="inline-flex px-3 py-1 rounded-full bg-blue-50 text-[9px] font-black tracking-widest text-[#007bff] border border-blue-100 uppercase">
                {mt(
                  'PROOF, NOT PROMISES', 
                  'PRUEBA, NO PROMESAS', 
                  'BEWEISE, KEINE VERSPRECHEN', 
                  'DES PREUVES, PAS DES PROMESSES', 
                  'PROVE, NON PROMESSE', 
                  'PROVAS, NÃO PROMESSAS'
                )}
              </span>
              
              <h3 className="text-2xl sm:text-3xl font-black text-[#002D5B] tracking-tight leading-tight select-none">
                {mt('See the standard', 'Vea el estándar', 'Sehen Sie den Standard', 'Découvrez le standard', 'Guarda lo standard', 'Veja o padrão')}{' '}
                <span className="text-[#007bff]">
                  {mt('before you book.', 'antes de reservar.', 'bevor Sie buchen.', 'avant de réserver.', 'prima di prenotare.', 'antes de reservar.')}
                </span>
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold select-none">
                {mt(
                  'Move-out cleaning that passes inspection — so you get your deposit back.',
                  'Limpieza de entrega de vivienda que supera la inspección para asegurar la devolución de su fianza.',
                  'Umzugsreinigung, die jede Übergabe besteht – damit Sie Ihre Kaution zurückerhalten.',
                  "Nettoyage de fin de bail qui réussit l'état des lieux pour récupérer votre caution.",
                  "Pulizia di fine locazione que supera l'ispezione per riavere il deposito.",
                  'Limpeza de fim de contrato que garante a devolução da caução.'
                )}
              </p>
              
              <ul className="space-y-3 pt-2">
                {[
                  mt('Detailed checklist', 'Lista de control detallada', 'Detaillierte Checkliste', 'Liste de contrôle détaillée', 'Lista di controllo dettagliata', 'Lista de verificação detalhada'),
                  mt('Deep cleaning', 'Limpieza profunda', 'Tiefenreinigung', 'Nettoyage en profondeur', 'Pulizia profonda', 'Limpeza profunda'),
                  mt('Inspection-ready results', 'Resultados listos para entrega', 'Abgabebereite Ergebnisse', "Résultats prêts pour l'état des lieux", "Risultati pronti per l'ispezione", 'Resultados prontos para inspeção')
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-xs font-bold text-slate-600 select-none">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Panel 2: Interactive Before/After Image Slider */}
            <div className="lg:col-span-6 flex justify-center w-full">
              <div 
                ref={sliderRef}
                onMouseDown={handleSlideMouseDown}
                onTouchStart={(e) => {
                  setIsSliding(true);
                  if (e.touches.length > 0) {
                    handleSlideMove(e.touches[0].clientX);
                  }
                }}
                onTouchMove={handleSlideTouchMove}
                onTouchEnd={() => setIsSliding(false)}
                className="relative select-none overflow-hidden rounded-[2rem] w-full max-w-[500px] h-[300px] sm:h-[380px] shadow-[0_20px_50px_rgba(0,0,0,0.06)] bg-slate-100 cursor-ew-resize group border border-slate-100"
              >
                {/* After Image / Base background (Clean) */}
                <img 
                  src="/despues-limpieza-experiencia.png" 
                  alt="After cleaning experience"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
                  referrerPolicy="no-referrer"
                />
                
                {/* Before Image / Top Clipped layer (Dirty) */}
                <img 
                  src="/antes-limpieza-experiencia.png" 
                  alt="Before cleaning experience"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none z-10"
                  style={{
                    clipPath: `polygon(0 0, ${sliderX}% 0, ${sliderX}% 100%, 0 100%)`
                  }}
                  referrerPolicy="no-referrer"
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase z-30 select-none pointer-events-none shadow-sm">
                  {mt('BEFORE', 'ANTES', 'VORHER', 'AVANT', 'PRIMA', 'ANTES')}
                </div>

                <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black tracking-widest px-3 py-1.5 rounded-full uppercase z-30 select-none pointer-events-none shadow-sm">
                  {mt('AFTER', 'DESPUÉS', 'NACHHER', 'APRÈS', 'DOPO', 'DEPOIS')}
                </div>

                {/* Slider divider line and indicator */}
                <div 
                  className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize z-20 shadow-md"
                  style={{ left: `${sliderX}%` }}
                >
                  <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 bg-white hover:scale-110 active:scale-95 text-[#002D5B] rounded-full flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] cursor-ew-resize border border-slate-100/60 transition-all z-30">
                    <div className="flex items-center justify-center gap-0.5">
                      <ChevronLeft className="w-3.5 h-3.5 shrink-0" />
                      <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Panel 3: Right Guarantee Callout */}
            <div className="lg:col-span-3 space-y-5 flex flex-col items-center lg:items-start text-center lg:text-left">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-full inline-flex items-center justify-center border border-blue-100 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              
              <h3 className="text-lg font-black text-[#002D5B] tracking-tight leading-snug select-none">
                {mt('Move-out inspection guarantee', 'Garantía de inspección de entrega', 'Abgabetermin-Garantie', "Garantie d'inspection de sortie", 'Garanzia di controllo di fine locazione', 'Garantia de inspeção de saída')}
              </h3>
              
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed font-semibold select-none">
                {mt(
                  "If a move-out clean doesn't pass inspection, we return at no extra cost.",
                  "Si una limpieza de entrega no supera la inspección, regresamos sin coste adicional.",
                  "Sollte eine Umzugsreinigung die Abnahme nicht bestehen, reinigen wir völlig kostenlos nach.",
                  "Si un nettoyage de fin de bail ne passe pas l'inspection, nous repassons sans frais.",
                  "Se la pulizia di fine locazione non supera l'ispezione, torniamo senza costi aggiuntivi.",
                  "Se a limpeza de saída não passar na inspeção, voltamos sem custos adicionais."
                )}
              </p>
              
              <div className="w-full bg-slate-50 border border-slate-100 px-4 py-3 rounded-2xl flex items-center justify-center gap-2 mt-4 select-none">
                <span className="text-[10px] sm:text-xs font-black text-slate-700 tracking-wider uppercase">
                  {mt('Our promise. Your peace of mind.', 'Nuestra promesa. Su tranquilidad.', 'Unser Versprechen. Ihre Sorgenfreiheit.', 'Notre promesse. Votre tranquillité.', 'La nostra promessa. La tua tranquillità.', 'Nossa promessa. Sua tranquilidade.')}
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Small bottom slogan badge */}
        <div className="text-center mt-12 mb-4 select-none">
          <span className="inline-block border border-slate-200 bg-white/60 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400 px-4 py-2 rounded-full shadow-xs">
            {mt('THE COST OF IGNORING THE SMALL THINGS', 'EL COSTE DE IGNORAR LOS PEQUEÑOS DETALLES', 'DIE KOSTEN, WENN MAN DIE KLEINEN DINGE IGNORIERT', 'LE COÛT DE NÉGLIGER LES PETITS DÉTAILS', 'IL COSTO DI IGNORARE I PICCOLI DETTAGLI', 'O CUSTO DE IGNORAR OS PEQUENOS DETALHES')}
          </span>
        </div>

      </div>
    </section>
  </>
);
};

export default SegmentationSection;
