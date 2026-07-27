import React from 'react';

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

// 1. Breadcrumb Schema
export const BreadcrumbSchema: React.FC<{ items: BreadcrumbItem[] }> = ({ items }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `https://krakenpfm.ch${item.url}`
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// 2. FAQ Schema
export const FAQSchema: React.FC<{ faqs: FaqItem[] }> = ({ faqs }) => {
  if (!faqs || faqs.length === 0) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

// 3. Local Business Schema
export interface LocalBusinessSchemaProps {
  citiesServed?: string[];
}

export const LocalBusinessSchema: React.FC<LocalBusinessSchemaProps> = ({ citiesServed = [] }) => {
  const baseSchema: any = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Kraken Properties and Facilities Management",
    "image": "https://krakenpfm.ch/logo-kraken-azul.webp",
    "telephone": "+41 77 450 57 05",
    "priceRange": "CHF",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Seewadelstrasse 3",
      "addressLocality": "Schaffhausen",
      "postalCode": "8203",
      "addressCountry": "CH"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 47.6954,
      "longitude": 8.6357
    },
    "url": "https://krakenpfm.ch",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday"
        ],
        "opens": "07:30",
        "closes": "18:00"
      },
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": "Saturday",
        "opens": "08:00",
        "closes": "16:00"
      }
    ],
    "sameAs": [
      "https://www.facebook.com/krakenpfm",
      "https://www.instagram.com/krakenpfm",
      "https://search.google.com/local/writereview?placeid=ChIJw_vX3CgQkEcR_VMyRUpGfK4"
    ]
  };

  if (citiesServed && citiesServed.length > 0) {
    baseSchema.areaServed = citiesServed.map(city => ({
      "@type": "City",
      "name": city
    }));
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(baseSchema) }}
    />
  );
};

// 4. Service Schema
export interface ServiceSchemaProps {
  serviceName: string;
  cityName: string;
  priceFrom?: number;
  description: string;
}

export const ServiceSchema: React.FC<ServiceSchemaProps> = ({
  serviceName,
  cityName,
  priceFrom,
  description
}) => {
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "description": description,
    "provider": {
      "@type": "LocalBusiness",
      "name": "Kraken Properties and Facilities Management",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Seewadelstrasse 3",
        "addressLocality": "Schaffhausen",
        "postalCode": "8203",
        "addressCountry": "CH"
      }
    },
    "areaServed": {
      "@type": "City",
      "name": cityName
    }
  };

  if (priceFrom) {
    schema.offers = {
      "@type": "Offer",
      "priceCurrency": "CHF",
      "price": priceFrom,
      "priceSpecification": {
        "@type": "UnitPriceSpecification",
        "price": priceFrom,
        "priceCurrency": "CHF",
        "referenceQuantity": {
          "@type": "QuantitativeValue",
          "value": "1",
          "unitCode": "C62"
        }
      }
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};
