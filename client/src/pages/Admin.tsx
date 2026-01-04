import { useAuth } from '@/_core/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { trpc } from '@/lib/trpc';
import { getLoginUrl } from '@/const';
import { Loader2, Package, ShoppingCart, MessageSquare, Users, Mail, Image } from 'lucide-react';

export default function Admin() {
  const { user, loading, isAuthenticated } = useAuth();
  
  const { data: products } = trpc.products.list.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: orders } = trpc.orders.list.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: customRequests } = trpc.customRequests.list.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: testimonials } = trpc.testimonials.listAll.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: newsletter } = trpc.newsletter.list.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });
  const { data: gallery } = trpc.gallery.listAll.useQuery(undefined, { enabled: isAuthenticated && user?.role === 'admin' });

  if (loading) {
    return (
      <div className="container py-12 flex justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-12 text-center space-y-6">
            <h1 className="text-2xl font-bold">Admin Access Required</h1>
            <p className="text-muted-foreground">
              Please log in to access the admin dashboard.
            </p>
            <Button onClick={() => window.location.href = getLoginUrl()}>
              Log In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== 'admin') {
    return (
      <div className="container py-12">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-12 text-center space-y-6">
            <h1 className="text-2xl font-bold">Access Denied</h1>
            <p className="text-muted-foreground">
              You don't have permission to access the admin dashboard.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user.name}!</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Products
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{products?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Orders
              </CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{orders?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Custom Requests
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{customRequests?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Testimonials
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{testimonials?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Newsletter Subscribers
              </CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{newsletter?.length || 0}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Gallery Images
              </CardTitle>
              <Image className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{gallery?.length || 0}</div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Use the Database panel in the Management UI to manage products, orders, custom requests, testimonials, newsletter subscribers, and gallery images.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="outline">Manage Products</Button>
              <Button variant="outline">View Orders</Button>
              <Button variant="outline">Custom Requests</Button>
              <Button variant="outline">Testimonials</Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Orders */}
        {orders && orders.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="flex justify-between items-center border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{order.orderNumber}</p>
                      <p className="text-sm text-muted-foreground">{order.customerName}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">${order.totalAmount}</p>
                      <p className="text-sm text-muted-foreground capitalize">{order.status}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
