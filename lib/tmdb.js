// lib/tmdb.js pour les requêtes
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des films");
  const data = await res.json();
  return data.results;
}

export async function fetchPopularTV(page = 1) {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des séries");
  const data = await res.json();
  return data.results;
}

export async function fetchPopularMixed(page = 1) {
  const [movies, tv] = await Promise.all([
    fetchPopularMovies(page),
    fetchPopularTV(page)
  ]);
  
  // Ajouter media_type pour les films (l'API TV ne le renvoie pas toujours)
  const moviesWithType = movies.map(m => ({ ...m, media_type: 'movie' }));
  const tvWithType = tv.map(t => ({ ...t, media_type: 'tv' }));
  
  // Fusionner et mélanger
  const mixed = [];
  const maxLength = Math.max(moviesWithType.length, tvWithType.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < moviesWithType.length) mixed.push(moviesWithType[i]);
    if (i < tvWithType.length) mixed.push(tvWithType[i]);
  }
  
  return mixed;
}

export async function searchMovies(query, page = 1) {
  const res = await fetch(`${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}`);
  if (!res.ok) throw new Error("Erreur lors de la recherche");
  const data = await res.json();
  return data.results.filter(item => item.media_type === 'movie' || item.media_type === 'tv');
}

export async function getMovieDetails(id) {
  const res = await fetch(
    `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,videos,similar,recommendations`
  );
  if (!res.ok) throw new Error("Erreur lors du chargement du film");
  return res.json();
}

export async function getTVDetails(id) {
  const res = await fetch(
    `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=credits,videos`
  );
  if (!res.ok) throw new Error("Erreur lors du chargement de la série");
  return res.json();
}

export async function fetchTrending(page = 1) {
  const [movies, tv] = await Promise.all([
    fetch(`${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR&page=${page}`).then(r => r.json()),
    fetch(`${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=fr-FR&page=${page}`).then(r => r.json())
  ]);
  
  const moviesWithType = movies.results.map(m => ({ ...m, media_type: 'movie' }));
  const tvWithType = tv.results.map(t => ({ ...t, media_type: 'tv' }));
  
  // Fusionner et mélanger
  const mixed = [];
  const maxLength = Math.max(moviesWithType.length, tvWithType.length);
  for (let i = 0; i < maxLength; i++) {
    if (i < moviesWithType.length) mixed.push(moviesWithType[i]);
    if (i < tvWithType.length) mixed.push(tvWithType[i]);
  }
  
  return mixed;
}
