'use client';

import { useState } from 'react';

export default function SearchBar({ onResultsChange, onLoading }) {
  const [query, setQuery] = useState('');

  const handleSearch = async (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.trim().length > 2) {
      onLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(value)}`);
        const results = await res.json();
        onResultsChange(results, value);
      } catch (error) {
        console.error('Erreur de recherche:', error);
        onResultsChange([]);
      } finally {
        onLoading(false);
      }
    } else {
      onResultsChange([]);
      onLoading(false);
    }
  };

  return (
    <div className="mb-8">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="🔍 Rechercher un film ou une série..."
          className="w-full px-6 py-3.5 bg-gray-800 text-white rounded-lg border-2 border-transparent hover:border-blue-500 focus:border-blue-600 focus:outline-none transition-all duration-300 shadow-lg"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              onResultsChange([]);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
