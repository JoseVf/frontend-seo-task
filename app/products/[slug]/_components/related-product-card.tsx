import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/api";
import { formatPrice, getPrimaryImage } from "../product-page-utils";
import { StarRating } from "./star-rating";

type RelatedProductCardProps = {
  product: Product;
};

export function RelatedProductCard({ product }: RelatedProductCardProps) {
  const image = getPrimaryImage(product);

  return (
    <Link
      href={`/products/${product.slug}`}
      className="block w-75 max-w-full overflow-hidden rounded-md border border-gray-200 bg-white"
      aria-label={`View ${product.name}`}
    >
      <div className="relative aspect-4/3 w-full bg-gray-100">
        <Image
          src={image.url}
          alt={image.alt}
          fill
          sizes="300px"
          className="object-cover"
        />
      </div>

      <article className="space-y-2 p-2">
        <h3 className="text-xl font-semibold text-gray-900">{product.name}</h3>
        <StarRating value={product.rating} />
        <p className="text-xl font-semibold text-blue-800">
          {formatPrice(product.price, product.currency)}
        </p>
      </article>
    </Link>
  );
}
