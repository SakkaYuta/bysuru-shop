import { currentUser } from "@clerk/nextjs/server";
import { getStripe } from "@/lib/stripe";
import { formatPrice, formatDate } from "@/lib/format";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function HistoryPage() {
  const user = await currentUser();
  if (!user) redirect("/shop/sign-in");

  const email = user.emailAddresses[0]?.emailAddress;
  if (!email) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-8 text-center text-gray-500">
        メールアドレスが登録されていません。
      </div>
    );
  }

  const sessions = await getStripe().checkout.sessions.list({
    limit: 50,
    status: "complete",
    customer_details: { email },
    expand: ["data.line_items"],
  });

  const orders = sessions.data.filter(
    (s) => s.payment_status === "paid" && s.metadata?.userId === user.id
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">購入履歴</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500">購入履歴はまだありません</p>
          <Link
            href="/shop"
            className="mt-4 inline-block text-blue-600 hover:underline text-sm"
          >
            商品一覧へ戻る
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-lg border border-gray-200 p-4 flex items-center justify-between"
            >
              <div>
                <div className="font-medium">
                  {order.metadata?.productName || "商品"}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(order.created)}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">
                  {formatPrice(order.amount_total || 0)}
                </div>
                <div className="text-xs text-green-600 mt-1">支払い完了</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
