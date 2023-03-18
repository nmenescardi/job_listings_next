'use client';
import React, { useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import Select, { MultiValue } from 'react-select';

import { Listing } from '@/utils/types';
import { Provider, providers } from '@/data/providers';

type TableProps = {
  listings: Listing[];
};

const Table: React.FC<TableProps> = ({ listings }) => {
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<MultiValue<Provider>>();

  const columnHelper = createColumnHelper<Listing>();

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
    }),
    columnHelper.accessor('salaryRange', {
      header: 'Salary Range',
    }),
    columnHelper.accessor('provider', {
      header: 'Provider',
    }),
    columnHelper.accessor('createdAt', {
      header: 'Created At',
    }),
    columnHelper.accessor('tags', {
      header: 'Tags',
      cell: ({ getValue }) => getValue().join(', '),
    }),
    columnHelper.accessor('location', {
      header: 'Location',
    }),
  ];

  const table = useReactTable({
    data: listings,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (!listings) {
    return <div>No data available</div>;
  }

  return (
    <>
      <section>
        <div className="filters">
          <div>
            <input
              type="checkbox"
              id="only_remote"
              onChange={() => setOnlyRemote((prevState) => !prevState)}
            />

            <label
              htmlFor="only_remote"
              className="ml-2 select-none cursor-pointer"
            >
              Only Remote
            </label>
          </div>

          <div>
            <Select
              onChange={(option) => {
                console.log('changed to:  ', option);
                setSelectedProvider(option);
              }}
              isMulti
              options={providers}
              placeholder="Select providers to filter..."
            />
          </div>
        </div>

        <div>Current filters:</div>
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    style={{
                      borderBottom: '1px solid gray',
                      textAlign: 'left',
                      padding: '1rem',
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    style={{
                      borderBottom: '1px solid gray',
                      padding: '1rem',
                    }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="h-2" />
        <div className="flex items-center gap-2">
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {'<<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {'<'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {'>'}
          </button>
          <button
            className="border rounded p-1"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
          </button>
          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
            </strong>
          </span>

          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </section>
    </>
  );
};

export default Table;
