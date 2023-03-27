'use client';
import React, { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import useListings from '@/hooks/useListings';
import useTags from '@/hooks/useTags';

import { Listing } from '@/utils/types';
import { Tags } from '@/data/tags';

import Filters, { FiltersType } from '@/components/Table/Filters';
import ActiveFilters from '@/components/Table/ActiveFilters';
import Pagination, { PaginationI } from '@/components/Table/Pagination';

const initialFilters: FiltersType = {
  onlyRemote: false,
};

const Table = () => {
  const columnHelper = createColumnHelper<Listing>();

  const [hideFilters, setHideFilters] = useState(true);
  const [activeFilters, setActiveFilters] =
    useState<FiltersType>(initialFilters);
  const [newFilters, setNewFilters] = useState<FiltersType>(initialFilters);
  const [loadingResults, setLoadingResults] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [tags, setTags] = useState<Tags[]>();
  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationI>();

  const {
    data: dataListings,
    isLoading: loadingListings,
    error,
  } = useListings(activeFilters, perPage, pagination?.currentPage);

  const { data: dataTags, isLoading: loadingTags } = useTags();

  useEffect(() => {
    if (!loadingListings && dataListings) {
      setListings(dataListings.data);
      setPagination({
        currentPage: dataListings.current_page,
        lastPage: dataListings.last_page,
        total: dataListings.total,
      });
    }
  }, [loadingListings, dataListings]);

  useEffect(() => {
    if (!loadingTags && dataTags && dataTags?.length > 0) {
      setTags(
        dataTags.map((tag: string) => ({
          label: tag,
          value: tag,
        }))
      );
    }
  }, [loadingTags, dataTags]);

  const handleApplyFilters = async () => {
    setLoadingResults(true);

    setActiveFilters({ ...newFilters });

    setLoadingResults(false);
    setHideFilters(true);
  };

  const columns = [
    columnHelper.accessor('title', {
      header: 'Title',
      cell: ({ row }) => (
        <a
          href={row.original.external_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:text-blue-700 underline flex items-center"
        >
          {row.original.title}
        </a>
      ),
    }),
    columnHelper.accessor('salary_range', {
      header: 'Salary Range',
    }),
    columnHelper.accessor('provider', {
      header: 'Provider',
    }),
    columnHelper.accessor('created_at', {
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

  const handlePerPageChange = (perPage: number) => {
    table.setPageSize(perPage);
    setPerPage(perPage);
  };

  if (loadingListings) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <section data-testid="job-listings-table">
        <Filters
          hideFilters={hideFilters}
          setHideFilters={setHideFilters}
          newFilters={newFilters}
          setNewFilters={setNewFilters}
          loadingResults={loadingResults}
          tags={tags}
          handleApplyFilters={handleApplyFilters}
        />
        <div className="flex gap-2 mt-3">
          <ActiveFilters activeFilters={activeFilters} />
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

export default Table;
