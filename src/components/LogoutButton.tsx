"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function LogoutButton() {
  return (
    <Button
      role="button"
      variant={"ghost"}
      onClick={() => signOut()}
      className="text-primary px-5 py-2.5 text-[16px]"
    >
      로그아웃
    </Button>
  );
}
