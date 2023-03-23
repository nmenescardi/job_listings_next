import { render, screen, waitFor } from '@testing-library/react';
import Table from '../components/Table';
import { SWRConfig } from 'swr';
import { listingsMockAPI, ListingsMockAPI } from '@/data/listings';
import { tags as tagsMockAPI } from '@/data/tags';

const mockFetch = (tagsMockAPI: string[], listingsMockAPI: ListingsMockAPI) =>
  jest.fn((args) => {
    let responseData = {};

    if (typeof args === 'string') {
      if (args.startsWith('/tags')) {
        responseData = tagsMockAPI;
      }

      if (args.startsWith('/listings')) {
        responseData = listingsMockAPI;
      }
    }

    const response = {
      json: () => Promise.resolve(responseData),
    };

    return Promise.resolve(response as Response);
  });

describe('Table component', () => {
  afterEach(async () => {
    jest.clearAllMocks();
  });

  test('renders initial state correctly', async () => {
    global.fetch = mockFetch(tagsMockAPI, listingsMockAPI);
    const firstListing = listingsMockAPI.data[0];

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    const tableElement = await waitFor(() =>
      screen.getByTestId('job-listings-table')
    );

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

  test('renders table with no data', async () => {
    global.fetch = mockFetch(tagsMockAPI, {
      data: [],
      total: 0,
      current_page: 1,
      last_page: 1,
    });

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    const tableElement = await waitFor(() =>
      screen.getByTestId('job-listings-table')
    );

    screen.debug(tableElement, 100000);

    expect(tableElement).toBeInTheDocument();

    const tbody = tableElement.querySelector('tbody');
    expect(tbody).toBeTruthy();
    expect(tbody?.children.length).toBe(0);
  });
});
