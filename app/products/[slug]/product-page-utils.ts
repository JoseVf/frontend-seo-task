import type { Metadata } from "next";
import type { Product } from "@/lib/api";
import { absoluteUrl, productUrl } from "@/lib/seo";

const FALLBACK_PRODUCT_IMAGE = {
  url: "/favicon.ico",
  alt: "Kitchen Gadgets Store",
};

export function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function formatReviewDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function getPrimaryImage(product: Product) {
  return product.images[0] ?? {
    ...FALLBACK_PRODUCT_IMAGE,
    alt: product.name,
  };
}

export function getRelatedProducts(
  product: Product,
  products: Product[],
): Product[] {
  return product.relatedSlugs.flatMap((relatedSlug) => {
    const relatedProduct = products.find(
      (candidate) => candidate.slug === relatedSlug,
    );
    return relatedProduct ? [relatedProduct] : [];
  });
}

export function buildProductMetadata(product: Product): Metadata {
  const primaryImage = getPrimaryImage(product);
  const primaryImageUrl = absoluteUrl(primaryImage.url);

  return {
    title: product.name,
    description: product.description,
    alternates: {
      canonical: productUrl(product.slug),
    },
    openGraph: {
      title: product.name,
      description: product.description,
      url: productUrl(product.slug),
      siteName: "Kitchen Gadgets Store",
      images: [
        {
          url: primaryImageUrl,
          alt: primaryImage.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: [primaryImageUrl],
    },
  };
}

export function buildNotFoundMetadata(): Metadata {
  return {
    title: "Product Not Found",
    description: "The requested product could not be found.",
    robots: {
      index: false,
      follow: false,
    },
  };
}

export function buildProductStructuredData(product: Product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    url: productUrl(product.slug),
    image: product.images.map((image) => absoluteUrl(image.url)),
    sku: product.sku,
    brand: {
      "@type": "Brand",
      name: product.brand,
    },
    offers: {
      "@type": "Offer",
      url: productUrl(product.slug),
      priceCurrency: product.currency,
      price: product.price.toFixed(2),
      availability:
        product.availability === "in_stock"
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    review: product.reviews.map((review) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: review.author,
      },
      datePublished: review.date,
      reviewBody: review.comment,
      reviewRating: {
        "@type": "Rating",
        ratingValue: review.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  };
}
