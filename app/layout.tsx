// layout.tsx
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import { useEffect, useState } from "react";

const inter = Inter({ subsets: ["latin"] });

type HistoryStateArguments = [data: any, unused: string, url?: string | URL | null | undefined];

// Override pushState and replaceState methods, as they otherwise don't trigger events 
// when only navigating within the app instead of reloading the page
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

  // Enforce login on all pages except the login page
  useEffect(() => {
    if (loading) return;
    // This effect depends on `token`, so it will re-run when `token` changes.
    // Initially, it runs after the token is retrieved from localStorage.
    const pathname = window.location.pathname;
    const noAuthPaths = ["/login"];
    if (!token && !noAuthPaths.includes(pathname)) {
      window.location.href = "/login"; // Redirect to login page
    }
  }, [token, loading]); // Depend on `token` to re-run this effect when it changes

  // Hide the navigation bar on some subpages
  useEffect(() => {
    const noNavigationPaths = ["/login", "/projects"];

    const handlePathChange = () => {
      const pathname = window.location.pathname;
      setShowNavigation(!noNavigationPaths.includes(pathname));
    };

    handlePathChange(); // Call initially to set the correct state
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
        {showNavigation && (
          <div className="h-screen">
            <SideNavbar />
          </div>
        )}
        {/* Main page */}
        <div className="p-8 w-full">{children}</div>
      </body>
    </html>
  );
}
