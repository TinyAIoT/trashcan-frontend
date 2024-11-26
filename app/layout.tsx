"use client";

import { Inter } from "next/font/google";
import { TranslationProvider } from "../lib/TranslationContext";
import "../app/globals.css"
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type HistoryStateArguments = [data: any, unused: string, url?: string | URL | null | undefined];

const overrideHistoryMethods = () => {
  const pushState = history.pushState;
  history.pushState = function (...args: HistoryStateArguments) {
    const result = pushState.apply(this, args);
    window.dispatchEvent(new Event("pushstate"));
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  const replaceState = history.replaceState;
  history.replaceState = function (...args: HistoryStateArguments) {
    const result = replaceState.apply(this, args);
    window.dispatchEvent(new Event("replacestate"));
    window.dispatchEvent(new Event("locationchange"));
    return result;
  };

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("locationchange"));
  });
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNavigation, setShowNavigation] = useState(false);
  const [token, setToken] = useState<string>("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    overrideHistoryMethods();
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (loading) return;
    const pathname = window.location.pathname;
    const noAuthPaths = ["/login"];
    if (!token && !noAuthPaths.includes(pathname)) {
      window.location.href = "/login";
    }
  }, [token, loading]);

  useEffect(() => {
    const noNavigationPaths = ["/login", "/projects"];

    const handlePathChange = () => {
      const pathname = window.location.pathname;
      setShowNavigation(!noNavigationPaths.includes(pathname));
    };

    handlePathChange();
    window.addEventListener("locationchange", handlePathChange);

    return () => {
      window.removeEventListener("locationchange", handlePathChange);
    };
  }, []);

  return (
    <html lang="en">
      <head>
        <title>TinyAIoT Dashboard</title>
      </head>
      <body
        className={cn(
          "min-h-screen w-full bg-white text-black flex ",
          inter.className,
          {
            "debug-screens": process.env.NODE_ENV === "development",
          }
        )}
      >
        <TranslationProvider>
          {/* Language Switcher in the Header */}
          <header className="flex justify-end p-4 bg-gray-100">
            <LanguageSwitcher />
          </header>
          {showNavigation && (
            <div className="h-screen">
              <SideNavbar />
            </div>
          )}
          <main className="p-8 w-full">{children}</main>
        </TranslationProvider>
      </body>
    </html>
  );
}
