"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

const ProductFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";
  const currentSort = searchParams.get("sort") || "newest";
  const currentSearch = searchParams.get("search") || "";
  const currentBrand = searchParams.get("brand") || "";
  
  // Price range state
  const minPriceParam = searchParams.get("minPrice");
  const maxPriceParam = searchParams.get("maxPrice");
  const [priceRange, setPriceRange] = useState<[number, number]>([
    minPriceParam && !isNaN(Number(minPriceParam)) ? parseInt(minPriceParam) / 70000 : 0,
    maxPriceParam && !isNaN(Number(maxPriceParam)) ? parseInt(maxPriceParam) / 70000 : 100,
  ]);
  
  // Available brands
  const brands = [
    "Ray-Ban",
    "Gucci",
    "Oakley",
    "Prada",
    "Versace",
    "Burberry",
    "Persol",
  ];

  // Create URL with new parameters
  const createQueryString = (
    name: string,
    value: string
  ) => {
    const params = new URLSearchParams(searchParams.toString());
    
    // Update the specified parameter
    if (value && value !== "newest" && value !== "") {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    
    // Add timestamp to ensure cache busting
    params.set("_t", Date.now().toString());
    
    return params.toString();
  };

  // Handle category selection
  const handleCategoryChange = (category: string) => {
    const queryString = createQueryString("category", category);
    
    // Use replace and force a full replacement rather than shallow routing
    // This ensures that the server component will refetch with new params
    router.push(`/products?${queryString}`, { 
      scroll: false 
    });
  };

  // Handle brand selection
  const handleBrandChange = (brand: string) => {
    const queryString = createQueryString("brand", brand);
    
    router.push(`/products?${queryString}`, {
      scroll: false
    });
  };

  // Handle price range change - update local state only 
  const handlePriceRangeChange = (value: [number, number]) => {
    setPriceRange(value);
  };

  // Handle price filter apply - this actually updates the URL
  const applyPriceFilter = (value: [number, number]) => {
    // Convert slider values to actual prices
    const minPrice = Math.round(value[0] * 70000);
    const maxPrice = Math.round(value[1] * 70000);
    
    // Create new URL params
    const params = new URLSearchParams(searchParams.toString());
    
    // Set min and max price params
    if (minPrice > 0) {
      params.set("minPrice", minPrice.toString());
    } else {
      params.delete("minPrice");
    }
    
    if (maxPrice < 7000000) {
      params.set("maxPrice", maxPrice.toString());
    } else {
      params.delete("maxPrice");
    }
    
    // Add timestamp for cache busting
    params.set("_t", Date.now().toString());
    
    const queryString = params.toString();
    
    router.push(`/products?${queryString}`, {
      scroll: false
    });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    const queryString = createQueryString("sort", sort);
    
    // Use replace and force a full replacement rather than shallow routing
    router.push(`/products?${queryString}`, {
      scroll: false
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get("search") as string;
    const queryString = createQueryString("search", search);
    
    // Use replace and force a full replacement rather than shallow routing 
    router.push(`/products?${queryString}`, {
      scroll: false
    });
  };

  // Format currency 
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND',
      maximumFractionDigits: 0
    }).format(value * 70000);
  };

  // Reset all filters
  const resetAllFilters = () => {
    // Reset price range state to default values
    setPriceRange([0, 100]);
    
    // Clear all URL parameters and navigate to base products page
    router.push("/products", { scroll: false });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-3">Tìm kiếm</h3>
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            name="search"
            placeholder="Tìm kiếm sản phẩm..."
            defaultValue={currentSearch}
          />
          <Button type="submit" size="sm">Tìm</Button>
        </form>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-3">Sắp xếp</h3>
        <Select value={currentSort} onValueChange={handleSortChange}>
          <SelectTrigger>
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Mới nhất</SelectItem>
            <SelectItem value="price-asc">Giá: Thấp đến cao</SelectItem>
            <SelectItem value="price-desc">Giá: Cao đến thấp</SelectItem>
            <SelectItem value="name-asc">Tên: A-Z</SelectItem>
            <SelectItem value="name-desc">Tên: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Accordion type="multiple" defaultValue={["category", "brand", "price"]} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger className="text-lg font-semibold">Danh mục</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-1">
              {[
                { id: "", label: "Tất cả" },
                { id: "men", label: "Kính nam" },
                { id: "women", label: "Kính nữ" },
                { id: "sunglasses", label: "Kính râm" },
                { id: "premium", label: "Kính cao cấp" },
              ].map((category) => (
                <div
                  key={category.id}
                  className={cn(
                    "flex items-center cursor-pointer hover:text-primary py-1",
                    currentCategory === category.id && "font-medium text-primary"
                  )}
                  onClick={() => handleCategoryChange(category.id)}
                >
                  {category.label}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="brand">
          <AccordionTrigger className="text-lg font-semibold">Thương hiệu</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 pl-1">
              <div
                className={cn(
                  "flex items-center cursor-pointer hover:text-primary py-1",
                  currentBrand === "" && "font-medium text-primary"
                )}
                onClick={() => handleBrandChange("")}
              >
                Tất cả
              </div>
              {brands.map((brand) => (
                <div
                  key={brand}
                  className={cn(
                    "flex items-center cursor-pointer hover:text-primary py-1",
                    currentBrand === brand && "font-medium text-primary"
                  )}
                  onClick={() => handleBrandChange(brand)}
                >
                  {brand}
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-semibold">Giá</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider 
                value={priceRange} 
                max={100} 
                step={1} 
                minStepsBetweenThumbs={5}
                onValueChange={handlePriceRangeChange}
                onValueCommit={applyPriceFilter}
              />
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span>{formatCurrency(priceRange[0])}</span>
                </div>
                <div className="text-sm">
                  <span>{formatCurrency(priceRange[1])}</span>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="outline"
        className="w-full"
        onClick={resetAllFilters}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default ProductFilter; 