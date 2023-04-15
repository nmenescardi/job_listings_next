'use client';
import React, { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import useListings, {
  setListingAsVisited,
  setListingAsApplied,
} from '@/hooks/useListings';
import useTags from '@/hooks/useTags';
import { initialFilters, useFilters } from '@/hooks/useFilters';
import { Listing } from '@/utils/types';

import { Tags, PaginationType } from '@/utils/types';

import Filters from '@/components/Table/Filters';
import ActiveFilters from '@/components/Table/ActiveFilters';
import Pagination from '@/components/Common/Pagination';
import Bookmarks from '@/components/Bookmarks';

import { Oval } from 'react-loader-spinner';

const getBackgroundColor = (status?: string) => {
  switch (status?.toLocaleLowerCase()) {
    case 'viewed':
      return '#f0f0f0';
    case 'applied':
      return '#d9f2d9';
    default:
      return 'white';
  }
};

const Table = () => {
  const columnHelper = createColumnHelper<Listing>();

  const [hideFilters, setHideFilters] = useState(true);
  const [loadingResults, setLoadingResults] = useState(false);
  const [listings, setListings] = useState<Listing[]>([]);
  const [tags, setTags] = useState<Tags[]>();
  const [perPage, setPerPage] = useState(50);
  const [pagination, setPagination] = useState<PaginationType>();

  const { activeFilters, newFilters, setActiveFilters, setNewFilters } =
    useFilters();

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

  const handleResetFilters = async () => {
    setLoadingResults(true);

    setNewFilters({ ...initialFilters });
    setActiveFilters({ ...initialFilters });

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
          onClick={(event) => {
            if (event.button === 0) {
              setListingAsVisited(row.original.id);
            }
          }}
          onAuxClick={(event) => {
            if (event.button === 1) {
              setListingAsVisited(row.original.id);
            }
          }}
        >
          {row.original.title}
        </a>
      ),
    }),
    columnHelper.accessor('company', {
      header: 'Company',
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
    columnHelper.accessor('status', {
      header: 'Status',

      cell: ({ row }) => (
        <button
          className="text-blue-500 hover:text-blue-700 underline flex items-center"
          onClick={(event) => {
            if (event.button === 0) {
              'VIEWED' === row.original?.status
                ? setListingAsApplied(row.original.id)
                : setListingAsVisited(row.original.id);
            }
          }}
          onAuxClick={(event) => {
            if (event.button === 1) {
              'VIEWED' === row.original?.status
                ? setListingAsApplied(row.original.id)
                : setListingAsVisited(row.original.id);
            }
          }}
        >
          {row.original?.status}
        </button>
      ),
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

  useEffect(() => {
    table.setPageSize(perPage);
  }, [table, perPage]);

  if (error) {
    return <div>Error fetching data</div>;
  }

  return (
    <>
      <section data-testid="job-listings-table" className="w-full">
        {loadingListings && (
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

        <Bookmarks />

        <Filters
          hideFilters={hideFilters}
          setHideFilters={setHideFilters}
          newFilters={newFilters}
          setNewFilters={setNewFilters}
          loadingResults={loadingResults}
          tags={tags}
          handleApplyFilters={handleApplyFilters}
          handleResetFilters={handleResetFilters}
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
              <tr
                key={row.id}
                data-testid={`listing-table-row-${row.id}`}
                style={{
                  backgroundColor: getBackgroundColor(row.getValue('status')),
                }}
              >
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
