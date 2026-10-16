import { inheritAttributes, inheritAriaAttributes, restoreHostStyling, setAttributesIfChanged } from '../attributes';
import { classNamesOf } from '../keep-hydrated';

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

describe('setAttributesIfChanged()', () => {
  it('sets missing and different values, and skips values already in place', () => {
    const el = document.createElement('button');
    el.setAttribute('aria-haspopup', 'menu');
    el.setAttribute('aria-expanded', 'true');
    const setAttribute = jest.spyOn(el, 'setAttribute');

    expect(setAttributesIfChanged(el, { 'aria-haspopup': 'menu', 'aria-expanded': 'false', 'aria-controls': 'panel' })).toBe(true);
    expect(setAttributesIfChanged(el, { 'aria-haspopup': 'menu' })).toBe(false);

    expect(el.getAttribute('aria-expanded')).toBe('false');
    expect(el.getAttribute('aria-controls')).toBe('panel');
    expect(setAttribute).toHaveBeenCalledTimes(2);
    expect(setAttribute).not.toHaveBeenCalledWith('aria-haspopup', 'menu');
  });
});

describe('classNamesOf()', () => {
  it('splits a rendered class string, dropping blanks', () => {
    expect(classNamesOf('\n  pds-box  pds-box-gap-md\n ')).toEqual(['pds-box', 'pds-box-gap-md']);
  });
});

describe('restoreHostStyling()', () => {
  it('adds missing classes and style properties, and keeps the consumer\'s own', () => {
    const el = document.createElement('div');
    el.className = 'consumer';

    expect(restoreHostStyling(el, { classes: ['pds-box', 'pds-box-gap-md'], styles: { '--color-background-box': 'red' } })).toBe(true);

    expect(el.className).toBe('consumer pds-box pds-box-gap-md');
    expect(el.style.getPropertyValue('--color-background-box')).toBe('red');
  });

  // Browsers normalize some values, so rewriting ones that differ would never settle.
  it('leaves a style property that is present alone, and skips empty values', () => {
    const el = document.createElement('div');
    el.style.setProperty('min-height', '20px');
    const setProperty = jest.spyOn(el.style, 'setProperty');

    expect(restoreHostStyling(el, { classes: [], styles: { 'min-height': '40px', '--row-gap-x': '' } })).toBe(false);

    expect(setProperty).not.toHaveBeenCalled();
    expect(el.style.getPropertyValue('min-height')).toBe('20px');
  });
});
