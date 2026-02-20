import { getMovieDetails } from '@lib/tmdb';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const movie = await getMovieDetails(id);
    
    return {
      title: `${movie.title} - StreamingPlatform`,
      description: movie.overview?.substring(0, 160) || `Découvrez ${movie.title} sur StreamingPlatform. Consulter le casting, la bande-annonce et les critiques.`,
      keywords: [
        movie.title,
        "film",
        "cinema",
        ...movie.genres?.map(g => g.name) || [],
        "streaming"
      ],
      openGraph: {
        type: "movie.movie",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/movie/${id}`,
        title: `${movie.title} - StreamingPlatform`,
        description: movie.overview?.substring(0, 160),
        images: movie.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            width: 500,
            height: 750,
            alt: movie.title,
          },
          {
            url: `https://image.tmdb.org/t/p/w500${movie.backdrop_path}`,
            width: 500,
            height: 281,
            alt: `${movie.title} backdrop`,
          }
        ] : [],
        releaseDate: movie.release_date,
        directors: movie.credits?.crew
          ?.filter(p => p.job === "Director")
          .map(p => p.name) || [],
        actors: movie.credits?.cast
          ?.slice(0, 5)
          .map(a => a.name) || []
      },
      twitter: {
        card: "summary_large_image",
        title: `${movie.title}`,
        description: movie.overview?.substring(0, 160),
        images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/movie/${id}`,
      }
    };
  } catch (error) {
    return {
      title: "Film - StreamingPlatform",
      description: "Découvrez ce film sur StreamingPlatform"
    };
  }
}
