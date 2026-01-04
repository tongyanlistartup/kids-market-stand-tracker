import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

export default function Shop() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(location.split('?')[1]);
  const categoryFilter = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(
    categoryFilter ? parseInt(categoryFilter) : undefined
  );

  const { data: categories } = trpc.categories.list.useQuery();
  const { data: products, isLoading } = trpc.products.list.useQuery({
    categoryId: selectedCategory,
    isAvailable: true,
  });

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Shop Our Collection</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Browse our unique handcrafted jewelry pieces.
          </p>
        </div>

        {categories && categories.length > 0 && (
          <div className="flex flex-wrap gap-3 justify-center">
            <Button
              variant={selectedCategory === undefined ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(undefined)}
            >
              All Products
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </Button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => {
              const images = JSON.parse(product.images);
              const firstImage = images[0] || '/placeholder.jpg';
              
              return (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group h-full">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <img
                        src={firstImage}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                    <CardContent className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      {product.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <p className="text-2xl font-bold text-primary">
                          ${parseFloat(product.price).toFixed(2)}
                        </p>
                        {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
                          <span className="text-xs text-amber-600 font-medium">
                            Only {product.stockQuantity} left!
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-muted-foreground">No products found.</p>
            <Button variant="outline" onClick={() => setSelectedCategory(undefined)}>
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}