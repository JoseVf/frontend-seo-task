const DEFAULT_SITE_URL = "http://localhost:3000";

function resolveSiteUrl(rawUrl: string | undefined): string {
  if (!rawUrl) return DEFAULT_SITE_URL;
  try {
    const parsed = new URL(rawUrl);
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export const SITE_URL = resolveSiteUrl(process.env.NEXT_PUBLIC_SITE_URL);
export const PRODUCTS_REVALIDATE_SECONDS = 300;
export const PRODUCTS_CACHE_TAG = "products";

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, SITE_URL).toString();
}

export function productUrl(slug: string): string {
  return absoluteUrl(`/products/${encodeURIComponent(slug)}`);
}
