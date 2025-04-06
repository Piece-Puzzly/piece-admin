"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const res = await signIn("credentials", {
      loginId: data.id,
      password: data.password,
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.ok && res.url) {
      router.push(res.url); // 수동 이동
      router.refresh();
    } else {
      alert("로그인 실패: 사용자 이름 또는 비밀번호를 확인하세요.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col justify-center gap-[40px] items-center py-[40px]"
    >
      <div className="space-y-4">
        <div className="space-y-[8px]">
          <div className="font-medium">아이디</div>
          <Input
            type="text"
            className="w-[432px]"
            placeholder="아이디를 입력하세요."
            {...register("id")}
          />
        </div>
        <div className="space-y-[8px]">
          <div className="font-medium">비밀번호</div>
          <Input
            type="password"
            {...register("password")}
            className="w-[432px]"
            placeholder="비밀번호를 입력하세요."
          />
        </div>
      </div>
      <Button className="w-[432px] h-[52px] text-base">로그인</Button>
    </form>
  );
}
