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
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
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
  const colors = product.colors ? JSON.parse(product.colors) : [];
  const materials = product.materials ? JSON.parse(product.materials) : [];
  
  // Check if images is array of objects with color and url
  const hasColorVariants = Array.isArray(images) && images.length > 0 && images[0]?.color;
  
  // Initialize selected color if not set
  if (hasColorVariants && !selectedColor && colors.length > 0) {
    setSelectedColor(colors[0].name);
  }
  
  // Get current image based on selected color
  const currentImage = hasColorVariants && selectedColor
    ? images.find((img: any) => img.color === selectedColor)?.url || images[0]?.url
    : (Array.isArray(images) ? images[selectedImage]?.url || images[selectedImage] : images);

  const handleAddToCart = () => {
    if (product.stockQuantity < quantity) {
      toast.error('Not enough stock available');
      return;
    }

    // Include selected color in cart item if applicable
    const itemName = hasColorVariants && selectedColor 
      ? `${product.name} (${selectedColor})`
      : product.name;

    addItem({
      productId: product.id,
      name: itemName,
      price: product.price,
      image: currentImage,
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
              src={currentImage || '/placeholder.jpg'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {!hasColorVariants && images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {images.map((img: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img src={img.url || img} alt={img.alt || `${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
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

          {hasColorVariants && colors.length > 0 && (
            <div>
              <h3 className="font-semibold mb-3">Choose Color:</h3>
              <div className="flex flex-wrap gap-3">
                {colors.map((color: any, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color.name)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                      selectedColor === color.name
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div
                      className="w-6 h-6 rounded-full border-2 border-border shadow-sm"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="font-medium">{color.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {materials.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Materials:</h3>
              <div className="flex flex-wrap gap-2">
                {materials.map((material: string, idx: number) => (
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
