"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { cartAPI, productAPI } from "@/lib/api";
import { useToast } from "@/components/ui/use-toast";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
};

interface CartContextType {
  items: CartItem[];
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isLoading: boolean;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Calculate derived values
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);

  // Load cart data from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (error) {
        console.error("Failed to parse cart data:", error);
        localStorage.removeItem("cart");
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem("cart", JSON.stringify(items));
    } else {
      localStorage.removeItem("cart");
    }
  }, [items]);

  const addToCart = async (productId: string, quantity = 1) => {
    setIsLoading(true);
    try {
      // Get product details
      const product = await productAPI.getById(productId);
      
      // Check if product is already in cart
      const existingItem = items.find((item) => item.id === productId);
      
      if (existingItem) {
        // Update quantity if already in cart
        updateQuantity(productId, existingItem.quantity + quantity);
      } else {
        // Add new item to cart
        setItems([
          ...items,
          {
            id: productId,
            name: product.name,
            price: product.price,
            quantity,
            imageUrl: product.imageUrl,
          },
        ]);
      }
      
      toast({
        title: "Đã thêm vào giỏ hàng",
        description: `${quantity} x ${product.name}`,
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Thêm vào giỏ hàng thất bại",
        description: "Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromCart = (productId: string) => {
    setItems(items.filter((item) => item.id !== productId));
    toast({
      title: "Đã xóa sản phẩm",
      description: "Sản phẩm đã được xóa khỏi giỏ hàng.",
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setItems(
      items.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("cart");
    toast({
      title: "Đã xóa giỏ hàng",
      description: "Giỏ hàng đã được xóa.",
    });
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isLoading,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default useCart; 