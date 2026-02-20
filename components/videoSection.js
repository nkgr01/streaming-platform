import Link from "next/link";
import Image from "next/image";

export default function MovieSection({ title, movies }) {
return (
    <section>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {movies.map((movie) => (
                <Link key={movie.id} href={`/movie/${movie.id}`}>
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={450}
                        className="rounded hover:scale-105 transition-transform"
                        style={{ objectFit: "cover" }}
                        priority={true}
                    />
                </Link>
            ))}
        </div>
    </section>
);
}
