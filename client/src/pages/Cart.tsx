import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useCart } from '@/contexts/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';

export default function Cart() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-12 text-center space-y-6">
            <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-bold">Your Cart is Empty</h2>
            <p className="text-muted-foreground">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Link href="/shop">
              <Button size="lg">Start Shopping</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.productId}>
              <CardContent className="p-6">
                <div className="flex gap-6">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between">
                      <h3 className="font-semibold text-lg">{item.name}</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.productId)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>

                    <p className="text-xl font-bold text-primary">
                      ${parseFloat(item.price).toFixed(2)}
                    </p>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Subtotal: ${(parseFloat(item.price) * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={clearCart} className="w-full">
            Clear Cart
          </Button>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-20">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-2xl font-bold">Order Summary</h2>

              <div className="space-y-3">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="text-primary">${totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <Link href="/checkout">
                <Button size="lg" className="w-full">
                  Proceed to Checkout
                </Button>
              </Link>

              <Link href="/shop">
                <Button variant="outline" className="w-full">
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
