import Link from "next/link";
import { Facebook, Instagram, Youtube, MapPin, Mail, PhoneCall } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Optical Glasses</h3>
            <p className="mb-4 text-muted-foreground">
              Cửa hàng kính mắt cao cấp với nhiều mẫu mã đa dạng cho mọi nhu cầu.
            </p>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-muted-foreground hover:text-foreground">
                <Facebook size={20} />
              </Link>
              <Link href="https://instagram.com" className="text-muted-foreground hover:text-foreground">
                <Instagram size={20} />
              </Link>
              <Link href="https://youtube.com" className="text-muted-foreground hover:text-foreground">
                <Youtube size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên kết nhanh</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-foreground">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-foreground">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Danh mục</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                <Link href="/products?category=men" className="hover:text-foreground">
                  Kính nam
                </Link>
              </li>
              <li>
                <Link href="/products?category=women" className="hover:text-foreground">
                  Kính nữ
                </Link>
              </li>
              <li>
                <Link href="/products?category=sunglasses" className="hover:text-foreground">
                  Kính râm
                </Link>
              </li>
              <li>
                <Link href="/products?category=premium" className="hover:text-foreground">
                  Kính cao cấp
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="mb-4 text-lg font-semibold">Liên hệ</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="shrink-0 mt-1" />
                <span>123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <PhoneCall size={20} className="shrink-0" />
                <span>+84 123 456 789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="shrink-0" />
                <span>contact@opticalglasses.vn</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Optical Glasses. Tất cả các quyền được bảo lưu.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 