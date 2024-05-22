"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "../lib/utils";
import SideNavbar from "@/components/SideNavbar";
import { useEffect, useState } from "react";
import { isLoginPage } from "@/lib/utils";

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

  useEffect(() => {
    // Check if window is defined (client side)
    if (typeof window !== "undefined") {
      // Get the current pathname when the component mounts
      const pathname = window.location.pathname;

      // Check if the current page is "/login"
      setCurrentPageIsLogin(!isLoginPage(pathname));
    }
  }, []);

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
