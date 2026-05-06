type StarRatingProps = {
  value: number;
  max?: number;
};

export function StarRating({ value, max = 5 }: StarRatingProps) {
  const safeMax = Math.max(1, Math.floor(max));
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const filledStars = Math.round(clampedValue);
  const emptyStars = safeMax - filledStars;
  const displayValue =
    Number.isInteger(clampedValue) ? String(clampedValue) : clampedValue.toFixed(1);

  return (
    <p className="text-sm" aria-label={`Rating: ${displayValue} out of ${safeMax}`}>
      <span className="text-amber-500" aria-hidden="true">
        {"★".repeat(filledStars)}
        {"☆".repeat(emptyStars)}
      </span>
      <span className="ml-2 text-gray-500">
        {displayValue}/{safeMax}
      </span>
    </p>
  );
}
