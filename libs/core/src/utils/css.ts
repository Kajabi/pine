/**
 * Escapes a string so it's safe to interpolate into a CSS identifier (an id selector like `#${id}`)
 * or into CSS text (a stylesheet rule referencing that id). Equivalent to the native `CSS.escape`,
 * reimplemented because Stencil's unit-test DOM (`newSpecPage`'s mock-doc) doesn't provide it.
 * @param value - The string to escape, e.g. a consumer-supplied id
 */
export const cssEscape = (value: string): string => {
  const string = String(value);
  const length = string.length;
  const firstCodeUnit = string.charCodeAt(0);
  let result = '';

  for (let index = 0; index < length; index++) {
    const codeUnit = string.charCodeAt(index);

    if (codeUnit === 0x0000) {
      result += '�';
      continue;
    }

    if (
      (codeUnit >= 0x0001 && codeUnit <= 0x001f) ||
      codeUnit === 0x007f ||
      (index === 0 && codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (index === 1 && codeUnit >= 0x0030 && codeUnit <= 0x0039 && firstCodeUnit === 0x002d)
    ) {
      result += `\\${codeUnit.toString(16)} `;
      continue;
    }

    if (index === 0 && length === 1 && codeUnit === 0x002d) {
      result += `\\${string.charAt(index)}`;
      continue;
    }

    if (
      codeUnit >= 0x0080 ||
      codeUnit === 0x002d ||
      codeUnit === 0x005f ||
      (codeUnit >= 0x0030 && codeUnit <= 0x0039) ||
      (codeUnit >= 0x0041 && codeUnit <= 0x005a) ||
      (codeUnit >= 0x0061 && codeUnit <= 0x007a)
    ) {
      result += string.charAt(index);
      continue;
    }

    result += `\\${string.charAt(index)}`;
  }

  return result;
};
