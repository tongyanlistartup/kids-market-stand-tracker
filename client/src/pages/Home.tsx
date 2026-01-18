import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Sparkles, Heart, Star } from 'lucide-react';

export default function Home() {
  const { data: featuredProducts, isLoading } = trpc.products.list.useQuery({ isFeatured: true, isAvailable: true });

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-secondary via-background to-accent/10 py-20 md:py-32 overflow-hidden">
        {/* Paint Splatter Decorations */}
        <img src="/paint-splatter-purple.png" alt="" className="absolute top-10 right-10 w-32 h-32 opacity-40 pointer-events-none animate-bounce" style={{animationDuration: '3s'}} />
        <img src="/paint-splatter-turquoise.png" alt="" className="absolute bottom-20 left-10 w-40 h-40 opacity-30 pointer-events-none" />
        <img src="/paint-splatter-pink.png" alt="" className="absolute top-1/2 right-1/4 w-24 h-24 opacity-25 pointer-events-none" />
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              <Sparkles className="h-4 w-4" />
              <span>Handcrafted with Love</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
              Unique Jewelry Made by Young Artists
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover beautiful, handcrafted polymer clay jewelry created by talented young entrepreneurs, ages 5 and 9. Each piece is unique and made with creativity and care.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/shop">
                <Button size="lg" className="text-lg px-8">
                  Shop Now
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Our Story
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-card">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Handmade with Love</h3>
              <p className="text-muted-foreground">
                Every piece is carefully crafted by hand with attention to detail and creativity.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-2">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Unique Designs</h3>
              <p className="text-muted-foreground">
                No two pieces are exactly alike. Each creation is one-of-a-kind and special.
              </p>
            </div>
            
            <div className="text-center space-y-3">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-2">
                <Sparkles className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold">Supporting Young Entrepreneurs</h3>
              <p className="text-muted-foreground">
                Your purchase supports young artists learning business and creativity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="relative py-16 overflow-hidden">
        {/* More Paint Splatters */}
        <img src="/paint-splatter-green.png" alt="" className="absolute top-10 left-5 w-28 h-28 opacity-20 pointer-events-none" />
        <img src="/paint-splatter-pink.png" alt="" className="absolute bottom-10 right-10 w-36 h-36 opacity-25 pointer-events-none" />
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl md:text-4xl font-bold">Featured Creations</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Check out our most popular handcrafted jewelry pieces
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="overflow-hidden">
                  <div className="aspect-square bg-muted animate-pulse" />
                  <CardContent className="p-4 space-y-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.slice(0, 6).map((product) => {
                const images = JSON.parse(product.images);
                const firstImage = images[0]?.url || '/placeholder.jpg';
                
                return (
                  <Link key={product.id} href={`/product/${product.slug}`}>
                    <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                      <div className="aspect-square overflow-hidden bg-muted">
                        <img
                          src={firstImage}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          ${parseFloat(product.price).toFixed(2)}
                        </p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No featured products available at the moment.</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/shop">
              <Button size="lg" variant="outline">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-primary/10 via-accent/10 to-secondary">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold">Want Something Custom?</h2>
            <p className="text-lg text-muted-foreground">
              We love creating custom pieces! Tell us your favorite colors and designs, and we'll make something special just for you.
            </p>
            <Link href="/custom-order">
              <Button size="lg" className="text-lg px-8">
                Request Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
