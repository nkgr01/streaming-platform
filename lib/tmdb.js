// lib/tmdb.js pour les requêtes
const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

export async function fetchPopularMovies(page = 1) {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`);
  if (!res.ok) throw new Error("Erreur lors du chargement des films");
  const data = await res.json();
  return data.results;
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
