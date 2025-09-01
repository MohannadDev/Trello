"use client";

import { ClerkProvider } from "@clerk/nextjs";
import SupabaseProvider from "@/lib/supabase/supabase-provider";

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <SupabaseProvider>
        {children}
      </SupabaseProvider>
    </ClerkProvider>
  );
}