"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { loginServerInfo } from "@/lib/loginData";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

export default function LoginForm() {
  const { register, handleSubmit } = useForm();
  const router = useRouter();
  const [loginServer, setLoginServer] = useState<number>(0);
  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    const res = await signIn(`${loginServerInfo[loginServer].name}-login`, {
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
      className="flex flex-col justify-center items-center gap-[40px]"
    >
      <Tabs className="w-[432px]" value={`${loginServer}`}>
        <TabsList className="inline-flex w-full grid-cols-2">
          {loginServerInfo.map(({ display }, i) => (
            <TabsTrigger
              // disabled={i === 1}
              onClick={() => {
                setLoginServer(i);
              }}
              key={i}
              value={`${i}`}
            >
              {display}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
      <div className="flex flex-col gap-[40px] ">
        <div className="space-y-4">
          <div className="space-y-[8px]">
            <Label htmlFor="id">아이디</Label>

            <Input
              id="id"
              type="text"
              className="w-[432px]"
              placeholder="아이디를 입력하세요."
              {...register("id")}
            />
          </div>
          <div className="space-y-[8px]">
            <Label htmlFor="id">비밀번호</Label>
            <Input
              id="pw"
              type="password"
              {...register("password")}
              className="w-[432px]"
              placeholder="비밀번호를 입력하세요."
            />
          </div>
        </div>
        <Button className="w-[432px] h-[52px] text-base">로그인</Button>
      </div>
    </form>
  );
}
