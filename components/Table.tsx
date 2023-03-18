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

import { Button, Icon, Badge } from '@tremor/react';

type TableProps = {
  listings: Listing[];
};

interface Filters {
  onlyRemote?: boolean;
  provider?: MultiValue<Provider>;
  tags?: MultiValue<Tags>;
}

const initialFilters: Filters = {
  onlyRemote: false,
};

const Table: React.FC<TableProps> = ({ listings }) => {
  const [hideFilters, setHideFilters] = useState(true);
  const [activeFilters, setActiveFilters] = useState<Filters>(initialFilters);
  const [newFilters, setNewFilters] = useState<Filters>(initialFilters);
  const [loadingResults, setLoadingResults] = useState(false);
  const columnHelper = createColumnHelper<Listing>();

  const handleApplyFilters = async () => {
    setLoadingResults(true);

    // TODO remove and perform API call
    const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));
    await delay(1000);

    setActiveFilters({ ...newFilters });

    setLoadingResults(false);
    setHideFilters(true);
  };

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
                onChange={() =>
                  setNewFilters((newFilters) => ({
                    ...newFilters,
                    onlyRemote: newFilters.onlyRemote
                      ? !newFilters.onlyRemote
                      : true,
                  }))
                }
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
                onChange={(options) => {
                  setNewFilters((newFilters) => ({
                    ...newFilters,
                    provider: options,
                  }));
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
                onChange={(options) => {
                  setNewFilters((newFilters) => ({
                    ...newFilters,
                    tags: options,
                  }));
                }}
                isMulti
                options={tags}
                placeholder="Select tags to filter..."
                className="mt-1"
              />
            </div>

            <div className="mt-8 flex justify-between">
              <Button
                size="xs"
                icon={ArrowPathIcon}
                onClick={handleApplyFilters}
                loading={!!loadingResults}
              >
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

        <div className="flex gap-2 mt-3">
          <span>Active filters:</span>
          <div className="inline">
            {activeFilters.onlyRemote && <Badge>Only Remotes</Badge>}
          </div>
          <div className="inline">
            {activeFilters?.provider?.length && (
              <Badge>
                {activeFilters?.provider?.length === 1 ? (
                  <span>Provider: {activeFilters.provider[0].value}</span>
                ) : (
                  <span>
                    <span>Providers: </span>
                    {activeFilters.provider
                      .map((provider) => provider.value)
                      .join(', ')}
                  </span>
                )}
              </Badge>
            )}
          </div>
          <div className="inline">
            {activeFilters?.tags?.length && (
              <Badge>
                {activeFilters?.tags?.length === 1 ? (
                  <span>tags: {activeFilters.tags[0].value}</span>
                ) : (
                  <span>
                    <span>Tags: </span>
                    {activeFilters.tags.map((tags) => tags.value).join(', ')}
                  </span>
                )}
              </Badge>
            )}
          </div>
        </div>

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
