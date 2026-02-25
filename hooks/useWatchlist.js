'use client';

import { useState, useEffect } from 'react';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState([]);
  const [isMounted, setIsMounted] = useState(false);

  // Charger depuis localStorage au montage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('watchlist');
      setWatchlist(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Erreur loading watchlist:', error);
      setWatchlist([]);
    }
    setIsMounted(true);
  }, []);

  // Sauvegarder dans localStorage quand watchlist change
  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('watchlist', JSON.stringify(watchlist));
    }
  }, [watchlist, isMounted]);

  // Ajouter à la watchlist
  const addToWatchlist = (item) => {
    setWatchlist(prev => {
      const exists = prev.some(w => w.id === item.id && w.media_type === item.media_type);
      if (exists) return prev;
      return [...prev, { ...item, addedAt: new Date().toISOString() }];
    });
  };

  // Retirer de la watchlist
  const removeFromWatchlist = (id, mediaType) => {
    setWatchlist(prev => prev.filter(item => !(item.id === id && item.media_type === mediaType)));
  };

  // Vérifier si un item est dans la watchlist
  const isInWatchlist = (id, mediaType) => {
    return watchlist.some(item => item.id === id && item.media_type === mediaType);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    isMounted
  };
}
