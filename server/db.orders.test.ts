import { describe, it, expect, beforeAll } from 'vitest';
import * as db from './db';

describe('Database Order Creation', () => {
  let testProductId: number;
  let testCategoryId: number;

  beforeAll(async () => {
    // Create a test category
    await db.createCategory({
      name: 'Test Category DB',
      slug: 'test-category-db',
      description: 'Test category for order tests',
      displayOrder: 999,
    });
    
    const categories = await db.getAllCategories();
    testCategoryId = categories.find(c => c.slug === 'test-category-db')?.id || 0;

    // Create a test product
    await db.createProduct({
      name: 'Test Product DB',
      slug: 'test-product-order-db',
      description: 'Test product for order creation',
      price: '15.00',
      categoryId: testCategoryId,
      materials: 'Test Materials',
      colors: 'Test Colors',
      images: JSON.stringify(['https://example.com/test.jpg']),
      stockQuantity: 10,
      isAvailable: true,
      isFeatured: false,
    });

    const products = await db.getAllProducts();
    testProductId = products.find(p => p.slug === 'test-product-order-db')?.id || 0;
  });

  it('should create an order and return a valid numeric order ID (not NaN)', async () => {
    const orderData = {
      orderNumber: `TEST-DB-${Date.now()}`,
      customerFirstName: 'John',
      customerLastName: 'Doe',
      customerEmail: 'john.doe@example.com',
      customerPhone: '555-1234',
      shippingStreet: '123 Test St',
      shippingCity: 'Test City',
      shippingState: 'TS',
      shippingZipCode: '12345',
      totalAmount: '15.00',
      status: 'pending',
      paymentStatus: 'pending',
    };

    const orderId = await db.createOrder(orderData);

    // Critical assertions: orderId must be a valid number, not NaN
    expect(orderId).toBeDefined();
    expect(typeof orderId).toBe('number');
    expect(orderId).toBeGreaterThan(0);
    expect(Number.isNaN(orderId)).toBe(false);

    // Verify order was created in database
    const createdOrder = await db.getOrderById(orderId);
    expect(createdOrder).toBeDefined();
    expect(createdOrder?.customerFirstName).toBe('John');
    expect(createdOrder?.customerLastName).toBe('Doe');
    expect(createdOrder?.customerEmail).toBe('john.doe@example.com');
  });

  it('should create order items with valid orderId (not NaN)', async () => {
    const orderData = {
      orderNumber: `TEST-DB-${Date.now()}`,
      customerFirstName: 'Jane',
      customerLastName: 'Smith',
      customerEmail: 'jane.smith@example.com',
      shippingStreet: '456 Test Ave',
      shippingCity: 'Test Town',
      shippingState: 'TT',
      shippingZipCode: '54321',
      totalAmount: '30.00',
      status: 'pending',
      paymentStatus: 'pending',
    };

    const orderId = await db.createOrder(orderData);

    // Verify orderId is valid before creating order items
    expect(Number.isNaN(orderId)).toBe(false);
    expect(orderId).toBeGreaterThan(0);

    // Create order items
    const orderItems = [
      {
        orderId,
        productId: testProductId,
        productName: 'Test Product DB',
        productPrice: '15.00',
        quantity: 2,
        subtotal: '30.00',
      },
    ];

    // This should not throw an error about NaN orderId
    await expect(db.createOrderItems(orderItems)).resolves.not.toThrow();

    // Verify order items were created
    const items = await db.getOrderItems(orderId);
    expect(items).toHaveLength(1);
    expect(items[0].productId).toBe(testProductId);
    expect(items[0].quantity).toBe(2);
    expect(items[0].orderId).toBe(orderId);
    expect(Number.isNaN(items[0].orderId)).toBe(false);
  });
});
