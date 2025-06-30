"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

export function AuthGuard({ 
  children, 
  fallback, 
  redirectTo = '/login' 
}: AuthGuardProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      const currentPath = window.location.pathname;
      const redirectUrl = `${redirectTo}?callbackUrl=${encodeURIComponent(currentPath)}`;
      router.push(redirectUrl);
    }
  }, [status, router, redirectTo]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}