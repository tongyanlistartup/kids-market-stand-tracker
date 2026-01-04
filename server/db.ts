import { eq, desc, and, sql, like } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { 
  InsertUser, users,
  categories, InsertCategory,
  products, InsertProduct,
  orders, InsertOrder,
  orderItems, InsertOrderItem,
  customRequests, InsertCustomRequest,
  testimonials, InsertTestimonial,
  newsletterSubscribers, InsertNewsletterSubscriber,
  galleryImages, InsertGalleryImage
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============ User Management ============
export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============ Categories ============
export async function getAllCategories() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(categories).orderBy(categories.displayOrder, categories.name);
}

export async function getCategoryBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(categories).where(eq(categories.slug, slug)).limit(1);
  return result[0];
}

export async function createCategory(category: InsertCategory) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(categories).values(category);
  return result;
}

// ============ Products ============
export async function getAllProducts(filters?: { categoryId?: number; isAvailable?: boolean; isFeatured?: boolean }) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(products);
  const conditions = [];
  
  if (filters?.categoryId) {
    conditions.push(eq(products.categoryId, filters.categoryId));
  }
  if (filters?.isAvailable !== undefined) {
    conditions.push(eq(products.isAvailable, filters.isAvailable));
  }
  if (filters?.isFeatured !== undefined) {
    conditions.push(eq(products.isFeatured, filters.isFeatured));
  }
  
  if (conditions.length > 0) {
    query = query.where(and(...conditions)) as any;
  }
  
  return await query.orderBy(desc(products.createdAt));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0];
}

export async function getProductBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(products).where(eq(products.slug, slug)).limit(1);
  return result[0];
}

export async function createProduct(product: InsertProduct) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(products).values(product);
  return result;
}

export async function updateProduct(id: number, product: Partial<InsertProduct>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(product).where(eq(products.id, id));
}

export async function deleteProduct(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(products).where(eq(products.id, id));
}

export async function updateProductStock(id: number, quantity: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set({ stockQuantity: quantity }).where(eq(products.id, id));
}

// ============ Orders ============
export async function createOrder(order: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(orders).values(order);
  // MySQL2 driver returns insertId in the result array
  const insertId = (result as any)[0]?.insertId;
  if (!insertId) {
    throw new Error("Failed to get order ID from database");
  }
  return Number(insertId);
}

export async function getOrderById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0];
}

export async function getOrderByNumber(orderNumber: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result[0];
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orders).orderBy(desc(orders.createdAt));
}

export async function updateOrderStatus(id: number, status: string, paymentStatus?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates: any = { status };
  if (paymentStatus) {
    updates.paymentStatus = paymentStatus;
  }
  await db.update(orders).set(updates).where(eq(orders.id, id));
}

// ============ Order Items ============
export async function createOrderItems(items: InsertOrderItem[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orderItems).values(items);
}

export async function getOrderItems(orderId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
}

// ============ Custom Requests ============
export async function createCustomRequest(request: InsertCustomRequest) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customRequests).values(request);
  return Number((result as any).insertId);
}

export async function getAllCustomRequests() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(customRequests).orderBy(desc(customRequests.createdAt));
}

export async function updateCustomRequestStatus(id: number, status: string, adminNotes?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const updates: any = { status };
  if (adminNotes) {
    updates.adminNotes = adminNotes;
  }
  await db.update(customRequests).set(updates).where(eq(customRequests.id, id));
}

// ============ Testimonials ============
export async function createTestimonial(testimonial: InsertTestimonial) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(testimonials).values(testimonial);
  return Number((result as any).insertId);
}

export async function getPublishedTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(testimonials)
    .where(and(eq(testimonials.isApproved, true), eq(testimonials.isPublished, true)))
    .orderBy(desc(testimonials.createdAt));
}

export async function getAllTestimonials() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(testimonials).orderBy(desc(testimonials.createdAt));
}

export async function updateTestimonialStatus(id: number, isApproved: boolean, isPublished: boolean) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(testimonials).set({ isApproved, isPublished }).where(eq(testimonials.id, id));
}

// ============ Newsletter ============
export async function subscribeNewsletter(subscriber: InsertNewsletterSubscriber) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  try {
    await db.insert(newsletterSubscribers).values(subscriber);
    return true;
  } catch (error) {
    // Handle duplicate email
    return false;
  }
}

export async function getAllNewsletterSubscribers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(newsletterSubscribers)
    .where(eq(newsletterSubscribers.isActive, true))
    .orderBy(desc(newsletterSubscribers.subscribedAt));
}

// ============ Gallery ============
export async function createGalleryImage(image: InsertGalleryImage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(galleryImages).values(image);
  return Number((result as any).insertId);
}

export async function getPublishedGalleryImages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(galleryImages)
    .where(eq(galleryImages.isPublished, true))
    .orderBy(galleryImages.displayOrder, desc(galleryImages.createdAt));
}

export async function getAllGalleryImages() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(galleryImages)
    .orderBy(galleryImages.displayOrder, desc(galleryImages.createdAt));
}
