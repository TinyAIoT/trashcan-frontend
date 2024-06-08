"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import { useEffect, useState } from "react";
import { useLocalStorage } from "@uidotdev/usehooks";

const inter = Inter({ subsets: ["latin"] });

// TODO: Where to put metadata?
// export const metadata: Metadata = {
//   title: "TinyAIoT Dashboard",
//   description: "Created by the project seminar \"TinyAIOT\" in summer term 2024.",
// };


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [showNavigation, setShowNavigation] = useState(false);
  const isBrowser = typeof window !== 'undefined';
  const [token, _setToken] = isBrowser ? useLocalStorage("authToken") : [null, () => {}];

  // Enforce login on all pages except the login and signup pages
  useEffect(() => {
    const pathname = window.location.pathname;
    const noAuthPaths = ["/login", "/signup"];
    if (!token && !noAuthPaths.includes(pathname)) {
      window.location.href = '/login'; // Redirect to login page
    }
  }, [token]);

  // Show the navigation bar on all pages except the login and signup pages
  useEffect(() => {
    if (!isBrowser) return;
    
    const noNavigationPaths = ["/login", "/signup"];

    // TODO: This is hacky. Fix later.
    const checkPathname = () => {
      const pathname = window.location.pathname;
      setShowNavigation(!noNavigationPaths.includes(pathname));
    };
    const interval = setInterval(checkPathname, 100);

    return () => clearInterval(interval);
  }, [token, isBrowser]);

  return (
    <html lang="en">
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
        {showNavigation ? <SideNavbar /> : <></>}

        {/* Main page */}
        <div className="p-8 w-full">{children}</div>
      </body>
    </html>
  );
}
