import RegisterForm from './register-form';

export const metadata = {
  title: 'Đăng Ký | Optical Glasses',
  description: 'Đăng ký tài khoản mới',
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-lg bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng Ký Tài Khoản</h1>
          <p className="text-muted-foreground mt-2">
            Tạo tài khoản mới để bắt đầu mua sắm
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
} 