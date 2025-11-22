import type { Metadata } from "next";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";

export const metadata: Metadata = {
  title: "LearningIsFun - Where Learning Feels Like Playing!",
  description: "Educational platform for 3rd-5th grade students with fun challenges, rewards, and progress tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Navigation />
        {children}
      </body>
    </html>
  );
}
