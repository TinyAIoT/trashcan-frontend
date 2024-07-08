// layout.tsx
"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import { useEffect, useState } from "react";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNavigation, setShowNavigation] = useState(false);
  const [token, setToken] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This effect will run only on the client side, after the component mounts
    const storedToken = localStorage.getItem("authToken"); // Safely access localStorage here
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []); // Empty dependency array ensures this runs once on mount

  // Enforce login on all pages except the login and signup pages
  useEffect(() => {
    if (loading) return;
    // This effect depends on `token`, so it will re-run when `token` changes.
    // Initially, it runs after the token is retrieved from localStorage.
    const pathname = window.location.pathname;
    const noAuthPaths = ["/login", "/signup"];
    if (!token && !noAuthPaths.includes(pathname)) {
      window.location.href = "/login"; // Redirect to login page
    }
    // const SECRET_KEY = process.env.JWT_SECRET_KEY || "";
    // if (token) {
    //   try {
    //     // Validate the token
    //     jwt.verify(token, SECRET_KEY);
    //   } catch (error) {
    //     // If token validation fails, redirect to the login page
    //     localStorage.removeItem("authToken");
    //     window.location.href = "/login";
    //   }
    // }
  }, [token, loading]); // Depend on `token` to re-run this effect when it changes

  // Hide the navigation bar on some subpages
  useEffect(() => {
    const noNavigationPaths = ["/login", "/signup", "/projects"];

    // TODO: This is hacky. Fix later.
    const checkPathname = () => {
      const pathname = window.location.pathname;
      setShowNavigation(!noNavigationPaths.includes(pathname));
    };
    const interval = setInterval(checkPathname, 100);

    return () => clearInterval(interval);
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
        {/* Only show the navigation bar on certain pages */}
        {showNavigation ? (
          <div className="h-screen">
            <SideNavbar />
          </div>
        ) : (
          <></>
        )}

        {/* Main page */}
        <div className="p-8 w-full">{children}</div>
      </body>
    </html>
  );
}
