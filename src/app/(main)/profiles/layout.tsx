import { getProfiles } from "@/lib/server";
import { ProfilesResponse } from "@/lib/types";
import { ProfileTableStoreProvider } from "@/providers/profile-table-provider";
import { ReactNode } from "react";
import ProfilesPagination from "./_components/profiles-pagination";
import ProfileSearchBar from "./_components/profile-search-bar";

export default async function layout({ children }: { children: ReactNode }) {
  const res = (await getProfiles(0)) as ProfilesResponse;
  const data = res.data;

  return (
    <div>
      <ProfileTableStoreProvider
        data={data.content}
        totalNum={data.totalElements}
      >
        <ProfileSearchBar className="mb-[20px]" />
        <div className="space-y-[44px] mb-[86px]">
          {children}
          <ProfilesPagination />
        </div>
      </ProfileTableStoreProvider>
    </div>
  );
}
