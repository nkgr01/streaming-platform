import { getTVDetails } from '@lib/tmdb';

export async function generateMetadata({ params }) {
  const { id } = await params;
  
  try {
    const series = await getTVDetails(id);
    
    return {
      title: `${series.name} - StreamingPlatform`,
      description: series.overview?.substring(0, 160) || `Découvrez ${series.name} sur StreamingPlatform. Consulter le casting, la bande-annonce et les critiques.`,
      keywords: [
        series.name,
        "série TV",
        "serie",
        "streaming",
        ...series.genres?.map(g => g.name) || [],
      ],
      openGraph: {
        type: "tv.series",
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/tv/${id}`,
        title: `${series.name} - StreamingPlatform`,
        description: series.overview?.substring(0, 160),
        images: series.poster_path ? [
          {
            url: `https://image.tmdb.org/t/p/w500${series.poster_path}`,
            width: 500,
            height: 750,
            alt: series.name,
          },
          {
            url: `https://image.tmdb.org/t/p/w500${series.backdrop_path}`,
            width: 500,
            height: 281,
            alt: `${series.name} backdrop`,
          }
        ] : [],
        createdTime: series.first_air_date,
      },
      twitter: {
        card: "summary_large_image",
        title: `${series.name}`,
        description: series.overview?.substring(0, 160),
        images: series.poster_path ? [`https://image.tmdb.org/t/p/w500${series.poster_path}`] : [],
      },
      alternates: {
        canonical: `${process.env.NEXT_PUBLIC_SITE_URL}/tv/${id}`,
      }
    };
  } catch (error) {
    return {
      title: "Série - StreamingPlatform",
      description: "Découvrez cette série sur StreamingPlatform"
    };
  }
}
