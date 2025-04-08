'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/products';
  
  const { toast } = useToast();
  const { login } = useAuth();
  const { startLoading, stopLoading } = useGlobalLoading();
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password) {
      newErrors.password = "Mật khẩu không được để trống";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    startLoading("Đang đăng nhập...");

    const formData = new FormData(e.currentTarget);
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      stopLoading();
      return;
    }

    setErrors({});
    
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      // Call login function from auth context
      const success = await login(email, password);
      
      if (success) {
        // Show success message
        toast({
          title: "Đăng nhập thành công",
          description: "Bạn đã đăng nhập thành công.",
        });
        
        console.log("Redirecting to:", returnUrl);
        
        // Redirect to returnUrl or default page
        router.push(returnUrl);
      } else {
        toast({
          title: "Đăng nhập thất bại",
          description: "Email hoặc mật khẩu không đúng.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Đăng nhập thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      stopLoading();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <div className="relative">
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="name@example.com" 
            className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
          />
          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Mật khẩu</Label>
          <Link href="/forgot-password" className="text-sm text-primary hover:underline">
            Quên mật khẩu?
          </Link>
        </div>
        <div className="relative">
          <Input 
            id="password" 
            name="password" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className={`pl-10 pr-10 ${errors.password ? "border-red-500" : ""}`}
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <button 
            type="button"
            className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5" />
            ) : (
              <Eye className="h-5 w-5" />
            )}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Đăng nhập"}
      </Button>
      
      <div className="text-center text-sm">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Đăng ký
        </Link>
      </div>
    </form>
  );
} 