"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card";

function removeLocalData() {
  if (typeof window !== "undefined") {
    localStorage.clear();
  }
}

export default function Component() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  removeLocalData();

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        // Save the token in local storage for future requests
        localStorage.setItem("authToken", response.data.token);
        localStorage.setItem("email", email);
        // Redirect to the home page
        router.push("/");
      }
    } catch (error: any) {
      setErrorMessage(error.response?.data?.message || "An error occurred");
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      // Set the focus to the email input field
      document.getElementById("email")?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    handleLogin(); // Trigger login function explicitly
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      // Simulate a button click by triggering the handleLogin function
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
        <form onSubmit={handleSubmit}>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Login</CardTitle>
            <CardDescription>
              Enter your email and password to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {errorMessage && (
                <div className="p-2 text-red-500 bg-red-100 rounded">
                  {errorMessage}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="Your email address"
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={handleKeyDown} // Add keydown handler
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  placeholder="Your password"
                  required
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={handleKeyDown} // Add keydown handler
                />
              </div>
              <Button
                className="w-full"
                type="button" // Change to type="button" for manual triggering
                onClick={handleLogin} // Explicitly trigger handleLogin on click
              >
                Login
              </Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
