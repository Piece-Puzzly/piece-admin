// ✅ 수정된 page.tsx
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchTableData } from "@/lib/actions/get-tables";

import Link from "next/link";
import { notFound } from "next/navigation";

export default async function TablePage({
  params,
  searchParams,
}: {
  params: Promise<{ table: string }>;
  searchParams?: Promise<{ page?: string; sort?: string; order?: string }>;
}) {
  const { table: tableName } = await params;
  const searchParams_ = await searchParams;
  const sort = searchParams_?.sort || undefined;
  const order = searchParams_?.order === "desc" ? "desc" : "asc";
  const page = Number(searchParams_?.page || "1");
  const pageSize = 20;

  const { data, total } = await fetchTableData({
    table: tableName,
    page,
    pageSize,
    sort,
    order,
  });

  if (!data || !Array.isArray(data)) notFound();

  const columns = data[0] ? Object.keys(data[0]) : [];

  return (
    <div className="p-0 max-w-full w-full overflow-auto">
      <Table className="">
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col}>
                <Link
                  href={{
                    pathname: `/tables/${tableName}`,
                    query: {
                      page,
                      sort: col,
                      order: sort === col && order === "asc" ? "desc" : "asc",
                    },
                  }}
                >
                  <Button variant="ghost" size="sm" className="px-1">
                    {col} {sort === col ? (order === "asc" ? "↑" : "↓") : ""}
                  </Button>
                </Link>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row: Record<string, unknown>, rowIdx: number) => (
            <TableRow key={rowIdx}>
              {columns.map((col) => (
                <TableCell key={col}>{String(row[col])}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-4 items-center p-4">
        {page > 1 ? (
          <Link
            href={{
              pathname: `/tables/${tableName}`,
              query: { page: page - 1, sort, order },
            }}
          >
            <Button variant="outline">이전</Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            이전
          </Button>
        )}

        <span className="text-sm text-muted-foreground">
          페이지 {page} / {Math.ceil(total / pageSize)}
        </span>

        {page * pageSize < total ? (
          <Link
            href={{
              pathname: `/tables/${tableName}`,
              query: { page: page + 1, sort, order },
            }}
          >
            <Button variant="outline">다음</Button>
          </Link>
        ) : (
          <Button variant="outline" disabled>
            다음
          </Button>
        )}
      </div>
    </div>
  );
}
