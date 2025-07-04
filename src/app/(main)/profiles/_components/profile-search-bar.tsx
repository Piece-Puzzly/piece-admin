//https://github.com/YAPP-Github/Piece-Server/pull/109/commits/b368ada71a9087518d6890ab76e10c22b3b9d0ee

"use client";
import SearchBar, { selectData } from "@/components/search-bar";
import { useProfileTableStore } from "@/providers/profile-table-provider";

export default function ProfileSearchBar({
  className,
}: React.ComponentProps<"div">) {
  const selectValue = useProfileTableStore((e) => e.selectValue);
  const setSelectValue = useProfileTableStore((e) => e.setSelectValue);
  const inputValue = useProfileTableStore((e) => e.inputValue);
  const setInputValue = useProfileTableStore((e) => e.setInputValue);
  const update = useProfileTableStore((e) => e.update);
  return (
    <SearchBar
      selectValue={selectValue}
      setSelectValue={setSelectValue}
      inputValue={inputValue}
      setInputValue={setInputValue}
      onSearch={() =>
        update({
          type: "search",
          select: selectData[selectValue].key,
          value: inputValue,
        })
      }
      className={className}
    />
  );
}
