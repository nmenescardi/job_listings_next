'use client';

import { useEffect, useState } from 'react';
import { useTagsWithAliases } from '@/hooks/useTags';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import { PaginationType } from '@/utils/types';

import Pagination from '@/components/Table/Pagination';

import { Oval } from 'react-loader-spinner';

export interface TagRow {
  name: string;
  type: string;
  aliases: {
    id: number;
    tag_id: number;
    alias: string;
  }[];
}

const TagsTable = () => {
  const columnHelper = createColumnHelper<TagRow>();

  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationType>();

  const { data: dataTags, isLoading: loading, error } = useTagsWithAliases();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
    }),
    columnHelper.accessor('aliases', {
      header: 'Aliases',
      cell: ({ getValue }) =>
        getValue()
          .map((aliasObj) => aliasObj.alias)
          .join(', '),
    }),
  ];

  const table = useReactTable({
    data: !loading ? dataTags : [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const handlePerPageChange = (perPage: number) => {
    table.setPageSize(perPage);
    setPerPage(perPage);
  };

  useEffect(() => {
    if (loading || error) return;

    setPagination(() => ({
      currentPage: 1,
      total: dataTags.length,
      lastPage: Math.ceil(dataTags.length / perPage) - 1,
    }));
  }, [dataTags, perPage, error, loading]);

  useEffect(() => {
    table.setPageIndex(pagination?.currentPage || 1);
  }, [table, pagination]);

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <section data-testid="tags-table" className="w-full">
        {loading && (
          <div className="fixed top-0 left-0 w-full h-full inset-0 z-[9999]">
            <div className="flex justify-center items-center w-full h-full bg-black bg-opacity-60">
              <Oval
                height="80"
                width="80"
                color="#3B82F6"
                ariaLabel="loading"
                secondaryColor="white"
              />
            </div>
          </div>
        )}

        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          {!loading && (
            <>
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
                  <tr key={row.id} data-testid={`listing-table-row-${row.id}`}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        style={{
                          borderBottom: '1px solid gray',
                          padding: '1rem',
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </>
          )}
        </table>
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          perPage={perPage}
          handlePerPageChange={handlePerPageChange}
        />
      </section>
    </>
  );
};

export default TagsTable;
