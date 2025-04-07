"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Star, ShoppingCart, Check, RefreshCw, Shield, CircleHelp, Minus, Plus } from "lucide-react";
import { useCart } from "@/hooks/useCart";
import { Input } from "@/components/ui/input";

// Client-side product detail component
export default function ProductDetailClient({ 
  product, 
  relatedProducts 
}: { 
  product: any;
  relatedProducts: any[];
}) {
  const router = useRouter();
  const { addToCart, isLoading } = useCart();
  const [quantity, setQuantity] = useState(1);
  
  // Handle quantity changes
  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setQuantity(isNaN(value) || value < 1 ? 1 : value);
  };
  
  // Handle add to cart
  const handleAddToCart = async () => {
    await addToCart(product.id.toString(), quantity);
  };
  
  // Handle buy now
  const handleBuyNow = async () => {
    await addToCart(product.id.toString(), quantity);
    router.push('/cart');
  };
  
  // Use fallback images if product doesn't have images array
  const productImages = product.images || [
    product.imageUrl,
    product.imageUrl,
    product.imageUrl,
    product.imageUrl
  ];

  // Use fallback specifications if product doesn't have specifications
  const productSpecifications = product.specifications || [
    { name: "Chất liệu gọng", value: "Cao cấp" },
    { name: "Chất liệu tròng", value: "Chống tia UV" },
    { name: "Xuất xứ", value: "Chính hãng" }
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Trang chủ</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/products">Sản phẩm</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href={`/products?category=${product.category}`}>
              {product.category === "sunglasses" && "Kính râm"}
              {product.category === "men" && "Kính nam"}
              {product.category === "women" && "Kính nữ"}
              {product.category === "premium" && "Kính cao cấp"}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink>{product.name}</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div>
          <div className="mb-4 rounded-lg overflow-hidden">
            <div className="aspect-square relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {productImages.map((image: string, index: number) => (
              <div 
                key={index} 
                className="cursor-pointer border rounded-md overflow-hidden hover:border-primary"
              >
                <div className="aspect-square relative">
                  <Image
                    src={image}
                    alt={`${product.name} - Ảnh ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex justify-between items-start mb-2">
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <Link 
              href={`/products?brand=${product.brand.name}`}
              className="text-lg font-medium text-muted-foreground hover:text-primary"
            >
              {product.brand.name}
            </Link>
          </div>

          <div className="flex items-center mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className="w-4 h-4 text-yellow-400 fill-yellow-400" 
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-muted-foreground">(12 đánh giá)</span>
          </div>

          <div className="mb-4">
            <p className="text-2xl font-bold">
              {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <span className={product.inStock ? "text-green-600" : "text-red-600"}>
                {product.inStock !== false ? (
                  <span className="flex items-center">
                    <Check className="h-4 w-4 mr-1" />
                    Còn hàng
                  </span>
                ) : (
                  "Hết hàng"
                )}
              </span>
              <span className="text-muted-foreground">|</span>
              <span className="text-muted-foreground">Mã: #{product.id}</span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">{product.description}</p>
          </div>

          <Separator className="my-6" />
          
          {/* Quantity selector */}
          <div className="mb-6">
            <label htmlFor="quantity" className="block text-sm font-medium mb-2">
              Số lượng
            </label>
            <div className="flex items-center">
              <Button
                variant="outline"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                className="h-10 w-20 mx-2 text-center"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={increaseQuantity}
                className="h-10 w-10"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <Button 
              className="w-full h-12" 
              size="lg"
              onClick={handleAddToCart}
              disabled={isLoading || product.inStock === false}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {isLoading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
            </Button>
            <Button 
              variant="outline" 
              className="w-full h-12" 
              size="lg"
              onClick={handleBuyNow}
              disabled={isLoading || product.inStock === false}
            >
              Mua ngay
            </Button>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start space-x-3">
              <RefreshCw className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>Đổi trả miễn phí trong 30 ngày nếu sản phẩm lỗi</p>
            </div>
            <div className="flex items-start space-x-3">
              <Shield className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>Bảo hành chính hãng 24 tháng</p>
            </div>
            <div className="flex items-start space-x-3">
              <CircleHelp className="w-5 h-5 text-primary shrink-0 mt-0.5" />
              <p>Tư vấn trực tiếp: <span className="font-semibold">0123 456 789</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Product details tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0">
          <TabsTrigger value="description" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">
            Mô tả
          </TabsTrigger>
          <TabsTrigger value="specifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">
            Thông số kỹ thuật
          </TabsTrigger>
          <TabsTrigger value="reviews" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary py-3 px-6">
            Đánh giá
          </TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <div className="prose max-w-none">
            <p className="whitespace-pre-line">{product.longDescription || product.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="specifications" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {productSpecifications.map((spec: { name: string; value: string }, index: number) => (
              <div key={index} className="flex border-b pb-2">
                <span className="font-medium w-1/2">{spec.name}:</span>
                <span className="w-1/2">{spec.value}</span>
              </div>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="reviews" className="pt-6">
          <p className="text-muted-foreground">Chưa có đánh giá nào cho sản phẩm này.</p>
        </TabsContent>
      </Tabs>

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Sản phẩm liên quan</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <Card key={relatedProduct.id} className="overflow-hidden">
                <div className="h-64 relative">
                  <Image
                    src={relatedProduct.imageUrl}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold">{relatedProduct.name}</h3>
                      <span className="text-sm font-medium text-muted-foreground">{relatedProduct.brand.name}</span>
                    </div>
                    <p className="text-muted-foreground text-sm line-clamp-2">{relatedProduct.description}</p>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(relatedProduct.price)}</span>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/products/${relatedProduct.id}`}>Chi tiết</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 