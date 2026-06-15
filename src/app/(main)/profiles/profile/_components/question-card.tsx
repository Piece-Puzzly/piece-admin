"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Question } from "@/lib/types";

export default function QuestionCard({ data }: { data?: Question }) {
  // 응답이 없거나(undefined) 범위를 벗어난 경우 크래시 대신 안내 표시
  if (!data) {
    return (
      <Card className="px-[20px] py-[24px] gap-[20px] md:w-[375px] break-all ">
        <CardContent className="p-0 min-h-[300px] flex items-center justify-center text-muted-foreground">
          등록된 응답이 없습니다.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="px-[20px] py-[24px] gap-[20px] md:w-[375px] break-all ">
      <CardHeader className="p-0">
        <CardTitle className="text-primary text-[14px]">{data.title}</CardTitle>
        <CardDescription className="text-lg text-gray-dark-1 font-medium">
          {data.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Card className="bg-gray-light-3 text-gray-black px-[16px] py-[14px] border-none">
          <CardContent className="p-0 min-h-[300px]">{data.answer}</CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
