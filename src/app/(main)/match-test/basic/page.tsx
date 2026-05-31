import { getBasicMatchConfig } from "@/lib/actions/match-config";
import BasicFilterTest from "../_components/basic-filter-test";
import BasicMatchConfigCard from "../_components/basic-match-config-card";
import BasicMatchingLogicExplainer from "../_components/basic-matching-logic-explainer";

// BASIC 매칭 테스트: 백엔드 /matches/test/basic API로 후보군 수집 결과를 확인한다.
// 즉시 매칭과 달리 N회·N일 조건이 아니라 과거 매칭 이력 자체로 pass되는 등 룰이 다르다.
export default async function BasicMatchTestPage() {
  // 설정값 조회 실패는 페이지 자체를 깨지 않도록 방어한다.
  const config = await getBasicMatchConfig().catch(() => null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">BASIC 매칭 테스트</h1>
        <p className="text-sm text-muted-foreground">
          BASIC 매칭 로직(주기적 일괄 매칭)의 후보군 수집 결과를 미리 확인합니다.
          실제 매칭/알림은 발생하지 않습니다.
        </p>
      </div>

      {config ? (
        <BasicMatchConfigCard config={config} />
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          BASIC 매칭 설정값을 불러오지 못했습니다.
        </div>
      )}

      <BasicMatchingLogicExplainer />

      <BasicFilterTest />
    </div>
  );
}
