import type { Product } from "@/lib/api";
import { RelatedProductCard } from "./related-product-card";

type RelatedProductsSectionProps = {
  products: Product[];
};

export function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-products-title">
      <h2 id="related-products-title" className="text-xl font-semibold mb-2">
        Related Products
      </h2>
      <ul className="flex gap-4 overflow-x-auto pb-2 pr-1 snap-x snap-mandatory">
        {products.map((product) => (
          <li key={product.slug} className="shrink-0 snap-start">
            <RelatedProductCard product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
