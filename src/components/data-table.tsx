"use client";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  variant?: "default" | "secondary";
  columnOptions?: {
    [key: string]: { tableHead?: string };
  };
}

export function DataTable<TData, TValue>({
  columns,
  data,
  variant = "default",
  columnOptions,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader
        className={cn({ "bg-gray-light-3": variant === "secondary" })}
      >
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  className={cn(
                    cn({
                      "border-0 bg-gray-light-3 py-[8px]":
                        variant === "secondary",
                    }),
                    columnOptions?.default?.tableHead,
                    columnOptions?.[header.id]?.tableHead
                  )}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow
              className={cn({ "h-fit": variant === "secondary" })}
              key={row.id}
              data-state={row.getIsSelected() && "selected"}
            >
              {row.getVisibleCells().map((cell) => (
                <TableCell
                  key={cell.id}
                  className={cn({
                    "py-[10px] text-center text-[16px]":
                      variant === "secondary",
                  })}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow className={cn({ "h-fit": variant === "secondary" })}>
            <TableCell
              colSpan={columns.length}
              className={cn(
                {
                  "py-[10px] text-center text-[16px]": variant === "secondary",
                },
                "h-24 text-center"
              )}
            >
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
