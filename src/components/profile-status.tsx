import { profileStatusInfo } from "@/lib/constants";

export default function ProfileStatus({ status }: { status: string }) {
  const profileStatusDetail = profileStatusInfo.find((e) => e.key === status);
  return (
    <div className="w-full justify-start bg-secondary px-4 py-[8px]  rounded-md">
      <div className="flex items-center gap-[6px]">
        <div
          className="rounded-full h-[12px] w-[12px]"
          style={{
            backgroundColor: profileStatusDetail?.color,
          }}
        />
        {profileStatusDetail?.name}
      </div>
    </div>
  );
}
