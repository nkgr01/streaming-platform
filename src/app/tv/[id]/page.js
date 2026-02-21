import React from 'react';
import Link from 'next/link';
import { getTVDetails } from '@lib/tmdb';
import MovieCard from '@components/MovieCard';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const series = await getTVDetails(id);
    
    return {
      title: `${series.name} - StreamingPlatform`,
      description: series.overview?.substring(0, 160) || `Découvrez ${series.name} sur StreamingPlatform`,
      keywords: [series.name, "série TV", "serie", "streaming", ...series.genres?.map(g => g.name) || []],
      openGraph: {
        type: "tv.series",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/tv/${id}`,
        title: `${series.name}`,
        description: series.overview?.substring(0, 160),
        images: series.poster_path ? [{ url: `https://image.tmdb.org/t/p/w500${series.poster_path}`, width: 500, height: 750 }] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: `${series.name}`,
        description: series.overview?.substring(0, 160),
        images: series.poster_path ? [`https://image.tmdb.org/t/p/w500${series.poster_path}`] : [],
      },
    };
  } catch {
    return { title: "Série - StreamingPlatform" };
  }
}

async function TVPage({ params }) {
  const { id } = await params;
  const series = await getTVDetails(id);

  const trailer = series.videos?.results.find(
    (v) => v.type === "Trailer" && v.site === "YouTube"
  );

  const cast = series.credits?.cast.slice(0, 8) || [];

  return (
    <main className="bg-gradient-to-b from-black via-gray-900 to-black min-h-screen text-white">
      {/* Bouton retour */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <Link href="/">
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
            &larr; Retour
          </button>
        </Link>
      </div>

      {/* Hero section */}
      <div className="relative h-96 overflow-hidden">
        {series.backdrop_path && (
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://image.tmdb.org/t/p/w1280${series.backdrop_path}')`,
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
              {series.poster_path && (
                <img
                  src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                  alt={series.name}
                  className="w-full rounded-lg shadow-2xl mb-6"
                />
              )}
              <div className="bg-gray-800 rounded-lg p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-yellow-400 text-2xl font-bold">⭐ {series.vote_average.toFixed(1)}</span>
                  <span className="text-sm text-gray-400">sur 10</span>
                </div>
                <div className="pt-4 border-t border-gray-700 space-y-3">
                  {series.first_air_date && (
                    <div>
                      <p className="text-gray-400 text-sm">Date de sortie</p>
                      <p className="font-semibold">{new Date(series.first_air_date).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}</p>
                    </div>
                  )}
                  {series.number_of_seasons && (
                    <div>
                      <p className="text-gray-400 text-sm">Saisons</p>
                      <p className="font-semibold">{series.number_of_seasons} saison{series.number_of_seasons > 1 ? 's' : ''}</p>
                    </div>
                  )}
                  {series.number_of_episodes && (
                    <div>
                      <p className="text-gray-400 text-sm">Épisodes</p>
                      <p className="font-semibold">{series.number_of_episodes} épisode{series.number_of_episodes > 1 ? 's' : ''}</p>
                    </div>
                  )}
                  {series.genres && series.genres.length > 0 && (
                    <div>
                      <p className="text-gray-400 text-sm">Genres</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {series.genres.map(genre => (
                          <span key={genre.id} className="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold">
                            {genre.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {series.status && (
                    <div>
                      <p className="text-gray-400 text-sm">Statut</p>
                      <p className="font-semibold">{series.status}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Description et détails */}
          <div className="lg:col-span-2">
            <h1 className="text-5xl font-bold mb-2">{series.name}</h1>
            {series.tagline && (
              <p className="text-xl text-gray-400 italic mb-6">&quot;{series.tagline}&quot;</p>
            )}
            
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Synopsis</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {series.overview || "Pas de description disponible."}
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
      </div>
    </main>
  );
}

export default TVPage;
