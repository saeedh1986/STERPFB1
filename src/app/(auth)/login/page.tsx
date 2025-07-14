
import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <Image src="https://s3eed.ae/wp-content/uploads/2025/04/logo13.png" alt="Saeed Store Logo" width={120} height={120} />
          </div>
          <CardTitle className="font-headline text-3xl">Saeed Store ERP Lite</CardTitle>
          <CardDescription>Please login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
