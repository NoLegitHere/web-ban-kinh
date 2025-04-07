"use client";

import React from "react";
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
    console.log("Category changed to:", category, "Query:", queryString);
    
    // Use replace and force a full replacement rather than shallow routing
    // This ensures that the server component will refetch with new params
    router.push(`/products?${queryString}`, { 
      scroll: false 
    });
  };

  // Handle sort change
  const handleSortChange = (sort: string) => {
    const queryString = createQueryString("sort", sort);
    console.log("Sort changed to:", sort, "Query:", queryString);
    
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
    console.log("Search for:", search, "Query:", queryString);
    
    // Use replace and force a full replacement rather than shallow routing 
    router.push(`/products?${queryString}`, {
      scroll: false
    });
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

      <Accordion type="single" collapsible className="w-full">
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
              {[
                "Ray-Ban",
                "Gucci",
                "Oakley",
                "Prada",
                "Versace",
                "Titanium",
                "Polaroid",
              ].map((brand) => (
                <div key={brand} className="flex items-center space-x-2 py-1">
                  <Checkbox id={`brand-${brand}`} />
                  <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
                    {brand}
                  </Label>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger className="text-lg font-semibold">Giá</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 pt-2">
              <Slider defaultValue={[0, 50]} max={100} step={1} />
              <div className="flex items-center justify-between">
                <div className="text-sm">
                  <span>1.000.000₫</span>
                </div>
                <div className="text-sm">
                  <span>7.000.000₫</span>
                </div>
              </div>
              <Button className="w-full" size="sm" variant="outline">
                Áp dụng
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Button
        variant="outline"
        className="w-full"
        onClick={() => router.push("/products")}
      >
        Xóa bộ lọc
      </Button>
    </div>
  );
};

export default ProductFilter; 