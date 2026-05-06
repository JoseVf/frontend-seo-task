import Image from "next/image";
import type { Product } from "@/lib/api";
import {
  ProductKeyValueList,
  type ProductKeyValueRow,
} from "@/shared/components/product-key-value-list";
import { formatPrice, getPrimaryImage } from "../product-page-utils";

type ProductHeroProps = {
  product: Product;
  featureRows: ProductKeyValueRow[];
};

export function ProductHero({ product, featureRows }: ProductHeroProps) {
  const primaryImage = getPrimaryImage(product);

  return (
    <section className="grid md:grid-cols-3 gap-8" aria-labelledby="product-title">
      <figure className="mx-auto w-full max-w-75 overflow-hidden bg-white md:col-span-1 md:mx-0 md:w-87.5">
        <Image
          src={primaryImage.url}
          alt={primaryImage.alt}
          width={300}
          height={300}
          sizes="(min-width: 768px) 300px, (min-width: 420px) 300px, calc(100vw - 3rem)"
          className="h-auto w-full"
          priority
        />
      </figure>

      <header className="flex flex-col gap-4 md:col-span-2">
        <h1 id="product-title" className="text-3xl font-bold">
          {product.name}
        </h1>

        <p className="text-gray-600">{product.description}</p>

        <div className="flex items-center gap-3">
          <p className="text-2xl font-semibold">
            {formatPrice(product.price, product.currency)}
          </p>
          <p className="inline-block w-fit px-3 py-1 text-sm rounded-md bg-green-100 text-green-700">
            {product.availability === "in_stock" ? "In Stock" : "Out of Stock"}
          </p>
        </div>

        <section className="hidden md:block" aria-labelledby="features-title-desktop">
          <h2 id="features-title-desktop" className="sr-only">
            Features
          </h2>
          <ProductKeyValueList rows={featureRows} />
        </section>
      </header>
    </section>
  );
}
