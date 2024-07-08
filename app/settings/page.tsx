"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import PageTitle from '@/components/PageTitle';
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { CardContent, Card, CardHeader } from "@/components/ui/card";
// import { Sun, Moon } from "lucide-react";
// import { useTheme } from "next-themes";  // https://github.com/pacocoursey/next-themes

export default function Component() {
  // const [language, setLanguage] = useState('de');
  // const [theme, setTheme] = useState('light');

  const handleLogout = () => {
    window.location.href = '/login';      // Redirect to the login page (where the authToken is cleared)
  }

  // TODO: Make it more robust by fetching the email by API, not storing it in local storage
  const getEmail = (): string => {
    if (typeof window !== 'undefined') {
      const email = localStorage.getItem('email'); // Safe to use localStorage here
      if (email) return email;
    }
    return 'Email not found';
  };

  return (
    <div>
      <div className="px-4 space-y-6 sm:px-6">
        <PageTitle title={getEmail()} />
        <Button onClick={handleLogout} variant="destructive" className="w-[150px]">
          Logout
        </Button>
        <p className='text-sm text-gray-500 text-center select-none'>Language and theme settings coming soon!</p>
        {/* <Card>
          <CardHeader>
            <div>
              <h2>Language</h2>
              <p>Choose your preferred language</p>
            </div>
          </CardHeader>
          <CardContent>
            // Comment: Radio button style: https://tailwindcomponents.com/component/radio-buttons-1
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
        </Card> */}
        {/* <Card>
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
        </Card> */}
      </div>
    </div>
  );
}
