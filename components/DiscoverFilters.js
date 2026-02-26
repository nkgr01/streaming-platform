'use client';

import { useState, useEffect } from 'react';

export default function DiscoverFilters({ onFilterChange }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedRating, setSelectedRating] = useState('0');
  const [contentType, setContentType] = useState('all');
  const [loading, setLoading] = useState(true);

  // Charger les genres
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const res = await fetch('/api/genres');
        const data = await res.json();
        setGenres(data);
      } catch (error) {
        console.error('Erreur chargement genres:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchGenres();
  }, []);

  // Appeler onFilterChange quand les filtres changent (sans dépendance circulaire)
  useEffect(() => {
    const timer = setTimeout(() => {
      onFilterChange({
        genre: selectedGenre,
        year: selectedYear,
        minRating: selectedRating,
        type: contentType
      });
    }, 300); // Délai de 300ms pour éviter les appels trop fréquents

    return () => clearTimeout(timer);
  }, [selectedGenre, selectedYear, selectedRating, contentType, onFilterChange]);

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
      <h2 className="text-2xl font-bold mb-6">🎬 Filtres de Recherche</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Type de contenu */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Type de contenu
          </label>
          <select
            value={contentType}
            onChange={(e) => setContentType(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white hover:border-blue-500 transition"
          >
            <option value="all">Films et séries</option>
            <option value="movie">Films seulement</option>
            <option value="tv">Séries seulement</option>
          </select>
        </div>

        {/* Genre */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            disabled={loading}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white hover:border-blue-500 transition disabled:opacity-50"
          >
            <option value="">Tous les genres</option>
            {genres.map(genre => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Année */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Année de sortie
          </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white hover:border-blue-500 transition"
          >
            <option value="">Toutes les années</option>
            {years.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Rating minimum */}
        <div>
          <label className="block text-sm font-semibold text-gray-300 mb-2">
            Note minimale: {selectedRating} ⭐
          </label>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
