import { inheritAttributes, inheritAriaAttributes } from '../attributes';

describe('inheritAttributes()', () => {
  it('should create an attribute inheritance object', () => {
    const el = document.createElement('div');
    el.setAttribute('tabindex', '20');
    el.setAttribute('title', 'myTitle');

    const attributeObject = inheritAttributes(el, ['tabindex', 'title']);

    expect(attributeObject).toEqual({
      tabindex: '20',
      title: 'myTitle',
    });
  });

  it('should not inherit attributes that are not defined on the element', () => {
    const el = document.createElement('div');
    el.setAttribute('tabindex', '20');

    const attributeObject = inheritAttributes(el, ['tabindex', 'title']);

    expect(attributeObject).toEqual({
      tabindex: '20',
    });
  });

  it('should not inherit attributes that are not defined on the input array', () => {
    const el = document.createElement('div');
    el.setAttribute('tabindex', '20');
    el.setAttribute('title', 'myTitle');

    const attributeObject = inheritAttributes(el, ['title']);

    expect(attributeObject).toEqual({
      title: 'myTitle',
    });
  });
});

describe('inheritAriaAttributes()', () => {
  it('should inherit ARIA attributes defined on the HTML element', () => {
    const el = document.createElement('div');
    el.setAttribute('aria-label', 'myLabel');
    el.setAttribute('aria-describedby', 'myDescription');

    const attributeObject = inheritAriaAttributes(el);

    expect(attributeObject).toEqual({
      'aria-label': 'myLabel',
      'aria-describedby': 'myDescription',
    });
  });

  it('should inherit the role attribute defined on the HTML element', () => {
    const el = document.createElement('div');
    el.setAttribute('role', 'button');

    const attributeObject = inheritAriaAttributes(el);

    expect(attributeObject).toEqual({
      role: 'button',
    });
  });

  it('should ignore attributes in the ignoreList', () => {
    const el = document.createElement('div');
    el.setAttribute('role', 'button');
    el.setAttribute('aria-label', 'Test Label');
    el.setAttribute('aria-describedby', 'desc');
    el.setAttribute('aria-hidden', 'true');

    const attributeObject = inheritAriaAttributes(el, ['aria-hidden']);

    expect(attributeObject).toEqual({
      role: 'button',
      'aria-label': 'Test Label',
      'aria-describedby': 'desc',
    });
  });

});
