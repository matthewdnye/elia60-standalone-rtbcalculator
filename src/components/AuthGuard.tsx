import React from 'react';

// Bypass authentication for development
export function AuthGuard({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}