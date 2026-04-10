import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { redirect } from "next/navigation";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;
  const { userId } = await auth();

  if (!session_id || !userId) {
    redirect("/shop");
  }

  let session;
  try {
    session = await getStripe().checkout.sessions.retrieve(session_id);
  } catch {
    redirect("/shop");
  }

  // セキュリティ: セッションの所有者を検証
  if (session.metadata?.userId !== userId) {
    redirect("/shop");
  }

  // 支払いが完了していない場合
  if (session.payment_status !== "paid") {
    redirect("/shop");
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-6">
        <span className="text-3xl text-green-600">&#10003;</span>
      </div>
      <h1 className="text-2xl font-bold">購入が完了しました</h1>
      <p className="mt-3 text-gray-600">
        {session.metadata?.productName} をご購入いただきありがとうございます。
      </p>
      <p className="mt-2 text-2xl font-bold text-blue-600">
        {formatPrice(session.amount_total || 0)}
      </p>
      <p className="mt-2 text-sm text-gray-400">
        確認メールを {session.customer_details?.email} にお送りしました。
      </p>
      <div className="mt-10 flex gap-3 justify-center">
        <Link
          href="/shop/history"
          className="rounded-lg bg-blue-600 px-5 py-2.5 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          購入履歴を見る
        </Link>
        <Link
          href="/shop"
          className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-medium hover:bg-gray-50 transition"
        >
          商品一覧へ戻る
        </Link>
      </div>
    </div>
  );
}
