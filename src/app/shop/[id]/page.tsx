import { notFound } from "next/navigation";
import { getProduct, products } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { BuyButton } from "./buy-button";

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="rounded-xl border border-gray-200 overflow-hidden">
        <div className="aspect-[16/7] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
          <span className="text-6xl">
            {product.category === "suite" ? "🏟️" : "⚾"}
          </span>
        </div>
        <div className="p-6">
          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
            {product.categoryLabel}
          </span>
          <h1 className="mt-3 text-2xl font-bold">{product.name}</h1>
          <p className="mt-2 text-gray-600">{product.description}</p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <div className="text-xs text-gray-400">価格</div>
              <div className="mt-1 text-lg font-bold text-blue-600">
                {formatPrice(product.price)}
              </div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <div className="text-xs text-gray-400">定員</div>
              <div className="mt-1 text-lg font-bold">{product.capacity}</div>
            </div>
            <div className="rounded-lg bg-gray-50 p-3 text-center">
              <div className="text-xs text-gray-400">残り枠</div>
              <div
                className={`mt-1 text-lg font-bold ${
                  product.stock > 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.stock > 0 ? `${product.stock}枠` : "売り切れ"}
              </div>
            </div>
          </div>

          <ul className="mt-6 space-y-2">
            {product.features.map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-0.5 text-green-500">&#10003;</span>
                {f}
              </li>
            ))}
          </ul>

          <div className="mt-8">
            <BuyButton productId={product.id} inStock={product.stock > 0} maxQuantity={product.stock} />
          </div>
        </div>
      </div>
    </div>
  );
}
