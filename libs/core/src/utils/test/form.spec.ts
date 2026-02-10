import { isRequired, exposeTypeProperty } from '../form';

interface ElementWithType extends Element {
  type: string;
}

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

