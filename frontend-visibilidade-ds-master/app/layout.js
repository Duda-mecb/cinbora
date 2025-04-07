"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import Header from "@/components/header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = () => {
      try {
        const userEmail = localStorage.getItem("user_email");

        if (!userEmail) {
          router.push("/login");
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };

    if (typeof window !== "undefined") {
      checkAuthentication();

      window.addEventListener("storage", checkAuthentication);

      window.addEventListener("loginStateChange", checkAuthentication);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", checkAuthentication);
        window.removeEventListener("loginStateChange", checkAuthentication);
      }
    };
  }, [router]);

  if (isLoading) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex-1 flex items-center justify-center min-h-screen">
            Carregando...
          </div>
        </body>
      </html>
    );
  }

  if (!isAuthenticated) {
    return (
      <html lang="en">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <div className="flex-1">{children}</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="[--header-height:calc(theme(spacing.14))]">
          <SidebarProvider className="flex flex-col">
            <Header />
            <div className="flex">
              <AppSidebar />
              <div className="flex-1">{children}</div>
            </div>
          </SidebarProvider>
        </div>
      </body>
    </html>
  );
}
