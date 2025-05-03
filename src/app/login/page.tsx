import Image from "next/image";
import LoginForm from "./_components/LoginForm";

export default function page() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col items-center gap-[60px] w-full md:w-auto">
        <Image
          src={"/logo.png"}
          height={80}
          width={214}
          className="w-auto h-[80px]"
          alt="Piece"
        />

        <LoginForm />
      </div>
    </div>
  );
}
