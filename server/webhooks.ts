import express from "express";
import Stripe from "stripe";
import { ENV } from "./_core/env";
import * as db from "./db";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

export function registerWebhooks(app: express.Application) {
  // Stripe webhook endpoint - MUST be registered before express.json()
  app.post(
    "/api/stripe/webhook",
    express.raw({ type: "application/json" }),
    async (req, res) => {
      const sig = req.headers["stripe-signature"];

      if (!sig) {
        console.error("[Webhook] Missing stripe-signature header");
        return res.status(400).send("Missing signature");
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          ENV.stripeWebhookSecret
        );
      } catch (err: any) {
        console.error("[Webhook] Signature verification failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // Handle test events
      if (event.id.startsWith("evt_test_")) {
        console.log("[Webhook] Test event detected, returning verification response");
        return res.json({
          verified: true,
        });
      }

      console.log("[Webhook] Received event:", event.type, event.id);

      try {
        switch (event.type) {
          case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;
            const orderNumber = session.client_reference_id;
            const orderId = session.metadata?.orderId;

            if (orderNumber && orderId) {
              console.log(`[Webhook] Payment succeeded for order ${orderNumber}`);
              
              // Update order status
              await db.updateOrderStatus(
                parseInt(orderId),
                "paid",
                "succeeded"
              );

              // Update stock quantities
              const order = await db.getOrderById(parseInt(orderId));
              if (order) {
                const items = await db.getOrderItems(parseInt(orderId));
                for (const item of items) {
                  if (item.productId) {
                    const product = await db.getProductById(item.productId);
                    if (product) {
                      const newStock = product.stockQuantity - item.quantity;
                      await db.updateProductStock(item.productId, Math.max(0, newStock));
                    }
                  }
                }
              }
            }
            break;
          }

          case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log(`[Webhook] Payment failed:`, paymentIntent.id);
            break;
          }

          default:
            console.log(`[Webhook] Unhandled event type: ${event.type}`);
        }

        res.json({ received: true });
      } catch (error) {
        console.error("[Webhook] Error processing event:", error);
        res.status(500).json({ error: "Webhook processing failed" });
      }
    }
  );
}
