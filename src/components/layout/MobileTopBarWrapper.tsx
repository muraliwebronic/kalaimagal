"use client";

import { usePathname } from "next/navigation";

export function MobileTopBarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/register") ||
    pathname.startsWith("/forgot") ||
    pathname.startsWith("/reset") ||
    pathname.startsWith("/verify") ||
    pathname.startsWith("/admin")
  ) {
    return null;
  }

  return <>{children}</>;
}
