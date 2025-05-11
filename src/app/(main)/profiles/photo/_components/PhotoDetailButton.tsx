"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { submitDebug } from "@/lib/debugFlags";
import {
  getUserProfileImageDetail,
  UpdateProfileImageStatus,
} from "@/lib/server";
import { UserProfileImageDetailResponseData } from "@/lib/types";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import UpdateProfileImageToggle from "./UpdateProfileImageToggle";

export default function PhotoDetailButton({
  id,
  nickname,
}: {
  id: number | null;
  nickname: string;
}) {
  const [content, setContent] = useState<
    UserProfileImageDetailResponseData | undefined
  >(undefined);
  const profileImageStatus = content?.pendingProfileImage?.profileImageStatus;
  return (
    <Dialog
      onOpenChange={async (e) => {
        if (e) {
          const res = await getUserProfileImageDetail(id as number);

          if (!res.data) {
            toast.error(JSON.stringify(res));
          }

          setContent(res.data);
        } else {
          setContent(undefined);
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant="outline"
          disabled={id == null}
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
                <div>
                  <div className="flex gap-[24px]">
                    <UpdateProfileImageToggle
                      profileImageStatus={profileImageStatus!}
                      rawData={content}
                    />
                    <Button
                      variant="submit"
                      className=" py-[10px] px-[12px] h-auto w-[76px]"
                      disabled={
                        !submitDebug && profileImageStatus !== "PENDING"
                      }
                      onClick={async () => {
                        if (
                          content.pendingProfileImage!.profileImageStatus ===
                          "PENDING"
                        ) {
                          toast.error("반려/통과 여부를 체크해주세요!");
                          return;
                        }
                        const profileImageId =
                          content.pendingProfileImage!.profileImageId;
                        const accepted =
                          content.pendingProfileImage!.profileImageStatus ===
                          "ACCEPTED";
                        console.log(profileImageId, accepted);
                        const res = await UpdateProfileImageStatus(
                          profileImageId,
                          accepted
                        );
                        if (res.status !== "success") {
                          toast.error(JSON.stringify(res));
                        }
                      }}
                    >
                      제출
                    </Button>
                  </div>
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
