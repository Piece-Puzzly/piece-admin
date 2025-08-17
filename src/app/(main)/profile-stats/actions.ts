"use server";

import { checkAuth } from "@/lib/actions/auth";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// $queryRaw의 반환 타입을 정의합니다.
interface RawQueryResult {
  group: string;
  count: bigint;
}

// groupBy의 반환 타입을 정의합니다.
type GroupByResult<K extends string> = ({
  [key in K]: string | null;
} & {
  _count: { [key in K]: number };
})[];

// 헬퍼 함수: RawQueryResult 타입을 받아 Record<string, number>로 변환합니다.
const transformRawQueryResult = (
  result: RawQueryResult[]
): Record<string, number> => {
  return result.reduce(
    (acc, row) => {
      acc[row.group] = Number(row.count);
      return acc;
    },
    {} as Record<string, number>
  );
};

// 헬퍼 함수: GroupByResult 타입을 받아 Record<string, number>로 변환합니다.
const transformGroupByResult = <K extends string>(
  result: GroupByResult<K>,
  field: K
): Record<string, number> => {
  return result.reduce(
    (acc, row) => {
      const key = row[field] || "미입력";
      acc[key] = row._count[field];
      return acc;
    },
    {} as Record<string, number>
  );
};

export async function getProfileStats() {
  await checkAuth();
  try {
    // 1. 각 통계에 대한 쿼리를 Promise 배열로 정의
    const queries = [
      prisma.profile.count(),

      // $queryRaw에 제네릭으로 반환 타입을 명시해줍니다.
      prisma.$queryRaw<RawQueryResult[]>`
        SELECT
          CASE
            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) < 20 THEN '10대'
            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) <= 24 THEN '20-24세'
            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) <= 29 THEN '25-29세'
            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) <= 34 THEN '30-34세'
            WHEN TIMESTAMPDIFF(YEAR, birthdate, CURDATE()) <= 39 THEN '35-39세'
            ELSE '40대 이상'
          END as \`group\`,
          COUNT(*) as count
        FROM profile
        WHERE birthdate IS NOT NULL
        GROUP BY \`group\`;
      `,

      prisma.$queryRaw<RawQueryResult[]>`
        SELECT
          CASE
            WHEN height < 160 THEN '~159cm'
            WHEN height <= 164 THEN '160-164cm'
            WHEN height <= 169 THEN '165-169cm'
            WHEN height <= 174 THEN '170-174cm'
            WHEN height <= 179 THEN '175-179cm'
            WHEN height <= 184 THEN '180-184cm'
            ELSE '185cm~'
          END as \`group\`,
          COUNT(*) as count
        FROM profile
        WHERE height IS NOT NULL
        GROUP BY \`group\`;
      `,

      prisma.$queryRaw<RawQueryResult[]>`
        SELECT
          CASE
            WHEN weight < 50 THEN '~49kg'
            WHEN weight <= 54 THEN '50-54kg'
            WHEN weight <= 59 THEN '55-59kg'
            WHEN weight <= 64 THEN '60-64kg'
            WHEN weight <= 69 THEN '65-69kg'
            WHEN weight <= 74 THEN '70-74kg'
            ELSE '75kg~'
          END as \`group\`,
          COUNT(*) as count
        FROM profile
        WHERE weight IS NOT NULL
        GROUP BY \`group\`;
      `,

      prisma.profile.groupBy({
        by: ["job"],
        _count: { job: true },
        orderBy: { _count: { job: "desc" } },
      }),
      prisma.profile.groupBy({
        by: ["location"],
        _count: { location: true },
        orderBy: { _count: { location: "desc" } },
      }),
      prisma.profile.groupBy({
        by: ["smoking_status"],
        _count: { smoking_status: true },
        orderBy: { _count: { smoking_status: "desc" } },
      }),
      prisma.profile.groupBy({
        by: ["sns_activity_level"],
        _count: { sns_activity_level: true },
        orderBy: { _count: { sns_activity_level: "desc" } },
      }),
    ] as const; // ✨ FIX: 배열을 튜플로 취급하도록 as const 추가

    // 2. Promise.all을 사용해 모든 쿼리를 동시에 실행
    const [
      totalProfiles,
      ageResult,
      heightResult,
      weightResult,
      jobResult,
      locationResult,
      smokingStatusResult,
      snsLevelResult,
    ] = await Promise.all(queries);

    if (totalProfiles === 0) {
      return { totalProfiles: 0 };
    }

    // 3. 이제 각 변수가 정확한 타입을 가지므로 타입 단언(as) 없이 안전하게 호출 가능
    return {
      totalProfiles,
      ageDistribution: transformRawQueryResult(ageResult),
      heightDistribution: transformRawQueryResult(heightResult),
      weightDistribution: transformRawQueryResult(weightResult),
      jobDistribution: transformGroupByResult(jobResult, "job"),
      locationDistribution: transformGroupByResult(locationResult, "location"),
      smokingStatusDistribution: transformGroupByResult(
        smokingStatusResult,
        "smoking_status"
      ),
      snsLevelDistribution: transformGroupByResult(
        snsLevelResult,
        "sns_activity_level"
      ),
    };
  } catch (error) {
    console.error("Failed to fetch profile stats with optimized query:", error);
    throw new Error("최적화된 프로필 통계를 가져오는 데 실패했습니다.");
  }
}

// ... (기존 actions.ts 코드 상단) ...

// User 타입을 정의하여 반환 값의 형태를 명시합니다.

export type UserIdentifier = {
  userId?: bigint;
  nickname: string;
};

// 반환 타입을 사용자와 전체 카운트로 변경합니다.
export type PaginatedUsersResponse = {
  users: UserIdentifier[];
  totalCount: number;
};

// 특정 카테고리와 값에 해당하는 사용자 목록을 조회하는 새로운 서버 액션
export async function getUsersInStatCategory(options: {
  category: string;
  value: string;
  page?: number;
  perPage?: number;
}): Promise<PaginatedUsersResponse> {
  await checkAuth();
  const { category, value, page = 1, perPage = 10 } = options;

  let whereCondition: Prisma.profileWhereInput = {};

  // WHERE 조건 생성 로직은 이전과 동일
  switch (category) {
    case "age":
      const currentYear = new Date().getFullYear();
      if (value === "10대") {
        whereCondition = {
          birthdate: { gte: new Date(`${currentYear - 19}-01-01`) },
        };
      } else if (value === "40대 이상") {
        whereCondition = {
          birthdate: { lte: new Date(`${currentYear - 40}-12-31`) },
        };
      } else {
        const [startAge, endAge] = value
          .replace("세", "")
          .split("-")
          .map(Number);
        const startYear = currentYear - endAge;
        const endYear = currentYear - startAge;
        whereCondition = {
          birthdate: {
            gte: new Date(`${startYear}-01-01`),
            lte: new Date(`${endYear}-12-31`),
          },
        };
      }
      break;

    case "height":
    case "weight":
      const unit = category === "height" ? "cm" : "kg";
      if (value.startsWith("~")) {
        const limit = parseInt(value.replace(`~`, "").replace(unit, ""));
        whereCondition = { [category]: { lte: limit } };
      } else if (value.endsWith("~")) {
        const limit = parseInt(value.replace(unit, "").replace("~", ""));
        whereCondition = { [category]: { gte: limit } };
      } else {
        const [gte, lte] = value.replace(unit, "").split("-").map(Number);
        whereCondition = { [category]: { gte, lte } };
      }
      break;

    default: // job, location, smoking_status, sns_activity_level
      whereCondition = {
        [category]: value === "미입력" || value === "미응답" ? null : value,
      };
      break;
  }

  const countQuery = prisma.profile.count({ where: whereCondition });

  // 2. 해당 페이지의 사용자 목록을 가져오는 쿼리 (skip, take 추가)
  const usersQuery = prisma.profile.findMany({
    where: whereCondition,
    skip: (page - 1) * perPage,
    take: perPage,
    select: {
      nickname: true,
      user_table: {
        select: {
          user_id: true,
        },
      },
    },
    orderBy: {
      user_table: {
        user_id: "desc",
      },
    },
  });

  // 두 쿼리를 Promise.all로 동시에 실행하여 성능 최적화
  const [totalCount, profiles] = await Promise.all([countQuery, usersQuery]);

  const users = profiles.map((p) => ({
    userId: p.user_table?.user_id,
    nickname: p.nickname,
  }));

  return { users, totalCount };
}
