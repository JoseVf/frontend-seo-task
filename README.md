# Next.js SEO Take-Home Test

## Objective

Enhance the `/products/[slug]` page to be production-ready with a strong focus on SEO and performance.

Run the following commands to get started

- `npm i`
- `npm run dev`

---

## Requirements

### SEO

- Implement dynamic metadata using `generateMetadata`
- Add Open Graph + Twitter tags
- Add canonical URL
- Include structured data (JSON-LD)

  **Note:** Canonical URLs, Open Graph images, and JSON-LD must use **absolute** URLs (including a scheme and host). In production that is typically `https://your-domain.com/...`. **For this take-home, using `http://localhost:3000/...` as the base URL is sufficient** for review; you do not need to deploy or configure a real domain.

### Performance

- Optimize data fetching (caching strategy)
- Replace `<img>` with `next/image`
- Provide proper alt text and sizing

### HTML

- Use semantic HTML (`article`, headings, etc.)

### Styling

- Modify the style and layout of the product page in any way you feel is an improvement.
- Consideration for Desktop vs Mobile view.

### Bonus

- Internal linking
- Sitemap or robots considerations

---

## Deliverables

- GitHub repo
- README explaining your decisions — **the text above is the task brief; include your write-up** (new section at the end of this README) covering tradeoffs, caching, and SEO choices.

---

## Implementation Decisions

### Metadata strategy

- Product pages use `generateMetadata` to build title, description, canonical URL, Open Graph, and Twitter metadata from product data.
- A shared site URL source is used with `NEXT_PUBLIC_SITE_URL` override and `http://localhost:3000` fallback.
- URL-based metadata uses absolute URLs, including canonical and social image URLs.
- Not-found metadata is marked `noindex, nofollow` to avoid indexing invalid product URLs.

### Caching strategy

- Product API helpers centralize fetch behavior with `cache: "force-cache"` and `next.revalidate` set to 300 seconds.
- Shared cache tags are applied for product resources to support scalable invalidation patterns.
- Request options are merged in one place so page-level overrides remain possible without duplicating caching logic.
- `generateStaticParams` pre-renders known product slugs while keeping ISR-compatible data fetching behavior.

### Structured data approach

- Product pages render JSON-LD using schema.org `Product`.
- JSON-LD includes `offers`, `aggregateRating`, and `review`.
- Product URL and image fields are generated as absolute URLs.
- JSON is sanitized before injection by replacing `<` characters to reduce XSS risk in script output.

### Robots and sitemap choices

- `app/robots.ts` allows crawling and points crawlers to the sitemap URL.
- `app/sitemap.ts` includes homepage and all product URLs.
- Each product entry uses `updatedAt` (or `createdAt`) as `lastModified`.
- A single sitemap file is used because the catalog size is small.

### SEO/performance tradeoffs

- Data is fetched through shared helpers to keep behavior consistent across metadata, page rendering, and sitemap generation.
- `next/image` is used with explicit width/height and descriptive alt text to reduce CLS and improve image delivery.
- Semantic HTML (`main`, `article`, `section`, `dl`, `time`) improves crawlability and content structure.
- Internal links to related products and back to catalog improve discovery and crawl paths.
