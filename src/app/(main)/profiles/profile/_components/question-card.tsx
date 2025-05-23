"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Question } from "@/lib/types";

export default function QuestionCard({ data }: { data: Question }) {
  return (
    <Card className="px-[20px] py-[24px] gap-[20px] md:w-[375px] ">
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
