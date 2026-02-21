import React from 'react';
import Link from 'next/link';
import { getMovieDetails } from '@lib/tmdb';
import MovieCard from '@components/MovieCard';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const movie = await getMovieDetails(id);
    
    return {
      title: `${movie.title} - StreamingPlatform`,
      description: movie.overview?.substring(0, 160) || `Découvrez ${movie.title} sur StreamingPlatform`,
      keywords: [movie.title, "film", "cinema", ...movie.genres?.map(g => g.name) || []],
      openGraph: {
        type: "movie.movie",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/movie/${id}`,
        title: `${movie.title}`,
        description: movie.overview?.substring(0, 160),
        images: movie.poster_path ? [{ url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`, width: 500, height: 750 }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${movie.title}`,
        description: movie.overview?.substring(0, 160),
        images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
      },
    };
  } catch {
    return { title: "Film - StreamingPlatform" };
  }
}

async function MoviePage({ params }) {
  const { id } = await params;
  const movie = await getMovieDetails(id);

  const trailer = movie.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const cast = movie.credits?.cast.slice(0, 8) || [];
  const recommendations = movie.recommendations?.results.slice(0, 4) || [];

  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      {/* Structured Data - Movie */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Movie",
            "name": movie.title,
            "description": movie.overview,
            "image": `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            "datePublished": movie.release_date,
            "director": movie.credits?.crew
              ?.filter(p => p.job === "Director")
              .map(p => ({ "@type": "Person", "name": p.name })) || [],
            "actor": cast.map(actor => ({
              "@type": "Person",
              "name": actor.name,
              "image": actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : undefined
            })),
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": movie.vote_average,
              "ratingCount": movie.vote_count
            },
            "duration": `PT${hours}H${minutes}M`,
            "genre": movie.genres?.map(g => g.name) || []
          })
        }}
      />
      
      {/* Bouton retour */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            ← Retour &agrave; l&apos;accueil
          </button>
        </Link>
      </div>

      {/* Hero section */}
      <div className="relative h-96 overflow-hidden">
        {movie.backdrop_path && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://image.tmdb.org/t/p/w1280${movie.backdrop_path}')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Poster et info de base */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              {movie.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-2xl mb-6"
                />
              )}
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-2xl font-bold">⭐ {movie.vote_average.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">sur 10</span>
                </div>
                <div className="pt-4 border-t border-gray-700 space-y-3">
                  {movie.release_date && (
                    <div>
                      <p className="text-gray-400 text-sm">Date de sortie</p>
                      <p className="font-semibold">{new Date(movie.release_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  )}
                  {movie.runtime > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Durée</p>
                      <p className="font-semibold">{hours}h {minutes}min</p>
                    </div>
                  )}
                  {movie.genres && movie.genres.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Genres</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {movie.genres.map(genre => (
                          <span key={genre.id} className="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {movie.budget > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Budget</p>
                      <p className="font-semibold">${(movie.budget / 1000000).toFixed(1)}M</p>
                    </div>
                  )}
                  {movie.revenue > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Recettes</p>
                      <p className="font-semibold">${(movie.revenue / 1000000).toFixed(1)}M</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description et détails */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-bold mb-2">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-xl text-gray-400 italic mb-6">&quot;{movie.tagline}&quot;</p>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {movie.overview || "Pas de description disponible."}
              </p>
            </div>

            {/* Trailer */}
            {trailer ? (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">🎬 Bande-annonce</h2>
                <div className="aspect-video rounded-lg overflow-hidden shadow-2xl">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${trailer.key}`}
                    title="Trailer"
                    allowFullScreen
                  />
                </div>
              </div>
            ) : (
              <p className="text-red-400 mb-8">Pas de bande-annonce disponible.</p>
            )}
          </div>
        </div>

        {/* Section Casting */}
        {cast.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">👥 Distribution</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {cast.map(actor => (
                <div key={actor.id} className="bg-gray-800 rounded-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {actor.profile_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${actor.profile_path}`}
                      alt={actor.name}
                      className="w-full h-64 object-cover"
                    />
                  ) : (
                    <div className="w-full h-64 bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-500">No image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-white truncate">{actor.name}</h3>
                    <p className="text-sm text-gray-400 truncate">{actor.character}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Films recommandés */}
        {recommendations.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-6">🎯 Films similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.map(movie => (
                <MovieCard key={movie.id} movie={{ ...movie, media_type: 'movie' }} />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default MoviePage;


