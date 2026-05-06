export type ProductKeyValueRow = {
  label: string;
  value: string;
};

type ProductKeyValueListProps = {
  rows: ProductKeyValueRow[];
};

const ROOT_CLASS_NAME =
  "grid grid-cols-[minmax(0,11rem)_minmax(0,1fr)] gap-x-5 gap-y-2";

export function ProductKeyValueList({ rows }: ProductKeyValueListProps) {
  return (
    <dl className={ROOT_CLASS_NAME}>
      {rows.map((row) => (
        <div key={row.label} className="contents">
          <dt className="font-semibold text-gray-900">{row.label}</dt>
          <dd className="text-gray-700">{row.value}</dd>
        </div>
      ))}
    </dl>
  );
}
