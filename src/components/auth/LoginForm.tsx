
"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { getMockData, type GenericItem } from '@/lib/data';

export function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<GenericItem[]>([]);
  const { login } = useAuth();
  const { toast } = useToast();
  const { t } = useLanguage();

  useEffect(() => {
    let storedUsers = JSON.parse(localStorage.getItem('erp-data-users') || '[]');
    if (storedUsers.length === 0) {
      storedUsers = getMockData('users');
      localStorage.setItem('erp-data-users', JSON.stringify(storedUsers));
    }
    setUsers(storedUsers);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Mock authentication by checking localStorage
    const foundUser = users.find(u => u.username === username && u.password === password);

    if (foundUser) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      login(foundUser.username);
      toast({
        title: t('login.success_title'),
        description: t('login.success_desc', { username: foundUser.username }),
      });
    } else {
      toast({
        title: t('login.failed_title'),
        description: t('login.failed_desc'),
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">{t('login.username')}</Label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="admin"
          required
          autoComplete="username"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">{t('login.password')}</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="password"
          required
          autoComplete="current-password"
        />
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
        {t('login.button')}
      </Button>
    </form>
  );
}

    
