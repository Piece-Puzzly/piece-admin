import LogoutButton from "@/components/LogoutButton";
import { getServerSession } from "next-auth";
import Image from "next/image";

export default async function Header() {
  const session = await getServerSession();
  return (
    <div className="shrink-0 h-20 flex w-full items-center justify-center border-b">
      <div className="w-full max-w-screen-xl flex justify-between px-4 items-center">
        <span className="flex flex-row gap-2 items-center">
          <Image
            src={"/logo1.png"}
            height={500}
            width={500}
            className="w-auto h-10"
            alt="Piece"
          />
          {session && (
            <span className="text-[16px] px-5 py-2.5 font-medium">
              <span className="decoration-grayscale-black underline">
                admin
              </span>
              <span className="text-grayscale-dark3 text-muted-foreground">
                님, 안녕하세요.
              </span>
            </span>
          )}
        </span>
        {session && <LogoutButton />}
      </div>
    </div>
  );
}
