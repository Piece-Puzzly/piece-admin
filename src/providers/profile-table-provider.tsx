"use client";

import { type ReactNode, createContext, useContext, useRef } from "react";
import { useStore } from "zustand";

import { Form } from "@/components/ui/form";
import { Profile } from "@/lib/types";
import {
  type ProfileTableStore,
  createProfileTableStore,
} from "@/stores/profile-table-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export type ProfileTableStoreApi = ReturnType<typeof createProfileTableStore>;

export const ProfileTableStoreContext = createContext<
  ProfileTableStoreApi | undefined
>(undefined);

export interface ProfileTableStoreProviderProps {
  children: ReactNode;
  data: Profile[];
  totalNum: number;
}

const rowSchema = z.object({
  rejectImage: z.boolean(),
  rejectDescription: z.boolean(),
});

const tableSchema = z.object({
  rejectStatuses: z.array(rowSchema).length(10),
});

export const ProfileTableStoreProvider = ({
  children,
  totalNum,
  data,
}: ProfileTableStoreProviderProps) => {
  const form = useForm<z.infer<typeof tableSchema>>({
    resolver: zodResolver(tableSchema),
    defaultValues: {
      rejectStatuses: data.map(({ rejectImage, rejectDescription }) => ({
        rejectImage,
        rejectDescription,
      })),
    },
  });

  const storeRef = useRef<ProfileTableStoreApi | null>(null);
  if (storeRef.current === null) {
    storeRef.current = createProfileTableStore({
      totalNum,
      page: 1,
      form,
      data,
      selectValue: 0,
      inputValue: "",
    });
  }

  return (
    <ProfileTableStoreContext.Provider value={storeRef.current}>
      <Form {...form}>
        <form className="space-y-8">{children}</form>
      </Form>
    </ProfileTableStoreContext.Provider>
  );
};

export const useProfileTableStore = <T,>(
  selector: (store: ProfileTableStore) => T
): T => {
  const profileTableStoreContext = useContext(ProfileTableStoreContext);

  if (!profileTableStoreContext) {
    throw new Error(
      `useProfileTableStore must be used within ProfileTableStoreProvider`
    );
  }

  return useStore(profileTableStoreContext, selector);
};
