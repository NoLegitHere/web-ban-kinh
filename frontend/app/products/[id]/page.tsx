import { Suspense } from "react";
import { notFound } from "next/navigation";
import { productAPI } from "@/lib/api";
import ProductDetailClient from "./product-detail-client";
import { Loader2 } from "lucide-react";

// Server component with data fetching
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  
  // If product not found, render 404
  if (!product) {
    notFound();
  }
  
  // Get related products from the same category
  const relatedProducts = await getRelatedProducts(product.category, product.id);
  
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải sản phẩm...</span>
        </div>
      }
    >
      <ProductDetailClient product={product} relatedProducts={relatedProducts} />
    </Suspense>
  );
}

// Server-side data fetching functions
async function getProduct(id: string) {
  try {
    const product = await productAPI.getById(id);
    if (!product) {
      return null;
    }
    return product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

async function getRelatedProducts(category: string, currentProductId: string) {
  try {
    // Get products in the same category using the new filtering system
    const products = await productAPI.getAll({ 
      category,
      sort: 'newest' // Match the frontend's sort parameter naming
    });
    
    // Filter out the current product and limit to 4 related products
    return products
      .filter(product => product.id.toString() !== currentProductId)
      .slice(0, 4);
  } catch (error) {
    console.error("Failed to fetch related products:", error);
    return [];
  }
} 