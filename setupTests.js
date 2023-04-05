import '@testing-library/jest-dom';
import fetch from 'cross-fetch';
global.fetch = fetch;

// empty out the domain for the API
process.env.NEXT_PUBLIC_API_URL = '';
