import LoginForm from './login-form';

export const metadata = {
  title: 'Đăng Nhập | Optical Glasses',
  description: 'Đăng nhập vào tài khoản của bạn',
};

export default function LoginPage() {
  return (
    <div className="container mx-auto flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
      <div className="w-full max-w-md space-y-8 p-8 border rounded-lg shadow-lg bg-white">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Đăng Nhập</h1>
          <p className="text-muted-foreground mt-2">
            Đăng nhập để tiếp tục mua sắm
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
} 