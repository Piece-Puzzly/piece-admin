"use client";

import UpdateProfileImageToggle from "@/app/(main)/profiles/photo/_components/update-profile-image-toggle";
import { useDebug } from "@/app/hooks/use-debug";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getUserProfileImageDetail,
  UpdateProfileImageStatus,
} from "@/lib/server";

import { Photo } from "@/lib/types";
import { ChevronRight, Loader } from "lucide-react";
import Image from "next/image";
import { useCallback, useState } from "react";
import { toast } from "sonner";

export default function PhotoDetailButton({
  id,
  nickname,
}: {
  id: number | null;
  nickname: string;
}) {
  const [content, setContent] = useState<Photo | undefined>(undefined);
  const profileImageStatus = content?.pendingProfileImage?.profileImageStatus;
  const debug = useDebug((e) => e.debug);
  const [loading, setLoading] = useState<boolean>(false);
  const update = useCallback(async () => {
    const res = await getUserProfileImageDetail(id as number);

    if (!res.data) {
      toast.error(JSON.stringify(res));
    }
    setContent(res.data);
  }, [id]);
  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          await update();
        } else {
          setContent(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={!debug && id == null}
          className="w-full flex justify-between py-[10px] px-[12px] h-[42px] md:h-[46px] "
        >
          <div>{nickname}</div>
          <ChevronRight />
        </Button>
      </DialogTrigger>
      <DialogContent className="md:w-[860px] max-h-full overflow-y-auto md:max-w-[860px] md:px-[60px] md:pt-[100px] md:pb-[120px]">
        <DialogHeader className="hidden">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        {content ? (
          <div className="flex flex-col items-center gap-[50px]">
            {content.pendingProfileImage ? (
              <>
                <div className="flex justify-between items-center gap-[20px]">
                  <div className="space-y-[20px] flex flex-col items-center">
                    <div>수정 전 이미지</div>
                    <Image
                      className="rounded-lg"
                      src={content.profileImageUrl}
                      height={220}
                      width={220}
                      alt="Profile"
                    />
                  </div>
                  <ChevronRight className="text-gray-black" />

                  <div className="space-y-[20px] flex flex-col items-center">
                    <div>수정 후 이미지</div>
                    <Image
                      className="rounded-lg"
                      src={content.pendingProfileImage.profileImageUrl}
                      height={220}
                      width={220}
                      alt="Profile"
                    />
                  </div>
                </div>

                <div className="flex gap-[24px] w-full md:w-auto items-center">
                  <UpdateProfileImageToggle
                    profileImageStatus={profileImageStatus!}
                    rawData={content}
                  />
                  <Button
                    variant="submit"
                    className=" py-[10px] px-[12px] h-[40px] md:h-[44px] w-[76px]"
                    disabled={
                      loading || (!debug && profileImageStatus !== "PENDING")
                    }
                    onClick={async () => {
                      if (
                        content.pendingProfileImage!.profileImageStatus ===
                        "PENDING"
                      ) {
                        toast.error("반려/통과 여부를 체크해주세요!");
                        return;
                      }
                      setLoading(true);
                      const profileImageId =
                        content.pendingProfileImage!.profileImageId;
                      const accepted =
                        content.pendingProfileImage!.profileImageStatus ===
                        "ACCEPTED";

                      const res = await UpdateProfileImageStatus(
                        profileImageId,
                        accepted
                      );
                      if (res.status !== "success") {
                        toast.error(JSON.stringify(res));
                      }
                      await update();
                      setLoading(false);
                    }}
                  >
                    {loading ? <Loader className="animate-spin" /> : "제출"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-[20px] flex flex-col items-center">
                <div>현재 이미지</div>
                <Image
                  className="rounded-lg"
                  src={content.profileImageUrl}
                  height={220}
                  width={220}
                  alt="Profile"
                />
              </div>
            )}
          </div>
        ) : (
          <div>loading</div>
        )}
      </DialogContent>
    </Dialog>
  );
}
