/** @format */

"use client";

import * as React from "react";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  getFilteredRowModel,
  getSortedRowModel,
  FilterFn,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Button } from "./ui/button";
import { Input } from "@/components/ui/input";
import { Info, ArrowUpDown } from "lucide-react";

// Utility function to convert data to CSV
const exportToCSV = (data: any[], columns: ColumnDef<any, any>[]) => {
  const csvRows = [];
  const headers = columns.map((col) => col.header);
  csvRows.push(headers.join(','));

  for (const row of data) {
    const values = columns.map((col) => {
      const cellValue = row[col.accessorKey as keyof typeof row];
      return `"${cellValue}"`;
    });
    csvRows.push(values.join(','));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.setAttribute('hidden', '');
  a.setAttribute('href', url);
  a.setAttribute('download', 'data.csv');
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  onRowClick?: (row: TData) => void;
  selectedRows?: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  selectedRows,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const fuzzyFilter: FilterFn<TData> = (row, columnId, value) => {
    const cellValue = row.getValue(columnId);
    return String(cellValue).toLowerCase().includes(value.toLowerCase());
  };

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    filterFns: {
      fuzzyName: fuzzyFilter,
      fuzzyLocation: fuzzyFilter,
      fuzzyIdentifier: fuzzyFilter,
    },
    debugTable: true, // Optional: Enable debugging to see console logs
  });

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Search..."
          value={table.getState().globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="max-w-sm"
        />
        <Info className="text-gray-500 ml-10 mr-2" />
        <p className="text-lg text-gray-500">
          Search by name, location, or identifier
        </p>
        <ArrowUpDown className="text-gray-500 ml-4 mr-2"/>
        <p className="text-lg text-gray-500">
          Sort by clicking on the column headers
        </p>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => exportToCSV(data, columns)}
        >
          Export to CSV
        </Button>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    className={
                      header.column.getIsSorted()
                        ? header.column.getIsSorted() === 'asc'
                          ? 'sort-asc'
                          : 'sort-desc'
                        : ''
                    }
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={() =>
                    onRowClick ? onRowClick(row.original) : undefined
                  }
                  className={
                    selectedRows && selectedRows.includes(row.original)
                      ? "bg-gray-200"
                      : undefined
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
