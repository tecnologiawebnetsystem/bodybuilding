import type React from "react"
import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const _geist = Geist({ subsets: ["latin"] })
const _geistMono = Geist_Mono({ subsets: ["latin"] })

const baseUrl = "https://fittransform.com.br"

export const metadata: Metadata = {
  // Titulo otimizado com palavras-chave
  title: {
    default: "FitTransform - App de Academia e Gestao para Personal Trainers | Vale do Paraiba",
    template: "%s | FitTransform - Sistema para Academias",
  },
  
  // Descricao otimizada (150-160 caracteres)
  description: "FitTransform: o melhor app de academia e sistema de gestao para personal trainers do Brasil. Treinos com IA, controle de alunos, financeiro e muito mais. Teste gratis!",
  
  // Keywords principais
  keywords: [
    "app de academia",
    "sistema para academia", 
    "gestao de academia",
    "app para personal trainer",
    "software para academia",
    "treinos com IA",
    "plataforma fitness",
    "controle de alunos",
    "academia Taubate",
    "academia Cacapava",
    "academia Pindamonhangaba",
    "academia Vale do Paraiba",
    "academia Sao Jose dos Campos",
    "app de treino",
    "personal trainer online",
    "gestao de alunos academia",
    "sistema de treinos",
    "aplicativo de musculacao",
  ],
  
  // Autores e publisher
  authors: [{ name: "FitTransform", url: baseUrl }],
  creator: "Web NetSystem",
  publisher: "FitTransform",
  
  // Configuracoes de indexacao
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
    languages: {
      "pt-BR": "/",
    },
  },
  
  // Open Graph para redes sociais
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: baseUrl,
    siteName: "FitTransform",
    title: "FitTransform - O Melhor App de Academia e Gestao Fitness do Brasil",
    description: "Transforme sua academia ou carreira de personal trainer com o FitTransform. Treinos personalizados com IA, gestao de alunos, financeiro e muito mais!",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FitTransform - App de Academia e Gestao Fitness",
      },
    ],
  },
  
  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "FitTransform - App de Academia e Gestao para Personal Trainers",
    description: "O melhor sistema de gestao para academias e personal trainers. Treinos com IA, controle de alunos e muito mais!",
    images: ["/og-image.jpg"],
    creator: "@fittransform",
  },
  
  // Robots
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verificacao de propriedade (adicionar IDs reais depois)
  verification: {
    google: "google-site-verification-id",
    // yandex: "yandex-verification-id",
    // bing: "bing-verification-id",
  },
  
  // Categoria
  category: "fitness",
  
  // PWA
  generator: "v0.app",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "FitTransform",
  },
  icons: {
    icon: [
      { url: "/icon-192.jpg", sizes: "192x192", type: "image/jpeg" },
      { url: "/icon-512.jpg", sizes: "512x512", type: "image/jpeg" },
    ],
    apple: [{ url: "/icon-512.jpg", sizes: "180x180", type: "image/jpeg" }],
  },
  
  // Outras meta tags
  other: {
    "geo.region": "BR-SP",
    "geo.placename": "Vale do Paraiba",
    "geo.position": "-23.0226;-45.5550",
    "ICBM": "-23.0226, -45.5550",
  },
}

export const viewport: Viewport = {
  themeColor: "#3b82f6",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <head>
        {/* PWA Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="application-name" content="FitTransform" />
        <meta name="apple-mobile-web-app-title" content="FitTransform" />
        <link rel="manifest" href="/manifest.json" />

        {/* iOS Splash Screens */}
        <link rel="apple-touch-icon" href="/icon-512.jpg" />
        <link rel="apple-touch-startup-image" href="/icon-512.jpg" />

        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', function() {
                navigator.serviceWorker.register('/sw.js').then(
                  function(registration) {
                    console.log('ServiceWorker registrado com sucesso:', registration.scope);
                  },
                  function(err) {
                    console.log('Falha ao registrar ServiceWorker:', err);
                  }
                );
              });
            }
          `,
          }}
        />
      </head>
      <body className={`font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
