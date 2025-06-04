"use client";
import { cn } from "@/lib/utils";
import { useProfileTableStore } from "@/providers/profile-table-provider";
import Image from "next/image";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const selectData = [
  { label: "닉네임", key: "nickname" },
  { label: "user ID", key: "userId" },
  { label: "프로필 식별값", key: "profileId" },
];

export default function ProfileSearchBar({
  className,
}: React.ComponentProps<"div">) {
  const selectValue = useProfileTableStore((e) => e.selectValue);
  const setSelectValue = useProfileTableStore((e) => e.setSelectValue);
  const inputValue = useProfileTableStore((e) => e.inputValue);
  const setInputValue = useProfileTableStore((e) => e.setInputValue);

  return (
    <div className={cn("flex gap-[8px]", className)}>
      <Select
        value={`${selectValue}`}
        onValueChange={(e) => setSelectValue(parseInt(e))}
      >
        <SelectTrigger className="w-[148px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {selectData.map(({ label, key }, i) => (
            <SelectItem
              key={key}
              value={`${i}`}
              className={cn({ "text-primary": selectValue === i })}
            >
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="relative">
        <Input
          placeholder="검색어를 입력해주세요"
          className="w-[260px]"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <Image
          className="absolute right-[16px] top-[16px] z-50"
          src={"/icons/Question.svg"}
          height={20}
          width={20}
          alt="Question"
        />
      </div>
    </div>
  );
}
