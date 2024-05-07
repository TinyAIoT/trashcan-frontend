import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Sidebar } from "@/components/sidebar";

export default function Home() {

  const cards = [
    { title: 'Trashcans 1', description: 'Smart trashcans are cool!', content: 'Smart trashcans are super cool!', footer: 'Bye' },
    { title: 'Trashcans 2', description: 'Smart trashcans are cool!', content: 'Smart trashcans are super cool!', footer: 'Bye' },
    { title: 'Trashcans 3', description: 'Smart trashcans are cool!', content: 'Smart trashcans are super cool!', footer: 'Bye' },
  ];

  return (
    <main className="flex min-h-screen flex-col items-left justify-between p-24">
      <Sidebar className="w-[200px]"/>
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        {cards.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle>{card.title}</CardTitle>
              <CardDescription>{card.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>{card.content}</p>
            </CardContent>
            <CardFooter>
              <p>{card.footer}</p>
            </CardFooter>
          </Card>
        ))}
      </div>
    </main>
  );
}
