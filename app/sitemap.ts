import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/api";
import { absoluteUrl, productUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts();

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      priority: 1,
    },
    ...products.map((product) => ({
      url: productUrl(product.slug),
      lastModified: product.updatedAt ?? product.createdAt,
      priority: 0.7,
      images: product.images.map((image) => absoluteUrl(image.url)),
    })),
  ];
}
