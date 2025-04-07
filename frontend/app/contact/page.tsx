"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { MapPin, Mail, Phone, Clock } from "lucide-react";

export default function ContactPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Mock submit - in a real app this would be an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form
      (e.target as HTMLFormElement).reset();
      
      // Show success message
      toast({
        title: "Gửi thành công",
        description: "Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.",
      });
    } catch (error) {
      toast({
        title: "Gửi thất bại",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Liên hệ với chúng tôi</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium mb-1">Địa chỉ</h3>
                  <p className="text-muted-foreground">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium mb-1">Email</h3>
                  <p className="text-muted-foreground">contact@opticalglasses.vn</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium mb-1">Điện thoại</h3>
                  <p className="text-muted-foreground">+84 123 456 789</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="w-5 h-5 text-primary mt-1 mr-3" />
                <div>
                  <h3 className="font-medium mb-1">Giờ làm việc</h3>
                  <p className="text-muted-foreground">Thứ 2 - Thứ 7: 8:30 - 21:00</p>
                  <p className="text-muted-foreground">Chủ nhật: 10:00 - 18:00</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Hệ thống cửa hàng</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Chi nhánh Quận 1</h3>
                  <p className="text-muted-foreground">123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</p>
                </div>
                <div>
                  <h3 className="font-medium">Chi nhánh Quận 3</h3>
                  <p className="text-muted-foreground">456 Đường Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh</p>
                </div>
                <div>
                  <h3 className="font-medium">Chi nhánh Quận 7</h3>
                  <p className="text-muted-foreground">789 Đường Nguyễn Thị Thập, Quận 7, TP. Hồ Chí Minh</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Gửi tin nhắn cho chúng tôi</CardTitle>
                <CardDescription>
                  Điền thông tin của bạn bên dưới và chúng tôi sẽ liên hệ lại trong thời gian sớm nhất.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Họ và tên</Label>
                    <Input id="name" name="name" required placeholder="Nguyễn Văn A" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" required placeholder="example@mail.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <Input id="phone" name="phone" required placeholder="0912 345 678" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Chủ đề</Label>
                    <Input id="subject" name="subject" required placeholder="Tư vấn sản phẩm" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Nội dung</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      placeholder="Nhập nội dung tin nhắn của bạn tại đây..."
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? "Đang gửi..." : "Gửi tin nhắn"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="rounded-xl overflow-hidden h-[400px] relative">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4241674197356!2d106.6989753!3d10.771886!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f46b159770d%3A0x241f983b4a5bbd53!2zMTIzIMSQLiBMw6ogTOG7o2ksIELhur9uIE5naMOpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1649211393200!5m2!1svi!2s"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
} 