import Link from 'next/link';

export default function MovieCard({ movie }) {
  // Déterminer le type de contenu
  let isMovie = true;
  if (movie.media_type) {
    isMovie = movie.media_type === 'movie';
  } else if (movie.title === undefined && movie.name !== undefined) {
    isMovie = false;
  }

  const id = movie.id;
  const title = movie.title || movie.name;
  const poster = movie.poster_path;
  const rating = movie.vote_average || 0;
  const releaseDate = movie.release_date || movie.first_air_date;
  
  // Description complète (3-5 lignes)
  let description = movie.overview || 'Pas de description disponible.';
  // Limiter à environ 3-5 lignes (150-200 caractères)
  if (description.length > 200) {
    description = description.substring(0, 200).trim() + '...';
  }

  return (
    <Link href={`/${isMovie ? 'movie' : 'tv'}/${id}`}>
      <div className="group bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 cursor-pointer h-full flex flex-col">
        <div className="relative overflow-hidden bg-gray-900 aspect-video">
          {poster ? (
            <img
              src={`https://image.tmdb.org/t/p/w500${poster}`}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              Image non disponible
            </div>
          )}
          <div className="absolute top-2 right-2 bg-yellow-500 text-black px-2.5 py-1 rounded-full font-semibold text-sm">
            {rating.toFixed(1)}⭐
          </div>
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <span className="text-white text-lg font-bold">Voir plus →</span>
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h2 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
            {title}
          </h2>
          <p className="text-xs text-gray-400 mt-1 mb-3">{releaseDate}</p>
          
          {/* Description sur 3-5 lignes */}
          <p className="text-sm text-gray-300 line-clamp-3 mb-3 flex-1">
            {description}
          </p>
          
          <div className="inline-block bg-blue-600 text-white text-xs px-3 py-1.5 rounded-lg font-semibold">
            {isMovie ? '🎬 Film' : '📺 Série'}
          </div>
        </div>
      </div>
    </Link>
  );
}
