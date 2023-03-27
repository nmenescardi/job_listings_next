import Select from 'react-select';
import {
  FunnelIcon,
  ArrowPathIcon,
  XMarkIcon,
} from '@heroicons/react/20/solid';
import { Button, Icon } from '@tremor/react';
import { providers } from '@/data/providers';
import { FiltersType, Tags, Provider } from '@/utils/types';

interface FiltersProps {
  hideFilters: boolean;
  setHideFilters: React.Dispatch<React.SetStateAction<boolean>>;
  newFilters: FiltersType;
  setNewFilters: React.Dispatch<React.SetStateAction<FiltersType>>;
  loadingResults: boolean;
  tags: Tags[] | undefined;
  handleApplyFilters: () => Promise<void>;
}

const Filters: React.FC<FiltersProps> = ({
  hideFilters,
  setHideFilters,
  newFilters,
  setNewFilters,
  loadingResults,
  tags,
  handleApplyFilters,
}) => {
  return (
    <>
      <div>
        <button
          data-testid="filter-toggle"
          onClick={() => setHideFilters((prevState) => !prevState)}
        >
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
              data-testid="only-remote"
              type="checkbox"
              id="only_remote"
              className="mb-4"
              onChange={() =>
                setNewFilters((newFilters) => ({
                  ...newFilters,
                  onlyRemote: !newFilters.onlyRemote,
                }))
              }
              checked={newFilters.onlyRemote}
            />

            <label
              htmlFor="only_remote"
              className="ml-2 select-none cursor-pointer"
            >
              Only Remote
            </label>
          </div>

          <div data-testid="providers-selector">
            <label htmlFor="providers_select">Providers:</label>
            <Select
              inputId="providers_select"
              name="providers_select"
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
              value={newFilters.provider}
            />
          </div>

          <div data-testid="tags-selector">
            <label htmlFor="tags_selector">Tags:</label>
            <Select
              name="tags_selector"
              inputId="tags_selector"
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
              value={newFilters.tags}
            />
          </div>

          <div className="mt-8 flex justify-between">
            <Button
              data-testid="apply-filters"
              size="xs"
              icon={ArrowPathIcon}
              onClick={handleApplyFilters}
              loading={!!loadingResults}
            >
              Apply Filters
            </Button>

            <Button size="xs" variant="secondary" color="red" icon={XMarkIcon}>
              Clear Filters
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Filters;
