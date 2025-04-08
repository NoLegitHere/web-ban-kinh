"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ShoppingCart, Loader2 } from "lucide-react";
import ProductFilter from "@/components/ProductFilter";
import { productAPI } from "@/lib/api";
import { useCart } from "@/hooks/useCart";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";
import { useLoadingFetch } from "@/lib/loadingFetch";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

interface SearchParamsProps {
  category?: string;
  sort?: string;
  search?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  _t?: string;
}

export default function ProductsClient({ 
  searchParams 
}: { 
  searchParams: SearchParamsProps;
}) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const { startLoading, stopLoading } = useGlobalLoading();
  const { fetchWithLoading } = useLoadingFetch();
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Serialize the search params for dependency tracking
  const searchParamsString = JSON.stringify(searchParams);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      
      try {
        // Add timestamp to avoid caching
        const timestamp = new Date().getTime();
        
        // Build a clean params object to ensure all filters are included
        const cleanParams: Record<string, string> = {
          _t: timestamp.toString()
        };
        
        // Add category filter if present
        if (searchParams.category) {
          cleanParams.category = searchParams.category;
        }
        
        // Add search filter if present
        if (searchParams.search) {
          cleanParams.search = searchParams.search;
        }
        
        // Add sort parameter if present
        if (searchParams.sort) {
          cleanParams.sort = searchParams.sort;
        }
        
        // Add brand filter if present
        if (searchParams.brand) {
          cleanParams.brand = searchParams.brand;
        }
        
        // Add price filters if present - ensure they're valid numbers
        if (searchParams.minPrice && !isNaN(Number(searchParams.minPrice))) {
          cleanParams.minPrice = searchParams.minPrice;
        }
        
        if (searchParams.maxPrice && !isNaN(Number(searchParams.maxPrice))) {
          cleanParams.maxPrice = searchParams.maxPrice;
        }
        
        // Fetch products from the API with search parameters - no need for explicit loading here
        // as the ProductFilter component already shows loading when changing filters
        const result = await productAPI.getAll(cleanParams);
        setProducts(result);
      } catch (error) {
        // Set fallback data
        setProducts(getFallbackProducts(searchParams));
        toast({
          title: "Lỗi tải dữ liệu",
          description: "Không thể tải danh sách sản phẩm. Đang hiển thị dữ liệu mẫu.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
        stopLoading();
      }
    }
    
    loadProducts();
  }, [searchParamsString, toast, stopLoading]);

  const handleAddToCart = async (productId: string) => {
    // Check if user is logged in
    if (!isAuthenticated) {
      toast({
        title: "Đăng nhập để tiếp tục",
        description: "Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng",
      });
      
      // Redirect to login page with return URL
      const returnUrl = encodeURIComponent(`/products?${new URLSearchParams(searchParams as any).toString()}`);
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }
    
    setAddingToCart(productId);
    try {
      await fetchWithLoading(
        () => addToCart(productId, 1),
        "Đang thêm vào giỏ hàng..."
      );
    } finally {
      setAddingToCart(null);
    }
  };

  // Fallback products function
  function getFallbackProducts(params: SearchParamsProps) {
    const products = [
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
        name: "Kính Oakley Holbrook",
        description: "Kính thể thao Oakley Holbrook siêu bền và chống va đập",
        price: 3200000,
        imageUrl: "https://images.unsplash.com/photo-1619449993667-6dee759dd3c1?q=80&w=580&h=580&auto=format&fit=crop",
        category: "men",
        brand: { name: "Oakley" }
      },
      {
        id: 4,
        name: "Kính Prada Linea Rossa",
        description: "Kính mát Prada Linea Rossa với thiết kế thể thao hiện đại",
        price: 5800000,
        imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=580&h=580&auto=format&fit=crop",
        category: "sunglasses",
        brand: { name: "Prada" }
      },
      {
        id: 5,
        name: "Kính Versace VE4361",
        description: "Kính mát Versace VE4361 với logo Medusa đặc trưng",
        price: 4900000,
        imageUrl: "https://images.unsplash.com/photo-1508296695146-257a814070b4?q=80&w=580&h=580&auto=format&fit=crop",
        category: "women",
        brand: { name: "Versace" }
      },
      {
        id: 6,
        name: "Kính Burberry BE4216",
        description: "Kính mát Burberry BE4216 với họa tiết kẻ caro biểu tượng",
        price: 4200000,
        imageUrl: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=580&h=580&auto=format&fit=crop",
        category: "premium",
        brand: { name: "Burberry" }
      },
      {
        id: 7,
        name: "Kính Persol 649",
        description: "Kính mát Persol 649 phong cách vintage đầy lịch lãm",
        price: 3650000,
        imageUrl: "https://images.unsplash.com/photo-1577803645773-f96470509666?q=80&w=580&h=580&auto=format&fit=crop",
        category: "men",
        brand: { name: "Persol" }
      }
    ];
    
    // Apply filters manually for the fallback data
    let filteredProducts = products;
    
    // Filter by category
    if (params.category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === params.category
      );
    }

    // Filter by brand - ensure case-insensitive comparison
    if (params.brand) {
      const brandName = params.brand.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) => product.brand.name.toLowerCase() === brandName
      );
    }

    // Filter by price range
    if (params.minPrice || params.maxPrice) {
      const minPrice = params.minPrice ? parseInt(params.minPrice) : 0;
      const maxPrice = params.maxPrice ? parseInt(params.maxPrice) : Number.MAX_SAFE_INTEGER;
      
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= minPrice && product.price <= maxPrice
      );
    }

    // Filter by search term
    if (params.search) {
      const searchTerm = params.search.toLowerCase();
      filteredProducts = filteredProducts.filter((product) =>
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.name.toLowerCase().includes(searchTerm)
      );
    }

    // Sort products
    if (params.sort) {
      switch (params.sort) {
        case "price-asc":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price-desc":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "name-asc":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        default:
          filteredProducts.sort((a, b) => b.id - a.id);
      }
    }
    
    return filteredProducts;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  // Function to get filter description
  const getFilterDescription = () => {
    const parts = [];
    
    if (searchParams?.category) {
      const categoryMap: Record<string, string> = {
        "men": "Kính nam",
        "women": "Kính nữ",
        "sunglasses": "Kính râm",
        "premium": "Kính cao cấp"
      };
      parts.push(`danh mục ${categoryMap[searchParams.category] || searchParams.category}`);
    }
    
    if (searchParams?.brand) {
      parts.push(`thương hiệu ${searchParams.brand}`);
    }
    
    if (searchParams?.minPrice || searchParams?.maxPrice) {
      const minPrice = searchParams.minPrice ? parseInt(searchParams.minPrice).toLocaleString('vi-VN') : '0';
      const maxPrice = searchParams.maxPrice ? parseInt(searchParams.maxPrice).toLocaleString('vi-VN') : 'không giới hạn';
      parts.push(`giá từ ${minPrice}₫ đến ${maxPrice}₫`);
    }
    
    if (searchParams?.search) {
      parts.push(`tìm kiếm "${searchParams.search}"`);
    }
    
    return parts.length > 0 ? ` với ${parts.join(', ')}` : "";
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex flex-col space-y-4 md:space-y-0 md:flex-row md:space-x-8">
        {/* Sidebar filters */}
        <div className="w-full md:w-64 md:shrink-0">
          <ProductFilter />
        </div>
        
        {/* Product grid */}
        <div className="flex-1">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Sản phẩm kính mắt</h1>
            {!isLoading && (
              <p className="text-muted-foreground">
                {products.length} sản phẩm{getFilterDescription()}
              </p>
            )}
          </div>
          
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Đang tải sản phẩm...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <Card key={product.id} className="overflow-hidden flex flex-col">
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
                    <CardContent className="py-2 flex-grow">
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
                ))
              ) : (
                <div className="col-span-full py-12 text-center">
                  <h3 className="text-xl font-semibold mb-2">Không tìm thấy sản phẩm</h3>
                  <p className="text-muted-foreground">Không tìm thấy sản phẩm phù hợp với tiêu chí tìm kiếm.</p>
                  <Link href="/products">
                    <Button variant="outline" className="mt-4">Xem tất cả sản phẩm</Button>
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 