"use client";
import { Button } from "@/components/ui/button";
import { useMount } from "@/hooks/use-mount";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useMediaQuery } from "../hooks/use-media-query";

export default function LogoButton() {
  const isMount = useMount();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (!isMount) return null;
  return (
    <Button
      variant="ghost"
      className="h-12 md:h-16 px-2"
      onClick={() => location.reload()}
    >
      <Image
        src={isDesktop ? "/logo1.png" : "/small-logo.png"}
        height={500}
        width={500}
        className={cn("w-auto", { "size-8": !isDesktop })}
        alt="Piece"
      />
    </Button>
  );
}
