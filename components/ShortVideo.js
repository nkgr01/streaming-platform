'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useWatchlist } from '@hooks/useWatchlist';

export default function ShortVideo({ item, onWatchlistToggle, isActive }) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const iframeRef = useRef(null);
  const [iframeKey, setIframeKey] = useState(0); // Force re-render pour stop/play

  // Auto-play/pause basé sur isActive
  useEffect(() => {
    if (iframeRef.current) {
      if (isActive) {
        // Jouer la vidéo
        iframeRef.current.src = iframeRef.current.src.includes('autoplay=1') 
          ? iframeRef.current.src 
          : iframeRef.current.src.replace('autoplay=0', 'autoplay=1');
      } else {
        // Arrêter la vidéo en changeant la clé
        setIframeKey(prev => prev + 1);
      }
    }
  }, [isActive]);

  const inWatchlist = isInWatchlist(item.id, item.media_type);

  const handleWatchlistToggle = () => {
    if (inWatchlist) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
    onWatchlistToggle?.();
  };

  const youtubeId = item.video?.key;
  const title = item.title || item.name;
  const date = item.release_date || item.first_air_date;
  const detailLink = item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black relative snap-center overflow-hidden">
      {/* YouTube Embed fullscreen */}
      {youtubeId ? (
        <iframe
          key={iframeKey}
          ref={iframeRef}
          width="100%"
          height="100%"
          src={`https://www.youtube.com/embed/${youtubeId}?autoplay=${isActive ? 1 : 0}&controls=1&modestbranding=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg">Vidéo indisponible</p>
          </div>
        </div>
      )}

      {/* Gradient overlay en bas pour les infos */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent p-6 z-10">
        {/* Infos du contenu */}
        <div className="text-white">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-1 line-clamp-2">{title}</h3>
              <div className="flex items-center gap-3 text-sm text-gray-300">
                <span className="px-2 py-1 bg-blue-600 rounded text-xs font-semibold">
                  {item.media_type === 'movie' ? '🎬 Film' : '📺 Série'}
                </span>
                {date && <span>{new Date(date).getFullYear()}</span>}
                {item.vote_average && <span>⭐ {item.vote_average.toFixed(1)}</span>}
              </div>
            </div>

            {/* Bouton Favoris */}
            <button
              onClick={handleWatchlistToggle}
              className={`ml-2 px-4 py-2 rounded-lg font-semibold transition ${
                inWatchlist
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
              title={inWatchlist ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              {inWatchlist ? '❌ Favoris' : '➕ Favoris'}
            </button>
          </div>

          {/* Synopsis */}
          <div className="mb-4">
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-gray-300 text-sm leading-relaxed hover:text-white transition"
            >
              <p className={isDescriptionExpanded ? '' : 'line-clamp-2'}>
                {item.overview || 'Pas de description disponible'}
              </p>
              {!isDescriptionExpanded && item.overview?.length > 100 && (
                <span className="text-blue-400 text-xs mt-1 block">Voir plus...</span>
              )}
            </button>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Link
              href={detailLink}
              className="flex-1 bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-gray-200 transition text-center"
            >
              Voir les détails
            </Link>
          </div>
        </div>
      </div>

      {/* Indicateurs de scroll (haut/bas) */}
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xs">
        <div className="flex flex-col gap-2">
          <span>↑</span>
        </div>
      </div>
      <div className="absolute left-4 bottom-32 text-gray-400 text-xs">
        <div className="flex flex-col gap-2">
          <span>↓</span>
        </div>
      </div>
    </div>
  );
}
