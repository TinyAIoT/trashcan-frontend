"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import { useEffect, useState } from "react";
// import useAuthPaths from "@/hooks";


import { useRouter } from 'next/router';
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
  const [currentPageIsLogin, setCurrentPageIsLogin] = useState(false);
  const router = useRouter();
  const [token, _setToken] = useLocalStorage("authToken");

  // Check if window is defined (client side)
  if (typeof window !== "undefined") {

    // Paths which do not require authentication
    const nonAuthenticatedPaths = ['/login', '/signup'];
  
    useEffect(() => {
      // We are not authenticated, but try to access an authenticated route
      if (!token && !nonAuthenticatedPaths.includes(router.pathname)) {
        // Redirect user to login page
        router.push('/login');
      }
    }, [token, router]); // Add dependencies here
  }

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
        {/* sidebar */}

        {/* <p className="border">Sidebar</p> */}
        {currentPageIsLogin ? <SideNavbar /> : <></>}


        {/* main page */}
        <div className="p-8 w-full">{children}</div>
      </body>
    </html>
  );
}
