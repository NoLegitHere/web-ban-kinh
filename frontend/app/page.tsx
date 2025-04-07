"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { productAPI } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  
  // Hero carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const slideInterval = 5000; // 5 seconds per slide
  const heroSlides = [
    {
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop",
      title: "Nâng tầm phong cách với kính mắt cao cấp",
      description: "Khám phá bộ sưu tập kính mắt sang trọng từ các thương hiệu nổi tiếng thế giới.",
      buttonText: "Khám phá ngay",
      buttonLink: "/products",
    },
    {
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop",
      title: "Kính râm thời trang 2025",
      description: "Bảo vệ đôi mắt của bạn với những mẫu kính râm thời thượng nhất.",
      buttonText: "Xem bộ sưu tập",
      buttonLink: "/products?category=sunglasses",
    },
    {
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop",
      title: "Kính thời trang dành cho phái nữ",
      description: "Tôn lên vẻ đẹp và cá tính riêng với bộ sưu tập dành riêng cho phái nữ.",
      buttonText: "Khám phá ngay",
      buttonLink: "/products?category=women",
    },
    {
      image: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop",
      title: "Gọng kính cao cấp từ Ý",
      description: "Trải nghiệm sự sang trọng với những gọng kính được chế tác tại Ý.",
      buttonText: "Xem ngay",
      buttonLink: "/products?category=premium",
    },
  ];

  // Auto-scroll the carousel with progress animation
  useEffect(() => {
    // Mark as transitioning (disables animations briefly)
    setIsTransitioning(true);
    
    // Reset progress when slide changes
    setProgress(0);
    
    // After a brief delay, enable animations again
    const transitionTimeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
    
    // Use requestAnimationFrame for smoother animation
    let startTime: number | null = null;
    let animationFrameId: number;
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const newProgress = Math.min(100, (elapsed / slideInterval) * 100);
      
      setProgress(newProgress);
      
      if (newProgress < 100) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        // Move to next slide when progress reaches 100%
        setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      }
    };
    
    // Start the animation with a slight delay to allow transition state to update
    const animationStartTimeout = setTimeout(() => {
      animationFrameId = requestAnimationFrame(animate);
    }, 50);
    
    return () => {
      clearTimeout(transitionTimeout);
      clearTimeout(animationStartTimeout);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, [currentSlide, heroSlides.length, slideInterval]);

  // Navigation functions for the carousel
  const goToSlide = useCallback((index: number) => {
    // Only change if it's a different slide
    if (index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setProgress(0); // Reset progress to restart animation
      
      // Re-enable animations after a brief delay
      setTimeout(() => {
        setIsTransitioning(false);
      }, 50);
    }
  }, [currentSlide]);

  const prevSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setProgress(0); // Reset progress to restart animation
    
    // Re-enable animations after a brief delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  }, [heroSlides.length]);

  const nextSlide = useCallback(() => {
    setIsTransitioning(true);
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    setProgress(0); // Reset progress to restart animation
    
    // Re-enable animations after a brief delay
    setTimeout(() => {
      setIsTransitioning(false);
    }, 50);
  }, [heroSlides.length]);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        // Fetch products from the API
        const result = await productAPI.getAll();
        setProducts(result.slice(0, 4)); // Only use the first 4 products for featured section
      } catch (error) {
        console.error("Failed to fetch products:", error);
        // Set fallback data
        setProducts(getFallbackProducts());
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách sản phẩm. Đang hiển thị dữ liệu mẫu.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
    
    loadProducts();
  }, [toast]);

  const handleAddToCart = async (productId: string) => {
    setAddingToCart(productId);
    try {
      await addToCart(productId, 1);
    } finally {
      setAddingToCart(null);
    }
  };

  // Fallback products function
  function getFallbackProducts() {
    return [
      {
        id: 1,
        name: "Kính Ray-Ban Aviator",
        description: "Kính mắt phi công Ray-Ban Aviator Classic với thiết kế vượt thời gian",
        price: 2500000,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=580&h=580&auto=format&fit=crop",
        category: "sunglasses",
        brand: { name: "Ray-Ban" }
      },
      {
        id: 2,
        name: "Kính Gucci GG0396S",
        description: "Kính mắt cao cấp Gucci GG0396S với thiết kế sang trọng",
        price: 6950000,
        imageUrl: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=580&h=580&auto=format&fit=crop",
        category: "premium",
        brand: { name: "Gucci" }
      },
      {
        id: 3,
        name: "Kính Cận Titanium",
        description: "Kính cận gọng titanium siêu nhẹ và bền bỉ",
        price: 1850000,
        imageUrl: "https://images.unsplash.com/photo-1619449993667-6dee759dd3c1?q=80&w=580&h=580&auto=format&fit=crop",
        category: "men",
        brand: { name: "Titanium" }
      },
      {
        id: 4,
        name: "Kính Mát Polarized",
        description: "Kính mát polarized chống tia UV hiệu quả cho mùa hè",
        price: 1250000,
        imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=580&h=580&auto=format&fit=crop",
        category: "sunglasses",
        brand: { name: "Polaroid" }
      }
    ];
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  return (
    <div className="flex flex-col">
      {/* Hero Carousel Section */}
      <section className="relative h-[70vh]">
        {/* Carousel slides */}
        <div className="relative h-full overflow-hidden">
          {heroSlides.map((slide, index) => (
            <div 
              key={index} 
              className={`absolute inset-0 flex items-center transition-opacity duration-1000 ease-in-out ${
                currentSlide === index ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover brightness-75"
                priority={index === 0}
              />
              <div className="container mx-auto px-4 relative z-10">
                <div className="max-w-lg text-white">
                  <h1 className="text-4xl md:text-5xl font-bold mb-4">{slide.title}</h1>
                  <p className="text-lg mb-6">{slide.description}</p>
                  <Button asChild size="lg">
                    <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation arrows */}
        <button 
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 rounded-full p-2 text-white transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        {/* Line indicators (replacing dots) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative h-1 w-16 bg-white/30 overflow-hidden rounded-full"
              aria-label={`Go to slide ${index + 1}`}
            >
              {/* Progress line for each indicator - using transform for better performance */}
              <div 
                className={`carousel-indicator absolute left-0 top-0 h-full w-full bg-white rounded-full transform origin-left will-change-transform`}
                style={{ 
                  transform: currentSlide === index 
                    ? `scaleX(${progress / 100})` 
                    : 'scaleX(0)',
                  // Disable transitions during slide changes to prevent unwanted animations
                  transition: isTransitioning
                    ? 'none'
                    : currentSlide === index 
                      ? 'transform 50ms linear' 
                      : 'transform 300ms cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              />
            </button>
          ))}
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kính nam", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", href: "/products?category=men" },
              { name: "Kính nữ", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", href: "/products?category=women" },
              { name: "Kính râm", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", href: "/products?category=sunglasses" },
              { name: "Kính cao cấp", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", href: "/products?category=premium" },
            ].map((category, index) => (
              <Link key={index} href={category.href} className="overflow-hidden rounded-lg shadow-md group relative">
                <div className="h-64 relative">
                  <Image
                    src={category.image}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Sản phẩm nổi bật</h2>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải sản phẩm...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <Card key={product.id} className="overflow-hidden">
                  <div className="h-64 relative">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardHeader className="pt-4 pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <span className="text-sm font-medium text-muted-foreground">{product.brand.name}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="flex flex-col pt-2 pb-4 gap-2">
                    <div className="flex justify-between items-center w-full">
                      <span className="font-bold">{formatCurrency(product.price)}</span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/products/${product.id}`}>Chi tiết</Link>
                      </Button>
                    </div>
                    <Button 
                      onClick={() => handleAddToCart(product.id.toString())}
                      disabled={addingToCart === product.id.toString()}
                      className="w-full"
                      size="sm"
                    >
                      {addingToCart === product.id.toString() ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang thêm...
                        </>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Thêm vào giỏ hàng
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg">
              <Link href="/products">Xem tất cả sản phẩm</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Tại sao chọn Optical Glasses?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Sản phẩm chính hãng</h3>
              <p className="text-muted-foreground">Cam kết 100% sản phẩm chính hãng từ các thương hiệu nổi tiếng thế giới.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 1 1 0 9h-2.5"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Bảo hành dài hạn</h3>
              <p className="text-muted-foreground">Chế độ bảo hành lên đến 12 tháng và hỗ trợ sửa chữa trọn đời.</p>
            </div>

            <div className="text-center p-6">
              <div className="bg-primary text-primary-foreground w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Tư vấn chuyên nghiệp</h3>
              <p className="text-muted-foreground">Đội ngũ nhân viên được đào tạo chuyên sâu, tư vấn tận tâm cho từng khách hàng.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Brands Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Thương hiệu nổi bật</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Ray-Ban", "Gucci", "Oakley", "Prada", "Dior"].map((brand, index) => (
              <div key={index} className="text-2xl font-bold text-muted-foreground">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
