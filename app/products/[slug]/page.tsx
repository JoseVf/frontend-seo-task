import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/api";
import { absoluteUrl, productUrl } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

function formatPrice(value: number, currency: string): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function formatReviewDate(date: string): string {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({
    slug: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const primaryImage = product.images[0];
  const primaryImageUrl = primaryImage
    ? absoluteUrl(primaryImage.url)
    : absoluteUrl("/favicon.ico");

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
          width: primaryImage?.width,
          height: primaryImage?.height,
          alt: primaryImage?.alt ?? product.name,
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

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const products = await getAllProducts();
  const primaryImage = product.images[0] ?? {
    url: "/favicon.ico",
    alt: product.name,
    width: 512,
    height: 512,
  };
  const relatedProducts = product.relatedSlugs.flatMap((relatedSlug) => {
    const relatedProduct = products.find(
      (candidate) => candidate.slug === relatedSlug,
    );
    return relatedProduct ? [relatedProduct] : [];
  });

  const structuredData = {
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

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <article className="space-y-10">
        <p>
          <Link href="/" className="text-blue-600 hover:underline">
            Back to all products
          </Link>
        </p>

        <section className="grid md:grid-cols-2 gap-8" aria-labelledby="product-title">
          <figure className="bg-white rounded-xl overflow-hidden">
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              width={primaryImage.width}
              height={primaryImage.height}
              sizes="(min-width: 768px) 40rem, 100vw"
              className="w-full h-auto"
              priority
            />
          </figure>

          <header className="flex flex-col gap-4">
            <h1 id="product-title" className="text-3xl font-bold">
              {product.name}
            </h1>

            <p className="text-gray-600">{product.description}</p>

            <p className="text-2xl font-semibold">
              {formatPrice(product.price, product.currency)}
            </p>

            <p className="inline-block w-fit px-3 py-1 text-sm rounded-md bg-green-100 text-green-700">
              {product.availability === "in_stock" ? "In Stock" : "Out of Stock"}
            </p>
          </header>
        </section>

        <section aria-labelledby="overview-title">
          <h2 id="overview-title" className="text-xl font-semibold mb-2">
            Overview
          </h2>
          <p className="text-gray-700">{product.longDescription}</p>
        </section>

        <section aria-labelledby="features-title">
          <h2 id="features-title" className="text-xl font-semibold mb-2">
            Features
          </h2>
          <ul className="space-y-2 list-disc pl-5">
            {product.features.map((feature) => (
              <li key={feature.title}>
                <strong>{feature.title}:</strong> {feature.description}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="specifications-title">
          <h2 id="specifications-title" className="text-xl font-semibold mb-2">
            Specifications
          </h2>
          <dl className="space-y-2">
            {product.specs.map((spec) => (
              <div key={spec.label}>
                <dt className="font-medium inline">{spec.label}: </dt>
                <dd className="inline">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section aria-labelledby="reviews-title">
          <h2 id="reviews-title" className="text-xl font-semibold mb-2">
            Customer Reviews
          </h2>

          <div className="space-y-4">
            {product.reviews.map((review) => (
              <article key={`${review.author}-${review.date}`} className="border-t pt-4">
                <header className="mb-1">
                  <h3 className="font-semibold">{review.author}</h3>
                  <p className="text-sm text-gray-500">Rating: {review.rating}/5</p>
                  <time className="text-sm text-gray-500" dateTime={review.date}>
                    {formatReviewDate(review.date)}
                  </time>
                </header>
                <p className="text-gray-700">{review.comment}</p>
              </article>
            ))}
          </div>
        </section>

        {relatedProducts.length > 0 ? (
          <section aria-labelledby="related-products-title">
            <h2 id="related-products-title" className="text-xl font-semibold mb-2">
              Related Products
            </h2>
            <ul className="space-y-2 list-disc pl-5">
              {relatedProducts.map((relatedProduct) => (
                <li key={relatedProduct.slug}>
                  <Link
                    href={`/products/${relatedProduct.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {relatedProduct.name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </article>
    </main>
  );
}
