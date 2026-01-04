import { imageStatusOptions } from "@/lib/constants";

export default function ImageStatus({
  status,
}: {
  status: string | null;
}) {
  const detail = imageStatusOptions.find((option) => option.key === status);
  return (
    <div className="justify-start bg-secondary px-4 py-[8px]  rounded-md">
      <div className="flex items-center gap-[6px]">
        <div
          className="rounded-full h-[12px] w-[12px]"
          style={{
            backgroundColor: detail?.color,
          }}
        />
        {detail?.label}
      </div>
    </div>
  );
}
