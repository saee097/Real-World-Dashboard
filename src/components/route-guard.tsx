"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { adminUser, hasRouteAccess } from "@/lib/app-data";

export function RouteGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!hasRouteAccess(adminUser.role, pathname)) {
      router.replace("/dashboard");
    }
  }, [pathname, router]);

  return <>{children}</>;
}
