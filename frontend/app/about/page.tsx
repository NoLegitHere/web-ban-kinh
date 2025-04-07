import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Về Optical Glasses</h1>
        
        <div className="relative h-96 mb-12 rounded-xl overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1576749872435-ff81455a9e6d?q=80&w=1920&auto=format&fit=crop"
            alt="Optical Glasses Store"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            <div className="text-white text-center px-4">
              <h2 className="text-3xl font-bold mb-2">Đam mê và chất lượng</h2>
              <p className="text-lg">Cung cấp sản phẩm kính mắt cao cấp từ năm 2010</p>
            </div>
          </div>
        </div>

        <div className="prose max-w-none mb-12">
          <h2 className="text-2xl font-semibold mb-4">Câu chuyện của chúng tôi</h2>
          <p className="mb-4">
            Optical Glasses được thành lập vào năm 2010 với niềm đam mê mang đến những sản phẩm kính mắt chất lượng cao cho người tiêu dùng Việt Nam. Từ một cửa hàng nhỏ tại Thành phố Hồ Chí Minh, chúng tôi đã không ngừng phát triển và mở rộng quy mô để trở thành một trong những thương hiệu kính mắt uy tín nhất trên thị trường.
          </p>
          <p className="mb-4">
            Với phương châm "Chất lượng là danh dự", chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu. Mỗi sản phẩm kính mắt tại Optical Glasses đều được lựa chọn kỹ lưỡng từ các thương hiệu nổi tiếng thế giới hoặc được thiết kế riêng bởi đội ngũ chuyên gia với nhiều năm kinh nghiệm trong ngành.
          </p>
          <p>
            Chúng tôi tin rằng một chiếc kính tốt không chỉ giúp bạn nhìn rõ hơn mà còn là phụ kiện thời trang thể hiện phong cách cá nhân. Vì vậy, tại Optical Glasses, bạn sẽ tìm thấy đa dạng mẫu mã, kiểu dáng và màu sắc phù hợp với mọi nhu cầu và sở thích.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Cam kết chất lượng</h3>
              <p className="text-muted-foreground">Tất cả sản phẩm đều được bảo hành chính hãng, đảm bảo nguồn gốc xuất xứ rõ ràng.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Đội ngũ chuyên nghiệp</h3>
              <p className="text-muted-foreground">Nhân viên được đào tạo chuyên sâu về kỹ thuật và thời trang, sẵn sàng tư vấn tận tâm.</p>
            </CardContent>
          </Card>
          
          <Card className="text-center p-6">
            <CardContent className="pt-6">
              <div className="mb-4 mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path><path d="M22 12A10 10 0 0 0 12 2v10z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Đa dạng sản phẩm</h3>
              <p className="text-muted-foreground">Từ kính thời trang đến kính chuyên dụng, chúng tôi có đầy đủ các dòng sản phẩm đáp ứng mọi nhu cầu.</p>
            </CardContent>
          </Card>
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 text-center">Đội ngũ lãnh đạo</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Nguyễn Văn An",
                position: "Nhà sáng lập & CEO",
                image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop"
              },
              {
                name: "Trần Thị Bình",
                position: "Giám đốc thiết kế",
                image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop"
              },
              {
                name: "Lê Minh Cường",
                position: "Giám đốc vận hành",
                image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=400&auto=format&fit=crop"
              }
            ].map((member, index) => (
              <div key={index} className="text-center">
                <div className="mb-4 relative w-40 h-40 mx-auto rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                <p className="text-muted-foreground">{member.position}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-6 text-center">Thương hiệu hợp tác</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {["Ray-Ban", "Gucci", "Oakley", "Prada", "Dior"].map((brand, index) => (
              <div key={index} className="text-xl md:text-2xl font-bold text-muted-foreground">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 