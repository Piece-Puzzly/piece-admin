"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getUserAllInfo, UserFullInfoResponse } from "@/lib/actions/get-user";
import { profileStatusInfo } from "@/lib/constants";
import { cn, getImageSrc } from "@/lib/utils";
import { Circle, CircleCheck } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "./info-card";
import PuzzleGrantCard from "./puzzle-grant-card";

// 데이터가 null/undefined/빈 문자열일 때 화면에 표시할 빈칸 표기
const EMPTY_PLACEHOLDER = "-";

function EmptyValue() {
  return <span className="text-muted-foreground">{EMPTY_PLACEHOLDER}</span>;
}

// 프로필 조회 404 시 노출되는 안내 모달. 닫으면 이전 페이지로 이동
function ProfileNotFoundModal() {
  const router = useRouter();
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
    router.back();
  };

  return (
    <AlertDialog
      open={open}
      onOpenChange={(next) => {
        if (!next) handleClose();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>프로필 없음</AlertDialogTitle>
          <AlertDialogDescription>
            유저의 프로필이 존재하지 않습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {/* 닫힘은 onOpenChange에서 일괄 처리(중복 router.back 방지) */}
          <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

// 값이 null/undefined/빈 문자열이면 빈칸을, 아니면 값(+선택적 단위)을 렌더
function FieldValue({
  value,
  suffix,
}: {
  value: string | number | null | undefined;
  suffix?: string;
}) {
  const isEmpty =
    value === null ||
    value === undefined ||
    (typeof value === "string" && value.trim() === "");

  if (isEmpty) return <EmptyValue />;

  return (
    <>
      {value}
      {suffix ? <span className="text-base font-normal">{suffix}</span> : null}
    </>
  );
}

export default function UserInfo({ id }: { id: number | bigint }) {
  const [user, setUser] = useState<UserFullInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) {
      setError("ID 없음");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const result = await getUserAllInfo(id);
        if (result.status === "not-found") {
          setNotFound(true);
        } else if (result.status === "error") {
          setError(result.message);
        } else {
          setUser(result.data);
        }
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "유저 정보를 불러오지 못했습니다."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (notFound) return <ProfileNotFoundModal />;
  if (error) return <div>오류: {error}</div>;
  if (!user) return <div>유저 없음</div>;

  // 탈퇴 유저: is_admin=true 또는 닉네임이 "탈퇴_"로 시작
  const isWithdrawn =
    user.isAdmin === true ||
    (user.profile?.nickname?.startsWith("탈퇴_") ?? false);

  return (
    <main className="space-y-4">
      <UserCard user={user} isWithdrawn={isWithdrawn} />
      {!isWithdrawn && <PuzzleGrantCard userId={user.userId} />}
      {user.profile ? (
        <>
          <ProfileCard
            profile={user.profile}
            profileImages={user.profileImages ?? []}
            isWithdrawn={isWithdrawn}
          />
          <ValuePickCard valuePicks={user.valuePicks ?? []} />
          <ValueTalkCard valueTalks={user.valueTalks ?? []} />
        </>
      ) : (
        "프로필 등록 안 됨"
      )}
    </main>
  );
}

function UserCard({
  user,
  isWithdrawn,
}: {
  user: UserFullInfoResponse;
  isWithdrawn: boolean;
}) {
  return (
    <Card
      className={cn(isWithdrawn && "border-destructive/50 bg-destructive/5")}
    >
      <CardHeader>
        <CardTitle>유저 정보</CardTitle>
        <CardDescription>user_table</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <p suppressHydrationWarning>
            <span className="font-medium">생성:</span>{" "}
            {user.createdAt ? (
              new Date(user.createdAt).toLocaleString("ko-KR", {
                timeZone: "UTC",
              })
            ) : (
              <EmptyValue />
            )}
          </p>
          <p>
            <span className="font-medium">유저 ID:</span>{" "}
            {user.userId != null ? user.userId.toString() : <EmptyValue />}
          </p>
          <p>
            <span className="font-medium">전화번호:</span>{" "}
            <FieldValue value={user.phoneNumber} />
          </p>
          <p>
            <span className="font-medium">역할:</span>{" "}
            <FieldValue value={user.role} />
          </p>
          <p>
            <span className="font-medium">어드민 여부:</span>{" "}
            {user.isAdmin == null ? (
              <EmptyValue />
            ) : user.isAdmin ? (
              "예"
            ) : (
              "아니요"
            )}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

type ProfileInfo = NonNullable<UserFullInfoResponse["profile"]>;
type ProfileImageInfo = UserFullInfoResponse["profileImages"][number];

function ProfileCard({
  profile,
  profileImages,
  isWithdrawn,
}: {
  profile: ProfileInfo;
  profileImages: ProfileImageInfo[];
  isWithdrawn: boolean;
}) {
  const profileStatusDetail = profileStatusInfo.find(
    (e) => e.key === profile.profileStatus
  );

  const images = profileImages ?? [];
  const birthdate = profile.birthdate ? new Date(profile.birthdate) : null;

  return (
    <Card
      className={cn(isWithdrawn && "border-destructive/50 bg-destructive/5")}
    >
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>profile</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div suppressHydrationWarning>
            <span className="font-medium">생성: </span>
            <span>
              {profile.createdAt ? (
                new Date(profile.createdAt).toLocaleString("ko-KR", {
                  timeZone: "UTC",
                })
              ) : (
                <EmptyValue />
              )}
            </span>
          </div>
          <div className="flex items-center gap-[6px]">
            <span className="font-medium">상태: </span>
            <div
              className="rounded-full h-[12px] w-[12px]"
              style={{
                backgroundColor: profileStatusDetail?.color,
              }}
            />
            {profileStatusDetail?.name ?? <EmptyValue />}
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <Image
            width={128}
            height={128}
            src={getImageSrc(profile.imageUrl)}
            alt="Profile Image"
            className="w-24 h-auto"
          />
          <div>
            <p>
              <span>
                <FieldValue value={profile.description} />
              </span>
            </p>
            <p className="text-xl text-primary font-semibold">
              <span>
                <FieldValue value={profile.nickname} />
              </span>
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>나이</InfoCardTitle>
            </InfoCardHeader>

            <InfoCardContent>
              <div>
                {birthdate ? (
                  `만 ${getKoreanAgeFromDate(birthdate)}세`
                ) : (
                  <EmptyValue />
                )}
              </div>
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>키</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <FieldValue value={profile.height} suffix="cm" />
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>몸무게</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <FieldValue value={profile.weight} suffix="kg" />
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>활동 지역</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <FieldValue value={profile.location} />
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>직업</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <FieldValue value={profile.job} />
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>흡연</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <FieldValue value={profile.smokingStatus} />
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>SNS 활동</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              <FieldValue value={profile.snsActivityLevel} />
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>생년월일</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent suppressHydrationWarning>
              {birthdate ? (
                birthdate.toLocaleDateString("ko-KR", {
                  timeZone: "UTC",
                })
              ) : (
                <EmptyValue />
              )}
            </InfoCardContent>
          </InfoCard>
        </div>
        {images.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium">프로필 이미지</div>
            <div className="flex flex-wrap gap-2">
              {images.map((img) => (
                <div key={img.profileImageId} className="relative">
                  <Image
                    width={80}
                    height={80}
                    src={getImageSrc(img.imageUrl)}
                    alt="Profile Image"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <span className="text-xs text-muted-foreground">
                    {img.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

type ValuePickInfo = UserFullInfoResponse["valuePicks"][number];

function ValuePickCard({ valuePicks }: { valuePicks: ValuePickInfo[] }) {
  const picks = valuePicks ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>가치관 Pick</CardTitle>
        <CardDescription>profile-value-pick</CardDescription>
      </CardHeader>

      <CardContent className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {picks.length === 0 ? (
          <p className="text-muted-foreground">등록된 가치관 Pick이 없습니다.</p>
        ) : (
          picks.map((pick) => (
            <div key={pick.id}>
              <p className="text-primary font-medium">
                <FieldValue value={pick.category} />
              </p>
              <p className="text-lg font-medium">
                <FieldValue value={pick.question} />
              </p>
              <div className="mt-2">
                {["1", "2"].map((e) => (
                  <div className="flex gap-2 items-center" key={e}>
                    {String(pick.selectedAnswer) === e ? (
                      <CircleCheck className={cn("size-4")} />
                    ) : (
                      <Circle className="size-4 stroke-muted-foreground" />
                    )}
                    <p
                      className={cn("text-muted-foreground", {
                        "text-foreground": String(pick.selectedAnswer) === e,
                      })}
                    >
                      선택지 {e}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

type ValueTalkInfo = UserFullInfoResponse["valueTalks"][number];

function ValueTalkCard({ valueTalks }: { valueTalks: ValueTalkInfo[] }) {
  const talks = valueTalks ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>가치관 Talk</CardTitle>
        <CardDescription>profile-value-talk</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 break-all">
        {talks.length === 0 ? (
          <p className="text-muted-foreground">등록된 가치관 Talk이 없습니다.</p>
        ) : (
          talks.map((talk) => (
            <div key={talk.id}>
              <p className="text-primary font-medium">
                <FieldValue value={talk.category} />
              </p>
              <p className="text-lg font-medium">
                <FieldValue value={talk.summary} />
              </p>
              <Card className="bg-background my-2 py-4">
                <CardContent className="px-4 break-all">
                  <p>
                    <FieldValue value={talk.answer} />
                  </p>
                </CardContent>
                <CardFooter className="justify-end">
                  <p>
                    <span className="text-primary">
                      {talk.answer?.length ?? 0}
                    </span>
                    <span className="text-muted-foreground">/300</span>
                  </p>
                </CardFooter>
              </Card>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

function getKoreanAgeFromDate(birthDate: Date): number {
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() >= birthDate.getDate());

  if (!hasHadBirthdayThisYear) {
    age--;
  }

  return age;
}
