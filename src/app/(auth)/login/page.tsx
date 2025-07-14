
"use client";

import { LoginForm } from '@/components/auth/LoginForm';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Image from 'next/image';
import { useCompanyProfile } from '@/context/CompanyProfileContext';

export default function LoginPage() {
  const { profile } = useCompanyProfile();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            {profile.logo && <Image src={profile.logo} alt="Company Logo" width={120} height={120} className="object-contain" />}
          </div>
          <CardTitle className="font-headline text-3xl">{profile.name}</CardTitle>
          <CardDescription>Please login to access your dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
        </CardContent>
      </Card>
    </div>
  );
}
