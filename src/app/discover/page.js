'use client';

import Link from 'next/link';
import { useEffect } from 'react';

export default function DiscoverPage() {
  // Structured Data - CollectionPage Schema
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Découvrir - StreamingPlatform",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://streaming-platform.vercel.app/discover",
      "description": "Découvrez des films et séries selon vos préférences"
    });
    document.head.appendChild(script);
  }, []);

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Link href="/" className="flex items-center gap-2 mb-4 w-fit hover:opacity-80 transition">
            <span>←</span>
            <span>Retour</span>
          </Link>
          <h1 className="text-5xl font-bold mb-2">🌟 Découvrir</h1>
          <p className="text-gray-100 text-lg">Trouvez vos films et séries préférés selon vos goûts</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Zone de contenu */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Placeholder pour filtres */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">🎬 Filtres par Genre</h2>
            <p className="text-gray-400 mb-4">
              Sélectionnez vos genres préférés pour découvrir des contenus adaptés à vos goûts.
            </p>
            <div className="space-y-2 opacity-50">
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">🔄 Fonctionnalité à venir...</p>
          </div>

          {/* Placeholder pour recommandations */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold mb-4">✨ Recommandations Personnalisées</h2>
            <p className="text-gray-400 mb-4">
              Découvrez des contenus recommandés spécialement pour vous en fonction de vos préférences.
            </p>
            <div className="space-y-2 opacity-50">
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">🔄 Fonctionnalité à venir...</p>
          </div>
        </div>

        {/* Grille de films */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">🎯 Contenus Populaires</h2>
          <p className="text-gray-400 mb-6">
            Explorez notre sélection de films et séries populaires
          </p>
          
          <div className="bg-gray-800 rounded-lg p-12 border border-gray-700 text-center opacity-50">
            <div className="space-y-4">
              <div className="h-32 bg-gray-700 rounded animate-pulse"></div>
              <div className="h-8 bg-gray-700 rounded animate-pulse"></div>
            </div>
            <p className="text-gray-500 text-sm mt-6">🔄 Contenus filtrés à venir...</p>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-900/30 border border-blue-700 rounded-lg p-6 text-center">
          <p className="text-gray-300 mb-2">
            💡 La page Découvrir vous permettra bientôt de filtrer par genre, année de sortie, note, et d&apos;autres critères.
          </p>
          <p className="text-gray-400 text-sm">
            En attendant, consultez nos <Link href="/" className="text-blue-400 hover:text-blue-300 font-semibold">films populaires</Link> ou les <Link href="/trending" className="text-red-400 hover:text-red-300 font-semibold">tendances de la semaine</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
