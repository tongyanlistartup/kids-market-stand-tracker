import { Card, CardContent } from '@/components/ui/card';
import { Mail, MapPin, Calendar } from 'lucide-react';

export default function Contact() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you! Here's how you can reach us.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Email Us</h3>
                <p className="text-sm text-muted-foreground">
                  Send us a message and we'll get back to you soon!
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                <MapPin className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Visit Our Booth</h3>
                <p className="text-sm text-muted-foreground">
                  Find us at the local flea market
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-2">Market Dates</h3>
                <p className="text-sm text-muted-foreground">
                  August 2026 - Check back for specific dates
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary">
          <CardContent className="p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-bold text-center">Market Location</h2>
            <div className="text-center space-y-3">
              <p className="text-lg">
                We'll be at the <span className="font-semibold">Local Flea Market</span> in August 2026!
              </p>
              <p className="text-muted-foreground">
                Come visit our booth to see our jewelry in person, meet the young makers, and watch them create new pieces. We love meeting our customers!
              </p>
              <p className="text-sm text-muted-foreground">
                Exact dates and booth location will be announced soon. Sign up for our newsletter to stay updated!
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-8 space-y-4">
            <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Do you ship orders?</h3>
                <p className="text-muted-foreground">
                  Yes! We ship within the United States. Shipping costs are calculated at checkout.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">How long does it take to make a custom order?</h3>
                <p className="text-muted-foreground">
                  Custom orders typically take 1-2 weeks, depending on complexity. We'll give you an estimated timeline when we discuss your design.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">What materials do you use?</h3>
                <p className="text-muted-foreground">
                  We use high-quality polymer clay, which is durable and lightweight. All findings (earring hooks, necklace chains, etc.) are hypoallergenic.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Can I return or exchange items?</h3>
                <p className="text-muted-foreground">
                  Due to the handmade nature of our products, we don't accept returns unless the item arrives damaged. Please contact us if you have any issues!
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
