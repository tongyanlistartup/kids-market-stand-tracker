import { describe, expect, it, beforeEach } from "vitest";
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

describe("products router", () => {
  describe("products.list", () => {
    it("should return empty array when no products exist", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({});

      expect(Array.isArray(result)).toBe(true);
    });

    it("should accept optional filters", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.products.list({
        categoryId: 1,
        isAvailable: true,
        isFeatured: true,
      });

      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe("products.getBySlug", () => {
    it("should throw error for non-existent product", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.products.getBySlug({ slug: "non-existent-product" })
      ).rejects.toThrow("Product not found");
    });
  });

  describe("products.create", () => {
    it("should require admin role", async () => {
      const ctx = createPublicContext();
      const caller = appRouter.createCaller(ctx);

      await expect(
        caller.products.create({
          name: "Test Product",
          slug: "test-product",
          description: "Test description",
          price: "10.00",
          images: JSON.stringify(["/test.jpg"]),
          stockQuantity: 5,
          isAvailable: true,
          isFeatured: false,
        })
      ).rejects.toThrow();
    });

    it("should allow admin to create product", async () => {
      const ctx = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const productData = {
        name: "Beautiful Earrings",
        slug: "beautiful-earrings-test",
        description: "Handmade polymer clay earrings",
        price: "15.00",
        images: JSON.stringify(["/earrings.jpg"]),
        stockQuantity: 10,
        isAvailable: true,
        isFeatured: true,
        colors: "Pink, Blue",
        materials: "Polymer Clay",
        createdBy: "9-year-old artist",
      };

      const result = await caller.products.create(productData);

      expect(result.success).toBe(true);
      if ('productId' in result) {
        expect(result.productId).toBeDefined();
      }
    });
  });
});
