import { cssEscape } from '../css';

describe('cssEscape', () => {
  it('leaves alphanumeric, hyphen and underscore characters untouched', () => {
    expect(cssEscape('my-component_id-123')).toBe('my-component_id-123');
  });

  it('escapes characters that are not valid in a CSS identifier', () => {
    expect(cssEscape('weird.id:part"quoted}end')).toBe('weird\\.id\\:part\\"quoted\\}end');
  });

  it('escapes a leading digit so the identifier stays valid', () => {
    expect(cssEscape('1foo')).toBe('\\31 foo');
  });

  it('leaves a selector built from the escaped id matchable against the real id', () => {
    const id = 'a.b:c';
    const escaped = cssEscape(id);

    const el = document.createElement('div');
    el.id = id;
    document.body.appendChild(el);

    expect(document.querySelector(`#${escaped}`)).toBe(el);

    el.remove();
  });
});
