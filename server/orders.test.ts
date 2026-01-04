import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: () => {},
    } as TrpcContext["res"],
  };
}

describe("orders router", () => {
  describe("orders.create", () => {
    it("should fail when products don't exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const orderData = {
        customerName: "John Doe",
        customerEmail: "john@example.com",
        customerPhone: "555-1234",
        shippingAddress: "123 Main St, City, State 12345",
        items: [
          { productId: 999, quantity: 2 },
        ],
      };

      await expect(
        caller.orders.create(orderData)
      ).rejects.toThrow("Product 999 not found");
    });

    it("should require customer name and email", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.orders.create({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          shippingAddress: "",
          items: [],
        })
      ).rejects.toThrow();
    });
  });

  describe("orders.list", () => {
    it("should require admin role", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(caller.orders.list()).rejects.toThrow();
    });

    it("should allow admin to list orders", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.orders.list();

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("orders.getByNumber", () => {
    it("should throw error for non-existent order", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.orders.getByNumber({ orderNumber: "ORD-NONEXISTENT" })
      ).rejects.toThrow("Order not found");
    });
  });
});
