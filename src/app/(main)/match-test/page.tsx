import { getInstantMatchConfig } from "@/lib/actions/match-config";
import InstantMatchConfigCard from "./_components/instant-match-config-card";
import InstantMatchSimulator from "./_components/instant-match-simulator";
import MatchingLogicExplainer from "./_components/matching-logic-explainer";

// 즉시 매칭 테스트: 백엔드 /matches/test/instants API로 두 유저 사이 매칭 가능 여부를 확인한다.
export default async function InstantMatchTestPage() {
  // 설정값 조회 실패는 페이지 자체를 깨지 않도록 방어한다.
  const config = await getInstantMatchConfig().catch(() => null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">즉시 매칭 테스트</h1>
        <p className="text-sm text-muted-foreground">
          즉시 매칭 필터가 어떤 결과를 내는지 미리 확인합니다. 실제 매칭/알림은
          발생하지 않습니다.
        </p>
      </div>

      {config ? (
        <InstantMatchConfigCard config={config} />
      ) : (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          즉시 매칭 설정값을 불러오지 못했습니다.
        </div>
      )}

      <MatchingLogicExplainer />

      <InstantMatchSimulator />
    </div>
  );
}
