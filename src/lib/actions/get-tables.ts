import prisma from "../prisma";
import { checkAuth } from "./auth";

export async function getAllTableNamesWithRowCount(): Promise<
  { name: string; count: number }[]
> {
  await checkAuth();
  const result = await prisma.$queryRawUnsafe<
    { TABLE_NAME: string; TABLE_ROWS: number }[]
  >(
    `
    SELECT table_name AS TABLE_NAME, table_rows AS TABLE_ROWS
    FROM information_schema.tables
    WHERE table_schema = 'dating-service-db'
  `
  );

  return result.map((row) => ({
    name: row.TABLE_NAME,
    count: row.TABLE_ROWS,
  }));
}

export async function fetchTableData({
  table,
  page,
  pageSize,
  sort,
  order,
}: {
  table: string;
  page: number;
  pageSize: number;
  sort?: string;
  order?: "asc" | "desc";
}) {
  await checkAuth();
  const skip = (page - 1) * pageSize;
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const model = (prisma as any)[table];

  if (!model) return { data: [], total: 0 };

  const orderBy = sort ? { [sort]: order ?? "asc" } : undefined;

  const [data, total] = await Promise.all([
    model.findMany({ orderBy, skip, take: pageSize }),
    model.count(),
  ]);

  return { data, total };
}
