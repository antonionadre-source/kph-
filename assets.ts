import React from 'react';

// This file centralizes URLs for static image assets, making them easier to manage.
// Optimized local derivatives retain originals and provenance in docs/KAI_MEDIA*.json.

export const companyLogoUrl = '/kai-calendar/optimized/brand/logo-blue-480.webp';
export const companyLogoWhiteUrl = '/kai-calendar/optimized/brand/logo-white-480.webp';
export const teamPhotoUrl = '/ChatGPT Image Jun 29, 2026, 02_32_15 AM.png';
export const mascotImageUrl = '/kai-calendar/optimized/kai/mascota-kraken-homepage-320.webp';
export const mascotVideoUrl = '';
export const tentacleImageUrl = mascotImageUrl;
export const heroVideoUrl = 'https://storage.googleapis.com/aai-web-samples/services-montage.mp4';
export const heroImageUrl = '/mascota-kraken-noche-zurich-home.webp';
export const aboutHeroImageUrl = '/kai about us.webp';
export const comicHeroImageUrl = '/kai comics.webp';
export const careersHeroImageUrl = '/kai careers.webp';
export const servicesHeroImageUrl = '/kai services.webp';

export const aboutOriginImages = {
    panel1: '/sobre-nosotros-bienvenida-familia-equipo.webp',
    panel2: '/sobre-nosotros-equipo-con-cliente-en-zurich.webp',
    panel3: '/sobre-nosotros-equipo-viaje-con-maletas.webp',
    panel4: '/sobre-nosotros-retrato-equipo-uniforme.webp'
};

// Kai Comic Legend Photos
export const kaiComicPhotos = {
  photo1: '/kai comics.webp', // Panel 1: Kai vs Nordic Kraken
  photo2: '/comic-promotion.webp', // Panel 2: Tentacles (Solutions)
  photo3: '/evolucion-mascota-kraken.webp', // Panel 3: Standard (Engineering)
  photo4: '/mascota-kraken-homepage.webp'  // Panel 4: Future
};

// New Comic Covers
export const comicCovers = [
  '/kai comics.webp',
  '/comic-promotion.webp',
  '/evolucion-mascota-kraken.webp',
  '/mascota-kraken-noche-zurich-home.webp'
];

// City Images for Strategic Network
export const cityImages = {
  zurich: '/kai zurich.webp',
  schaffhausen: '/kai schaffhausen.webp',
  stgallen: '/oficina-moderna-homepage.webp',
  thurgau: '/kai-services/thurgau.webp',
  winterthur: '/kai winterthur.webp',
  bern: '/kai about us.webp'
};

// The 13 former Schaffhausen-specific files were corrupt, not recovered.
// SEO pages use verified service or regional images; retain this export for compatibility.
// Original paths and archive: docs/ASSET_PENDING_ORIGINALS.json.
export const schaffhausenServiceImages: Record<string, string> = {};

export const cardCleaningUrl = '/servicio-privado-limpieza-apartamento.webp';
export const cardMaintenanceUrl = '/kai-calendar/optimized/commercial/industry-logistics/768.webp';
export const cardTabletUrl = '/kai build your quote.webp';
export const cardMovingUrl = '/servicio-privado-mudanza-cajas.webp';
export const cardCarDetailingUrl = '/servicio-privado-lavado-coche.webp';

// Refined Specialization Images (User Mapping)
export const pestControlImg = '/servicio-privado-control-plagas.webp'; // Fallback to maintenance img
export const carDetailingImg = '/servicio-privado-lavado-coche.webp'; // Imagen 2 (from previous Gutter)
export const wasteManagementImg = '/servicio-privado-residuos-desalojo.webp'; // Imagen 3
export const gardeningImg = '/servicio-privado-jardineria.webp'; // Imagen 4 (from previous Exterior)

// Exterior Cleaning now uses the "Berna" architecture image
export const exteriorCleaningImg = '/servicio-privado-limpieza-exterior.webp';
export const gutterCleaningImg = '/servicio-privado-canalones.webp';

export const sustainabilityImage1Url = '/sustainability-ops.png';
export const sustainabilityImage2Url = '/sustainability-partner.png';
export const sustainabilityBackgroundUrl = '/sustainability-hero.png';

export const csrImageUrl = '/sustainability-people.png';

export const clientLogos = [
  { url: '/new-200-Aldersgate-Logo.jpg', name: '200 Aldersgate', width: 3841, height: 2161 },
  { url: '/MOZUR-gold-logo-1024x884.png', name: 'Mandarin Oriental Savoy Zurich', width: 1024, height: 884 },
  { url: '/Meili-Logo-black-cmyc-png.webp', name: 'Meili', width: 709, height: 299 },
  { url: '/images-2.png', name: 'Board of Deputies of British Jews', width: 432, height: 117 },
  { url: '/head-logo-Basque-Trade-jpg.webp', name: 'Basque Trade & Investment', width: 230, height: 100 },
  { url: '/Crisis-logo-1024x366.jpg', name: 'Crisis', width: 1024, height: 366 },
  { url: '/Amazon-logo-svg.png', name: 'Amazon', width: 1280, height: 387 },
  { url: '/display-green-mountain-as-logo.png', name: 'Green Mountain', width: 700, height: 492 },
];

export const sustainabilityPartnerLogos = {
  suva: '/Schweizerische-Unfallversicherungsanstalt-logo-svg.png',
  diversey: '',
  steinfels: '/Logo-Steinfels-Swiss-RGB.png',
  ecolab: '',
  ebp: '/Logo_EBP_Logo.jpg',
  climeworks: '', // Historical logo is unavailable; do not render a broken or invented logo.
};

// Restored Original Sustainability Page Images
export const sustainabilityPageImages = {
  header: '/sustainability-hero.png',
  lowEmissionLogistics: '/sustainability-logistics.png',
  workforceProximity: '/sustainability-people.png',
  carbonFootprint: '/sustainability-ops.png',
  wasteReduction: '/sustainability-circular.png',
};

export interface Service {
  id: string;
  icon: string | React.ReactNode;
  titleKey: string;
  descriptionKey: string;
  marketingDescKey: string;
  imageUrl: string;
}

// Exported services array with restored URLs for EOT, Deep, and Daily cleaning
export const services: Service[] = [
  {
    id: 'end-of-tenancy',
    icon: '🗝️',
    titleKey: 'services.endOfTenancy.title',
    descriptionKey: 'services.endOfTenancy.description',
    marketingDescKey: 'services.endOfTenancy.marketingDesc',
    imageUrl: '/servicio-privado-limpieza-apartamento.webp',
  },
  {
    id: 'deep-cleaning',
    icon: '✨',
    titleKey: 'services.deepCleaning.title',
    descriptionKey: 'services.deepCleaning.description',
    marketingDescKey: 'services.deepCleaning.marketingDesc',
    imageUrl: '/servicio-privado-limpieza-cocina.webp',
  },
  {
    id: 'daily-cleaning',
    icon: '🗓️',
    titleKey: 'services.dailyCleaning.title',
    descriptionKey: 'services.dailyCleaning.description',
    marketingDescKey: 'services.dailyCleaning.marketingDesc',
    imageUrl: '/servicio-privado-limpieza-oficina-casa.webp',
  },
  {
    id: 'moving-furniture',
    icon: '📦',
    titleKey: 'services.movingFurniture.title',
    descriptionKey: 'services.movingFurniture.description',
    marketingDescKey: 'services.movingFurniture.marketingDesc',
    imageUrl: '/servicio-privado-mudanza-cajas.webp',
  },
  {
    id: 'car-detailing',
    icon: '🚗',
    titleKey: 'services.car.title',
    descriptionKey: 'services.car.subtitle',
    marketingDescKey: 'services.car.marketingDesc',
    imageUrl: '/servicio-privado-lavado-coche.webp',
  },
  {
    id: 'gardening',
    icon: '🌿',
    titleKey: 'services.gardening.title',
    descriptionKey: 'services.gardening.desc',
    marketingDescKey: 'services.gardening.marketingDesc',
    imageUrl: '/servicio-privado-jardineria.webp',
  },
  {
    id: 'exterior-cleaning',
    icon: '💧',
    titleKey: 'services.exterior.title',
    descriptionKey: 'services.exterior.desc',
    marketingDescKey: 'services.exterior.marketingDesc',
    imageUrl: '/servicio-privado-limpieza-exterior.webp',
  },
  {
    id: 'pest-control',
    icon: '🐜',
    titleKey: 'services.pest.title',
    descriptionKey: 'services.pest.desc',
    marketingDescKey: 'services.pest.marketingDesc',
    imageUrl: '/servicio-privado-control-plagas.webp',
  },
  {
    id: 'waste-management',
    icon: '🗑️',
    titleKey: 'services.waste.title',
    descriptionKey: 'services.waste.desc',
    marketingDescKey: 'services.waste.marketingDesc',
    imageUrl: '/servicio-privado-residuos-desalojo.webp',
  },
  {
    id: 'gutter-cleaning',
    icon: '🍂',
    titleKey: 'services.gutter.title',
    descriptionKey: 'services.gutter.desc',
    marketingDescKey: 'services.gutter.marketingDesc',
    imageUrl: '/servicio-privado-canalones.webp',
  },
  {
    id: 'upholstery-cleaning',
    icon: '🛋️',
    titleKey: 'services.upholstery.title',
    descriptionKey: 'services.upholstery.desc',
    marketingDescKey: 'services.upholstery.marketingDesc',
    imageUrl: '/kai-services/upholstery.webp',
  },
  {
    id: 'window-cleaning',
    icon: '🪟',
    titleKey: 'services.window.title',
    descriptionKey: 'services.window.desc',
    marketingDescKey: 'services.window.marketingDesc',
    imageUrl: '/kai-services/windows.webp',
  },
  {
    id: 'mudanza-cajas',
    icon: '📦',
    titleKey: 'services.mudanzaCajas.title',
    descriptionKey: 'services.mudanzaCajas.desc',
    marketingDescKey: 'services.mudanzaCajas.marketingDesc',
    imageUrl: '/kai-services/moving.webp',
  },
  {
    id: 'pulido-suelos',
    icon: '✨',
    titleKey: 'services.pulidoSuelos.title',
    descriptionKey: 'services.pulidoSuelos.desc',
    marketingDescKey: 'services.pulidoSuelos.marketingDesc',
    imageUrl: '/kai-services/floor-care.webp',
  },
  {
    id: 'common-area-cleaning',
    icon: '🏘️',
    titleKey: 'commercial.service.common.title',
    descriptionKey: 'commercial.service.common.desc',
    marketingDescKey: 'commercial.service.common.desc',
    imageUrl: '/kai-calendar/optimized/commercial/property-managers/768.webp',
  },
  {
    id: 'property-managers',
    icon: '🏢',
    titleKey: 'services.propertyManagers.title',
    descriptionKey: 'services.propertyManagers.desc',
    marketingDescKey: 'services.propertyManagers.marketingDesc',
    imageUrl: '/kai-calendar/optimized/commercial/property-managers/1440.webp',
  },
  {
    id: 'airbnb-rentals',
    icon: '✨',
    titleKey: 'services.airbnbRentals.title',
    descriptionKey: 'services.airbnbRentals.desc',
    marketingDescKey: 'services.airbnbRentals.marketingDesc',
    imageUrl: '/kai-calendar/optimized/commercial/airbnb-rentals/1440.webp',
  },
  {
    id: 'offices-corporate',
    icon: '💼',
    titleKey: 'services.officesCorporate.title',
    descriptionKey: 'services.officesCorporate.desc',
    marketingDescKey: 'services.officesCorporate.marketingDesc',
    imageUrl: '/kai-calendar/optimized/commercial/offices-corporate/1440.webp',
  },
  {
    id: 'retail-showrooms',
    icon: '🛍️',
    titleKey: 'services.retailShowrooms.title',
    descriptionKey: 'services.retailShowrooms.desc',
    marketingDescKey: 'services.retailShowrooms.marketingDesc',
    imageUrl: '/kai-calendar/optimized/commercial/retail-showrooms/1440.webp',
  },
  {
    id: 'gastronomy-restaurants',
    icon: '🍳',
    titleKey: 'services.gastronomyRestaurants.title',
    descriptionKey: 'services.gastronomyRestaurants.desc',
    marketingDescKey: 'services.gastronomyRestaurants.marketingDesc',
    imageUrl: '/kai-calendar/optimized/commercial/gastronomy-restaurants/1440.webp',
  },
  {
    id: 'industry-logistics',
    icon: '🏭',
    titleKey: 'services.industryLogistics.title',
    descriptionKey: 'services.industryLogistics.desc',
    marketingDescKey: 'services.industryLogistics.marketingDesc',
    imageUrl: '/kai-calendar/optimized/commercial/industry-logistics/1440.webp',
  },
];
