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
import { Tags, tags } from '@/data/tags';
import {
  FunnelIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';

import { Button, Icon } from '@tremor/react';

type TableProps = {
  listings: Listing[];
};

const Table: React.FC<TableProps> = ({ listings }) => {
  const [onlyRemote, setOnlyRemote] = useState(false);
  const [selectedProvider, setSelectedProvider] =
    useState<MultiValue<Provider>>();
  const [selectedTags, setSelectedTags] = useState<MultiValue<Tags>>();
  const [hideFilters, setHideFilters] = useState(true);

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
        <div>
          <button onClick={() => setHideFilters((prevState) => !prevState)}>
            <Icon icon={FunnelIcon} size="md" className="text-blue-500 px-0" />
            <span>Filter</span>
          </button>
          <div
            className={`
              absolute bg-white p-5 border shadow-lg transition z-10 rounded-lg ring-1 min-w-[350px]
              ${hideFilters ? 'hidden' : ''}
            `}
          >
            <div className="">
              <input
                type="checkbox"
                id="only_remote"
                className="mb-4"
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
              <label htmlFor="tags_select">Providers:</label>
              <Select
                onChange={(option) => {
                  console.log('changed to:  ', option);
                  setSelectedProvider(option);
                }}
                isMulti
                options={providers}
                placeholder="Select providers to filter..."
                className="mb-3 mt-1"
              />
            </div>

            <div>
              <label htmlFor="tags_select">Tags:</label>
              <Select
                id="tags_select"
                onChange={(option) => {
                  console.log('changed to:  ', option);
                  setSelectedTags(option);
                }}
                isMulti
                options={tags}
                placeholder="Select tags to filter..."
                className="mt-1"
              />
            </div>

            <div className="mt-8 flex justify-between">
              <Button size="xs" icon={ArrowPathIcon}>
                {/* TODO pass loading */}
                Apply Filters
              </Button>

              <Button
                size="xs"
                variant="secondary"
                color="red"
                icon={XMarkIcon}
              >
                Clear Filters
              </Button>
            </div>
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
