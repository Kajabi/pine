import { isRequired } from '../form';

describe('isRequired', () => {
  it('returns empty string when no target or component defined', () => {
    expect(isRequired(undefined, undefined)).toEqual(undefined);
  });
});

