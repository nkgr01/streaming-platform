'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import ShortVideo from '@components/ShortVideo';
import { useWatchlist } from '@hooks/useWatchlist';

export default function ShortsPage() {
  const [videos, setVideos] = useState([]);
  const [usedIds, setUsedIds] = useState(new Set());
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [currentActiveIndex, setCurrentActiveIndex] = useState(0);
  const [showWatchlist, setShowWatchlist] = useState(false);
  const { watchlist, isMounted } = useWatchlist();
  const containerRef = useRef(null);
  const shortRefs = useRef([]);
  const scrollTimeoutRef = useRef(null);

  // Charger les vidéos
  const loadVideos = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/videos?page=${page}`);
      const newVideos = await res.json();

      if (newVideos.length > 0) {
        // Filtrer les vidéos et mettre à jour l'état
        setUsedIds(prevUsedIds => {
          const filteredVideos = newVideos.filter(video => {
            const videoId = `${video.media_type}-${video.id}`;
            return !prevUsedIds.has(videoId);
          });

          // Ajouter les nouvelles vidéos non-vues
          if (filteredVideos.length > 0) {
            setVideos(prev => [...prev, ...filteredVideos]);
          }

          // Toujours aller à la page suivante si on a du contenu
          setPage(prev => prev + 1);

          // Mettre à jour les IDs utilisés
          const updatedUsedIds = new Set(prevUsedIds);
          newVideos.forEach(video => {
            updatedUsedIds.add(`${video.media_type}-${video.id}`);
          });
          return updatedUsedIds;
        });
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Erreur chargement vidéos:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore]);

  // Charger initial
  useEffect(() => {
    if (videos.length === 0) {
      loadVideos();
    }
  }, []);

  // Charger plus quand page change (après changement de page)
  useEffect(() => {
    if (page > 1 && videos.length > 0) {
      loadVideos();
    }
  }, [page]);

  // Intersection Observer pour tracker la vidéo visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        let mostVisibleIndex = 0;
        let maxVisibility = 0;

        entries.forEach((entry) => {
          const index = shortRefs.current.indexOf(entry.target);
          const visibility = entry.intersectionRatio;

          if (visibility > maxVisibility) {
            maxVisibility = visibility;
            mostVisibleIndex = index;
          }
        });

        if (maxVisibility > 0) {
          setCurrentActiveIndex(mostVisibleIndex);
        }
      },
      {
        threshold: [0.3, 0.6, 0.9] // Déclencher quand 30%, 60%, 90% visible
      }
    );

    // Observer tous les shorts
    shortRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      shortRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, [videos]);

  // Gestion du scroll clavier et souris
  const handleScroll = useCallback((e) => {
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      const scrollTop = containerRef.current?.scrollTop || 0;
      const scrollHeight = containerRef.current?.scrollHeight || 0;
      const clientHeight = containerRef.current?.clientHeight || 0;

      // Charger plus si proche de la fin
      if (scrollHeight - scrollTop - clientHeight < 500 && hasMore && !loading) {
        loadVideos();
      }
    }, 100);
  }, [hasMore, loading, loadVideos]);

  // Utiliser l'événement wheel pour scroll smooth
  const handleWheel = useCallback((e) => {
    if (!containerRef.current) return;
    
    e.preventDefault();
    const scrollAmount = window.innerHeight * 0.8;
    
    if (e.deltaY > 0) {
      containerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else {
      containerRef.current.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    }
  }, []);

  // Gestion au clavier
  const handleKeyDown = useCallback((e) => {
    if (!containerRef.current) return;

    const scrollAmount = window.innerHeight * 0.8;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      containerRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      containerRef.current.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll);
    container.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      container.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll, handleWheel, handleKeyDown]);

  if (!isMounted) {
    return <div className="w-full h-screen bg-black"></div>;
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Conteneur Shorts avec scroll snap */}
      <div
        ref={containerRef}
        className="w-full h-full overflow-y-scroll snap-y snap-mandatory scroll-smooth"
        style={{ scrollBehavior: 'smooth' }}
      >
        {videos.length > 0 ? (
          videos.map((video, idx) => (
            <div
              key={`${video.media_type}-${video.id}-${idx}`}
              ref={(el) => (shortRefs.current[idx] = el)}
            >
              <ShortVideo
                item={video}
                isActive={currentActiveIndex === idx}
                onWatchlistToggle={() => setShowWatchlist(false)}
              />
            </div>
          ))
        ) : (
          <div className="w-full h-screen flex items-center justify-center bg-black">
            <div className="text-center">
              <p className="text-2xl font-bold text-white mb-4">Chargement...</p>
            </div>
          </div>
        )}

        {/* Loading animation */}
        {loading && (
          <div className="w-full h-screen flex items-center justify-center bg-black/80">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
              </div>
              <p className="text-white font-semibold">Chargement des extraits...</p>
            </div>
          </div>
        )}
      </div>

      {/* Header fixe */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-6 flex justify-between items-center">
        <Link href="/" className="text-white hover:opacity-80 transition text-2xl">
          ←
        </Link>
        <h1 className="text-white text-2xl font-bold">🎬 Extraits</h1>
        <button
          onClick={() => setShowWatchlist(!showWatchlist)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition"
        >
          ❤️ Favoris ({watchlist.length})
        </button>
      </div>

      {/* Modale Favoris */}
      {showWatchlist && (
        <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
            <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">❤️ Mes Favoris ({watchlist.length})</h2>
              <button
                onClick={() => setShowWatchlist(false)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {watchlist.length > 0 ? (
                <div className="space-y-3">
                  {watchlist.map(item => (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      href={item.media_type === 'movie' ? `/movie/${item.id}` : `/tv/${item.id}`}
                      className="flex items-center gap-4 p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition"
                    >
                      {item.poster_path && (
                        <img
                          src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                          alt={item.title || item.name}
                          className="w-12 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-white">{item.title || item.name}</p>
                        <p className="text-sm text-gray-400">
                          {item.media_type === 'movie' ? '🎬 Film' : '📺 Série'} • ⭐ {item.vote_average?.toFixed(1) || 'N/A'}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-lg">Vos favoris sont vides</p>
                  <p className="text-gray-500 text-sm mt-2">Ajoutez des films et séries en cliquant sur "➕ Favoris"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Controls info */}
      <div className="absolute bottom-6 right-6 z-20 bg-black/80 rounded-lg p-4 text-white text-sm border border-gray-700">
        <p>⬆️/⬇️ ou Scroll pour naviguer</p>
        <p>❤️ Click pour voir vos favoris</p>
      </div>

      {/* Close button */}
      <button
        onClick={() => window.history.back()}
        className="absolute top-6 right-6 z-20 text-white hover:bg-white/20 p-3 rounded-full transition text-2xl bg-black/50"
        title="Fermer les extraits"
      >
        ✕
      </button>
    </div>
  );
}
