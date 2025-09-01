"use client";
import { useSession } from "@clerk/nextjs";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState } from "react";

interface supabaseContext {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
}
const Context = createContext<supabaseContext>({
  supabase: null,
  isLoaded: false
});

export default function SupabaseProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const { session, isLoaded: sessionLoaded } = useSession();
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  
  useEffect(() => {
    if (!sessionLoaded) return;
    
    if (session) {
      const client = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { 
          global: {
            headers: {
              Authorization: `Bearer ${session.getToken()}`
            }
          }
        }
      );
      setSupabase(client);
    }
    setIsLoaded(true);
  }, [session, sessionLoaded]);

  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);
  // Remove the undefined check since we now provide default values
  return context;
};