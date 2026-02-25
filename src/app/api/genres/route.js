export async function GET() {
  try {
    const movieGenresRes = await fetch(
      `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}&language=fr`
    );
    const tvGenresRes = await fetch(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}&language=fr`
    );

    const movieData = await movieGenresRes.json();
    const tvData = await tvGenresRes.json();

    // Combiner et dédupliquer les genres
    const allGenres = [...(movieData.genres || []), ...(tvData.genres || [])];
    const uniqueGenres = Array.from(
      new Map(allGenres.map(g => [g.id, g])).values()
    ).sort((a, b) => a.name.localeCompare(b.name));

    return Response.json(uniqueGenres);
  } catch (error) {
    return Response.json({ error: 'erreur sur la requete genres' }, { status: 500 });
  }
}
