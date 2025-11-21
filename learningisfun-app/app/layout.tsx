import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "LearningIsFun - Where Learning Feels Like Playing!",
  description: "Educational platform for 3rd-5th grade students with fun challenges, rewards, and progress tracking.",
};

function Navigation() {
  return (
    <nav className="bg-white/90 backdrop-blur-sm shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              LearningIsFun
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/dashboard"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/parent-portal"
              className="text-gray-600 hover:text-purple-600 font-medium transition-colors"
            >
              Parent Portal
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard"
              className="hidden sm:inline-block bg-purple-100 text-purple-600 px-4 py-2 rounded-full font-medium hover:bg-purple-200 transition-colors"
            >
              Log In
            </Link>
            <Link
              href="/pricing"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-full font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Sign Up
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-gray-600 hover:text-purple-600">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

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
