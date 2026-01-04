import { useState } from 'react';
import { useRoute, Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { useCart } from '@/contexts/CartContext';
import { Loader2, ShoppingCart, ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const [, params] = useRoute('/product/:slug');
  const slug = params?.slug || '';
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [added, setAdded] = useState(false);

  const { data: product, isLoading } = trpc.products.getBySlug.useQuery({ slug });
  const { addItem } = useCart();

  if (isLoading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-12 text-center space-y-4">
        <h1 className="text-3xl font-bold">Product Not Found</h1>
        <p className="text-muted-foreground">The product you're looking for doesn't exist.</p>
        <Link href="/shop">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const images = JSON.parse(product.images);
  const colors = product.colors ? product.colors.split(',').map(c => c.trim()) : [];
  const materials = product.materials ? product.materials.split(',').map(m => m.trim()) : [];

  const handleAddToCart = () => {
    if (product.stockQuantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: images[0] || '/placeholder.jpg',
    });

    setAdded(true);
    toast.success('Added to cart!');
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container py-12">
      <Link href="/shop">
        <Button variant="ghost" className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Shop
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square rounded-lg overflow-hidden bg-muted">
            <img
              src={images[selectedImage] || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: string, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-4xl font-bold mb-2">{product.name}</h1>
            <p className="text-3xl font-bold text-primary">${parseFloat(product.price).toFixed(2)}</p>
          </div>

          {product.description && (
            <p className="text-lg text-muted-foreground">{product.description}</p>
          )}

          {colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Colors:</h3>
              <div className="flex flex-wrap gap-2">
                {colors.map((color, idx) => (
                  <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {color}
                  </span>
                ))}
              </div>
            </div>
          )}

          {materials.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Materials:</h3>
              <div className="flex flex-wrap gap-2">
                {materials.map((material, idx) => (
                  <span key={idx} className="px-3 py-1 bg-secondary rounded-full text-sm">
                    {material}
                  </span>
                ))}
              </div>
            </div>
          )}

          {product.createdBy && (
            <div className="p-4 bg-accent/10 rounded-lg">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold">Created by:</span> {product.createdBy}
              </p>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold">Quantity:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </Button>
                <span className="w-12 text-center font-semibold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                  disabled={quantity >= product.stockQuantity}
                >
                  +
                </Button>
              </div>
              <span className="text-sm text-muted-foreground">
                {product.stockQuantity} available
              </span>
            </div>

            <Button
              size="lg"
              className="w-full text-lg"
              onClick={handleAddToCart}
              disabled={product.stockQuantity === 0 || added}
            >
              {added ? (
                <>
                  <Check className="h-5 w-5 mr-2" />
                  Added to Cart
                </>
              ) : (
                <>
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </>
              )}
            </Button>

            {product.stockQuantity === 0 && (
              <p className="text-center text-destructive font-medium">Out of Stock</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
