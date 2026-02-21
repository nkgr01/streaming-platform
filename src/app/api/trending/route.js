import { fetchTrending } from '@lib/tmdb';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get('page') || '1';

  try {
    const data = await fetchTrending(parseInt(page));
    return Response.json(data);
  } catch (error) {
    return Response.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}
