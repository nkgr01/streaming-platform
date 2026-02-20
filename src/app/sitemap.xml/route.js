export const dynamic = 'force-dynamic';

async function getSitemapContent() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://streaming-platform.vercel.app';

  const staticUrls = `
    <url>
      <loc>${baseUrl}</loc>
      <lastmod>${new Date().toISOString()}</lastmod>
      <changefreq>daily</changefreq>
      <priority>1.0</priority>
    </url>
  `;

  let dynamicUrls = '';

  try {
    // Récupérer les films populaires
    const moviesRes = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1&page=2`);
    const moviesData = await moviesRes.json();
    
    if (moviesData.results) {
      moviesData.results.slice(0, 100).forEach((movie) => {
        dynamicUrls += `
        <url>
          <loc>${baseUrl}/movie/${movie.id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`;
      });
    }

    // Récupérer les séries populaires
    const seriesRes = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${process.env.TMDB_API_KEY}&language=fr-FR&page=1&page=2`);
    const seriesData = await seriesRes.json();
    
    if (seriesData.results) {
      seriesData.results.slice(0, 100).forEach((series) => {
        dynamicUrls += `
        <url>
          <loc>${baseUrl}/tv/${series.id}</loc>
          <lastmod>${new Date().toISOString()}</lastmod>
          <changefreq>weekly</changefreq>
          <priority>0.8</priority>
        </url>`;
      });
    }
  } catch (error) {
    console.error('Erreur génération sitemap:', error);
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${dynamicUrls}
</urlset>`;
}

export async function GET() {
  const sitemap = await getSitemapContent();
  
  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
