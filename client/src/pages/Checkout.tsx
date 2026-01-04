import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    shippingAddress: '',
  });

  const createOrderMutation = trpc.orders.create.useMutation();
  const createSessionMutation = trpc.checkout.createSession.useMutation();

  if (items.length === 0) {
    return (
      <div className="container py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <p className="text-muted-foreground">Add some items to your cart before checking out.</p>
        <Button onClick={() => setLocation('/shop')}>Go to Shop</Button>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Create order
      const orderResult = await createOrderMutation.mutateAsync({
        ...formData,
        items: items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      });

      // Create Stripe checkout session
      const sessionResult = await createSessionMutation.mutateAsync({
        orderId: orderResult.orderId,
        orderNumber: orderResult.orderNumber,
      });

      // Redirect to Stripe checkout
      if (sessionResult.sessionUrl) {
        clearCart();
        window.location.href = sessionResult.sessionUrl;
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to process checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Full Name *</Label>
                  <Input
                    id="customerName"
                    required
                    value={formData.customerName}
                    onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    required
                    value={formData.customerEmail}
                    onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Phone Number</Label>
                  <Input
                    id="customerPhone"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingAddress">Shipping Address</Label>
                  <Textarea
                    id="shippingAddress"
                    rows={4}
                    placeholder="Street address, city, state, ZIP code"
                    value={formData.shippingAddress}
                    onChange={(e) => setFormData({ ...formData, shippingAddress: e.target.value })}
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={isProcessing}>
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Continue to Payment'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.productId} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} × {item.quantity}
                    </span>
                    <span className="font-medium">
                      ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <p className="text-xs text-muted-foreground">
                You will be redirected to Stripe to complete your payment securely.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
