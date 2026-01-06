import { useLocation, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { CheckCircle, Loader2, Sparkles, Package, Mail } from 'lucide-react';

export default function OrderConfirmation() {
  const [location] = useLocation();
  
  // Parse URL parameters more robustly to handle Stripe redirects
  const url = new URL(window.location.href);
  const orderNumber = url.searchParams.get('order');

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
      <div className="container py-12 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading your order details...</p>
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
        {/* Cheerful Success Message */}
        <Card className="border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
          <CardContent className="p-8 text-center space-y-6">
            <div className="relative">
              <CheckCircle className="h-20 w-20 mx-auto text-primary animate-in zoom-in duration-500" />
              <Sparkles className="h-6 w-6 absolute top-0 right-1/3 text-primary/60 animate-pulse" />
              <Sparkles className="h-5 w-5 absolute bottom-2 left-1/3 text-primary/40 animate-pulse delay-150" />
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                🎉 Payment Successful!
              </h1>
              <p className="text-xl font-medium text-foreground">
                Thank you for supporting young entrepreneurs!
              </p>
              <p className="text-lg text-muted-foreground">
                Your beautiful handcrafted jewelry is on its way! ✨
              </p>
            </div>

            <div className="bg-background/50 backdrop-blur-sm rounded-lg p-4 inline-block">
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="text-lg font-mono font-bold text-primary">{order.orderNumber}</p>
            </div>
          </CardContent>
        </Card>

        {/* Order Details */}
        <Card>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold">Order Details</h2>
            </div>
            
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

            <div className="border-t pt-6">
              <h3 className="font-semibold mb-4">Order Items</h3>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
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

        {/* What's Next - More cheerful */}
        <Card className="border-primary/10 bg-primary/5">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">What Happens Next?</h3>
            </div>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">📧</span>
                <span className="text-muted-foreground">
                  You'll receive a confirmation email shortly with your order details
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">🎨</span>
                <span className="text-muted-foreground">
                  Our young artists (ages 5 & 9) will carefully prepare your handcrafted jewelry
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">📦</span>
                <span className="text-muted-foreground">
                  We'll send you a shipping notification when your order is on its way
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-bold">💝</span>
                <span className="text-muted-foreground">
                  Questions? We're here to help! Feel free to contact us anytime
                </span>
              </li>
            </ul>
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-center flex-wrap">
          <Link href="/shop">
            <Button size="lg" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Continue Shopping
            </Button>
          </Link>
          <Link href="/contact">
            <Button size="lg" variant="outline">Contact Us</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
