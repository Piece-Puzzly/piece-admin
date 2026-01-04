"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserAllInfo, UserFullInfoResponse } from "@/lib/actions/get-user";
import { profileStatusInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Circle, CircleCheck } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

const DEFAULT_PROFILE_IMAGE = "/default-profile.svg";

function getImageSrc(url: string | null | undefined): string {
  if (!url || typeof url !== "string") return DEFAULT_PROFILE_IMAGE;
  const trimmed = url.trim();
  if (trimmed === "" || trimmed === "null") return DEFAULT_PROFILE_IMAGE;
  if (trimmed.startsWith("https://")) return trimmed;
  return DEFAULT_PROFILE_IMAGE;
}
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "./info-card";

export default function UserInfo({ id }: { id: number | bigint }) {
  const [user, setUser] = useState<UserFullInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setError("ID 없음");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const data = await getUserAllInfo(id);
        setUser(data);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;
  if (!user) return <div>유저 없음</div>;

  return (
    <main className="space-y-4">
      <UserCard user={user} />
      {user.profile ? (
        <>
          <ProfileCard profile={user.profile} profileImages={user.profileImages} />
          <ValuePickCard valuePicks={user.valuePicks} />
          <ValueTalkCard valueTalks={user.valueTalks} />
        </>
      ) : (
        "프로필 등록 안 됨"
      )}
    </main>
  );
}

function UserCard({ user }: { user: UserFullInfoResponse }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>유저 정보</CardTitle>
        <CardDescription>user_table</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <p suppressHydrationWarning>
            <span className="font-medium">생성:</span>{" "}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleString("ko-KR", {
                  timeZone: "UTC",
                })
              : "없음"}
          </p>
          <p>
            <span className="font-medium">유저 ID:</span>{" "}
            {user.userId.toString()}
          </p>
          <p>
            <span className="font-medium">전화번호:</span>{" "}
            {user.phoneNumber ?? "없음"}
          </p>
          <p>
            <span className="font-medium">역할:</span> {user.role ?? "없음"}
          </p>
          <p>
            <span className="font-medium">어드민 여부:</span>{" "}
            {user.isAdmin ? "예" : "아니요"}
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
}: {
  profile: ProfileInfo;
  profileImages: ProfileImageInfo[];
}) {
  const profileStatusDetail = profileStatusInfo.find(
    (e) => e.key === profile.profileStatus
  );

  const birthdate = profile.birthdate ? new Date(profile.birthdate) : null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>profile</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div suppressHydrationWarning>
            <span className="font-medium">생성: </span>
            <span>
              {profile.createdAt &&
                new Date(profile.createdAt).toLocaleString("ko-KR", {
                  timeZone: "UTC",
                })}
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
            {profileStatusDetail?.name}
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
              <span>{profile.description}</span>
            </p>
            <p className="text-xl text-primary font-semibold">
              <span>{profile.nickname}</span>
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
                만 {birthdate && getKoreanAgeFromDate(birthdate)}세
              </div>
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>키</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {profile.height}
              <span className="text-base font-normal">cm</span>
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>몸무게</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {profile.weight}
              <span className="text-base font-normal">kg</span>
            </InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>활동 지역</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>{profile.location}</InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>직업</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>{profile.job}</InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>흡연</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>{profile.smokingStatus}</InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>SNS 활동</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>{profile.snsActivityLevel}</InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>생년월일</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent suppressHydrationWarning>
              {birthdate?.toLocaleDateString("ko-KR", {
                timeZone: "UTC",
              })}
            </InfoCardContent>
          </InfoCard>
        </div>
        {profileImages.length > 0 && (
          <div className="space-y-2">
            <div className="font-medium">프로필 이미지</div>
            <div className="flex flex-wrap gap-2">
              {profileImages.map((img) => (
                <div key={img.profileImageId} className="relative">
                  <Image
                    width={80}
                    height={80}
                    src={getImageSrc(img.imageUrl)}
                    alt="Profile Image"
                    className="w-20 h-20 object-cover rounded"
                  />
                  <span className="text-xs text-muted-foreground">{img.status}</span>
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
  if (!valuePicks || valuePicks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>가치관 Pick</CardTitle>
        <CardDescription>profile-value-pick</CardDescription>
      </CardHeader>

      <CardContent className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {valuePicks.map((pick) => (
          <div key={pick.id}>
            <p className="text-primary font-medium">{pick.category}</p>
            <p className="text-lg font-medium">{pick.question}</p>
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
        ))}
      </CardContent>
    </Card>
  );
}

type ValueTalkInfo = UserFullInfoResponse["valueTalks"][number];

function ValueTalkCard({ valueTalks }: { valueTalks: ValueTalkInfo[] }) {
  if (!valueTalks || valueTalks.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>가치관 Talk</CardTitle>
        <CardDescription>profile-value-talk</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 break-all">
        {valueTalks.map((talk) => (
          <div key={talk.id}>
            <p className="text-primary font-medium">{talk.category}</p>
            <p className="text-lg font-medium">{talk.summary}</p>
            <Card className="bg-background my-2 py-4">
              <CardContent className="px-4 break-all">
                <p>{talk.answer}</p>
              </CardContent>
              <CardFooter className="justify-end">
                <p>
                  <span className="text-primary">{talk.answer?.length ?? 0}</span>
                  <span className="text-muted-foreground">/300</span>
                </p>
              </CardFooter>
            </Card>
          </div>
        ))}
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
