"use client";
import SearchBar from "@/components/search-bar";
import { usePhotoTableStore } from "@/providers/photo-table-provider";

export default function PhotoSearchBar({
  className,
}: React.ComponentProps<"div">) {
  const selectValue = usePhotoTableStore((e) => e.selectValue);
  const setSelectValue = usePhotoTableStore((e) => e.setSelectValue);
  const inputValue = usePhotoTableStore((e) => e.inputValue);
  const setInputValue = usePhotoTableStore((e) => e.setInputValue);

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
