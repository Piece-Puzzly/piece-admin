import { getFilteredProfile, getProfiles } from "@/lib/server";
import { Profile } from "@/lib/types";
import Cookies from "js-cookie";
import { UseFormReturn } from "react-hook-form";
import { createStore } from "zustand/vanilla";
export type ProfileTableState = {
  data: Profile[];
  totalNum: number;
  page: number;
  form: UseFormReturn<
    {
      rejectStatuses: {
        rejectImage: boolean;
        rejectDescription: boolean;
      }[];
    },
    unknown,
    {
      rejectStatuses: {
        rejectImage: boolean;
        rejectDescription: boolean;
      }[];
    }
  >;
  selectValue: number;
  inputValue: string;
};

export type ProfileTableActions = {
  setSelectValue: (value: number) => void;
  setInputValue: (value: string) => void;
  update: (
    params:
      | { type: "all"; page: number }
      | {
          type: "search";
          select: "userId" | "profileId" | "nickname";
          value: string;
        }
  ) => void;
};

export type ProfileTableStore = ProfileTableState & ProfileTableActions;

export const createProfileTableStore = (initState: ProfileTableState) => {
  return createStore<ProfileTableStore>()((set) => ({
    ...initState,

    setSelectValue: (value: number) => {
      Cookies.set("selectValue", String(value));
      set(() => ({ selectValue: value }));
    },
    setInputValue: (value: string) => set(() => ({ inputValue: value })),
    update: async (
      params:
        | { type: "all"; page: number }
        | {
            type: "search";
            select: "userId" | "profileId" | "nickname";
            value: string;
          }
    ) => {
      if (params.type === "all") {
        const data = await getProfiles(params.page - 1);

        set({ totalNum: data.data.totalElements, data: data.data.content });
      } else {
        const data = await getFilteredProfile(params.select, params.value);

        set({ data: data ? [data] : [], totalNum: data ? 1 : 0 });
      }
    },
  }));
};
