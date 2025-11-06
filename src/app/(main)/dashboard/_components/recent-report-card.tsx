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
import { toLocaleDateString } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { RecentReport } from "../actions";
// 1. UserInfoButton을 import 합니다.

interface RecentReportsCardProps {
  reports: RecentReport[] | null;
  reportsError: string | null;
}

export function RecentReportsCard({
  reports,
  reportsError,
}: RecentReportsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          최근 신고 내역(5개)
          <Link href="/report/reported" className="inline-flex">
            <ArrowUpRight className="size-4 ml-2" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">신고 일시</TableHead>
              <TableHead>신고자</TableHead>
              <TableHead>신고 대상</TableHead>
              <TableHead className="text-right">신고 사유</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reports ? (
              reports.length > 0 ? (
                reports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">
                      {report.createdAt
                        ? toLocaleDateString(report.createdAt)
                        : "-"}
                    </TableCell>

                    {/* 2. '신고자' 셀의 내용을 UserInfoButton으로 교체합니다. */}
                    <TableCell>
                      <UserInfoButton
                        userId={report.reporterId}
                        nickname={report.reporter || undefined}
                      />
                    </TableCell>

                    {/* 3. '신고 대상' 셀의 내용을 UserInfoButton으로 교체합니다. */}
                    <TableCell>
                      <UserInfoButton
                        userId={report.reportedUserId}
                        nickname={report.reportedUser || undefined}
                      />
                    </TableCell>

                    <TableCell className="text-right truncate max-w-xs">
                      {report.reason || "사유 없음"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    최근 신고 내역이 없습니다.
                  </TableCell>
                </TableRow>
              )
            ) : (
              reportsError
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
