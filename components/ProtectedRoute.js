"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import useAuth from "@/hooks/useAuth"; // Adjust the import path as necessary

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login"); // Redirect to login page if not authenticated
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null; // Return null or a loading spinner while checking authentication
  }

  return children;
};

export default ProtectedRoute;
