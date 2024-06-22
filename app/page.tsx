"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to /projects
    router.push('/projects');
  }, [router]); // Dependency array to ensure effect runs once

  // The component's return statement can be omitted or kept minimal
  // since we are redirecting immediately
  return null;
}
