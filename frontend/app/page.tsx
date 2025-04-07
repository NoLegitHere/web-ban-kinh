"use client";

import { useState, useEffect } from "react";
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
import { ShoppingCart, Loader2 } from "lucide-react";
import { productAPI } from "@/lib/api";
import { useCart } from "@/hooks/useCart";

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);

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
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=1200&auto=format&fit=crop"
          alt="Glasses collection"
          fill
          className="object-cover brightness-75"
          priority
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-lg text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Nâng tầm phong cách với kính mắt cao cấp</h1>
            <p className="text-lg mb-6">Khám phá bộ sưu tập kính mắt sang trọng từ các thương hiệu nổi tiếng thế giới.</p>
            <Button asChild size="lg">
              <Link href="/products">Khám phá ngay</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-10 text-center">Danh mục sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Kính nam", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", href: "/products?category=men" },
              { name: "Kính nữ", image: "https://images.unsplash.com/photo-1588495752527-77d65c84c586?q=80&w=400&auto=format&fit=crop", href: "/products?category=women" },
              { name: "Kính râm", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=400&auto=format&fit=crop", href: "/products?category=sunglasses" },
              { name: "Kính cao cấp", image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?q=80&w=400&auto=format&fit=crop", href: "/products?category=premium" },
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
