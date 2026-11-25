import photos from '../../public/photo-credits.json';

const photoUrls = new Map(photos.map(photo => [`/${photo.file}`, photo.url]));

function httpsUrl(value: string): string | null {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && !url.username && !url.password ? url.href : null;
  } catch {
    return null;
  }
}

/** The database may store a full HTTPS URL or a legacy image path. No local files are required. */
export function recipeImageUrl(value: unknown, cloudBaseUrl?: string): string | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  const image = value.trim();
  if (image.startsWith('https://')) return httpsUrl(image);
  if (!image.startsWith('/') || image.startsWith('//')) return null;
  const legacyPath = image.replace(/^(\/assets\/(?:hero-pasta|salmon|shakshuka))\.png$/, '$1.jpg');
  if (cloudBaseUrl) {
    const base = httpsUrl(cloudBaseUrl.endsWith('/') ? cloudBaseUrl : `${cloudBaseUrl}/`);
    if (!base) return null;
    const url = new URL(legacyPath.slice(1), base).href;
    return url.startsWith(base) ? url : null;
  }
  return photoUrls.get(legacyPath) ?? null;
}

export const demoRecipeImages = {
  shakshuka: recipeImageUrl('/assets/shakshuka.jpg')!,
  salmon: recipeImageUrl('/assets/salmon.jpg')!,
  pasta: recipeImageUrl('/assets/hero-pasta.jpg')!,
  chickpea: recipeImageUrl('/assets/chickpea.jpg')!,
  chicken: recipeImageUrl('/assets/chicken.jpg')!,
  soup: recipeImageUrl('/assets/soup.jpg')!,
};
