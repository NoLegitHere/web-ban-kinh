import { Suspense } from "react";
import ProductsClient from "./products-client";
import { Loader2 } from "lucide-react";

interface SearchParams {
  category?: string;
  sort?: string;
  search?: string;
  brand?: string;
  minPrice?: string;
  maxPrice?: string;
  _t?: string;
}

// This is a Server Component
export default function ProductsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Convert searchParams to a plain object to avoid passing non-serializable objects to client
  const sanitizedParams: Record<string, string> = {};
  
  // Manually copy each property to ensure only plain values are passed
  if (searchParams.category) sanitizedParams.category = String(searchParams.category);
  if (searchParams.sort) sanitizedParams.sort = String(searchParams.sort);
  if (searchParams.search) sanitizedParams.search = String(searchParams.search);
  if (searchParams.brand) sanitizedParams.brand = String(searchParams.brand);
  if (searchParams.minPrice) sanitizedParams.minPrice = String(searchParams.minPrice);
  if (searchParams.maxPrice) sanitizedParams.maxPrice = String(searchParams.maxPrice);

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Đang tải sản phẩm...</span>
        </div>
      }
    >
      <ProductsClient searchParams={sanitizedParams} />
    </Suspense>
  );
} 