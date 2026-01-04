import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { trpc } from '@/lib/trpc';
import { Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomOrder() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    itemType: '',
    description: '',
    colors: '',
    budget: '',
  });

  const createRequestMutation = trpc.customRequests.create.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await createRequestMutation.mutateAsync(formData);
      setSubmitted(true);
      toast.success('Custom order request submitted!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    }
  };

  if (submitted) {
    return (
      <div className="container py-12">
        <Card className="max-w-2xl mx-auto border-primary/20 bg-primary/5">
          <CardContent className="p-12 text-center space-y-6">
            <CheckCircle className="h-16 w-16 mx-auto text-primary" />
            <h1 className="text-3xl font-bold">Request Received!</h1>
            <p className="text-lg text-muted-foreground">
              Thank you for your custom order request. We'll review your ideas and get back to you soon!
            </p>
            <Button onClick={() => { setSubmitted(false); setFormData({ customerName: '', customerEmail: '', customerPhone: '', itemType: '', description: '', colors: '', budget: '' }); }}>
              Submit Another Request
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Custom Orders</h1>
          <p className="text-lg text-muted-foreground">
            Have a special design in mind? We'd love to create something unique just for you!
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Tell Us About Your Custom Piece</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Your Name *</Label>
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
                <Label htmlFor="itemType">Type of Item</Label>
                <Input
                  id="itemType"
                  placeholder="e.g., Earrings, Necklace, Bracelet, Keychain"
                  value={formData.itemType}
                  onChange={(e) => setFormData({ ...formData, itemType: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Describe Your Vision *</Label>
                <Textarea
                  id="description"
                  required
                  rows={5}
                  placeholder="Tell us about your design ideas, style preferences, or any special requests..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="colors">Preferred Colors</Label>
                <Input
                  id="colors"
                  placeholder="e.g., Pink, Blue, Gold"
                  value={formData.colors}
                  onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget Range</Label>
                <Input
                  id="budget"
                  placeholder="e.g., $10-$20"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={createRequestMutation.isPending}
              >
                {createRequestMutation.isPending ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Custom Order Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="bg-accent/10">
          <CardContent className="p-6 space-y-3">
            <h3 className="font-semibold">What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• We'll review your custom order request</li>
              <li>• Our young makers will sketch out some design ideas</li>
              <li>• We'll contact you to discuss details and pricing</li>
              <li>• Once approved, we'll create your unique piece!</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
