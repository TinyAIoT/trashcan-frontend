"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent, Card, CardHeader } from "@/components/ui/card";
import {
  Sun,
  Moon,
} from "lucide-react";
// import { useTheme } from "next-themes";  // https://github.com/pacocoursey/next-themes


export default function Component() {
  const [language, setLanguage] = useState('de');
  const [theme, setTheme] = useState('light');

  const handleLogout = () => {
    localStorage.setItem("authToken", "");  // Clear the token
    window.location.href = '/login';  // Redirect to the login page
  }

  return (
    <div>
      <div className="px-4 space-y-6 sm:px-6">
        <header className="space-y-2">
          <div className="flex items-center space-x-3">
            <img
              alt="Avatar"
              className="rounded-full"
              height="96"
              src="/stadtlogo-muenster.png"
              style={{
                aspectRatio: "96/96",
                objectFit: "cover",
              }}
              width="96"
            />
            <div className="space-y-1">
              <h1 className="text-2xl font-bold">Münster</h1>
              <Button size="sm">Change photo</Button>
            </div>
          </div>
        </header>
        <div className="space-y-8">
        <div className="pt-6" onClick={handleLogout}>
          <Button>Logout</Button>
        </div>
          <Card>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input defaultValue="Münster" id="name" placeholder="Münster" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="E.g. jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label>What best in your city?</Label>
                <Textarea
                  className="mt-1"
                  id="bio"
                  placeholder="Some fun fact"
                  style={{
                    minHeight: "100px",
                  }}
                />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <div>
                <h2>Language</h2>
                <p>Choose your preferred language</p>
              </div>
            </CardHeader>
            <CardContent>
              {/* Radio button style: https://tailwindcomponents.com/component/radio-buttons-1 */}
              <div className="grid w-[20rem] grid-cols-2 gap-2 rounded-xl bg-gray-200 p-2">
                <div>
                    <input type="radio" name="option" id="de" value="de" className="peer hidden" checked={language === 'de'} onChange={() => setLanguage('de')} />
                    <label htmlFor="de" className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">DE</label>
                </div>
                <div>
                    <input type="radio" name="option" id="en" value="en" className="peer hidden" checked={language === 'en'} onChange={() => setLanguage('en')} />
                    <label htmlFor="en" className="block cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">EN</label>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
          <CardHeader>
            <div>
              <h2>Theme</h2>
              <p>Choose your preferred theme</p>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid w-[10rem] grid-cols-2 gap-2 rounded-xl bg-gray-200 p-2">
              <div>
                <input type="radio" name="theme" id="light" value="light" className="peer hidden" checked={theme === 'light'} onChange={() => setTheme('light')} />
                <label htmlFor="light" className="block flex items-center justify-center cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
                  <Sun />
                </label>
              </div>
              <div>
                <input type="radio" name="theme" id="dark" value="dark" className="peer hidden" checked={theme === 'dark'} onChange={() => setTheme('dark')} />
                <label htmlFor="dark" className="block flex items-center justify-center cursor-pointer select-none rounded-xl p-2 text-center peer-checked:bg-blue-500 peer-checked:font-bold peer-checked:text-white">
                  <Moon />
                </label>
              </div>
            </div>
          </CardContent>
        </Card>
          <Card>
            <CardHeader>
              <div>Change Password</div>
              <div>
                For your security, please do not share your password with
                others.
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="pt-6">
          <Button>Save</Button>
        </div>
      </div>
    </div>
  );
}
