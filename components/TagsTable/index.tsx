'use client';

import { useCallback, useEffect, useState } from 'react';
import { useDeleteTag, useTagsWithAliases } from '@/hooks/useTags';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
} from '@tanstack/react-table';

import { PaginationType, TagModel } from '@/utils/types';

import Pagination from '@/components/Common/Pagination';
import Popup from '@/components/Common/Popup';
import AddTagForm from '@/components/TagsTable/AddTagForm';

import { Oval } from 'react-loader-spinner';
import { Button, Icon } from '@tremor/react';

import {
  PlusCircleIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/20/solid';

import ToastContainer from '@/components/Common/ToastContainer';
import { toast } from '@/utils/toast';

interface TypeRow extends TagModel {
  edit: React.ElementType;
  delete: React.ElementType;
}

const TagsTable = () => {
  const columnHelper = createColumnHelper<TypeRow>();

  const [globalFilter, setGlobalFilter] = useState('');

  const [perPage, setPerPage] = useState(10);
  const [pagination, setPagination] = useState<PaginationType>();

  const [editTag, setEditTag] = useState<TypeRow | null>(null);
  const [tagToDelete, setTagToDelete] = useState<TypeRow | false>(false);

  const [newTagFormOpen, setNewTagFormOpen] = useState(false);

  const closeDeleteConfirmationPopup = useCallback(
    () => setTagToDelete(false),
    []
  );

  const { data: dataTags, isLoading: loading, error } = useTagsWithAliases();

  const deleteTag = useDeleteTag();

  const columns = [
    columnHelper.accessor('name', {
      header: 'Name',
    }),
    columnHelper.accessor('type', {
      header: 'Type',
    }),
    columnHelper.accessor('aliases', {
      header: 'Aliases',
      meta: {
        width: '50%',
      },
      cell: ({ getValue }) =>
        getValue()
          ?.map((aliasObj) => aliasObj.alias)
          ?.join(', '),
    }),
    columnHelper.accessor('edit', {
      header: '',
      meta: {
        width: '1%',
      },
      cell: ({ row }) => (
        <span className="cursor-pointer">
          <Icon
            size="md"
            icon={PencilIcon}
            color="yellow"
            className="cursor-pointer"
            onClick={() => {
              setEditTag(row.original);
              setNewTagFormOpen(true);
            }}
          />
        </span>
      ),
    }),
    columnHelper.accessor('delete', {
      header: '',
      meta: {
        width: '1%',
      },
      cell: ({ row }) => (
        <span className="cursor-pointer">
          <Icon
            size="md"
            icon={TrashIcon}
            color="red"
            onClick={() => {
              setTagToDelete(row.original);
            }}
          />
        </span>
      ),
    }),
  ];

  const table = useReactTable({
    data: !loading ? dataTags : [],
    columns,
    state: {
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
  });

  const handlePerPageChange = (perPage: number) => {
    table.setPageSize(perPage);
    setPerPage(perPage);
  };

  useEffect(() => {
    if (loading || error) return;

    setPagination((pagination) => {
      const total = dataTags.length;
      const lastPage = Math.ceil(dataTags.length / perPage) - 1;
      let currentPage = pagination?.currentPage || 1;

      if (currentPage > lastPage) {
        currentPage = lastPage;
      }

      return {
        currentPage,
        total,
        lastPage,
      };
    });
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

        <div className="flex flex-col">
          <div className="flex justify-between mb-4">
            <div>
              <label htmlFor="globalFilter" className="cursor-pointer mr-2">
                Search:{' '}
              </label>
              <input
                type="text"
                id="globalFilter"
                value={globalFilter ?? ''}
                onChange={(e) => setGlobalFilter(String(e.target.value))}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search all columns..."
              />
            </div>
            <Button
              data-testid="new-tag-button"
              size="xs"
              icon={PlusCircleIcon}
              onClick={() => {
                setNewTagFormOpen(true);
                setEditTag(null);
              }}
            >
              Add new tag
            </Button>
          </div>

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

                            // @ts-ignore
                            width: header.column.columnDef?.meta?.width ?? '',
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
                    >
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
        </div>
        <Pagination
          pagination={pagination}
          setPagination={setPagination}
          perPage={perPage}
          handlePerPageChange={handlePerPageChange}
        />

        {newTagFormOpen && (
          <Popup setOpen={setNewTagFormOpen} open>
            <AddTagForm
              tag={editTag ?? undefined}
              onCancel={() => setNewTagFormOpen(false)}
            />
          </Popup>
        )}

        {tagToDelete && (
          <Popup setOpen={closeDeleteConfirmationPopup} open>
            <div>
              <p className="text-lg">
                Are you sure you want to delete the{' '}
                <strong>{tagToDelete.name}</strong> tag?{' '}
                {!!tagToDelete?.aliases?.length && '(and its aliases)'}
              </p>
              <div className="flex gap-3 mt-5">
                <Button
                  size="md"
                  color="red"
                  onClick={async () => {
                    if (!!tagToDelete.id) {
                      const result = await deleteTag(tagToDelete.id);

                      if ('success' === result.status) {
                        toast.success('Tag deleted!');
                      } else {
                        toast.error('There was some error deleting the tag.');
                      }
                    }
                    closeDeleteConfirmationPopup();
                  }}
                >
                  Yes
                </Button>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    closeDeleteConfirmationPopup();
                  }}
                >
                  No
                </Button>
              </div>
            </div>
          </Popup>
        )}

        <ToastContainer />
      </section>
    </>
  );
};

export default TagsTable;
