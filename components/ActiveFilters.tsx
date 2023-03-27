import { Badge } from '@tremor/react';
import { FiltersType } from '@/components/Filters';
import { Tags } from '@/data/tags';
import { Provider } from '@/data/providers';
import { MultiValue } from 'react-select';

interface InlineBadgesProps {
  collection: MultiValue<Provider | Tags> | undefined;
  title: string;
}
const InlineBadges: React.FC<InlineBadgesProps> = ({ collection, title }) => {
  return (
    <>
      <div className="inline">
        {!!collection?.length && (
          <Badge>
            {collection?.length === 1 ? (
              <span>
                {title}: {collection[0].value}
              </span>
            ) : (
              <span>
                <span>{title}s: </span>
                {collection.map((item) => item.value).join(', ')}
              </span>
            )}
          </Badge>
        )}
      </div>
    </>
  );
};

interface ActiveFiltersProps {
  activeFilters: FiltersType;
}

const ActiveFilters: React.FC<ActiveFiltersProps> = ({ activeFilters }) => {
  return (
    <>
      <span>Active filters:</span>
      <div className="inline">
        {activeFilters.onlyRemote && <Badge>Only Remotes</Badge>}
      </div>

      <InlineBadges collection={activeFilters?.provider} title="Provider" />
      <InlineBadges collection={activeFilters?.tags} title="Tag" />
    </>
  );
};

export default ActiveFilters;
