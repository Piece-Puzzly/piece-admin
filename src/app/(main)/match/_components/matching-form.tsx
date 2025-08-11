"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMatchCandidateStore } from "@/providers/match-candidate-provider";
import { useMatchHistoryTableStore } from "@/providers/match-history-table-provider";
import { format } from "date-fns";
import { Check, ChevronDownIcon, Loader } from "lucide-react";
import { useState } from "react";
import MatchCandidatePagination from "./match-candidate-pagination";

export default function MatchingForm() {
  const match = useMatchCandidateStore((e) => e.match);
  const [loading, setLoading] = useState<boolean>(false);
  const reload = useMatchHistoryTableStore((e) => e.reload);

  // const onSubmit: SubmitHandler<FieldValues> = async (data) => {};

  return (
    <div className="flex flex-col @3xl:flex-row items-center gap-4">
      <div className="flex flex-col @3xl:flex-row gap-4 flex-1">
        <div className="flex-1 items-center grid grid-cols-2 gap-[8px] w-auto ">
          {[0, 1].map((e) => (
            <MatchingFormDialog userIndex={e as 0 | 1} key={e} />
          ))}
        </div>
        <div className="items-center flex gap-[8px]">
          <DateSelect />
          <TimeSelect />
        </div>
      </div>
      <Button
        disabled={loading}
        className="!h-[48px] min-w-[100px]"
        onClick={async () => {
          setLoading(true);
          await match();
          setLoading(false);
          await reload();
        }}
      >
        {loading ? <Loader className="animate-spin" /> : "매칭"}
      </Button>
    </div>
  );
}

function DateSelect() {
  const date = useMatchCandidateStore((e) => e.selectedDate);
  const selectDate = useMatchCandidateStore((e) => e.selectDate);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"secondary"}
          className={cn(
            " !h-[48px] w-[180px] text-secondary-foreground font-medium px-[16px] flex justify-between "
          )}
        >
          {date ? format(date, "yyyy년 MM월 dd일") : <span>매칭 날짜</span>}
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(e) => selectDate(e)}
          disabled={(date) => {
            const now = new Date();
            const startOfDay = new Date(now.setHours(0, 0, 0, 0));
            return date < startOfDay;
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function TimeSelect() {
  const time = useMatchCandidateStore((e) => e.selectedTime);
  const selectTime = useMatchCandidateStore((e) => e.selectTime);
  return (
    <Select value={time} onValueChange={(e) => selectTime(e)}>
      <SelectTrigger className="!h-[48px]  w-[150px] text-secondary-foreground font-medium px-[16px]">
        <SelectValue placeholder="매칭 시간" />
      </SelectTrigger>
      <SelectContent>
        {[...Array(12)]
          .map((_, i) => {
            return i + 12;
          })
          .map((i) => (
            <SelectItem key={i} value={`${i}`}>
              <div>{i}시</div>
            </SelectItem>
          ))}
      </SelectContent>
    </Select>
  );
}

function MatchingFormDialog({ userIndex }: { userIndex: 0 | 1 }) {
  const users = useMatchCandidateStore((e) => e.selectedUsers);
  const data = useMatchCandidateStore((e) => e.data);
  const clear = useMatchCandidateStore((e) => e.clear);

  const update = useMatchCandidateStore((e) => e.update);
  const user = users[userIndex];

  const opponent = users[1 - userIndex];
  const selectUser = useMatchCandidateStore((e) => e.selectUser);
  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) {
          clear();
        } else {
          update(1);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"secondary"}
          className="overflow-hidden w-full max-w-full !h-[48px] text-secondary-foreground font-medium px-[16px] justify-between "
        >
          <div className="flex-1 text-left w-full overflow-hidden">
            {!user ? "닉네임을 선택해 주세요" : `[${user.id}] ${user.nickname}`}
          </div>
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-sm md:max-w-sm">
        <DialogHeader>
          <DialogTitle>{`프로필${userIndex === 0 ? "A" : "B"} 선택`}</DialogTitle>
        </DialogHeader>
        {data ? (
          <div>
            {data.map((e) => (
              <DialogClose asChild key={e.userId}>
                <Button
                  variant="ghost"
                  className="w-full -mx-2 justify-between px-2 has-[>svg]:px-2"
                  disabled={!e.canBeMatched || opponent?.id === e.userId}
                  onClick={() =>
                    selectUser(userIndex, {
                      id: e.userId,
                      nickname: e.nickName,
                    })
                  }
                >
                  <div>
                    [{e.userId}]{` `}
                    {e.nickName}
                  </div>
                  {e.userId === user?.id && <Check />}
                </Button>
              </DialogClose>
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground">loading</div>
        )}
        <MatchCandidatePagination />
      </DialogContent>
    </Dialog>
  );
}
