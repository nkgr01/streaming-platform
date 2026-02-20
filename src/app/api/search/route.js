export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  const page = searchParams.get('page') || '1';

  if (!query) {
    return Response.json(
      { error: 'Query parameter is required' },
      { status: 400 }
    );
  }

  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  try {
    const res = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!res.ok) {
      return Response.json(
        { error: 'Erreur lors de la recherche' },
        { status: res.status }
      );
    }

    const data = await res.json();
    const filtered = data.results.filter(
      item => item.media_type === 'movie' || item.media_type === 'tv'
    );
    
    return Response.json(filtered);
  } catch (error) {
    return Response.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
