import { NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return Response.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return Response.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    // Purchase is automatically tracked in Stripe.
    // The metadata (productId, userId) is stored on the session.
    // Purchase history is queried directly from Stripe API.
    console.log(
      `[Webhook] Purchase completed: ${session.metadata?.productName} by ${session.metadata?.userId}`
    );
  }

  return Response.json({ received: true });
}
