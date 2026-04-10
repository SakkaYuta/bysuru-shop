import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getProduct } from "@/data/products";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await currentUser();
    const { productId, quantity = 1 } = await req.json();
    const qty = Math.max(1, Math.min(10, Math.floor(Number(quantity))));
    const product = getProduct(productId);

    if (!product) {
      return Response.json({ error: "Product not found" }, { status: 404 });
    }

    if (product.stock <= 0) {
      return Response.json({ error: "Out of stock" }, { status: 400 });
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      `https://${req.headers.get("host")}`;

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      customer_email: user?.emailAddresses[0]?.emailAddress,
      metadata: {
        productId: product.id,
        productName: product.name,
        userId,
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
          quantity: qty,
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
