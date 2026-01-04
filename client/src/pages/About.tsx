import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, Star, Users } from 'lucide-react';

export default function About() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Our Story</h1>
          <p className="text-xl text-muted-foreground">
            Meet the young entrepreneurs behind Little Makers Jewelry
          </p>
        </div>

        {/* Main Story */}
        <Card>
          <CardContent className="p-8 md:p-12 space-y-6 text-lg">
            <p>
              Little Makers Jewelry was born from the creativity and entrepreneurial spirit of two amazing young artists, ages 5 and 9. What started as a fun craft activity has blossomed into a thriving small business that brings joy to customers and valuable life lessons to our young makers.
            </p>
            <p>
              Every piece of jewelry you see in our collection is handcrafted with polymer clay, carefully shaped, baked, and assembled by our talented duo. They pour their hearts into each creation, experimenting with colors, patterns, and designs to make truly unique pieces.
            </p>
            <p>
              Through this business, they're learning important skills like creativity, responsibility, customer service, and financial literacy. But most importantly, they're discovering the joy of making something beautiful with their own hands and sharing it with others.
            </p>
          </CardContent>
        </Card>

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Handmade with Love</h3>
              <p className="text-muted-foreground">
                Every piece is crafted by hand with care, attention to detail, and lots of love. No two pieces are exactly alike!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Creativity First</h3>
              <p className="text-muted-foreground">
                We encourage experimentation and creative expression. Each design reflects the unique imagination of our young artists.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Star className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Quality Matters</h3>
              <p className="text-muted-foreground">
                We use high-quality polymer clay and materials to ensure each piece is durable and beautiful.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Users className="h-6 w-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Learning Together</h3>
              <p className="text-muted-foreground">
                This business is a family project that teaches valuable life skills while having fun together.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Meet the Makers */}
        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary">
          <CardContent className="p-8 md:p-12 space-y-6">
            <h2 className="text-3xl font-bold text-center">Meet the Makers</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">The 9-Year-Old Artist</h3>
                <p className="text-muted-foreground">
                  Our older maker loves intricate designs and experimenting with color combinations. They handle the more detailed work and help manage inventory and customer orders.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl font-semibold">The 5-Year-Old Creator</h3>
                <p className="text-muted-foreground">
                  Our younger maker brings boundless creativity and joy to every piece. They love bright colors and fun shapes, and their enthusiasm is contagious!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Info */}
        <Card>
          <CardContent className="p-8 text-center space-y-4">
            <h2 className="text-2xl font-bold">Find Us at the Market!</h2>
            <p className="text-lg text-muted-foreground">
              We'll be at the local flea market in August! Come visit our booth to see our creations in person, meet the young makers, and watch them work on new pieces.
            </p>
            <p className="text-sm text-muted-foreground">
              Check our contact page for exact dates and location details.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
