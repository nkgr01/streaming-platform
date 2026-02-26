'use client';

import { useState } from 'react';

export default function AISearch({ onSearch, loading }) {
  const [query, setQuery] = useState('');
  const [analyzing, setAnalyzing] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
      });
      
      const filters = await res.json();
      onSearch(filters);
      setQuery('');
    } catch (error) {
      console.error('Erreur recherche IA:', error);
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-2xl p-8 border border-purple-300/30 shadow-2xl mb-10">
      {/* En-tête */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl">🤖</span>
        <div>
          <h3 className="text-2xl font-bold text-white">Recherche Intelligente par IA</h3>
          <p className="text-purple-200 text-sm">Trouvez exactement ce que vous cherchez</p>
        </div>
      </div>
      
      <p className="text-gray-100 text-sm mb-6 leading-relaxed">
        Décrivez le film ou la série que vous cherchez, le genre, l'acteur, l'année... et l'IA trouvera les meilleurs résultats pour vous
      </p>

      {/* Formulaire */}
      <form onSubmit={handleSearch} className="flex flex-col gap-4">
        <div className="relative">
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Décrivez ce que vous cherchez... (ex: Film d'action avec Tom Cruise, Série dramatique récente, Comédie des années 80...)"
            disabled={analyzing || loading}
            className="w-full bg-white/15 backdrop-blur-sm border border-white/25 rounded-xl px-5 py-4 text-white placeholder-gray-300 resize-none focus:outline-none focus:border-white/50 focus:bg-white/20 transition disabled:opacity-50"
            rows="4"
          />
          <div className="absolute bottom-3 right-3 text-gray-400 text-xs">
            {query.length}/500
          </div>
        </div>

        {/* Bouton responsive */}
        <button
          type="submit"
          disabled={!query.trim() || analyzing || loading}
          className="w-full md:w-auto md:self-end bg-gradient-to-r from-white to-gray-100 text-transparent bg-clip-text hover:from-blue-100 hover:to-purple-100 disabled:from-gray-400 disabled:to-gray-400 px-8 py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 border-2 border-white/50 hover:border-white disabled:opacity-50 shadow-lg"
        >
          {analyzing ? (
            <>
              <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
              <span className="text-white">Recherche en cours...</span>
            </>
          ) : (
            <>
              <span className="text-lg">🔍</span>
              <span className="text-white font-semibold">Chercher</span>
            </>
          )}
        </button>
      </form>

      {/* Exemples et conseils */}
      <div className="mt-6 pt-6 border-t border-white/20">
        <p className="text-xs text-purple-100 font-semibold mb-3 uppercase tracking-wider">💡 Exemples de recherche:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="text-xs text-gray-200 flex items-start gap-2">
            <span>✨</span>
            <span>Film d'action avec Tom Cruise</span>
          </div>
          <div className="text-xs text-gray-200 flex items-start gap-2">
            <span>✨</span>
            <span>Série dramatique excellente 2024</span>
          </div>
          <div className="text-xs text-gray-200 flex items-start gap-2">
            <span>✨</span>
            <span>Comédie des années 90 amusante</span>
          </div>
          <div className="text-xs text-gray-200 flex items-start gap-2">
            <span>✨</span>
            <span>Films avec (Léonardo DiCaprio)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
