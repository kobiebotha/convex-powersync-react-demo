import { useAuthToken } from '@convex-dev/auth/react';
import { jwtDecode } from 'jwt-decode';
import React from 'react';

interface ConvexJwtPayload {
  sub: string;
}

export function useUserId(): string | null {
  const token = useAuthToken();

  return React.useMemo(() => {
    if (!token) return null;
    try {
      const decoded = jwtDecode<ConvexJwtPayload>(token);
      return decoded.sub;
    } catch {
      return null;
    }
  }, [token]);
}
