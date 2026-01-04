import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { CheckCircle, Loader2 } from 'lucide-react';

export default function OrderConfirmation() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const orderNumber = searchParams.get('order');

  const { data, isLoading } = trpc.orders.getByNumber.useQuery(
    { orderNumber: orderNumber || '' },
    { enabled: !!orderNumber }
  );

  if (!orderNumber) {
    return (
      <div className="container py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground">No order number provided.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Order Not Found</h1>
        <p className="text-muted-foreground">We couldn't find an order with that number.</p>
        <Link href="/shop">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const { order, items } = data;

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Success Message */}
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-8 text-center space-y-4">
            <CheckCircle className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Thank You for Your Order!</h1>
            <p className="text-lg text-muted-foreground">
              Your order has been received and is being processed.
            </p>
            <p className="text-sm text-muted-foreground">
              Order Number: <span className="font-mono font-semibold">{order.orderNumber}</span>
            </p>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-bold mb-4">Order Details</h2>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Customer Name</p>
                  <p className="font-medium">{order.customerFirstName} {order.customerLastName}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Email</p>
                  <p className="font-medium">{order.customerEmail}</p>
                </div>
                {order.customerPhone && (
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{order.customerPhone}</p>
                  </div>
                )}
                <div className="col-span-2">
                  <p className="text-muted-foreground">Shipping Address</p>
                  <p className="font-medium">
                    {order.shippingStreet}<br />
                    {order.shippingCity}, {order.shippingState} {order.shippingZipCode}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span className="text-muted-foreground">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="font-medium">${item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between text-xl font-bold">
                <span>Total</span>
                <span className="text-primary">${order.totalAmount}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Next Steps */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold">What's Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• You will receive an email confirmation shortly</li>
              <li>• We'll notify you when your order ships</li>
              <li>• If you have any questions, please contact us</li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center">
          <Link href="/shop">
            <Button size="lg">Continue Shopping</Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
