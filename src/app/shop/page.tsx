import Link from "next/link";
import { getProductsByCategory } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/data/products";

function ProductCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/shop/${product.id}`}
      className="group block rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-[16/9] bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
        <span className="text-4xl">
          {product.category === "suite" ? "🏟️" : "⚾"}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-base group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-lg font-bold text-blue-600">
            {formatPrice(product.price)}
          </span>
          <span className="text-xs text-gray-400">
            定員 {product.capacity}
          </span>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              product.stock > 0
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {product.stock > 0 ? `残り${product.stock}枠` : "売り切れ"}
          </span>
          <span className="text-xs text-blue-600 font-medium group-hover:underline">
            詳細を見る &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function ShopPage() {
  const { suites, grounds } = getProductsByCategory();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-bold">ポイント交換特典ラインナップ</h1>
        <p className="mt-2 text-sm text-gray-500">
          埼玉西武ライオンズ &times; アメフリ 2026年7月31日(金) ベルーナドーム
        </p>
      </div>

      <section className="mb-12">
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-blue-600 rounded-full" />
          スイートルーム観戦
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suites.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="w-1 h-6 bg-green-600 rounded-full" />
          グラウンド内イベント
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {grounds.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
