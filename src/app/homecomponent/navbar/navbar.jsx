// components/home/Navbar.tsx

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <header className="w-full px-6 md:px-20 py-4 flex justify-between items-center bg-white/10 border-b border-white/10 sticky top-0 z-50 text-white">
      <h1 className="text-xl font-bold">SpeechFix</h1>
      <nav className="flex items-center gap-6 text-sm">
        <Link href="#/" className="hover:underline">Home</Link>
        <Link href="#" className="hover:underline">Features</Link>
        <Link href="#" className="hover:underline">Pricing</Link>
        <Link href="#" className="hover:underline">About</Link>
        <Link href="#" className="hover:underline">Contact</Link>
        <Link href="#" className="hover:underline">Help</Link>
        <div className="flex items-center">
          <Link href="/login">
            <Button className="border-white text-white hover:bg-white/10 h-9">Login</Button>
          </Link>
        </div>
      </nav>
    </header>
  );
}
