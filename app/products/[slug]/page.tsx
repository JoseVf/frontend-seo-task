import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getProduct } from "@/lib/api";
import { ProductPageContent } from "./_components/product-page-content";
import { ProductStructuredData } from "./_components/product-structured-data";
import {
  buildNotFoundMetadata,
  buildProductMetadata,
  buildProductStructuredData,
  getRelatedProducts,
} from "./product-page-utils";

type Props = {
  params: Promise<{ slug: string }>;
};

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
    return buildNotFoundMetadata();
  }

  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) return notFound();

  const products = await getAllProducts();
  const relatedProducts = getRelatedProducts(product, products);
  const structuredData = buildProductStructuredData(product);

  return (
    <main className="max-w-5xl mx-auto px-6 py-10">
      <ProductStructuredData data={structuredData} />
      <ProductPageContent product={product} relatedProducts={relatedProducts} />
    </main>
  );
}
