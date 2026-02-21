'use client';

import { useState, useEffect } from 'react';
import SearchBar from '@components/SearchBar';
import MovieCard from '@components/MovieCard';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSearched, setHasSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const res = await fetch('/api/movies/popular?page=1');
        const data = await res.json();
        setMovies(data);
        setCurrentPage(1);
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadMovies();
  }, []);

  const handleLoadMore = async () => {
    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      if (hasSearched) {
        const searchQuery = sessionStorage.getItem('lastSearchQuery') || '';
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&page=${nextPage}`);
        const data = await res.json();
        setSearchResults([...searchResults, ...data]);
      } else {
        const res = await fetch(`/api/movies/popular?page=${nextPage}`);
        const data = await res.json();
        setMovies([...movies, ...data]);
      }
      setCurrentPage(nextPage);
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setHasSearched(results.length > 0);
    setCurrentPage(1);
    sessionStorage.setItem('lastSearchQuery', query);
  };

  const handleSearchLoading = (loading) => {
    setIsLoading(loading);
  };

  const displayMovies = hasSearched ? searchResults : movies;

  // Structured Data - WebSite Schema
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.innerHTML = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "StreamingPlatform",
      "url": process.env.NEXT_PUBLIC_SITE_URL || "https://streaming-platform.vercel.app",
      "description": "Découvrez films et séries populaires",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${process.env.NEXT_PUBLIC_SITE_URL}/search?q={search_term_string}` || `https://streaming-platform.vercel.app/search?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    });
    document.head.appendChild(script);
  }, []);

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      {/* Header avec gradient */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-2">🎬 StreamingPlatform</h1>
          <p className="text-gray-100 text-lg">Découvrez vos films et séries préférés</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Barre de recherche */}
        <SearchBar onResultsChange={handleSearchResults} onLoading={handleSearchLoading} />

        {/* Titre de la section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">
            {hasSearched ? '🔍 Résultats de recherche' : '⭐ Films et séries populaires'}
          </h2>
          <p className="text-gray-400">
            {hasSearched
              ? `${searchResults.length} résultat${searchResults.length > 1 ? 's' : ''} trouvé${searchResults.length > 1 ? 's' : ''}`
              : `Découvrez les films et séries les plus populaires du moment`}
          </p>
        </div>

        {/* Grille de films/séries */}
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : displayMovies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {displayMovies.map((movie) => (
                <MovieCard key={`${movie.media_type}-${movie.id}`} movie={movie} />
              ))}
            </div>
            
            {/* Bouton Load More */}
            <div className="flex justify-center mt-12">
              <button
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
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
            <p className="text-xl text-gray-400">Aucun résultat trouvé</p>
            <p className="text-sm text-gray-500 mt-2">Essayez une autre recherche...</p>
          </div>
        )}
      </div>
    </main>
  );
}



