import Image from "next/image";
import LoginForm from "./_components/LoginForm";

export default function page() {
  return (
    <div className="h-full flex justify-center items-center">
      <div className="flex flex-col">
        <div className="flex flex-col pb-10">
          <Image
            src={"/logo.png"}
            height={500}
            width={500}
            className="w-auto h-50"
            alt="Piece"
          />
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
