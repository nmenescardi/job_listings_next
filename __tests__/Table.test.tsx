import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from '@testing-library/react';
import selectEvent from 'react-select-event';

import Table from '../components/Table';
import { SWRConfig } from 'swr';
import { listingsMockAPI, ListingsMockAPI } from '@/data/listings';
import { tags as tagsMockAPI } from '@/data/tags';

const mockFetch = (tagsMockAPI: string[], listingsMockAPI: ListingsMockAPI) =>
  jest.fn((args) => {
    let responseData = {};

    if (typeof args === 'string') {
      if (args.startsWith('/api/tags')) {
        responseData = tagsMockAPI;
      }

      if (args.startsWith('/api/listings')) {
        const page = args.match(/page=(\d+)/);
        responseData = listingsMockAPI(page ? +page[1] : 1);
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
    const firstListing = listingsMockAPI().data[0];

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    const tableElement = await waitFor(() =>
      screen.getByTestId('job-listings-table')
    );

    expect(tableElement).toBeInTheDocument();
    // screen.debug(tableElement, 100000);

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
    global.fetch = mockFetch(tagsMockAPI, () => ({
      data: [],
      total: 0,
      current_page: 1,
      last_page: 1,
    }));

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    const tableElement = await waitFor(() =>
      screen.getByTestId('job-listings-table')
    );

    // screen.debug(tableElement, 100000);

    expect(tableElement).toBeInTheDocument();

    const tbody = tableElement.querySelector('tbody');
    expect(tbody).toBeTruthy();
    expect(tbody?.children.length).toBe(0);
  });

  test('pagination works correctly', async () => {
    global.fetch = mockFetch(tagsMockAPI, listingsMockAPI);

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    const tableElement = await waitFor(() =>
      screen.getByTestId('job-listings-table')
    );

    // Check the main container is present
    const paginationElement = await waitFor(() =>
      screen.getByTestId('pagination')
    );

    expect(paginationElement).toBeInTheDocument();

    // Pages text
    function hasPaginationText(
      element: HTMLElement,
      expectedPage: string,
      expectedTotalPages: string
    ) {
      const pageText = element.querySelector('div')?.textContent?.trim();
      const strongElements = element.querySelectorAll('strong');
      const pageNumber = strongElements[0]?.textContent?.trim();
      const totalPages = strongElements[1]?.textContent?.trim();

      return (
        pageText === 'Page' &&
        pageNumber === expectedPage &&
        totalPages === expectedTotalPages
      );
    }
    const paginationText = () => screen.getByTestId('pagination__page');
    expect(paginationText()).toBeInTheDocument();
    expect(hasPaginationText(paginationText(), '1', '3')).toBe(true);

    // click next page number
    const nextPageButton = screen.getByTestId('pagination__next');
    await act(async () => {
      fireEvent.click(nextPageButton);
    });
    expect(hasPaginationText(paginationText(), '2', '3')).toBe(true);

    //  click previous page
    const previousPageButton = screen.getByTestId('pagination__previous');
    await act(async () => {
      fireEvent.click(previousPageButton);
    });
    expect(hasPaginationText(paginationText(), '1', '3')).toBe(true);

    // click last page
    const lastPageButton = screen.getByTestId('pagination__last');
    await act(async () => {
      fireEvent.click(lastPageButton);
    });
    expect(hasPaginationText(paginationText(), '3', '3')).toBe(true);

    // click on first page
    const firstPageButton = screen.getByTestId('pagination__first');
    await act(async () => {
      fireEvent.click(firstPageButton);
    });
    expect(hasPaginationText(paginationText(), '1', '3')).toBe(true);
  });

  test('applying filters adds specific arguments in the query string when fetching listings.', async () => {
    // Mock to get the initial listings
    global.fetch = mockFetch(tagsMockAPI, listingsMockAPI);

    const expectedUriContaining = [
      'onlyRemote=1',
      'providersIn=[LinkedIn]',
      'tagsIn=[nextjs]',
    ];

    render(
      <SWRConfig value={{ provider: () => new Map(), dedupingInterval: 0 }}>
        <Table />
      </SWRConfig>
    );

    // await the element is present
    await waitFor(() => screen.getByTestId('job-listings-table'));

    // Mock to get the url and control the numbers of calls
    let receivedUrl = '';
    global.fetch = jest.fn((arg) => {
      receivedUrl = arg as string;

      return Promise.resolve({} as Response);
    });

    // Click on filter toggle icon
    await act(async () => {
      fireEvent.click(screen.getByTestId('filter-toggle'));
    });

    // Click on onlyRemote
    await act(async () => {
      fireEvent.click(screen.getByTestId('only-remote'));
    });

    // Select providers
    await selectEvent.select(screen.getByLabelText('Providers:'), ['LinkedIn']);

    // Select tags
    await selectEvent.select(screen.getByLabelText('Tags:'), ['nextjs']);

    // Click on apply filters
    await act(async () => {
      fireEvent.click(screen.getByTestId('apply-filters'));
    });

    expect(global.fetch).toHaveBeenCalledTimes(1);

    expectedUriContaining.forEach((param) => {
      expect(receivedUrl).toContain(param);
    });
  });

  // screen.debug(table2, 100000);
});
