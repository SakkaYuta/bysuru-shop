import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { z } from "zod";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/data/products";
import { rateLimit } from "@/lib/rate-limit";

const CheckoutSchema = z.object({
  productId: z.string().regex(/^[a-z0-9-]+$/),
  quantity: z.number().int().min(1).max(10).default(1),
});

export async function POST(req: NextRequest) {
  try {
    // CSRF: same-origin チェック
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");
    if (origin && host) {
      try {
        const originHost = new URL(origin).host;
        if (originHost !== host) {
          return Response.json({ error: "Forbidden" }, { status: 403 });
        }
      } catch {
        return Response.json({ error: "Forbidden" }, { status: 403 });
      }
    }

    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // レート制限
    const { success: withinLimit } = rateLimit(userId);
    if (!withinLimit) {
      return Response.json(
        { error: "リクエストが多すぎます。しばらくしてからお試しください。" },
        { status: 429 }
      );
    }

    // 入力バリデーション
    const body = await req.json();
    const parsed = CheckoutSchema.safeParse(body);
    if (!parsed.success) {
      return Response.json({ error: "Invalid input" }, { status: 400 });
    }
    const { productId, quantity } = parsed.data;

    const product = getProduct(productId);
    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock <= 0) {
      return Response.json({ error: "Out of stock" }, { status: 400 });
    }

    // メール検証
    const user = await currentUser();
    const email = user?.emailAddresses[0]?.emailAddress;
    if (!email) {
      return Response.json(
        { error: "メールアドレスが登録されていません。" },
        { status: 400 }
      );
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${req.headers.get("host")}`;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: email,
      metadata: {
        productId: product.id,
        productName: product.name,
        userId,
        quantity: String(quantity),
      },
      line_items: [
        {
          price_data: {
            currency: "jpy",
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: product.price,
          },
          quantity,
        },
      ],
      success_url: `${baseUrl}/shop/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/shop/${product.id}`,
    });

    return Response.json({ url: session.url });
  } catch (error) {
    console.error("[Checkout Error]", error);
    return Response.json(
      { error: "決済セッションの作成に失敗しました" },
      { status: 500 }
    );
  }
}
