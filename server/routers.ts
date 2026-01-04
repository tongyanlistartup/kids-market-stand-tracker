import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { ENV } from "./_core/env";

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: "2025-12-15.clover",
});

// Admin-only procedure
const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== 'admin') {
    throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  // ============ Categories ============
  categories: router({
    list: publicProcedure.query(async () => {
      return await db.getAllCategories();
    }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        displayOrder: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createCategory(input);
        return { success: true };
      }),
  }),

  // ============ Products ============
  products: router({
    list: publicProcedure
      .input(z.object({
        categoryId: z.number().optional(),
        isAvailable: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
      }).optional())
      .query(async ({ input }) => {
        return await db.getAllProducts(input);
      }),
    
    getBySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const product = await db.getProductBySlug(input.slug);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        return product;
      }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await db.getProductById(input.id);
        if (!product) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
        }
        return product;
      }),
    
    create: adminProcedure
      .input(z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        price: z.string(),
        categoryId: z.number().optional(),
        materials: z.string().optional(),
        colors: z.string().optional(),
        images: z.string(),
        stockQuantity: z.number(),
        isAvailable: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        createdBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.createProduct(input);
        return { success: true };
      }),
    
    update: adminProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        slug: z.string().optional(),
        description: z.string().optional(),
        price: z.string().optional(),
        categoryId: z.number().optional(),
        materials: z.string().optional(),
        colors: z.string().optional(),
        images: z.string().optional(),
        stockQuantity: z.number().optional(),
        isAvailable: z.boolean().optional(),
        isFeatured: z.boolean().optional(),
        createdBy: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateProduct(id, updates);
        return { success: true };
      }),
    
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await db.deleteProduct(input.id);
        return { success: true };
      }),
  }),

  // ============ Orders ============
  orders: router({
    create: publicProcedure
      .input(z.object({
        customerFirstName: z.string(),
        customerLastName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        shippingStreet: z.string(),
        shippingCity: z.string(),
        shippingState: z.string(),
        shippingZipCode: z.string(),
        items: z.array(z.object({
          productId: z.number(),
          quantity: z.number(),
        })),
      }))
      .mutation(async ({ input }) => {
        // Generate order number
        const orderNumber = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        
        // Calculate total and prepare items
        let totalAmount = 0;
        const orderItemsData = [];
        
        for (const item of input.items) {
          const product = await db.getProductById(item.productId);
          if (!product) {
            throw new TRPCError({ code: 'NOT_FOUND', message: `Product ${item.productId} not found` });
          }
          if (!product.isAvailable || product.stockQuantity < item.quantity) {
            throw new TRPCError({ code: 'BAD_REQUEST', message: `Product ${product.name} is not available in requested quantity` });
          }
          
          const subtotal = parseFloat(product.price) * item.quantity;
          totalAmount += subtotal;
          
          orderItemsData.push({
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            quantity: item.quantity,
            subtotal: subtotal.toFixed(2),
            orderId: 0, // Will be set after order creation
          });
        }
        
        // Create order
        const orderId = await db.createOrder({
          orderNumber,
          customerFirstName: input.customerFirstName,
          customerLastName: input.customerLastName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          shippingStreet: input.shippingStreet,
          shippingCity: input.shippingCity,
          shippingState: input.shippingState,
          shippingZipCode: input.shippingZipCode,
          totalAmount: totalAmount.toFixed(2),
          status: 'pending',
          paymentStatus: 'pending',
        });
        
        // Create order items
        const itemsWithOrderId = orderItemsData.map(item => ({ ...item, orderId }));
        await db.createOrderItems(itemsWithOrderId);
        
        return { orderId, orderNumber, totalAmount };
      }),
    
    list: adminProcedure.query(async () => {
      return await db.getAllOrders();
    }),
    
    getByNumber: publicProcedure
      .input(z.object({ orderNumber: z.string() }))
      .query(async ({ input }) => {
        const order = await db.getOrderByNumber(input.orderNumber);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }
        const items = await db.getOrderItems(order.id);
        return { order, items };
      }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.string(),
        paymentStatus: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateOrderStatus(input.id, input.status, input.paymentStatus);
        return { success: true };
      }),
  }),

  // ============ Checkout ============
  checkout: router({
    createSession: publicProcedure
      .input(z.object({
        orderId: z.number(),
        orderNumber: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const order = await db.getOrderById(input.orderId);
        if (!order) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Order not found' });
        }
        
        const items = await db.getOrderItems(input.orderId);
        
        const lineItems = items.map(item => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.productName,
            },
            unit_amount: Math.round(parseFloat(item.productPrice) * 100),
          },
          quantity: item.quantity,
        }));
        
        const origin = ctx.req.headers.origin || 'http://localhost:3000';
        
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          line_items: lineItems,
          mode: 'payment',
          success_url: `${origin}/order-confirmation?order=${input.orderNumber}`,
          cancel_url: `${origin}/checkout?order=${input.orderNumber}`,
          customer_email: order.customerEmail,
          client_reference_id: input.orderNumber,
          metadata: {
            orderId: input.orderId.toString(),
            orderNumber: input.orderNumber,
            customerEmail: order.customerEmail,
            customerName: `${order.customerFirstName} ${order.customerLastName}`,
          },
          allow_promotion_codes: true,
        });
        
        return { sessionUrl: session.url };
      }),
  }),

  // ============ Custom Requests ============
  customRequests: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email(),
        customerPhone: z.string().optional(),
        itemType: z.string().optional(),
        description: z.string(),
        colors: z.string().optional(),
        budget: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const requestId = await db.createCustomRequest(input);
        return { requestId, success: true };
      }),
    
    list: adminProcedure.query(async () => {
      return await db.getAllCustomRequests();
    }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        status: z.string(),
        adminNotes: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        await db.updateCustomRequestStatus(input.id, input.status, input.adminNotes);
        return { success: true };
      }),
  }),

  // ============ Testimonials ============
  testimonials: router({
    create: publicProcedure
      .input(z.object({
        customerName: z.string(),
        customerEmail: z.string().email().optional(),
        rating: z.number().min(1).max(5),
        comment: z.string(),
        productId: z.number().optional(),
        orderId: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        const testimonialId = await db.createTestimonial({
          ...input,
          isApproved: false,
          isPublished: false,
        });
        return { testimonialId, success: true };
      }),
    
    listPublished: publicProcedure.query(async () => {
      return await db.getPublishedTestimonials();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllTestimonials();
    }),
    
    updateStatus: adminProcedure
      .input(z.object({
        id: z.number(),
        isApproved: z.boolean(),
        isPublished: z.boolean(),
      }))
      .mutation(async ({ input }) => {
        await db.updateTestimonialStatus(input.id, input.isApproved, input.isPublished);
        return { success: true };
      }),
  }),

  // ============ Newsletter ============
  newsletter: router({
    subscribe: publicProcedure
      .input(z.object({
        email: z.string().email(),
        name: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const success = await db.subscribeNewsletter(input);
        if (!success) {
          throw new TRPCError({ code: 'CONFLICT', message: 'Email already subscribed' });
        }
        return { success: true };
      }),
    
    list: adminProcedure.query(async () => {
      return await db.getAllNewsletterSubscribers();
    }),
  }),

  // ============ Gallery ============
  gallery: router({
    listPublished: publicProcedure.query(async () => {
      return await db.getPublishedGalleryImages();
    }),
    
    listAll: adminProcedure.query(async () => {
      return await db.getAllGalleryImages();
    }),
    
    create: adminProcedure
      .input(z.object({
        title: z.string().optional(),
        description: z.string().optional(),
        imageUrl: z.string(),
        category: z.string().optional(),
        displayOrder: z.number().optional(),
        isPublished: z.boolean().optional(),
      }))
      .mutation(async ({ input }) => {
        const imageId = await db.createGalleryImage(input);
        return { imageId, success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
