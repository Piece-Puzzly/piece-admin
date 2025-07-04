"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function LogoButton() {
  return (
    <Button
      variant="ghost"
      className="h-12 md:h-16 -mx-4"
      onClick={() => location.reload()}
    >
      <Image
        src={"/logo1.png"}
        height={500}
        width={500}
        className="w-auto h-8 md:h-10"
        alt="Piece"
      />
    </Button>
  );
}
