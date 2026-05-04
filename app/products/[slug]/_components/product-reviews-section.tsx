import type { Product } from "@/lib/api";
import { StarRating } from "@/shared/components/star-rating";
import { formatReviewDate } from "../product-page-utils";

type ProductReviewsSectionProps = {
  reviews: Product["reviews"];
};

export function ProductReviewsSection({ reviews }: ProductReviewsSectionProps) {
  return (
    <section aria-labelledby="reviews-title">
      <h2 id="reviews-title" className="text-xl font-semibold mb-2">
        Customer Reviews
      </h2>

      <div className="space-y-4">
        {reviews.map((review) => (
          <article key={`${review.author}-${review.date}`} className="border-b pb-4 border-b-gray-400">
            <header className="mb-1">
              <h3 className="font-semibold">{review.author}</h3>
              <StarRating value={review.rating} />
              <time className="text-sm text-gray-500" dateTime={review.date}>
                {formatReviewDate(review.date)}
              </time>
            </header>
            <p className="text-gray-700">{review.comment}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
