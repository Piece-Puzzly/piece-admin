import { getMatchCandidate, reserveMatch } from "@/lib/server";
import { MatchCandidate } from "@/lib/types";
import { cloneDeep } from "lodash";
import { toast } from "sonner";
import { createStore } from "zustand/vanilla";

export type MatchCandidateState = {
  selectedUsers: [
    { id: number; nickname: string } | undefined,
    { id: number; nickname: string } | undefined,
  ];
  selectedDate?: Date;
  selectedTime?: Date;
  matchType: string;
  data: undefined | MatchCandidate[];
  page: number;
};

export type MatchCandidateActions = {
  selectUser: (num: 0 | 1, info: { id: number; nickname: string }) => void;
  selectDate: (date: Date | undefined) => void;
  selectTime: (time: Date | undefined) => void;
  setMatchType: (type: string) => void;
  update: (page: number) => Promise<void>;
  clear: () => void;
  match: () => Promise<void>;
};

export type MatchCandidateStore = MatchCandidateState & MatchCandidateActions;

export const createMatchCandidateStore = (initState: MatchCandidateState) => {
  return createStore<MatchCandidateStore>()((set, get) => ({
    ...initState,
    selectedDate: new Date(),
    selectedTime: new Date(),
    matchType: "basic",
    selectUser: (num: 0 | 1, info: { id: number; nickname: string }) => {
      const { selectedUsers } = get();
      const result = cloneDeep(selectedUsers);
      result[num] = info;
      set({ selectedUsers: result });
    },
    selectDate: (date: Date | undefined) => set({ selectedDate: date }),
    selectTime: (time: Date | undefined) => set({ selectedTime: time }),
    setMatchType: (type: string) => set({ matchType: type }),

    update: async (page: number) => {
      const res = await getMatchCandidate(page - 1);

      if (res) {
        set({ data: res.data.candidateList, page });
      } else {
        toast(String(res));
      }
    },
    clear: () => {
      set({ data: undefined, page: 1 });
    },
    match: async () => {
      const { selectedUsers, selectedDate, selectedTime, matchType } = get();
      if (!selectedUsers[0]) {
        toast("프로필A를 선택해주세요");
        return;
      } else if (!selectedUsers[1]) {
        toast("프로필B를 선택해주세요");
        return;
      } else if (!selectedDate) {
        toast("매칭 날짜를 선택해주세요");
        return;
      } else if (!selectedTime) {
        toast("매칭 시각을 선택해주세요");
        return;
      } else {
        const dateTime = makeDateTimeString(selectedDate, selectedTime);
        await reserveMatch(selectedUsers[0].id, selectedUsers[1].id, dateTime, matchType);
      }
    },
  }));
};

function makeDateTimeString(baseDate: Date, hourStr: Date): string {
  const yyyy = baseDate.getFullYear();
  const mm = String(baseDate.getMonth() + 1).padStart(2, "0"); // getMonth()는 0~11
  const dd = String(baseDate.getDate()).padStart(2, "0");
  // 시,분,초
  const hour = String(hourStr.getHours()).padStart(2, "0");
  const minute = String(hourStr.getMinutes()).padStart(2, "0");
  const second = String(hourStr.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd}T${hour}:${minute}:${second}`;
}
