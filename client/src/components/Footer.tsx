import { Link } from 'wouter';
import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Little Makers Jewelry</h3>
            <p className="text-sm text-muted-foreground">
              Handcrafted polymer clay jewelry made with love by young entrepreneurs, ages 5 and 9.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop"><a className="text-muted-foreground hover:text-primary transition-colors">All Products</a></Link>
              </li>
              <li>
                <Link href="/shop?category=earrings"><a className="text-muted-foreground hover:text-primary transition-colors">Earrings</a></Link>
              </li>
              <li>
                <Link href="/shop?category=necklaces"><a className="text-muted-foreground hover:text-primary transition-colors">Necklaces</a></Link>
              </li>
              <li>
                <Link href="/shop?category=bracelets"><a className="text-muted-foreground hover:text-primary transition-colors">Bracelets</a></Link>
              </li>
            </ul>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Information</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about"><a className="text-muted-foreground hover:text-primary transition-colors">About Us</a></Link>
              </li>
              <li>
                <Link href="/gallery"><a className="text-muted-foreground hover:text-primary transition-colors">Gallery</a></Link>
              </li>
              <li>
                <Link href="/custom-order"><a className="text-muted-foreground hover:text-primary transition-colors">Custom Orders</a></Link>
              </li>
              <li>
                <Link href="/contact"><a className="text-muted-foreground hover:text-primary transition-colors">Contact</a></Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for new designs and market dates.
            </p>
            <Link href="/newsletter">
              <a className="text-sm font-medium text-primary hover:underline">
                Sign Up →
              </a>
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-primary fill-primary" /> by young entrepreneurs
          </p>
          <p className="mt-2">© {new Date().getFullYear()} Little Makers Jewelry. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
