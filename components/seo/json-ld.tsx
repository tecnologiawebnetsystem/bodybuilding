// Componentes de Schema.org JSON-LD para SEO

interface OrganizationSchemaProps {
  name?: string
  url?: string
  logo?: string
  description?: string
}

export function OrganizationSchema({
  name = "FitTransform",
  url = "https://fittransform.com.br",
  logo = "https://fittransform.com.br/icon-512.jpg",
  description = "FitTransform - O melhor app de academia e sistema de gestao para personal trainers do Brasil",
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    logo,
    description,
    foundingDate: "2024",
    founders: [
      {
        "@type": "Person",
        name: "Web NetSystem",
      },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Taubate",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+55-12-99220-7444",
      contactType: "customer service",
      availableLanguage: "Portuguese",
    },
    sameAs: [
      "https://instagram.com/fittransform.app",
      "https://facebook.com/fittransform",
      "https://linkedin.com/company/fittransform",
    ],
    areaServed: [
      { "@type": "City", name: "Taubate" },
      { "@type": "City", name: "Cacapava" },
      { "@type": "City", name: "Pindamonhangaba" },
      { "@type": "City", name: "Sao Jose dos Campos" },
      { "@type": "City", name: "Jacarei" },
      { "@type": "City", name: "Guaratingueta" },
      { "@type": "City", name: "Caraguatatuba" },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface SoftwareApplicationSchemaProps {
  name?: string
  description?: string
  url?: string
}

export function SoftwareApplicationSchema({
  name = "FitTransform",
  description = "App de academia e sistema de gestao para personal trainers com treinos personalizados por IA",
  url = "https://fittransform.com.br",
}: SoftwareApplicationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory: "HealthApplication",
    operatingSystem: "Web, iOS, Android",
    offers: {
      "@type": "AggregateOffer",
      lowPrice: "0",
      highPrice: "199.90",
      priceCurrency: "BRL",
      offerCount: 4,
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "500",
      bestRating: "5",
      worstRating: "1",
    },
    featureList: [
      "Gestao de alunos",
      "Treinos com Inteligencia Artificial",
      "Controle financeiro",
      "Acompanhamento de medidas",
      "Plano alimentar com IA",
      "Controle de hidratacao",
      "Historico de treinos",
      "Relatorios e analytics",
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface LocalBusinessSchemaProps {
  cidade: string
  estado?: string
}

export function LocalBusinessSchema({ cidade, estado = "SP" }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `https://fittransform.com.br/academia/${cidade.toLowerCase()}`,
    name: `FitTransform - Sistema para Academias em ${cidade}`,
    description: `O melhor app de academia e sistema de gestao para personal trainers em ${cidade}, ${estado}. Treinos com IA, controle de alunos e muito mais.`,
    url: `https://fittransform.com.br/academia/${cidade.toLowerCase()}`,
    telephone: "+55-12-99220-7444",
    address: {
      "@type": "PostalAddress",
      addressLocality: cidade,
      addressRegion: estado,
      addressCountry: "BR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -23.0226,
      longitude: -45.555,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
    priceRange: "$$",
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BlogPostSchemaProps {
  title: string
  description: string
  url: string
  image?: string
  datePublished: string
  dateModified?: string
  author?: string
}

export function BlogPostSchema({
  title,
  description,
  url,
  image = "https://fittransform.com.br/og-image.jpg",
  datePublished,
  dateModified,
  author = "FitTransform",
}: BlogPostSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    url,
    image,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: author,
      url: "https://fittransform.com.br",
    },
    publisher: {
      "@type": "Organization",
      name: "FitTransform",
      logo: {
        "@type": "ImageObject",
        url: "https://fittransform.com.br/icon-512.jpg",
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface FAQSchemaProps {
  faqs: Array<{ question: string; answer: string }>
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface WebsiteSchemaProps {
  name?: string
  url?: string
}

export function WebsiteSchema({
  name = "FitTransform",
  url = "https://fittransform.com.br",
}: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${url}/blog?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
