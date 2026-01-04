import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { trpc } from '@/lib/trpc';
import { Loader2, CheckCircle, Mail } from 'lucide-react';
import { toast } from 'sonner';

export default function Newsletter() {
  const [subscribed, setSubscribed] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    name: '',
  });

  const subscribeMutation = trpc.newsletter.subscribe.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await subscribeMutation.mutateAsync(formData);
      setSubscribed(true);
      toast.success('Successfully subscribed to our newsletter!');
    } catch (error: any) {
      if (error.message.includes('already subscribed')) {
        toast.error('This email is already subscribed');
      } else {
        toast.error(error.message || 'Failed to subscribe');
      }
    }
  };

  if (subscribed) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
          <CardContent className="p-12 text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">You're All Set!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for subscribing to our newsletter. We'll keep you updated on new designs, market dates, and special promotions!
            </p>
            <Button onClick={() => { setSubscribed(false); setFormData({ email: '', name: '' }); }}>
              Subscribe Another Email
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-2xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <Mail className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold">Stay Updated</h1>
          <p className="text-lg text-muted-foreground">
            Subscribe to our newsletter to get the latest updates on new jewelry designs, market dates, and special promotions!
          </p>
        </div>

        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name (Optional)</Label>
                <Input
                  id="name"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={subscribeMutation.isPending}
              >
                {subscribeMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Subscribing...
                  </>
                ) : (
                  'Subscribe to Newsletter'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-primary/5 via-accent/5 to-secondary">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold">What You'll Receive:</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Announcements of new jewelry designs and collections</li>
              <li>• Updates on market dates and booth locations</li>
              <li>• Exclusive subscriber-only promotions and discounts</li>
              <li>• Behind-the-scenes looks at our creative process</li>
              <li>• Special offers for custom orders</li>
            </ul>
            <p className="text-xs text-muted-foreground pt-3">
              We respect your privacy. You can unsubscribe at any time.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
