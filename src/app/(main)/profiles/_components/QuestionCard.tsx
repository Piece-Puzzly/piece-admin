"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionResponseType } from "@/lib/types";
export default function QuestionCard({ data }: { data: QuestionResponseType }) {
  return (
    <Card className="px-[20px] py-[24px] gap-[20px] w-[375px]">
      <CardHeader className="p-0">
        <CardTitle className="text-primary text-[14px]">{data.title}</CardTitle>
        <CardDescription className="text-lg text-[#484B4D]">
          {data.category}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Card className="bg-secondary px-[16px] py-[14px]">
          <CardContent className="p-0 min-h-[300px]">{data.answer}</CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
