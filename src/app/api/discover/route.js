import { fetchPopularMovies, fetchPopularTV } from '@lib/tmdb';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const genre = searchParams.get('genre') || '';
    const year = searchParams.get('year') || '';
    const minRating = searchParams.get('minRating') || '0';
    const page = searchParams.get('page') || '1';
    const type = searchParams.get('type') || 'all'; // 'movie', 'tv', or 'all'

    const API_KEY = process.env.TMDB_API_KEY;
    const BASE_URL = 'https://api.themoviedb.org/3';

    let url = `${BASE_URL}/discover/`;
    let params = `api_key=${API_KEY}&language=fr&page=${page}&sort_by=popularity.desc`;

    // Ajouter filtres
    if (genre) {
      params += `&with_genres=${genre}`;
    }
    if (year) {
      params += `&primary_release_year=${year}`;
    }
    if (minRating > 0) {
      params += `&vote_average.gte=${minRating}`;
    }

    const results = [];

    // Récupérer films ou tous (films + séries)
    if (type === 'movie' || type === 'all') {
      const movieUrl = `${url}movie?${params}`;
      const movieRes = await fetch(movieUrl);
      const movieData = await movieRes.json();
      const moviesWithType = (movieData.results || []).map(m => ({ ...m, media_type: 'movie' }));
      results.push(...moviesWithType);
    }

    // Récupérer séries ou tous
    if (type === 'tv' || type === 'all') {
      const tvUrl = `${url}tv?${params}`;
      const tvRes = await fetch(tvUrl);
      const tvData = await tvRes.json();
      const tvWithType = (tvData.results || []).map(t => ({ ...t, media_type: 'tv' }));
      results.push(...tvWithType);
    }

    // Mixer les résultats si "all"
    if (type === 'all') {
      results.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
    }

    return Response.json(results.slice(0, 40)); // Limiter à 40 résultats
  } catch (error) {
    console.error('Discover API Error:', error);
    return Response.json({ error: 'Erreur lors de la découverte' }, { status: 500 });
  }
}
