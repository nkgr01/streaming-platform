'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import MovieCard from '@components/MovieCard';

export default function TrendingPage() {
  const [trending, setTrending] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadTrending = async () => {
      try {
        const res = await fetch('/api/trending?page=1');
        const data = await res.json();
        setTrending(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadTrending();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const res = await fetch(`/api/trending?page=${nextPage}`);
      const data = await res.json();
      setTrending([...trending, ...data]);
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // Structured Data - CollectionPage Schema
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": "Tendances - StreamingPlatform",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://streaming-platform.vercel.app",
      "description": "Les films et séries les plus tendances de la semaine",
      "mainEntity": {
        "@type": "Thing",
        "name": "Contenu en tendance"
      }
    });
    document.head.appendChild(script);
  }, []);

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-2">🔥 Tendances de la Semaine</h1>
          <p className="text-gray-100 text-lg">Découvrez ce qui est populaire en ce moment</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Titre de la section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">⭐ Films & Séries en Tendance</h2>
          <p className="text-gray-400">
            Les contenus les plus regardés cette semaine
          </p>
        </div>

        {/* Grille de films/séries */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
          </div>
        ) : trending.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {trending.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
              ))}
            </div>
            
            {/* Bouton Load More */}
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                {isLoadingMore ? (
                  <span className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                    Chargement...
                  </span>
                ) : (
                  '📥 Charger plus'
                )}
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-400">Aucun contenu en tendance trouvé</p>
            <p className="text-sm text-gray-500 mt-2">Réessayez plus tard...</p>
          </div>
        )}
      </div>
    </main>
  );
}
