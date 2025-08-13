"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserAllInfo } from "@/lib/actions/get-user";
import { contactsMap, profileStatusInfo } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { Prisma } from "@prisma/client";
import { Circle, CircleCheck } from "lucide-react";
import Image from "next/image";

import { useEffect, useState } from "react";
import {
  InfoCard,
  InfoCardContent,
  InfoCardHeader,
  InfoCardTitle,
} from "./info-card";

export default function UserInfo({ id }: { id: number | bigint }) {
  const [user, setUser] = useState<Awaited<
    ReturnType<typeof getUserAllInfo>
  > | null>(null);
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
          <ProfileCard profile={user.profile} />
          <ValuePickCard valuePick={user.profile.profile_value_pick} />
          <ValueTalkCard valueTalk={user.profile.profile_value_talk} />
        </>
      ) : (
        "프로필 등록 안 됨"
      )}
    </main>
  );
}

function UserCard({
  user,
}: {
  user: Awaited<ReturnType<typeof getUserAllInfo>>;
}) {
  return (
    user && (
      <Card>
        <CardHeader>
          <CardTitle>유저 정보</CardTitle>
          <CardDescription>user_table</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2">
            <p>
              <span className="font-medium">생성:</span>{" "}
              {user.created_at
                ? new Date(user.created_at).toLocaleString("ko-KR", {
                    timeZone: "UTC",
                  })
                : "없음"}
            </p>
            <p>
              <span className="font-medium">업데이트:</span>{" "}
              {user.updated_at
                ? new Date(user.updated_at).toLocaleString("ko-KR", {
                    timeZone: "UTC",
                  })
                : "없음"}
            </p>
            <p>
              <span className="font-medium">유저 ID:</span>{" "}
              {user.user_id.toString()}
            </p>
            <p>
              <span className="font-medium">전화번호:</span>{" "}
              {user.phone ?? "없음"}
            </p>
            <p>
              <span className="font-medium">역할:</span> {user.role ?? "없음"}
            </p>
            <p>
              <span className="font-medium">어드민 여부:</span>{" "}
              {user.is_admin ? "예" : "아니요"}
            </p>
          </div>
          <div>
            <div className="font-medium">약관 동의</div>
            {user.term_agreement.map(
              ({ term_id, agreed_at, term: { title } }) => (
                <div key={term_id}>
                  {title}(
                  {agreed_at.toLocaleString("ko-KR", {
                    timeZone: "UTC",
                  })}
                  )
                </div>
              )
            )}
          </div>
        </CardContent>
      </Card>
    )
  );
}

type ProfileWithAll = Prisma.profileGetPayload<{
  include: {
    profile_image: true;
    profile_value_pick: {
      include: { value_pick: true };
    };
    profile_value_talk: {
      include: { value_talk: true };
    };
  };
}>;

function ProfileCard({ profile }: { profile: ProfileWithAll }) {
  const profileStatusDetail = profileStatusInfo.find(
    (e) => e.key === profile.profile_status
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>프로필 정보</CardTitle>
        <CardDescription>profile</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div>
            <span className="font-medium">생성: </span>
            <span>
              {profile.created_at &&
                profile.created_at.toLocaleString("ko-KR", {
                  timeZone: "UTC",
                })}
            </span>
          </div>
          <div>
            <span className="font-medium">업데이트: </span>
            <span>
              {profile.updated_at &&
                profile.updated_at.toLocaleString("ko-KR", {
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
          {profile.image_url && (
            <Image
              width={128}
              height={128}
              src={profile.image_url}
              alt="Profile Image"
              className="w-24 h-auto"
            />
          )}
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
                만{" "}
                {profile.birthdate && getKoreanAgeFromDate(profile.birthdate)}세
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
            <InfoCardContent>{profile.smoking_status}</InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>SNS 활동</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>{profile.sns_activity_level}</InfoCardContent>
          </InfoCard>
          <InfoCard>
            <InfoCardHeader>
              <InfoCardTitle>생년월일</InfoCardTitle>
            </InfoCardHeader>
            <InfoCardContent>
              {profile.birthdate?.toLocaleDateString("ko-KR")}
            </InfoCardContent>
          </InfoCard>
        </div>
        <div className="space-y-2">
          <div className="font-medium">연락처 </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(profile.contacts as Record<string, string>).map(
              (e) => (
                <InfoCard key={e[0]}>
                  <InfoCardHeader>
                    <InfoCardTitle>{contactsMap[e[0]] ?? e[0]} </InfoCardTitle>
                  </InfoCardHeader>
                  <InfoCardContent>{e[1]}</InfoCardContent>
                </InfoCard>
              )
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ValuePickCard({
  valuePick,
}: {
  valuePick: ProfileWithAll["profile_value_pick"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>가치관 Pick</CardTitle>
        <CardDescription>profile-value-pick</CardDescription>
      </CardHeader>

      <CardContent className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {valuePick.map(
          ({
            value_pick: { category, question, answers },
            selected_answer,
          }) => {
            const answer = JSON.parse(answers) as Record<string, string>;
            return (
              <div key={question}>
                <p className="text-primary font-medium">{category}</p>
                <p className="text-lg font-medium">{question}</p>
                <div className="mt-2">
                  {["1", "2"].map((e) => (
                    <div className="flex gap-2 items-center" key={e}>
                      {String(selected_answer) === e ? (
                        <CircleCheck className={cn("size-4")} />
                      ) : (
                        <Circle className="size-4 stroke-muted-foreground" />
                      )}

                      <p
                        className={cn("text-muted-foreground", {
                          "text-foreground": String(selected_answer) === e,
                        })}
                      >
                        {answer[e]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }
        )}
      </CardContent>
    </Card>
  );
}

function ValueTalkCard({
  valueTalk,
}: {
  valueTalk: ProfileWithAll["profile_value_talk"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>가치관 Talk</CardTitle>
        <CardDescription>profile-value-talk</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6 break-all">
        {valueTalk.map(
          ({ value_talk: { category, title }, answer, summary }) => {
            // const answer = JSON.parse(answers) as Record<string, string>;
            return (
              <div key={title}>
                <p className="text-primary font-medium">{category}</p>
                <p className="text-lg font-medium">{title}</p>
                <Card className="bg-background my-2 py-4">
                  <CardContent className="px-4  break-all">
                    <p>{answer}</p>
                  </CardContent>
                  <CardFooter className="justify-end">
                    <p>
                      <span className="text-primary">{answer?.length}</span>
                      <span className="text-muted-foreground">/300</span>
                    </p>
                  </CardFooter>
                </Card>

                <p className="text-muted-foreground">요약 : {summary}</p>
              </div>
            );
          }
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
