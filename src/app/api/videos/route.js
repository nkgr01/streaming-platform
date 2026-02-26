export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const API_KEY = process.env.TMDB_API_KEY;
    const language = 'fr';

    // Marges aléatoires pour chaque page
    const randomOffset = Math.floor(Math.random() * 400);
    
    // Récupérer films populaires avec offset aléatoire
    const moviesUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=popularity.desc&with_original_language=en|fr|ja`;
    const moviesRes = await fetch(moviesUrl);
    const moviesData = await moviesRes.json();
    const movies = moviesData.results || [];

    // Récupérer séries populaires avec offset aléatoire
    const tvUrl = `https://api.themoviedb.org/3/discover/tv?api_key=${API_KEY}&language=${language}&page=${page}&sort_by=popularity.desc&with_original_language=en|fr|ja`;
    const tvRes = await fetch(tvUrl);
    const tvData = await tvRes.json();
    const tvSeries = tvData.results || [];

    // Récupérer les vidéos pour chaque contenu
    const itemsWithVideos = [];
    const allItems = [...movies.map(m => ({ ...m, media_type: 'movie' })), 
                     ...tvSeries.map(t => ({ ...t, media_type: 'tv' }))];

    // Mélanger aléatoirement les résultats
    const shuffled = allItems.sort(() => Math.random() - 0.5);

    for (const item of shuffled.slice(0, 15)) {
      try {
        const videoRes = await fetch(
          `https://api.themoviedb.org/3/${item.media_type}/${item.id}/videos?api_key=${API_KEY}&language=${language}`
        );
        const videoData = await videoRes.json();
        
        // Chercher une bande-annonce ou teaser
        const trailer = (videoData.results || []).find(v => 
          v.type === 'Trailer' || v.type === 'Teaser' || v.type === 'Clip'
        );
        
        if (trailer && trailer.site === 'YouTube') {
          itemsWithVideos.push({
            id: item.id,
            title: item.title || item.name,
            overview: item.overview,
            poster_path: item.poster_path,
            backdrop_path: item.backdrop_path,
            vote_average: item.vote_average,
            release_date: item.release_date || item.first_air_date,
            media_type: item.media_type,
            video: trailer
          });
        }
      } catch (error) {
        console.error(`Erreur pour ${item.media_type} ${item.id}:`, error);
      }
    }

    // Mélanger à nouveau les résultats finaux
    const finalResults = itemsWithVideos.sort(() => Math.random() - 0.5);

    return Response.json(finalResults);
  } catch (error) {
    console.error('Videos API Error:', error);
    return Response.json({ error: 'Erreur lors de la récupération des vidéos' }, { status: 500 });
  }
}
