import * as React from "react";
import { useState, useEffect, useRef, useCallback } from "react";
import { PageBreadcrumb } from "@/components/shared/PageBreadcrumb";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots,
  type CarouselApi,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import {
  Play, Eye, MapPin, Users, Home, Calendar, X, ChevronLeft, ChevronRight,
  Heart, Share2, Bookmark
} from "lucide-react";

// Sample property data
const PROPERTIES = [
  {
    id: 1,
    title: "Modern Apartment in City Center",
    location: "Biratnagar, Kathmandu",
    price: "₹200,000",
    period: "month",
    type: "FLAT",
    furnished: "SEMIFURNISHED",
    occupancy: "2-4",
    status: "Available",
    hasVideo: true,
    isBroker: true,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?w=800",
      "https://images.unsplash.com/photo-1565182999561-18d7dc61c393?w=800",
    ],
  },
  {
    id: 2,
    title: "Cozy 2BHK Near Metro",
    location: "Shantinagar, Kathmandu",
    price: "₹22,000",
    period: "month",
    type: "2BK",
    furnished: "UNFURNISHED",
    occupancy: "3-4",
    status: "Available",
    hasVideo: false,
    isBroker: true,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800",
    ],
  },
  {
    id: 3,
    title: "Spacious Family Home",
    location: "New Baneshwor, Kathmandu",
    price: "₹24,000",
    period: "month",
    type: "2BK",
    furnished: "UNFURNISHED",
    occupancy: "2-5",
    status: "Available",
    hasVideo: false,
    isBroker: true,
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800",
    ],
  },
  {
    id: 4,
    title: "Premium 2BHK Apartment",
    location: "Sinamangal, Kathmandu",
    price: "₹25,000",
    period: "month",
    type: "2BHK",
    furnished: "UNFURNISHED",
    occupancy: "3-5",
    status: "Available",
    hasVideo: false,
    isBroker: true,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800",
      "https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=800",
    ],
  },
];

// Sample gallery images for product detail
const GALLERY_IMAGES = [
  "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=1200",
  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=1200",
  "https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?w=1200",
  "https://images.unsplash.com/photo-1523381294911-8d3cead13475?w=1200",
  "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=1200",
  "https://images.unsplash.com/photo-1475180429745-d155ea2d0d8e?w=1200",
];

// Property Card with Carousel
function PropertyCard({ property }: { property: typeof PROPERTIES[0] }) {
  const autoplay = useRef(Autoplay({ delay: 4000, stopOnInteraction: true }));
  const [api, setApi] = useState<CarouselApi>();

  const handlePrev = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    api?.scrollPrev();
  }, [api]);

  const handleNext = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    api?.scrollNext();
  }, [api]);

  return (
    <Card className="overflow-hidden border-border group hover:shadow-lg transition-shadow">
      <div className="relative">
        <Carousel plugins={[autoplay.current]} className="w-full" setApi={setApi}>
          <CarouselContent>
            {property.images.map((image, index) => (
              <CarouselItem key={index}>
                <div className="aspect-[4/3] relative">
                  <img
                    src={image}
                    alt={`${property.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselDots className="absolute bottom-3 left-1/2 -translate-x-1/2" />
          
          {/* Navigation arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70 z-10"
          >
            <ChevronRight size={16} />
          </button>
          
          {/* Overlays */}
          <div className="absolute top-3 left-3 flex gap-2">
            {property.hasVideo && (
              <Badge className="bg-blue-500 hover:bg-blue-600 gap-1">
                <Play size={10} />
                VIDEO
              </Badge>
            )}
          </div>
          <div className="absolute top-3 right-3 z-10">
            <Badge className="bg-green-500 hover:bg-green-600">
              {property.status}
            </Badge>
          </div>

          {/* Quick actions on hover */}
          <div className="absolute bottom-12 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 z-10">
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Heart size={14} />
            </Button>
            <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full">
              <Bookmark size={14} />
            </Button>
          </div>
        </Carousel>
      </div>

      <CardContent className="p-4 space-y-3">
        <div className="flex items-start gap-1 text-muted-foreground text-sm">
          <MapPin size={14} className="mt-0.5 shrink-0" />
          <span>{property.location}</span>
        </div>

        <div className="flex items-baseline justify-between">
          <div className="text-xl font-bold text-primary">
            {property.price}
            <span className="text-sm font-normal text-muted-foreground">/{property.period}</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Users size={14} />
            {property.occupancy}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Home size={14} />
            <span>{property.type}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span>{property.furnished}</span>
          </div>
        </div>

        {property.isBroker && (
          <Badge className="bg-primary">BROKER</Badge>
        )}

        <Button variant="link" className="p-0 h-auto text-primary">
          VIEW DETAILS
        </Button>
      </CardContent>
    </Card>
  );
}

// Property Grid with Carousel
function PropertyListings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Featured Properties</h2>
        <Button variant="outline" size="sm">View All</Button>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: false,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {PROPERTIES.map((property) => (
            <CarouselItem key={property.id} className="pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <PropertyCard property={property} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-end gap-2 mt-4">
          <CarouselPrevious className="static translate-y-0" />
          <CarouselNext className="static translate-y-0" />
        </div>
      </Carousel>
    </div>
  );
}

// Product Gallery with Thumbnails
function ProductGallery() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [api, setApi] = useState<CarouselApi>();
  const [thumbApi, setThumbApi] = useState<CarouselApi>();

  useEffect(() => {
    if (!api) return;
    
    api.on("select", () => {
      setSelectedIndex(api.selectedScrollSnap());
      thumbApi?.scrollTo(api.selectedScrollSnap());
    });
  }, [api, thumbApi]);

  const handleThumbnailClick = useCallback((index: number) => {
    api?.scrollTo(index);
    setSelectedIndex(index);
  }, [api]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Product Gallery</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setLightboxOpen(true)}>
            <Eye size={14} className="mr-2" />
            View Large
          </Button>
        </div>
      </div>

      {/* Main Image */}
      <Card className="overflow-hidden border-border">
        <div className="relative">
          <Carousel setApi={setApi} className="w-full">
            <CarouselContent>
              {GALLERY_IMAGES.map((image, index) => (
                <CarouselItem key={index}>
                  <div 
                    className="aspect-[16/9] relative cursor-pointer"
                    onClick={() => setLightboxOpen(true)}
                  >
                    <img
                      src={image}
                      alt={`Gallery image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            {/* Overlay controls */}
            <div className="absolute top-4 left-4 flex gap-2">
              <Button size="sm" variant="secondary" className="gap-1 opacity-80 hover:opacity-100">
                <Play size={12} />
                VIDEO
              </Button>
              <Button size="sm" variant="secondary" className="gap-1 opacity-80 hover:opacity-100">
                <Eye size={12} />
                VIEW LARGE
              </Button>
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {selectedIndex + 1} / {GALLERY_IMAGES.length}
            </div>

            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </Carousel>
        </div>
      </Card>

      {/* Thumbnails */}
      <Carousel
        setApi={setThumbApi}
        opts={{
          containScroll: "keepSnaps",
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {GALLERY_IMAGES.map((image, index) => (
            <CarouselItem key={index} className="pl-2 basis-1/4 sm:basis-1/5 lg:basis-1/6">
              <button
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "w-full aspect-square rounded-lg overflow-hidden border-2 transition-all",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-transparent hover:border-muted-foreground/30"
                )}
              >
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Lightbox Dialog */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent className="max-w-full max-h-full w-screen h-screen p-0 bg-black/95 border-none [&>button]:hidden">
          <DialogTitle className="sr-only">Image Lightbox</DialogTitle>
          <div className="relative w-full h-full flex flex-col">
            {/* Single close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-50"
              onClick={() => setLightboxOpen(false)}
            >
              <X size={24} />
            </Button>

            {/* Main carousel */}
            <div className="flex-1 flex items-center justify-center px-16">
              <Carousel
                opts={{ startIndex: selectedIndex }}
                className="w-full h-full max-w-6xl"
                setApi={(api) => {
                  if (api) {
                    api.on("select", () => {
                      setSelectedIndex(api.selectedScrollSnap());
                    });
                  }
                }}
              >
                <CarouselContent className="h-full">
                  {GALLERY_IMAGES.map((image, index) => (
                    <CarouselItem key={index} className="flex items-center justify-center">
                      <img
                        src={image}
                        alt={`Gallery image ${index + 1}`}
                        className="max-w-full max-h-[70vh] object-contain rounded-lg"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="left-4 bg-white/10 hover:bg-white/20 text-white border-none" />
                <CarouselNext className="right-4 bg-white/10 hover:bg-white/20 text-white border-none" />
              </Carousel>
            </div>

            {/* Lightbox thumbnails */}
            <div className="pb-6 pt-4">
              <div className="flex justify-center gap-2 mb-3">
                {GALLERY_IMAGES.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedIndex(index)}
                    className={cn(
                      "w-14 h-14 rounded-lg overflow-hidden border-2 transition-all",
                      selectedIndex === index
                        ? "border-white opacity-100"
                        : "border-transparent opacity-50 hover:opacity-75"
                    )}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
              {/* Lightbox counter */}
              <div className="text-center">
                <span className="bg-white/20 text-white px-4 py-2 rounded-full text-sm backdrop-blur">
                  {selectedIndex + 1} of {GALLERY_IMAGES.length}
                </span>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Instagram-style Grid
function InstagramGrid() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const images = [
    ...GALLERY_IMAGES,
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600",
    "https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=600",
    "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600",
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Image Grid Gallery</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className="aspect-square overflow-hidden rounded-lg group relative"
          >
            <img
              src={image}
              alt={`Grid image ${index + 1}`}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
              <Eye className="text-white opacity-0 group-hover:opacity-100 transition-opacity" size={24} />
            </div>
          </button>
        ))}
      </div>

      {/* Quick View Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl p-0 bg-background border-border">
          <DialogTitle className="sr-only">Image Preview</DialogTitle>
          {selectedImage !== null && (
            <div className="relative">
              <img
                src={images[selectedImage]}
                alt={`Image ${selectedImage + 1}`}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent">
                <div className="flex items-center justify-between">
                  <span className="text-white text-sm">
                    {selectedImage + 1} / {images.length}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setSelectedImage(Math.max(0, selectedImage - 1))}
                      disabled={selectedImage === 0}
                    >
                      <ChevronLeft size={20} />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-white hover:bg-white/20"
                      onClick={() => setSelectedImage(Math.min(images.length - 1, selectedImage + 1))}
                      disabled={selectedImage === images.length - 1}
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function GalleryShowcase() {
  return (
    <div className="p-4 md:p-6 lg:p-8 space-y-8">
      <PageBreadcrumb items={[{ label: "Galleries" }]} />

      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Gallery Layouts</h1>
        <p className="text-muted-foreground">
          Various gallery and carousel layouts for property listings, product galleries, and image grids
        </p>
      </div>

      <Tabs defaultValue="properties" className="w-full">
        <TabsList>
          <TabsTrigger value="properties">Property Listings</TabsTrigger>
          <TabsTrigger value="product">Product Gallery</TabsTrigger>
          <TabsTrigger value="grid">Image Grid</TabsTrigger>
        </TabsList>

        <div className="mt-6">
          <TabsContent value="properties">
            <PropertyListings />
          </TabsContent>
          <TabsContent value="product">
            <ProductGallery />
          </TabsContent>
          <TabsContent value="grid">
            <InstagramGrid />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
