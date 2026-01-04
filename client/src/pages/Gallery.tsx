import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';
import { Loader2 } from 'lucide-react';

export default function Gallery() {
  const { data: images, isLoading } = trpc.gallery.listPublished.useQuery();

  return (
    <div className="container py-12">
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">Gallery</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Behind the scenes of our jewelry-making process and the young artists at work
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : images && images.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image) => (
              <Card key={image.id} className="overflow-hidden group cursor-pointer">
                <div className="aspect-square overflow-hidden bg-muted">
                  <img
                    src={image.imageUrl}
                    alt={image.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                {(image.title || image.description) && (
                  <div className="p-4 space-y-1">
                    {image.title && (
                      <h3 className="font-semibold text-lg">{image.title}</h3>
                    )}
                    {image.description && (
                      <p className="text-sm text-muted-foreground">{image.description}</p>
                    )}
                  </div>
                )}
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <p className="text-lg text-muted-foreground">
              Gallery coming soon! Check back later for photos of our jewelry-making process.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
