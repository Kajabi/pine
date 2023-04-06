import { positionTooltip } from './overlay';

describe('positionTooltip', () => {
  it('returns false if no arguments are defined', () => {
    expect(positionTooltip(undefined, undefined, undefined)).toBe(false);
  })
});
