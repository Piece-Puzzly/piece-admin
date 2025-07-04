"use client";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export const selectData: {
  label: string;
  key: "nickname" | "userId" | "profileId";
}[] = [
  { label: "닉네임", key: "nickname" },
  { label: "user ID", key: "userId" },
  { label: "프로필 식별값", key: "profileId" },
];

export default function SearchBar({
  selectValue,
  setSelectValue,
  inputValue,
  setInputValue,
  onSearch,
  className,
}: {
  selectValue: number;
  inputValue: string;
  setSelectValue: (value: number) => void;
  setInputValue: (value: string) => void;
  onSearch: () => void;
} & React.ComponentProps<"div">) {
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onSearch(); // 즉시 실행 (즉시 검색)
            }
          }}
        />
        <Button
          type="button"
          size="icon"
          variant="ghost"
          onClick={onSearch}
          className="absolute top-1/2 -translate-y-1/2 right-[16px] z-50"
        >
          <Image
            src={"/icons/Question.svg"}
            height={20}
            width={20}
            alt="Question"
          />
        </Button>
      </div>
    </div>
  );
}
