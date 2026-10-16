import { keepPineHydrated } from '../utils/keep-hydrated';

// Stencil runs this when the loader loads, before any component is defined, and again for each
// server-rendered document, where it does nothing.
export default () => {
  keepPineHydrated();
};
