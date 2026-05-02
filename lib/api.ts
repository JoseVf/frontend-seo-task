import { PRODUCTS } from "./products-data";
import type { Product } from "./products-data";
import {
  PRODUCTS_CACHE_TAG,
  PRODUCTS_REVALIDATE_SECONDS,
} from "./seo";

export type {
  Product,
  ProductFeature,
  ProductSpec,
  Review,
} from "./products-data";

type FetchInitWithNext = RequestInit & {
  next?: {
    revalidate?: number;
    tags?: string[];
  };
};

function getApiOrigin(): string {
  return "http://127.0.0.1:3000";
}

function mergeRequestInit(
  defaults: FetchInitWithNext,
  init?: RequestInit,
): FetchInitWithNext {
  const base = defaults;
  const override = (init ?? {}) as FetchInitWithNext;
  const merged: FetchInitWithNext = {
    ...base,
    ...override,
  };
  const baseNext = base.next ?? {};
  const overrideNext = override.next ?? {};
  const tags = [
    ...(baseNext.tags ?? []),
    ...(overrideNext.tags ?? []),
  ];
  const dedupedTags = [...new Set(tags)];
  if (
    Object.keys(baseNext).length > 0 ||
    Object.keys(overrideNext).length > 0
  ) {
    merged.next = {
      ...baseNext,
      ...overrideNext,
      ...(dedupedTags.length > 0 ? { tags: dedupedTags } : {}),
    };
  }
  return merged;
}

export async function getAllProducts(init?: RequestInit): Promise<Product[]> {
  const requestInit = mergeRequestInit(
    {
      cache: "force-cache",
      next: {
        revalidate: PRODUCTS_REVALIDATE_SECONDS,
        tags: [PRODUCTS_CACHE_TAG],
      },
    },
    init,
  );

  try {
    const res = await fetch(`${getApiOrigin()}/api/products`, requestInit);
    if (res.ok) return res.json() as Promise<Product[]>;
  } catch {
    return [...PRODUCTS];
  }

  return [...PRODUCTS];
}

export async function getProduct(
  slug: string,
  init?: RequestInit,
): Promise<Product | null> {
  const requestInit = mergeRequestInit(
    {
      cache: "force-cache",
      next: {
        revalidate: PRODUCTS_REVALIDATE_SECONDS,
        tags: [PRODUCTS_CACHE_TAG, `product:${slug}`],
      },
    },
    init,
  );

  try {
    const res = await fetch(
      `${getApiOrigin()}/api/products/${encodeURIComponent(slug)}`,
      requestInit,
    );
    if (res.ok) return res.json() as Promise<Product>;
    if (res.status === 404) return null;
  } catch {
    return PRODUCTS.find((product) => product.slug === slug) ?? null;
  }

  return PRODUCTS.find((product) => product.slug === slug) ?? null;
}
