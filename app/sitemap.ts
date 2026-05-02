import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/api";
import { absoluteUrl, productUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...products.map((product) => ({
      url: productUrl(product.slug),
      lastModified: product.updatedAt ?? product.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
      images: product.images.map((image) => absoluteUrl(image.url)),
    })),
  ];
}
