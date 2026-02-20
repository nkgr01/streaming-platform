// app/archive/page.js
import React from 'react';

const archiveVideos = [
  {
    id: 'TheMatrix1999',
    title: 'The Matrix (1999)',
    description: 'A computer hacker learns about the true nature of his reality and his role in the war against its controllers.',
  },
  {
    id: 'FightClub_201904',
    title: 'Fight Club',
    description: 'An office worker forms an underground fight club that evolves into something much more.',
  },
  {
    id: 'Nosferatu1922',
    title: 'Nosferatu (1922)',
    description: 'An unauthorized adaptation of Dracula. A vampire terrorizes a German town.',
  },
];

export default function ArchivePage() {
  return (
    <main className="p-6 bg-gray-900 min-h-screen text-white">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">🎥 Archive.org Streaming</h1>

        <div className="space-y-12">
          {archiveVideos.map((video) => (
            <div key={video.id}>
              <h2 className="text-xl font-semibold mb-2">{video.title}</h2>
              <p className="text-gray-400 mb-4">{video.description}</p>
              <div className="aspect-w-16 aspect-h-9">
                <iframe
                  src={`https://archive.org/embed/${video.id}`}
                  width="100%"
                  height="400"
                  allow="autoplay"
                  title={video.title}
                  className="rounded w-full"
                ></iframe>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
