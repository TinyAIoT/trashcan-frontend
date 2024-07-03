"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card";

import axios from "axios";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Component() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {

    try {
      const response = await axios.post(
        `http://localhost:${process.env.NEXT_PUBLIC_PORT}/api/v1/auth/login`,
        {
          email,
          password,
        }
      );

      if (response.status === 200) {
        // Login was successful
        // Save the token in local storage for future requests
        localStorage.setItem("authToken", response.data.token);
        // Redirect to the home page
        router.push("/");
      }
    } catch (error: any) {
      // Login failed
      // Show an error message for a few seconds
      console.log(error.response.data.message);
      setErrorMessage(error.response.data.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 2000);
      // Set the focus to the email input field
      document.getElementById("email")?.focus();
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="mx-auto max-w-sm">
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
                placeholder="superadmin@tinyaiot.com"
                required
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                required
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button className="w-full" type="submit" onClick={handleLogin}>
              Login
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
