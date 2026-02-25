'use client';

import Link from 'next/link';
import { useState, useCallback, useEffect } from 'react';
import MovieCard from '@components/MovieCard';
import DiscoverFilters from '@components/DiscoverFilters';
import { useWatchlist } from '@hooks/useWatchlist';

export default function DiscoverPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ genre: '', year: '', minRating: '0', type: 'all' });
  const { isInWatchlist } = useWatchlist();

  // Charger les résultats filtrés
  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.genre) params.append('genre', filters.genre);
      if (filters.year) params.append('year', filters.year);
      if (filters.minRating) params.append('minRating', filters.minRating);
      params.append('type', filters.type);
      params.append('page', '1');

      const res = await fetch(`/api/discover?${params.toString()}`);
      const data = await res.json();
      setResults(data);
    } catch (error) {
      console.error('Erreur chargement découvrir:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Charger quand les filtres changent
  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
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
        {/* Filtres */}
        <DiscoverFilters onFilterChange={handleFilterChange} />

        {/* Résultats */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Array(10).fill(0).map((_, i) => (
              <div key={i} className="bg-gray-700 rounded animate-pulse h-48"></div>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold mb-6">📺 Résultats ({results.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {results.map((item) => (
                <MovieCard key={`${item.media_type}-${item.id}`} movie={item} />
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-800 rounded-lg">
            <p className="text-2xl font-bold mb-2">Aucun résultat</p>
            <p className="text-gray-400">Essayez de modifier vos filtres</p>
          </div>
        )}
      </div>
    </main>
  );
}
