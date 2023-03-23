// global.fetch = require('jest-fetch-mock');
// fetch.mockResponse(JSON.stringify({ testing: true }));
import '@testing-library/jest-dom';
import fetch from 'cross-fetch';
global.fetch = fetch;

// empty out the domain for the API
process.env.NEXT_PUBLIC_API_URL = '';
