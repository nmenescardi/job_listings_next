import { render, screen, waitFor } from '@testing-library/react';
import Table from '../components/Table';
import { SWRConfig } from 'swr';
import { listingsMockAPI } from '@/data/listings';
import { tags as tagsMockAPI } from '@/data/tags';

// Mock the fetch function
global.fetch = jest.fn((args) => {
  if (typeof args === 'string') {
    if (args.startsWith('/tags')) {
      return Promise.resolve({
        json: () => Promise.resolve(tagsMockAPI),
      });
    }

    if (args.startsWith('/listings')) {
      return Promise.resolve({
        json: () => Promise.resolve(listingsMockAPI),
      });
    }
  }
});

describe('Table component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const firstListing = listingsMockAPI.data[0];

  test('renders initial state correctly', async () => {
    render(
      <SWRConfig value={{ dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    const tableElement = await waitFor(() =>
      screen.getByTestId('job-listings-table')
    );

    // screen.debug(tableElement, 100000);

    expect(tableElement).toBeInTheDocument();

    expect(tableElement).toHaveTextContent(firstListing.title);
    expect(tableElement).toHaveTextContent(firstListing.salary_range);
    expect(tableElement).toHaveTextContent(firstListing.tags[0]);
    expect(tableElement).toHaveTextContent(firstListing.tags[1]);
    expect(tableElement).toHaveTextContent(firstListing.tags[2]);
    expect(tableElement).toHaveTextContent(firstListing.location);

    const linkElement = screen.getByRole('link', { name: firstListing.title });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement).toHaveAttribute('href', firstListing.external_link);
  });
});
