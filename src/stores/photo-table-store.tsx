import { Profile } from "@/lib/types";
import { createStore } from "zustand/vanilla";

export type PhotoTableState = {
  data: Profile[];
  selectValue: number;
  inputValue: string;
};
export type PhotoTableActions = {
  setSelectValue: (value: number) => void;
  setInputValue: (value: string) => void;
  search: () => void;
};

export type PhotoTableStore = PhotoTableState & PhotoTableActions;

export const createPhotoTableStore = (initState: PhotoTableState) => {
  return createStore<PhotoTableStore>()((set, get) => ({
    ...initState,
    setSelectValue: (value: number) => set(() => ({ selectValue: value })),
    setInputValue: (value: string) => set(() => ({ inputValue: value })),
    search: () => {
      const { selectValue, inputValue } = get();
      console.log(selectValue, inputValue);
    },
  }));
};
