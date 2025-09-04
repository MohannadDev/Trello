import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ClientProviders from "@/lib/providers/client-providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  title: "Trello Clone - Task Management & Productivity",
  description: "A powerful Trello-inspired task management application built with Next.js, TypeScript, Supabase and Clerk",
  keywords: ["task management", "productivity", "Trello", "kanban", "project management", "team collaboration"],
  authors: [{ name: "Mohannad eldardeery" }],
  creator: "Mohannad eldardeery",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://trello-clone.com",
    title: "Trello Clone - Task Management & Productivity",
    description: "A powerful Trello-inspired task management application built with Next.js, TypeScript, Supabase and Clerk",
    siteName: "Trello Clone"
  },
  twitter: {
    card: "summary_large_image",
    title: "Trello Clone - Task Management & Productivity",
    description: "A powerful Trello-inspired task management application built with Next.js, TypeScript, Supabase and Clerk",
    creator: "@mohannad"
  },
  robots: {
    index: true,
    follow: true
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
