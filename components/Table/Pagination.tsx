import { PaginationType } from '@/utils/types';

interface PaginationProps {
  pagination: PaginationType | undefined;
  setPagination: React.Dispatch<
    React.SetStateAction<PaginationType | undefined>
  >;
  perPage: number;
  handlePerPageChange: (perPage: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({
  pagination,
  setPagination,
  perPage,
  handlePerPageChange,
}) => {
  return (
    <>
      <div
        data-testid="pagination"
        className="flex items-center gap-3 mt-3 text-lg"
      >
        <button
          data-testid="pagination__first"
          className="border rounded p-1"
          onClick={() => {
            setPagination((pagination) => ({
              ...pagination,
              currentPage: 1,
            }));
          }}
          // disabled={!table.getCanPreviousPage()}
        >
          {'<<'}
        </button>
        <button
          data-testid="pagination__previous"
          className="border rounded p-1"
          onClick={() => {
            setPagination((pagination) => ({
              ...pagination,
              currentPage: pagination?.currentPage
                ? pagination?.currentPage - 1
                : 1,
            }));
          }}
          // disabled={!table.getCanPreviousPage()}
        >
          {'<'}
        </button>
        <button
          data-testid="pagination__next"
          className="border rounded p-1"
          onClick={() => {
            setPagination((pagination) => ({
              ...pagination,
              currentPage: pagination?.currentPage
                ? pagination?.currentPage + 1
                : 1,
            }));
          }}
          // disabled={!table.getCanNextPage()}
        >
          {'>'}
        </button>
        <button
          data-testid="pagination__last"
          className="border rounded p-1"
          onClick={() => {
            setPagination((pagination) => ({
              ...pagination,
              currentPage: pagination?.lastPage,
            }));
          }}
          // disabled={!table.getCanNextPage()}
        >
          {'>>'}
        </button>
        <span
          data-testid="pagination__page"
          className="flex items-center gap-1"
        >
          <div>Page</div>
          <strong>{pagination?.currentPage}</strong> of{' '}
          <strong>{pagination?.lastPage || 1}</strong>
        </span>

        <select
          data-testid="pagination__per_page"
          value={perPage}
          onChange={(e) => {
            handlePerPageChange(Number(e.target.value));
          }}
          className="cursor-pointer"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Pagination;
