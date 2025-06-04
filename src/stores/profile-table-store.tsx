import { Profile } from "@/lib/types";
import { UseFormReturn } from "react-hook-form";
import { createStore } from "zustand/vanilla";

export type ProfileTableState = {
  data: Profile[];
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
  search: () => void;
};

export type ProfileTableStore = ProfileTableState & ProfileTableActions;

export const createProfileTableStore = (initState: ProfileTableState) => {
  return createStore<ProfileTableStore>()((set, get) => ({
    ...initState,
    setSelectValue: (value: number) => set(() => ({ selectValue: value })),
    setInputValue: (value: string) => set(() => ({ inputValue: value })),
    search: () => {
      const { selectValue, inputValue } = get();
      console.log(selectValue, inputValue);
    },
  }));
};
