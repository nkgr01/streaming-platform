import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "@components/Navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://cinema-now.vercel.app"),
  title: {
    default: "Ciné Now - Découvrez Films et Séries",
    template: "%s | Ciné Now"
  },
  description: "Ciné Now est votre plateforme pour découvrir, rechercher et regarder les meilleurs films et séries TV. Accès à des milliers de contenus avec synopsis, casting et bandes-annonces.",
  keywords: [
    "films",
    "séries TV",
    "streaming",
    "cinema",
    "films populaires",
    "séries populaires",
    "bandes-annonces",
    "casting",
    "films à regarder",
    "recommandations films"
  ],
  authors: [{ name: "Ciné Now" }],
  creator: "Ciné Now",
  publisher: "Ciné Now",
  formatDetection: {
    email: false,
    telephone: false,
    address: false,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://cinema-now.vercel.app",
    siteName: "Ciné Now",
    title: "Ciné Now - Films et Séries",
    description: "Découvrez les meilleurs films et séries TV avec synopsis, casting et recommandations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ciné Now - Films et Séries",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ciné Now",
    description: "Découvrez films et séries populaires",
    images: ["/og-image.png"],
    creator: "@cinenow_app",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "lU0hnz9MJIkFwJi5Fl54w6aI8cyegv6FfAda8kRjW0o",
  },
  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || "https://cinema-now.vercel.app",
    languages: {
      "fr": process.env.NEXT_PUBLIC_SITE_URL || "https://cinema-now.vercel.app",
      "en": `${process.env.NEXT_PUBLIC_SITE_URL}/en` || "https://cinema-now.vercel.app/en",
    },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <head>
        {/* Preconnect aux services externes */}
        <link rel="preconnect" href="https://api.themoviedb.org" />
        <link rel="preconnect" href="https://image.tmdb.org" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="https://api.themoviedb.org" />
        
        {/* Structured Data - Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "CinéNow",
              "description": "Découvrez films et séries populaires",
              "url": process.env.NEXT_PUBLIC_SITE_URL || "https://streaming-platform.vercel.app",
              "applicationCategory": "Entertainment",
              "screenshot": "/screenshot.png",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "1000"
              }
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} bg-black text-white`} suppressHydrationWarning>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
