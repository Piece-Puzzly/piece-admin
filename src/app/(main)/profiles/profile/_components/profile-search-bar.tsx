"use client";
import SearchBar from "@/components/search-bar";
import { useProfileTableStore } from "@/providers/profile-table-provider";

export default function ProfileSearchBar({
  className,
}: React.ComponentProps<"div">) {
  const selectValue = useProfileTableStore((e) => e.selectValue);
  const setSelectValue = useProfileTableStore((e) => e.setSelectValue);
  const inputValue = useProfileTableStore((e) => e.inputValue);
  const setInputValue = useProfileTableStore((e) => e.setInputValue);

  return (
    <SearchBar
      selectValue={selectValue}
      setSelectValue={setSelectValue}
      inputValue={inputValue}
      setInputValue={setInputValue}
      className={className}
    />
  );
}
