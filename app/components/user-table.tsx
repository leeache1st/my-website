/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import data from "../api/data-users.json";

import "../globals.css";

import {
  Column,
  Table as ReactTable,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  getSortedRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

interface User {
  _id: string;
  avatar: string;
  birthdate: string;
  email: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  subscription: string;
  createdAt: string;
}

export default function UserTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: "Avatar",
        accessorKey: "avatar",
        enableColumnFilter: false,
        enableSorting: false,
        cell: (info) => (
          <img
            src={String(info.getValue())}
            alt="Avatar"
            className="w-8 h-8 rounded-full"
          />
        ),
        footer: (props) => props.column.id,
      },
      {
        header: "Last Name",
        accessorKey: "lastName",
        enableSorting: false,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: "First Name",
        accessorKey: "firstName",
        enableSorting: false,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        header: "Age",
        accessorKey: "age",
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        accessorKey: "gender",
        header: "Gender",
        enableSorting: false,
        footer: (props) => props.column.id,
      },
      {
        header: "Subscription",
        accessorKey: "subscription",
        enableSorting: false,
        footer: (props) => props.column.id,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableSorting: false,
        footer: (props) => props.column.id,
      },
      {
        header: "Birthdate",
        accessorKey: "birthdate",
        enableColumnFilter: false,
        footer: (props) => props.column.id,
      },
      {
        header: "Created At",
        accessorKey: "createdAt",
        enableColumnFilter: false,
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  return (
    <Table
      {...{
        data,
        columns,
        sorting,
        setSorting,
      }}
    />
  );
}

function Table({
  data,
  columns,
  sorting,
  setSorting,
}: {
  data: User[];
  columns: ColumnDef<User>[];
  sorting: SortingState;
  setSorting: any;
}) {
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    debugTable: true,
  });

  return (
    <div>
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <th
                    className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        {...{
                          className: header.column.getCanSort()
                            ? "cursor-pointer select-none flex justify-between"
                            : "",
                          onClick: header.column.getToggleSortingHandler(),
                        }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanFilter() ? (
                          <div>
                            <Filter column={header.column} table={table} />
                          </div>
                        ) : (
                          <div>
                            {{
                              asc: " ↑",
                              desc: " ↓",
                            }[header.column.getIsSorted() as string] ?? null}
                          </div>
                        )}
                      </div>
                    )}
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="bg-white divide-y  divide-gray-200">
          {table.getRowModel().rows.map((row) => {
            return (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <td className="px-6 py-4 whitespace-nowrap" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className=" flex  justify-center">
        <button
          className="p-2 m-2 border rounded"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          {"<<"}
        </button>
        <button
          className="p-2 m-2 border rounded"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          {"<"}
        </button>
        <button
          className="p-2 m-2 border rounded"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          {">"}
        </button>
        <button
          className="p-2 m-2 border rounded"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          {">>"}
        </button>
        <span className="flex items-center m-2 p-2">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
        </span>
        <span className="flex items-center m-2 p-2">
          | Go to page:
          <input
            type="number"
            defaultValue={table.getState().pagination.pageIndex + 1}
            onChange={(e) => {
              const page = e.target.value ? Number(e.target.value) - 1 : 0;
              table.setPageIndex(page);
            }}
            className="border p-1 rounded w-16"
          />
        </span>
        <select
          className="flex items-center m-2 p-2 border rounded "
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
        >
          {[10, 30, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
function Filter({
  column,
  table,
}: {
  column: Column<any, any>;
  table: ReactTable<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  return typeof firstValue === "number" ? (
    <input
      type="number"
      value={(columnFilterValue as [number, number])?.[1] ?? ""}
      onChange={(e) =>
        column.setFilterValue((old: [number, number]) => [
          old?.[0],
          e.target.value,
        ])
      }
      className="w-24 border shadow rounded"
    />
  ) : (
    <input
      type="text"
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder={`Search...`}
      className="border rounded-sm"
    />
  );
}
