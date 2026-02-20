import MovieSection from "@/composant/videoSection";

const API_KEY = process.env.TMDB_API_KEY;

const getMovies = async (url) => {
  const res = await fetch(`https://api.themoviedb.org/3/${url}&api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
};

export default async function HOMEpage() {
  const [popular, action, topRated, horror, kids] = await Promise.all([
    getMovies("movie/popular?language=fr-FR&page=1"),
    getMovies("discover/movie?with_genres=28&language=fr-FR&page=1"), // action
    getMovies("movie/top_rated?language=fr-FR&page=1"),
    getMovies("discover/movie?with_genres=27&language=fr-FR&page=1"), // horreur
    getMovies("discover/movie?with_genres=10751&language=fr-FR&page=1"), // enfants
  ]);

  return (
    <main className="space-y-8 p-6">
      <MovieSection title="🎥 Films Populaires" movies={popular} />
      <MovieSection title="💥 Films d’Action" movies={action} />
      <MovieSection title="⭐ Mieux Notés" movies={topRated} />
      <MovieSection title="😱 Films d’Horreur" movies={horror} />
      <MovieSection title="🧒 Films pour Enfants" movies={kids} />
    </main>
  );
}
