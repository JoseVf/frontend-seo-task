import Link from "next/link";
import type { Product } from "@/lib/api";
import {
  ProductKeyValueList,
  type ProductKeyValueRow,
} from "@/shared/components/product-key-value-list";
import { ProductHero } from "./product-hero";
import { ProductReviewsSection } from "./product-reviews-section";
import { RelatedProductsSection } from "./related-products-section";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

function mapFeatureRows(features: Product["features"]): ProductKeyValueRow[] {
  return features.map((feature) => ({
    label: feature.title,
    value: feature.description,
  }));
}

function mapSpecificationRows(specs: Product["specs"]): ProductKeyValueRow[] {
  return specs.map((spec) => ({
    label: spec.label,
    value: spec.value,
  }));
}

export function ProductPageContent({ product, relatedProducts }: Props) {
  const featureRows = mapFeatureRows(product.features);
  const specificationRows = mapSpecificationRows(product.specs);

  return (
    <article className="space-y-10">
      <p>
        <Link href="/" className="text-blue-600 hover:underline">
          Back to all products
        </Link>
      </p>

      <ProductHero product={product} featureRows={featureRows} />

      <section aria-labelledby="overview-title">
        <h2 id="overview-title" className="sr-only">
          Overview
        </h2>
        <p className="text-gray-700">{product.longDescription}</p>
      </section>

      <section className="md:hidden" aria-labelledby="features-title-mobile">
        <h2 id="features-title-mobile" className="sr-only">
          Features
        </h2>
        <ProductKeyValueList rows={featureRows} />
      </section>

      <section aria-labelledby="specifications-title">
        <h2 id="specifications-title" className="text-xl font-semibold mb-2">
          Specifications
        </h2>
        <ProductKeyValueList rows={specificationRows} />
      </section>

      <ProductReviewsSection reviews={product.reviews} />
      <RelatedProductsSection products={relatedProducts} />
    </article>
  );
}
