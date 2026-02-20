export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  const API_KEY = process.env.TMDB_API_KEY;
  const BASE_URL = 'https://api.themoviedb.org/3';

  try {
    const res = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    
    if (!res.ok) {
      return Response.json(
        { error: 'Erreur lors du chargement des films' },
        { status: res.status }
      );
    }

    const data = await res.json();
    return Response.json(data.results);
  } catch (error) {
    return Response.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
