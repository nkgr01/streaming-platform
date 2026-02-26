'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import MovieCard from '@components/MovieCard';
import DiscoverFilters from '@components/DiscoverFilters';
import AISearch from '@components/AISearch';
import { useWatchlist } from '@hooks/useWatchlist';

export default function DiscoverPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: '0', type: 'all' });
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [actorSearchResults, setActorSearchResults] = useState(null);
  const { isInWatchlist } = useWatchlist();

  // Charger les résultats filtrés
  const fetchResults = useCallback(async (currentFilters, pageNum = 1, append = false) => {
    const isInitialLoad = pageNum === 1;
    if (isInitialLoad) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    
    try {
      const params = new URLSearchParams();
      if (currentFilters.genre) params.append('genre', currentFilters.genre);
      if (currentFilters.year) params.append('year', currentFilters.year);
      if (currentFilters.minRating) params.append('minRating', currentFilters.minRating);
      params.append('type', currentFilters.type);
      params.append('page', pageNum.toString());

      const res = await fetch(`/api/discover?${params.toString()}`);
      const data = await res.json();
      const newData = Array.isArray(data) ? data : [];
      
      if (append) {
        setResults(prev => [...prev, ...newData]);
      } else {
        setResults(newData);
      }
      
      // Détecter s'il y a plus de résultats
      setHasMore(newData.length > 0);
    } catch (error) {
      console.error('Erreur chargement découvrir:', error);
      if (!append) {
        setResults([]);
      }
      setHasMore(false);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
      } else {
        setLoadingMore(false);
      }
    }
  }, []);

  // Charger quand les filtres changent
  useEffect(() => {
    setPage(1);
    setHasMore(true);
    fetchResults(filters, 1, false);
  }, [filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleAISearch = useCallback((aiFilters) => {
    setPage(1);
    setHasMore(true);
    
    // Si c'est une recherche d'acteur
    if (aiFilters.isActorSearch) {
      setActorSearchResults({
        actor: aiFilters.actorName,
        results: aiFilters.actorResults
      });
      setResults(aiFilters.actorResults);
      setShowFilters(false);
    } else {
      // Sinon, c'est une recherche par filtres
      setActorSearchResults(null);
      setFilters(aiFilters);
      setShowFilters(false);
    }
  }, []);

  const handleLoadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResults(filters, nextPage, true);
  }, [page, filters, fetchResults]);

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white pb-20">
      {/* Header */}
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
        {/* Recherche IA */}
        <AISearch onSearch={handleAISearch} loading={loading} />

        {/* Onglets */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowFilters(true)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              showFilters
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🎬 Filtres Classiques
          </button>
          <button
            onClick={() => setShowFilters(false)}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              !showFilters
                ? 'bg-purple-600 text-white'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🤖 Résultats Recherche IA
          </button>
        </div>

        {/* Filtres classiques */}
        {showFilters && (
          <div>
            <DiscoverFilters onFilterChange={handleFilterChange} />
          </div>
        )}

        {/* Résultats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-700 rounded animate-pulse h-48"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div>
            {actorSearchResults ? (
              <div className="mb-6 p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-lg border border-purple-400/30">
                <h2 className="text-3xl font-bold">🎬 Films et Séries de <span className="text-purple-400">{actorSearchResults.actor}</span></h2>
                <p className="text-gray-300 mt-2">{results.length} résultat{results.length > 1 ? 's' : ''}</p>
              </div>
            ) : (
              <h2 className="text-2xl font-bold mb-6">📺 Résultats ({results.length})</h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {results.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
              ))}
            </div>

            {/* Bouton Charger plus */}
            {hasMore && !actorSearchResults && (
              <div className="flex justify-center mt-8">
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold transition"
                >
                  {loadingMore ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Chargement...
                    </span>
                  ) : (
                    '↓ Charger plus'
                  )}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold mb-2">Aucun résultat</p>
            <p className="text-gray-400">Essayez de modifier vos filtres ou votre recherche</p>
          </div>
        )}
      </div>
    </main>
  );
}
