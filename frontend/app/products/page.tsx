import { Suspense } from "react";
import ProductsClient from "./products-client";
import { Loader2 } from "lucide-react";

// This is a Server Component
export default function ProductsPage({
  searchParams,
}: {
  searchParams: {
    category?: string;
    sort?: string;
    search?: string;
  };
}) {
  // Create a sanitized version of searchParams with only the properties we need
  const sanitizedParams = {
    category: searchParams.category || undefined,
    sort: searchParams.sort || undefined,
    search: searchParams.search || undefined
  };

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