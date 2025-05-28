import { UseFormReturn } from "react-hook-form";
import { createStore } from "zustand/vanilla";

export type ProfileTableState = {
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
};

export type ProfileTableStore = ProfileTableState;

export const createProfileTableStore = (initState: ProfileTableState) => {
  return createStore<ProfileTableStore>()(() => ({
    ...initState,
  }));
};
