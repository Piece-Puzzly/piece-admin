import ProfileStatus from "@/components/profile-status";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserInfoButton from "@/components/user-info/user-info-button";
import { profileStatusInfo } from "@/lib/constants";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { IncompleteProfile } from "../actions";

interface IncompleteProfilesCardProps {
  profiles: IncompleteProfile[] | null;
}

export function IncompleteProfilesCard({
  profiles,
}: IncompleteProfilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          심사가 필요한 프로필
          <Link
            href="/profiles/profile?status=NEEDS_REVIEW"
            className="inline-flex"
          >
            <ArrowUpRight className="size-4 ml-2" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>유저</TableHead>
              <TableHead>상태</TableHead>
              <TableHead className="text-right">프로필 생성일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {profiles && profiles.length > 0 ? (
              profiles.map((profile) => (
                <TableRow key={profile.profileId}>
                  <TableCell>
                    {/* Display user info with the interactive button */}
                    <UserInfoButton
                      userId={profile.userId}
                      nickname={profile.nickname || undefined}
                    />
                  </TableCell>
                  <TableCell>
                    <ProfileStatus
                      status={
                        profileStatusInfo.find((e) => e.key === profile.status)
                          ?.name || ""
                      }
                    />
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {profile.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString("ko-KR")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  미완료 프로필이 없습니다.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
