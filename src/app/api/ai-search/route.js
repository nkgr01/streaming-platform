export async function POST(req) {
  try {
    const { query } = await req.json();

    if (!query || query.trim().length === 0) {
      return Response.json({
        genre: '',
        year: '',
        minRating: '0',
        type: 'all'
      });
    }

    const lowerQuery = query.toLowerCase();
    
    // Détection des acteurs entre parenthèses (ex: (Tony Statham))
    const actorMatch = query.match(/\(([^)]+)\)/);
    let actorResults = null;
    
    if (actorMatch) {
      const actorName = actorMatch[1].trim();
      try {
        const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
        
        // Chercher l'acteur sur TMDB
        const searchRes = await fetch(
          `https://api.themoviedb.org/3/search/person?api_key=${tmdbApiKey}&query=${encodeURIComponent(actorName)}&language=fr-FR`
        );
        const searchData = await searchRes.json();
        
        if (searchData.results && searchData.results.length > 0) {
          const actor = searchData.results[0];
          const actorId = actor.id;
          
          // Récupérer les films de l'acteur
          const moviesRes = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}/movie_credits?api_key=${tmdbApiKey}&language=fr-FR`
          );
          const moviesData = await moviesRes.json();
          
          // Récupérer les séries de l'acteur
          const tvRes = await fetch(
            `https://api.themoviedb.org/3/person/${actorId}/tv_credits?api_key=${tmdbApiKey}&language=fr-FR`
          );
          const tvData = await tvRes.json();
          
          // Combiner et formater les résultats
          const allResults = [
            ...(moviesData.cast || []).map(item => ({
              id: item.id,
              title: item.title,
              media_type: 'movie',
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              vote_average: item.vote_average,
              overview: item.overview,
              release_date: item.release_date
            })),
            ...(tvData.cast || []).map(item => ({
              id: item.id,
              title: item.name,
              media_type: 'tv',
              poster_path: item.poster_path,
              backdrop_path: item.backdrop_path,
              vote_average: item.vote_average,
              overview: item.overview,
              first_air_date: item.first_air_date
            }))
          ];
          
          actorResults = {
            actor: actor.name,
            results: allResults
          };
        }
      } catch (error) {
        console.error('Erreur recherche acteur:', error);
      }
    }
    
    // Si un acteur est trouvé, retourner ses résultats avec un flag spécial
    if (actorResults) {
      return Response.json({
        isActorSearch: true,
        actorName: actorResults.actor,
        actorResults: actorResults.results,
        genre: '',
        year: '',
        minRating: '0',
        type: 'all'
      });
    }

    // Extraction des genres
    const genreMap = {
      'action': '28',
      'aventure': '12',
      'animation': '16',
      'comédie': '35',
      'crime': '80',
      'documentaire': '99',
      'drame': '18',
      'famille': '10751',
      'fantaisie': '14',
      'histoire': '36',
      'horreur': '27',
      'musique': '10402',
      'mystère': '9648',
      'romance': '10749',
      'science-fiction': '878',
      'sci-fi': '878',
      'tv movie': '10770',
      'thriller': '53',
      'guerre': '10752',
      'western': '37',
      'policier': '80',
      'fantasy': '14',
      'suspense': '53'
    };

    let detectedGenre = '';
    for (const [genre, id] of Object.entries(genreMap)) {
      if (lowerQuery.includes(genre)) {
        detectedGenre = id;
        break;
      }
    }

    // Extraction de la note minimale
    let minRating = '0';
    if (lowerQuery.includes('excellent') || lowerQuery.includes('meilleur') || lowerQuery.includes('top')) {
      minRating = '7.5';
    } else if (lowerQuery.includes('bon') || lowerQuery.includes('bien') || lowerQuery.includes('qualité')) {
      minRating = '6.5';
    } else if (lowerQuery.includes('très bon') || lowerQuery.includes('magnifique')) {
      minRating = '8';
    }

    // Extraction de l'année
    let year = '';
    const yearMatch = query.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      year = yearMatch[0];
    } else if (lowerQuery.includes('récent') || lowerQuery.includes('nouveau') || lowerQuery.includes('2024') || lowerQuery.includes('2025') || lowerQuery.includes('2026')) {
      year = new Date().getFullYear().toString();
    } else if (lowerQuery.includes('ancien') || lowerQuery.includes('classique') || lowerQuery.includes('années 80') || lowerQuery.includes('années 90')) {
      if (lowerQuery.includes('années 80')) {
        year = '1980';
      } else if (lowerQuery.includes('années 90')) {
        year = '1990';
      } else if (lowerQuery.includes('années 2000')) {
        year = '2000';
      } else if (lowerQuery.includes('années 2010')) {
        year = '2010';
      }
    }

    // Extraction du type de contenu
    let type = 'all';
    if (lowerQuery.includes('film') && !lowerQuery.includes('série')) {
      type = 'movie';
    } else if (lowerQuery.includes('série') && !lowerQuery.includes('film')) {
      type = 'tv';
    }

    return Response.json({
      genre: detectedGenre,
      year,
      minRating,
      type
    });
  } catch (error) {
    console.error('Erreur traitement IA:', error);
    return Response.json(
      { error: 'Erreur lors du traitement' },
      { status: 500 }
    );
  }
}
