"use client";

import { TimePickerInput } from "@/components/time-picker-input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { useRef, useState } from "react";
import MatchCandidatePagination from "./match-candidate-pagination";

export default function MatchingForm() {
  const match = useMatchCandidateStore((e) => e.match);
  const matchType = useMatchCandidateStore((e) => e.matchType);
  const setMatchType = useMatchCandidateStore((e) => e.setMatchType);
  const [loading, setLoading] = useState<boolean>(false);
  const reload = useMatchHistoryTableStore((e) => e.reload);

  return (
    <div className="flex @3xl:flex-row @3xl:items-center flex-col items-start gap-4">
      <div className="flex flex-col @3xl:flex-row gap-4 flex-1">
        <div className="flex-1 items-center grid grid-cols-2 gap-[8px] w-auto ">
          {[0, 1].map((e) => (
            <MatchingFormDialog userIndex={e as 0 | 1} key={e} />
          ))}
        </div>
      </div>
      <div className="flex flex-col @3xl:flex-row gap-4 flex-1">
        <div className="@2xl:items-center flex gap-[8px] flex-col @2xl:flex-row items-start">
          <DateSelect />
          <TimeSelect />
        </div>
      </div>
      <Select value={matchType} onValueChange={setMatchType}>
        <SelectTrigger className="h-[40px] w-[120px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic</SelectItem>
          <SelectItem value="trial">Trial</SelectItem>
          <SelectItem value="premium">Premium</SelectItem>
        </SelectContent>
      </Select>
      <Button
        disabled={loading}
        className="h-[40px]! min-w-[100px]"
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
            " !h-[40px] w-[180px] text-secondary-foreground font-medium px-[16px] flex justify-between "
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
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

function TimeSelect() {
  const time = useMatchCandidateStore((e) => e.selectedTime);
  const selectTime = useMatchCandidateStore((e) => e.selectTime);
  const minuteRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex items-end gap-2">
      <TimePickerInput
        picker="hours"
        date={time}
        setDate={selectTime}
        ref={hourRef}
        onRightFocus={() => minuteRef.current?.focus()}
      />
      시
      <TimePickerInput
        picker="minutes"
        date={time}
        setDate={selectTime}
        ref={minuteRef}
        onLeftFocus={() => hourRef.current?.focus()}
        onRightFocus={() => secondRef.current?.focus()}
      />
      분
      <TimePickerInput
        picker="seconds"
        date={time}
        setDate={selectTime}
        ref={secondRef}
        onLeftFocus={() => minuteRef.current?.focus()}
      />
      초
    </div>
  );
}

function MatchingFormDialog({ userIndex }: { userIndex: 0 | 1 }) {
  const [open, setOpen] = useState(false);
  const users = useMatchCandidateStore((e) => e.selectedUsers);
  const data = useMatchCandidateStore((e) => e.data);
  const clear = useMatchCandidateStore((e) => e.clear);
  const update = useMatchCandidateStore((e) => e.update);
  const selectUser = useMatchCandidateStore((e) => e.selectUser);

  const user = users[userIndex];
  const opponent = users[1 - userIndex];

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) update(1);
        else clear();
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="secondary"
          className="overflow-hidden w-full max-w-full !h-[40px] text-secondary-foreground font-medium px-[16px] justify-between"
        >
          <div className="flex-1 text-left w-full overflow-hidden">
            {!user ? "닉네임을 선택해 주세요" : `[${user.id}] ${user.nickname}`}
          </div>
          <ChevronDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <div className="p-2 border-b">
          <span className="text-sm font-medium">
            프로필{userIndex === 0 ? "A" : "B"} 선택
          </span>
        </div>
        {data ? (
          <div className="max-h-[300px] overflow-y-auto p-1">
            {data.map((e) => (
              <Button
                key={e.userId}
                variant="ghost"
                className="w-full justify-between px-2 h-9"
                disabled={!e.canBeMatched || opponent?.id === e.userId}
                onClick={() => {
                  selectUser(userIndex, {
                    id: e.userId,
                    nickname: e.nickName,
                  });
                  setOpen(false);
                }}
              >
                <span>
                  [{e.userId}] {e.nickName}
                </span>
                {e.userId === user?.id && <Check className="size-4" />}
              </Button>
            ))}
          </div>
        ) : (
          <div className="p-4 text-center text-muted-foreground text-sm">
            loading...
          </div>
        )}
        <div className="border-t p-2">
          <MatchCandidatePagination />
        </div>
      </PopoverContent>
    </Popover>
  );
}
