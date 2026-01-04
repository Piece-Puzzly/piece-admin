"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toLocaleDateString } from "@/lib/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { KpiData } from "../actions";

interface KpiHistoryTableProps {
  history: KpiData[] | null;
}

export function KpiHistoryTable({ history }: KpiHistoryTableProps) {
  const [activeTab, setActiveTab] = useState("users");

  return (
    <Card className="col-span-1 md:col-span-2">
      <CardHeader>
        <CardTitle>
          
          KPI 최근 5일 기록
          <Link href="/tables/daily_kpi" className="inline-flex">
            <ArrowUpRight className="size-4 ml-2" />
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-12">
            <TabsTrigger value="users">사용자 지표</TabsTrigger>
            <TabsTrigger value="matches">매칭 지표</TabsTrigger>
          </TabsList>

          {/* 사용자 지표 탭 */}
          <TabsContent value="users">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">날짜</TableHead>
                    <TableHead className="text-right">신규 가입</TableHead>
                    <TableHead className="text-right">활성 사용자</TableHead>
                    <TableHead className="text-right">프로필 미작성</TableHead>
                    <TableHead className="text-right">프로필 생성</TableHead>
                    <TableHead className="text-right">프로필 승인</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history && history.length > 0 ? (
                    history.map((kpi) => (
                      <TableRow key={`user-${kpi.id}`}>
                        <TableCell className="font-medium">
                          {toLocaleDateString(kpi.targetDate)}
                        </TableCell>

                        <TableCell className="text-right">
                          {kpi.newUserCount?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.activeUserCount?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.registerStatusUserCount?.toLocaleString() ??
                            0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.createdProfileUserCount?.toLocaleString() ??
                            0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.approvedProfileUserCount?.toLocaleString() ??
                            0}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* 매칭 지표 탭 */}
          <TabsContent value="matches">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[120px]">날짜</TableHead>
                    <TableHead className="text-right">매칭 생성</TableHead>
                    <TableHead className="text-right">상호 수락</TableHead>
                    <TableHead className="text-right">확인 유저</TableHead>
                    <TableHead className="text-right">미확인 유저</TableHead>
                    <TableHead className="text-right">수락 유저</TableHead>
                    <TableHead className="text-right">거절 유저</TableHead>
                    <TableHead className="text-right">차단 유저</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {history && history.length > 0 ? (
                    history.map((kpi) => (
                      <TableRow key={`match-${kpi.id}`}>
                        <TableCell className="font-medium">
                          {toLocaleDateString(kpi.targetDate)}
                        </TableCell>

                        <TableCell className="text-right">
                          {kpi.createdMatchCount?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.mutuallyAcceptedMatchCount?.toLocaleString() ??
                            0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.checkedMatchUserCount?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.uncheckedMatchUserCount?.toLocaleString() ??
                            0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.acceptedMatchUserCount?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.refusedMatchUserCount?.toLocaleString() ?? 0}
                        </TableCell>
                        <TableCell className="text-right">
                          {kpi.blockedMatchUserCount?.toLocaleString() ?? 0}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        데이터가 없습니다.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
