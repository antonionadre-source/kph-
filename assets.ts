import React from 'react';

// This file centralizes URLs for static image assets, making them easier to manage.
// Using external URLs is more performant than embedding large images directly in the code.

export const companyLogoUrl = '/logo-kraken-azul.webp';
export const companyLogoWhiteUrl = '/logo-kraken-blanco.webp';
export const teamPhotoUrl = '/nuestra-historia-hero.png';
export const mascotImageUrl = '/mascota-kraken-homepage.webp';
export const mascotVideoUrl = '';
export const tentacleImageUrl = '/mascota-kraken-homepage.webp';
export const heroVideoUrl = 'https://storage.googleapis.com/aai-web-samples/services-montage.mp4';
export const heroImageUrl = '/mascota-kraken-noche-zurich-home.webp';
export const aboutHeroImageUrl = '/kai about us.webp';
export const comicHeroImageUrl = '/kai comics.webp';

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
  thurgau: '/ChatGPT%20Image%20Jul%2011,%202026,%2003_32_16%20AM.png',
  winterthur: '/kai winterthur.webp',
  bern: '/kai about us.webp'
};

// Schaffhausen-specific SEO service+city images (13 pages, one photo each)
export const schaffhausenServiceImages: Record<string, string> = {
  'car-detailing': '/car-detailing-schaffhausen.webp',
    'common-area-cleaning': '/common-area-cleaning-schaffhausen.webp',
      'daily-cleaning': '/daily-recurring-cleaning-schaffhausen.webp',
        'deep-cleaning': '/deep-cleaning-schaffhausen.webp',
          'exterior-cleaning': '/exterior-cleaning-schaffhausen.webp',
            'moving-furniture': '/furniture-moving-schaffhausen.webp',
              'gardening': '/gardening-schaffhausen.webp',
                'gutter-cleaning': '/gutter-cleaning-schaffhausen.webp',
                  'industrial-maintenance': '/industrial-maintenance-schaffhausen.webp',
                    'office-cleaning': '/office-cleaning-schaffhausen.webp',
                      'pest-control': '/pest-control-schaffhausen.webp',
                        'retail-management': '/retail-cleaning-schaffhausen.webp',
                          'waste-management': '/waste-management-schaffhausen.webp',
                          };

export const cardCleaningUrl = 'https://www.dropbox.com/scl/fi/cylyo5ytzkmj4znb6o5xa/servicio-privado-limpieza-apartamento.webp?rlkey=05qwqg9i2v625pu4l8zewc9mo&st=xk7ablnv&raw=1';
export const cardMaintenanceUrl = '/servicio-comercial-limpieza-industrial.webp';
export const cardTabletUrl = '/kai build your quote.webp';
export const cardMovingUrl = 'https://www.dropbox.com/scl/fi/vaw5n8iqx3r42f3co5qir/servicio-privado-mudanza-cajas.webp?rlkey=ogss3ftloq89pknwq5hixihxu&st=7d1jd2im&raw=1';
export const cardCarDetailingUrl = 'https://www.dropbox.com/scl/fi/5o1s20a1gbnpkweux0yio/servicio-privado-lavado-coche.webp?rlkey=lmlin1t29zbx5fqwte24kpvkt&st=cx497a9l&raw=1';

// Refined Specialization Images (User Mapping)
export const pestControlImg = '/servicio-privado-control-plagas.webp'; // Fallback to maintenance img
export const carDetailingImg = 'https://www.dropbox.com/scl/fi/5o1s20a1gbnpkweux0yio/servicio-privado-lavado-coche.webp?rlkey=lmlin1t29zbx5fqwte24kpvkt&st=cx497a9l&raw=1'; // Imagen 2 (from previous Gutter)
export const wasteManagementImg = '/servicio-privado-residuos-desalojo.webp'; // Imagen 3
export const gardeningImg = 'https://www.dropbox.com/scl/fi/xkpuoqlnlukig2tk4dokm/servicio-privado-jardineria.webp?rlkey=ook2125yt3u6p04izvaak8ei2&st=fnadpn2e&raw=1'; // Imagen 4 (from previous Exterior)

// Exterior Cleaning now uses the "Berna" architecture image
export const exteriorCleaningImg = 'https://www.dropbox.com/scl/fi/s584iq3w3ton5cpfoz92s/servicio-privado-limpieza-exterior.webp?rlkey=4uzfn7m99h3os1gl8sbnxiqg2&st=67943x7s&raw=1';
export const gutterCleaningImg = '/servicio-privado-canalones.webp';

export const sustainabilityImage1Url = '/sustainability-ops.png';
export const sustainabilityImage2Url = '/sustainability-partner.png';
export const sustainabilityBackgroundUrl = '/sustainability-hero.png';

export const csrImageUrl = '/sustainability-people.png';

export const clientLogos = [
  { url: '/new-200-Aldersgate-Logo.jpg', name: '200 Aldersgate' },
  { url: '/MOZUR-gold-logo-1024x884.png', name: 'Mandarin Oriental Savoy Zurich' },
  { url: '/Meili-Logo-black-cmyc-png.webp', name: 'Meili' },
  { url: '/Logo.jpg', name: 'Government of Senegal' },
  { url: '/images-2.png', name: 'Board of Deputies of British Jews' },
  { url: '/head-logo-Basque-Trade-jpg.webp', name: 'Basque Trade & Investment' },
  { url: '/Crisis-logo-1024x366.jpg', name: 'Crisis' },
  { url: '/Asset-47-jpg.webp', name: 'One One Six' },
  { url: '/Amazon-logo-svg.png', name: 'Amazon' },
  { url: '/display-green-mountain-as-logo.png', name: 'Green Mountain' },
];

export const sustainabilityPartnerLogos = {
  suva: '/Schweizerische-Unfallversicherungsanstalt-logo-svg.png',
  diversey: '',
  steinfels: '/Logo-Steinfels-Swiss-RGB.png',
  ecolab: '',
  ebp: '/Logo_EBP_Logo.jpg',
  climeworks: '/images-3.png',
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
    imageUrl: 'https://www.dropbox.com/scl/fi/cylyo5ytzkmj4znb6o5xa/servicio-privado-limpieza-apartamento.webp?rlkey=05qwqg9i2v625pu4l8zewc9mo&st=xk7ablnv&raw=1',
  },
  {
    id: 'deep-cleaning',
    icon: '✨',
    titleKey: 'services.deepCleaning.title',
    descriptionKey: 'services.deepCleaning.description',
    marketingDescKey: 'services.deepCleaning.marketingDesc',
    imageUrl: 'https://www.dropbox.com/scl/fi/59bzz6p4e7r2eiy83bzin/servicio-privado-limpieza-cocina.webp?rlkey=2fwi4lpzcuopld7js0kdadgok&st=bu3p7in6&raw=1',
  },
  {
    id: 'daily-cleaning',
    icon: '🗓️',
    titleKey: 'services.dailyCleaning.title',
    descriptionKey: 'services.dailyCleaning.description',
    marketingDescKey: 'services.dailyCleaning.marketingDesc',
    imageUrl: 'https://www.dropbox.com/scl/fi/h0mvnnlclm631kn5zxqnh/servicio-privado-limpieza-oficina-casa.webp?rlkey=9b3nvjjm1syt3d9r86qt6jtx4&st=4nt8efqc&raw=1',
  },
  {
    id: 'moving-furniture',
    icon: '📦',
    titleKey: 'services.movingFurniture.title',
    descriptionKey: 'services.movingFurniture.description',
    marketingDescKey: 'services.movingFurniture.marketingDesc',
    imageUrl: 'https://www.dropbox.com/scl/fi/vaw5n8iqx3r42f3co5qir/servicio-privado-mudanza-cajas.webp?rlkey=ogss3ftloq89pknwq5hixihxu&st=7d1jd2im&raw=1',
  },
  {
    id: 'car-detailing',
    icon: '🚗',
    titleKey: 'services.car.title',
    descriptionKey: 'services.car.subtitle',
    marketingDescKey: 'services.car.marketingDesc',
    imageUrl: 'https://www.dropbox.com/scl/fi/5o1s20a1gbnpkweux0yio/servicio-privado-lavado-coche.webp?rlkey=lmlin1t29zbx5fqwte24kpvkt&st=cx497a9l&raw=1',
  },
  {
    id: 'gardening',
    icon: '🌿',
    titleKey: 'services.gardening.title',
    descriptionKey: 'services.gardening.desc',
    marketingDescKey: 'services.gardening.marketingDesc',
    imageUrl: 'https://www.dropbox.com/scl/fi/xkpuoqlnlukig2tk4dokm/servicio-privado-jardineria.webp?rlkey=ook2125yt3u6p04izvaak8ei2&st=fnadpn2e&raw=1',
  },
  {
    id: 'exterior-cleaning',
    icon: '💧',
    titleKey: 'services.exterior.title',
    descriptionKey: 'services.exterior.desc',
    marketingDescKey: 'services.exterior.marketingDesc',
    imageUrl: 'https://www.dropbox.com/scl/fi/s584iq3w3ton5cpfoz92s/servicio-privado-limpieza-exterior.webp?rlkey=4uzfn7m99h3os1gl8sbnxiqg2&st=67943x7s&raw=1',
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
    imageUrl: '/servicio-privado-limpieza-tapiceria-1.webp',
  },
  {
    id: 'window-cleaning',
    icon: '🪟',
    titleKey: 'services.window.title',
    descriptionKey: 'services.window.desc',
    marketingDescKey: 'services.window.marketingDesc',
    imageUrl: '/servicio-privado-limpieza-ventanas-1.webp',
  },
  {
    id: 'mudanza-cajas',
    icon: '📦',
    titleKey: 'services.mudanzaCajas.title',
    descriptionKey: 'services.mudanzaCajas.desc',
    marketingDescKey: 'services.mudanzaCajas.marketingDesc',
    imageUrl: '/servicio-privado-mudanza-cajas-1.webp',
  },
  {
    id: 'pulido-suelos',
    icon: '✨',
    titleKey: 'services.pulidoSuelos.title',
    descriptionKey: 'services.pulidoSuelos.desc',
    marketingDescKey: 'services.pulidoSuelos.marketingDesc',
    imageUrl: '/servicio-privado-pulido-suelos-1.webp',
  },
  {
    id: 'common-area-cleaning',
    icon: '🏘️',
    titleKey: 'commercial.service.common.title',
    descriptionKey: 'commercial.service.common.desc',
    marketingDescKey: 'commercial.service.common.desc',
    imageUrl: '/servicio-comercial-limpieza-escaleras.webp',
  },
  {
    id: 'property-managers',
    icon: '🏢',
    titleKey: 'services.propertyManagers.title',
    descriptionKey: 'services.propertyManagers.desc',
    marketingDescKey: 'services.propertyManagers.marketingDesc',
    imageUrl: '/servicio-comercial-limpieza-escaleras.png',
  },
  {
    id: 'airbnb-rentals',
    icon: '✨',
    titleKey: 'services.airbnbRentals.title',
    descriptionKey: 'services.airbnbRentals.desc',
    marketingDescKey: 'services.airbnbRentals.marketingDesc',
    imageUrl: '/imagen-02-google-ai.webp',
  },
  {
    id: 'offices-corporate',
    icon: '💼',
    titleKey: 'services.officesCorporate.title',
    descriptionKey: 'services.officesCorporate.desc',
    marketingDescKey: 'services.officesCorporate.marketingDesc',
    imageUrl: '/servicio-comercial-limpieza-showroom.png',
  },
  {
    id: 'retail-showrooms',
    icon: '🛍️',
    titleKey: 'services.retailShowrooms.title',
    descriptionKey: 'services.retailShowrooms.desc',
    marketingDescKey: 'services.retailShowrooms.marketingDesc',
    imageUrl: '/servicio-comercial-limpieza-retail.png',
  },
  {
    id: 'gastronomy-restaurants',
    icon: '🍳',
    titleKey: 'services.gastronomyRestaurants.title',
    descriptionKey: 'services.gastronomyRestaurants.desc',
    marketingDescKey: 'services.gastronomyRestaurants.marketingDesc',
    imageUrl: '/servicio-comercial-limpieza-bar-restaurante.png',
  },
  {
    id: 'industry-logistics',
    icon: '🏭',
    titleKey: 'services.industryLogistics.title',
    descriptionKey: 'services.industryLogistics.desc',
    marketingDescKey: 'services.industryLogistics.marketingDesc',
    imageUrl: '/servicio-comercial-limpieza-industrial.png',
  },
];