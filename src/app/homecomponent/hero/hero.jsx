// components/home/HeroSection.tsx

import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    // <section className="px-6 md:px-20 py-20 flex flex-col md:flex-row items-center justify-between gap-10 text-white">
    //   <div className="flex flex-col gap-4 max-w-xl text-right">
    //     <h1 className="text-4xl md:text-5xl font-bold">
    //       Your AI Assistant for Better Speech Clarity
    //     </h1>
    //     <p className="text-lg text-white/80">
    //       Fix audio, enhance speech, and get clear transcriptions in seconds.
    //     </p>
    //     <div className="flex gap-4 justify-end mt-4">
    //       <Link href="#demo">
    //         <Button className="border-white hover:bg-white/10">Try the Demo</Button>
    //       </Link>
    //       <Link href="/signup">
    //         <Button className="border-white hover:bg-white/10">Get Started</Button>
    //       </Link>
    //     </div>
    //   </div>
    //   <div className="w-full md:w-[800px] h-[400px] relative">
    //     <Image src="/home/hero3.jpeg" alt="AI face illustration" fill className="object-contain" />
    //   </div>
    // </section>
    <section className="px-6 md:px-20 py-40 flex flex-col items-center justify-center text-center text-white">
      <div className="flex flex-col gap-4 max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold">
          Your AI Assistant for Better Speech Clarity
        </h1>
        <p className="text-lg text-white/80">
          Fix audio, enhance speech, and get clear transcriptions in seconds.
        </p>
        <div className="flex gap-4 justify-center mt-6">
          <Link href="#demo">
            <Button className="border-white hover:bg-white/10">Try the Demo</Button>
          </Link>
          <Link href="/signup">
            <Button className="border-white hover:bg-white/10">Get Started</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
