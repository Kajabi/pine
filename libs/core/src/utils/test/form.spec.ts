import { assignDescription, isRequired, exposeTypeProperty } from '../form';

interface ElementWithType extends Element {
  type: string;
}

describe('assignDescription', () => {
  it('describes nothing when there are no messages', () => {
    expect(assignDescription('field', false)).toBeUndefined();
    expect(assignDescription('field', true)).toBeUndefined();
  });

  it('describes the helper message when valid', () => {
    expect(assignDescription('field', false, 'Helper')).toBe('field__helper-message');
    expect(assignDescription('field', false, 'Helper', 'Error')).toBe('field__helper-message');
  });

  it('does not describe an error message while valid', () => {
    expect(assignDescription('field', false, undefined, 'Error')).toBeUndefined();
  });

  it('describes the error message when invalid, with no helper message present', () => {
    expect(assignDescription('field', true, undefined, 'Error')).toBe('field__error-message');
  });

  it('prefers the error message over the helper message when invalid', () => {
    expect(assignDescription('field', true, 'Helper', 'Error')).toBe('field__error-message');
  });

  it('falls back to the helper message when invalid with no error message', () => {
    expect(assignDescription('field', true, 'Helper')).toBe('field__helper-message');
  });
});

describe('isRequired', () => {
  it('returns empty string when no target or component defined', () => {
    expect(isRequired(undefined, undefined)).toEqual(undefined);
  });
});

describe('exposeTypeProperty', () => {
  it('defines a readonly type property on the element', () => {
    const el = document.createElement('div') as unknown as ElementWithType;
    exposeTypeProperty(el, 'select-one');
    expect(el.type).toBe('select-one');
  });

  it('supports a getter function for the type value', () => {
    const el = document.createElement('div') as unknown as ElementWithType;
    let dynamicType = 'text';
    exposeTypeProperty(el, () => dynamicType);
    expect(el.type).toBe('text');
    dynamicType = 'email';
    expect(el.type).toBe('email');
  });

  it('does not throw when called multiple times on the same element', () => {
    const el = document.createElement('div') as unknown as ElementWithType;
    exposeTypeProperty(el, 'select-one');
    expect(() => exposeTypeProperty(el, 'select-one')).not.toThrow();
    expect(el.type).toBe('select-one');
  });
});

