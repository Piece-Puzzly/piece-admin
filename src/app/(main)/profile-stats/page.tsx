import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Briefcase,
  Cake,
  ChevronRight,
  Cigarette,
  MapPin,
  Ruler,
  Users,
  Weight,
  Wifi,
} from "lucide-react";
import { UserListDialog } from "./_components/user-list-dialog";
import { getProfileStats } from "./actions";

export const dynamic = "force-dynamic";

// 통계 데이터를 시각화하는 재사용 컴포넌트
function StatBarList({
  data,
  category,
}: {
  data: Record<string, number>;
  category: string;
}) {
  const total = Object.values(data).reduce((sum, count) => sum + count, 0);
  if (total === 0) {
    return <p className="text-sm text-muted-foreground">데이터가 없습니다.</p>;
  }

  // 카테고리 이름을 한글로 변환하는 헬퍼

  return (
    <div className="space-y-4">
      {Object.entries(data).map(([label, count]) => {
        const percentage = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={label} className="space-y-1">
            <div className="flex justify-between text-sm font-medium">
              <span className="flex items-center">{label}</span>
              {/* UserListDialog를 사용하여 숫자 부분을 클릭 가능한 트리거로 만듭니다. */}
              <UserListDialog
                category={category}
                value={label}
                title={`'${label}' 그룹 사용자 목록 (${count}명)`}
                trigger={
                  <Button
                    variant="ghost"
                    className="pt-2 px-4 -my-2 -mx-4 h-auto"
                  >
                    {count.toLocaleString()}명{" "}
                    <ChevronRight className="stroke-muted-foreground" />
                  </Button>
                }
              />
            </div>
            <div className="h-2 w-full rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default async function ProfileStatsPage() {
  const stats = await getProfileStats();

  return (
    <div className="flex-1 space-y-4 ">
      <Card className="max-w-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">총 프로필</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalProfiles}</div>
          <p className="text-xs text-muted-foreground">전체 사용자 프로필 수</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 @2xl:grid-cols-2">
        {/* 각 StatBarList에 category prop을 전달합니다. */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> 지역 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList
              category="location"
              data={stats.locationDistribution || {}}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cake className="mr-2 h-5 w-5" /> 나이 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList category="age" data={stats.ageDistribution || {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Briefcase className="mr-2 h-5 w-5" /> 직업 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList category="job" data={stats.jobDistribution || {}} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ruler className="mr-2 h-5 w-5" /> 키 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList
              category="height"
              data={stats.heightDistribution || {}}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Weight className="mr-2 h-5 w-5" /> 몸무게 분포
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList
              category="weight"
              data={stats.weightDistribution || {}}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Cigarette className="mr-2 h-5 w-5" /> 흡연 여부
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList
              category="smoking_status"
              data={stats.smokingStatusDistribution || {}}
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wifi className="mr-2 h-5 w-5" /> SNS 활동 수준
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StatBarList
              category="sns_activity_level"
              data={stats.snsLevelDistribution || {}}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
