export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page') || '1';
    const API_KEY = process.env.TMDB_API_KEY;

    // Récupérer films populaires
    const moviesRes = await fetch(
      `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=fr&page=${page}`
    );
    const moviesData = await moviesRes.json();
    const movies = moviesData.results || [];

    // Récupérer séries populaires
    const tvRes = await fetch(
      `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=fr&page=${page}`
    );
    const tvData = await tvRes.json();
    const tvSeries = tvData.results || [];

    // Récupérer les vidéos pour chaque contenu
    const itemsWithVideos = [];

    for (const movie of movies) {
      const videoRes = await fetch(
        `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${API_KEY}&language=fr`
      );
      const videoData = await videoRes.json();
      const trailer = (videoData.results || []).find(v => v.type === 'Trailer' || v.type === 'Teaser');
      
      if (trailer) {
        itemsWithVideos.push({
          id: movie.id,
          title: movie.title,
          overview: movie.overview,
          poster_path: movie.poster_path,
          backdrop_path: movie.backdrop_path,
          vote_average: movie.vote_average,
          release_date: movie.release_date,
          media_type: 'movie',
          video: trailer
        });
      }
    }

    for (const tv of tvSeries) {
      const videoRes = await fetch(
        `https://api.themoviedb.org/3/tv/${tv.id}/videos?api_key=${API_KEY}&language=fr`
      );
      const videoData = await videoRes.json();
      const trailer = (videoData.results || []).find(v => v.type === 'Trailer' || v.type === 'Teaser');
      
      if (trailer) {
        itemsWithVideos.push({
          id: tv.id,
          title: tv.name,
          overview: tv.overview,
          poster_path: tv.poster_path,
          backdrop_path: tv.backdrop_path,
          vote_average: tv.vote_average,
          first_air_date: tv.first_air_date,
          media_type: 'tv',
          video: trailer
        });
      }
    }

    return Response.json(itemsWithVideos);
  } catch (error) {
    console.error('Videos API Error:', error);
    return Response.json({ error: 'Erreur lors de la récupération des vidéos' }, { status: 500 });
  }
}
