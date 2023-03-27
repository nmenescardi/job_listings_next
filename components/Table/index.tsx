'use client';
import React, { useEffect, useState } from 'react';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
} from '@tanstack/react-table';

import useSWR from 'swr';

import { Listing } from '@/utils/types';
import { Tags } from '@/data/tags';

import Filters, { FiltersType } from '@/components/Table/Filters';
import ActiveFilters from '@/components/Table/ActiveFilters';
import Pagination, { PaginationI } from '@/components/Table/Pagination';

const initialFilters: FiltersType = {
  onlyRemote: false,
};

const API_TOKEN = process.env.NEXT_PUBLIC_API_AUTH_TOKEN;
const fetcher = (...args: Parameters<typeof fetch>) => {
  const [url, ...rest] = args;
  const headers = {
    Authorization: `Bearer ${API_TOKEN}`,
  };

  return fetch(url, { headers, credentials: 'include', ...rest }).then(
    async (res) => res.json()
  );
};

const domain = process.env.NEXT_PUBLIC_API_URL;

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

  const getApiUrl = () => {
    // it'll only re-fetch for a new URL when the activeFilters changed
    const onlyRemoteArg = `onlyRemote=${
      !!activeFilters?.onlyRemote ? '1' : '0'
    }`;

    let url = `${domain}/listings?${onlyRemoteArg}`;

    if (activeFilters?.provider && activeFilters?.provider?.length > 0) {
      url +=
        '&providersIn=[' +
        activeFilters?.provider?.map((provider) => provider.value).join(',') +
        ']';
    }

    if (activeFilters?.tags && activeFilters?.tags?.length > 0) {
      url +=
        '&tagsIn=[' +
        activeFilters?.tags?.map((tag) => tag.value).join(',') +
        ']';
    }

    url += '&perPage=' + perPage;

    url += `&page=${pagination?.currentPage || 1}`;

    return url;
  };

  const { data, isLoading, error } = useSWR(getApiUrl(), fetcher);
  const { data: dataTags, isLoading: loadingTags } = useSWR(
    `${domain}/tags`,
    fetcher
  );

  useEffect(() => {
    if (!isLoading && data) {
      setListings(data.data);
      setPagination({
        currentPage: data.current_page,
        lastPage: data.last_page,
        total: data.total,
      });
    }
  }, [isLoading, data]);

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

  if (isLoading) {
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
