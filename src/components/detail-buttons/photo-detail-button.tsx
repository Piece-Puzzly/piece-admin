"use client";

import { useDebug } from "@/app/hooks/use-debug";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getUserProfileImageDetail,
  UpdateProfileImageStatus,
} from "@/lib/server";

import { UpdateProfileImageToggles } from "@/app/(main)/profiles/photo/_components/update-profile-image-toggles";
import ProfileImage from "@/components/profile-image";
import { Photo } from "@/lib/types";
import { ChevronRight, Loader } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import UserInfoTrigger from "../user-info/user-info-trigger";

export default function PhotoDetailButton({
  id,
  nickname,
}: {
  id: number | null;
  nickname: string | null;
}) {
  const [content, setContent] = useState<Photo | undefined>(undefined);
  const profileImageStatus = content?.pendingProfileImage?.profileImageStatus;
  const debug = useDebug((e) => e.debug);
  const [loading, setLoading] = useState<boolean>(false);
  const [reviewDecision, setReviewDecision] =
    useState<string>("PENDING");
  const update = useCallback(async () => {
    const res = await getUserProfileImageDetail(id as number);
    if (!res) {
      toast.error("사진 정보를 불러오지 못했습니다.");
    }
    setContent(res);
  }, [id]);

  // 사진이 없거나(없거나 빈/null 문자열) 로드에 실패하면 이미지 대신 "사진 없음"을 표시
  const renderPhoto = (url: string | null | undefined) => (
    <ProfileImage
      className="rounded-lg"
      src={url}
      height={220}
      width={220}
      alt="프로필 이미지"
      fallback={
        <div className="flex h-[220px] w-[220px] items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
          사진 없음
        </div>
      }
    />
  );
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
        <Button variant="outline" className="w-full flex justify-between ">
          <div className="flex gap-2">
            <div className="text-muted-foreground">[{id}]</div>
            <div>{nickname}</div>
          </div>
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
                    {renderPhoto(content.profileImageUrl)}
                  </div>
                  <ChevronRight className="text-gray-black" />

                  <div className="space-y-[20px] flex flex-col items-center">
                    <div>수정 후 이미지</div>
                    {renderPhoto(content.pendingProfileImage.profileImageUrl)}
                  </div>
                </div>

                <div className="flex gap-[24px] w-full md:w-auto items-center">
                  <UpdateProfileImageToggles
                    currentStatus={reviewDecision}
                    onStatusChange={setReviewDecision}
                    disabled={
                      content.pendingProfileImage.profileImageStatus !==
                        "PENDING" && !debug
                    }
                  />
                  <Button
                    variant="submit"
                    className=" py-[10px] px-[12px] h-[40px] md:h-[44px] w-[76px]"
                    disabled={
                      loading ||
                      (!debug &&
                        (profileImageStatus !== "PENDING" ||
                          reviewDecision === "PENDING"))
                    }
                    onClick={async () => {
                      setLoading(true);
                      const profileImageId =
                        content.pendingProfileImage!.profileImageId;
                      // 심사 결과는 운영자가 토글로 선택한 값(reviewDecision)을 따른다.
                      // (기존: 현재 상태값으로 계산해 항상 반려로 전송되던 버그)
                      const accepted = reviewDecision === "ACCEPTED";

                      await UpdateProfileImageStatus(
                        profileImageId,
                        accepted
                      );
                    
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
                {renderPhoto(content.profileImageUrl)}
              </div>
            )}
          </div>
        ) : (
          <div>loading</div>
        )}
        <DialogFooter>
          <UserInfoTrigger asChild userId={id} nickname={nickname}>
            <Button variant={"outline"}>자세히 보기</Button>
          </UserInfoTrigger>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
