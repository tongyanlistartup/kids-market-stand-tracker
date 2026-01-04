import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Product categories for jewelry items
 */
export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  description: text("description"),
  displayOrder: int("displayOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Category = typeof categories.$inferSelect;
export type InsertCategory = typeof categories.$inferInsert;

/**
 * Products table for jewelry items
 */
export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  categoryId: int("categoryId").references(() => categories.id),
  materials: text("materials"), // JSON array of materials used
  colors: text("colors"), // JSON array of colors
  images: text("images").notNull(), // JSON array of image URLs
  stockQuantity: int("stockQuantity").default(0).notNull(),
  isAvailable: boolean("isAvailable").default(true).notNull(),
  isFeatured: boolean("isFeatured").default(false).notNull(),
  createdBy: varchar("createdBy", { length: 50 }), // "5-year-old" or "9-year-old" or "both"
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

/**
 * Orders table
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  orderNumber: varchar("orderNumber", { length: 50 }).notNull().unique(),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }),
  shippingAddress: text("shippingAddress"),
  totalAmount: decimal("totalAmount", { precision: 10, scale: 2 }).notNull(),
  status: mysqlEnum("status", ["pending", "paid", "processing", "shipped", "delivered", "cancelled"]).default("pending").notNull(),
  paymentIntentId: varchar("paymentIntentId", { length: 255 }), // Stripe payment intent ID
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "succeeded", "failed"]).default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Order items table
 */
export const orderItems = mysqlTable("orderItems", {
  id: int("id").autoincrement().primaryKey(),
  orderId: int("orderId").notNull().references(() => orders.id),
  productId: int("productId").references(() => products.id),
  productName: varchar("productName", { length: 200 }).notNull(), // Store name in case product is deleted
  productPrice: decimal("productPrice", { precision: 10, scale: 2 }).notNull(),
  quantity: int("quantity").notNull(),
  subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
});

export type OrderItem = typeof orderItems.$inferSelect;
export type InsertOrderItem = typeof orderItems.$inferInsert;

/**
 * Custom order requests
 */
export const customRequests = mysqlTable("customRequests", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }).notNull(),
  customerPhone: varchar("customerPhone", { length: 50 }),
  itemType: varchar("itemType", { length: 100 }), // earrings, necklace, etc.
  description: text("description").notNull(),
  colors: text("colors"), // Requested colors
  budget: decimal("budget", { precision: 10, scale: 2 }),
  status: mysqlEnum("status", ["pending", "reviewing", "accepted", "in_progress", "completed", "declined"]).default("pending").notNull(),
  adminNotes: text("adminNotes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CustomRequest = typeof customRequests.$inferSelect;
export type InsertCustomRequest = typeof customRequests.$inferInsert;

/**
 * Testimonials/Reviews
 */
export const testimonials = mysqlTable("testimonials", {
  id: int("id").autoincrement().primaryKey(),
  customerName: varchar("customerName", { length: 200 }).notNull(),
  customerEmail: varchar("customerEmail", { length: 320 }),
  rating: int("rating").notNull(), // 1-5 stars
  comment: text("comment").notNull(),
  productId: int("productId").references(() => products.id),
  orderId: int("orderId").references(() => orders.id),
  isApproved: boolean("isApproved").default(false).notNull(),
  isPublished: boolean("isPublished").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = typeof testimonials.$inferInsert;

/**
 * Newsletter subscribers
 */
export const newsletterSubscribers = mysqlTable("newsletterSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  name: varchar("name", { length: 200 }),
  isActive: boolean("isActive").default(true).notNull(),
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type NewsletterSubscriber = typeof newsletterSubscribers.$inferSelect;
export type InsertNewsletterSubscriber = typeof newsletterSubscribers.$inferInsert;

/**
 * Gallery images for behind-the-scenes and process photos
 */
export const galleryImages = mysqlTable("galleryImages", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 200 }),
  description: text("description"),
  imageUrl: varchar("imageUrl", { length: 500 }).notNull(),
  category: varchar("category", { length: 100 }), // "process", "kids", "booth", etc.
  displayOrder: int("displayOrder").default(0),
  isPublished: boolean("isPublished").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;
