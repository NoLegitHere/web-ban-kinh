import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Optical Glasses',
    default: 'Optical Glasses',
  },
  description: 'Trang điều khoản sử dụng của Optical Glasses',
};

export default function TermsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-background">
      {children}
    </div>
  );
} 