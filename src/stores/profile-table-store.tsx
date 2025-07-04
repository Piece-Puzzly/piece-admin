import { getFilteredProfile, getProfiles } from "@/lib/server";
import { Profile } from "@/lib/types";
import Cookies from "js-cookie";
import { UseFormReturn } from "react-hook-form";
import { createStore } from "zustand/vanilla";
type query =
  | { type: "all"; page: number }
  | {
      type: "search";
      select: "userId" | "profileId" | "nickname";
      value: string;
    };
export type ProfileTableState = {
  data: Profile[];
  totalNum: number;

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
  query: query;
};

export type ProfileTableActions = {
  setSelectValue: (value: number) => void;
  setInputValue: (value: string) => void;
  update: (params?: query) => Promise<void>;
};

export type ProfileTableStore = ProfileTableState & ProfileTableActions;

export const createProfileTableStore = (initState: ProfileTableState) => {
  return createStore<ProfileTableStore>()((set, get) => ({
    ...initState,

    setSelectValue: (value: number) => {
      Cookies.set("selectValue", String(value));
      set(() => ({ selectValue: value }));
    },
    setInputValue: (value: string) => set(() => ({ inputValue: value })),
    update: async (
      query?:
        | { type: "all"; page: number }
        | {
            type: "search";
            select: "userId" | "profileId" | "nickname";
            value: string;
          }
    ) => {
      const { form } = get();
      let data: Profile[];
      let totalNum: number;
      query = query ? query : get().query;

      if (query.type === "all") {
        const d = await getProfiles(query.page - 1);
        data = d.data.content;
        totalNum = d.data.totalElements;
      } else {
        const d = await getFilteredProfile(query.select, query.value);
        data = d ? [d] : [];
        totalNum = d ? 1 : 0;
      }
      set({ totalNum, data, query });

      form.reset({
        rejectStatuses: data.map(({ rejectImage, rejectDescription }) => ({
          rejectImage,
          rejectDescription,
        })),
      });
    },
  }));
};
