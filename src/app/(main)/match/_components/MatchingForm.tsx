import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function MatchingForm({
  data,
}: {
  data: { profile: string; disabled: boolean }[];
}) {
  return (
    <div className="flex items-center gap-[40px]">
      <div className="flex-1 items-center grid grid-cols-2 gap-[24px]">
        <ProfileSelect data={data} />
        <ProfileSelect data={data} />
      </div>
      <Button className="h-[52px] w-[200px] text-base">매칭</Button>
    </div>
  );
}

function ProfileSelect({
  data,
}: {
  data: { profile: string; disabled: boolean }[];
}) {
  return (
    <Select>
      <SelectTrigger className="w-full !h-[52px] text-base text-secondary-foreground font-medium px-[16px]">
        <SelectValue placeholder="닉네임을 선택해 주세요" />
      </SelectTrigger>
      <SelectContent className="bg-[#F4F6FA]">
        {data.map(({ profile, disabled }) => (
          <SelectItem key={profile} value={profile} disabled={disabled}>
            <div>{profile}</div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
