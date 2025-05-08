import '@testing-library/jest-dom';
import { TextEncoder, TextDecoder } from 'util';

// Explicitly set TextEncoder and TextDecoder on the global object
Object.assign(global, {
  TextEncoder,
  TextDecoder
});
