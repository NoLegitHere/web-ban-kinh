'use client';

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { authAPI } from "@/lib/api";
import { useGlobalLoading } from "@/hooks/useGlobalLoading";

export default function RegisterForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { startLoading, stopLoading } = useGlobalLoading();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const terms = formData.get("terms");

    if (!name || name.trim().length < 2) {
      newErrors.name = "Tên phải có ít nhất 2 ký tự";
    }

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!password || password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    if (!terms) {
      newErrors.terms = "Bạn phải đồng ý với điều khoản sử dụng";
    }

    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    startLoading("Đang đăng ký...");

    const formData = new FormData(e.currentTarget);
    const validationErrors = validateForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false);
      stopLoading();
      return;
    }

    setErrors({});
    
    const userData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    try {
      // Call API to register
      await authAPI.register(userData);
      
      // Show success message
      toast({
        title: "Đăng ký thành công",
        description: "Tài khoản của bạn đã được tạo. Vui lòng đăng nhập.",
      });
      
      // Redirect to login page
      router.push("/login");
    } catch (error) {
      toast({
        title: "Đăng ký thất bại",
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
        <Label htmlFor="name">Họ và tên</Label>
        <div className="relative">
          <Input 
            id="name" 
            name="name" 
            type="text" 
            placeholder="Nguyễn Văn A" 
            className={`pl-10 ${errors.name ? "border-red-500" : ""}`}
          />
          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
      </div>

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
        <Label htmlFor="password">Mật khẩu</Label>
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Xác nhận mật khẩu</Label>
        <div className="relative">
          <Input 
            id="confirmPassword" 
            name="confirmPassword" 
            type={showPassword ? "text" : "password"} 
            placeholder="••••••••" 
            className={`pl-10 ${errors.confirmPassword ? "border-red-500" : ""}`}
          />
          <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword}</p>}
      </div>

      <div className="flex items-start space-x-2 pt-2">
        <Checkbox id="terms" name="terms" />
        <div className="grid gap-1.5 leading-none">
          <label
            htmlFor="terms"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Tôi đồng ý với <Link href="/terms" className="text-primary font-semibold hover:underline">điều khoản sử dụng</Link>
          </label>
          {errors.terms && <p className="text-sm text-red-500">{errors.terms}</p>}
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Đăng ký"}
      </Button>
      
      <div className="text-center text-sm">
        Đã có tài khoản?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
} 