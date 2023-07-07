import { getAssetPath } from '@stencil/core';
import { PdsIcon } from './pds-icon';

let CACHED_MAP: Map<string, string>;

export const addIcons = (icons: { [name: string]: string; }) => {
  const map = getIconMap();
  Object.keys(icons).forEach(name => map.set(name, icons[name]));
}

export const getIconMap = (): Map<string, string> => {
  if (typeof window === 'undefined') {
    return new Map();
  }  else {
    if (!CACHED_MAP) {
      const win = window as any;
      win.PdsIcons = win.PdsIcons || {};
      CACHED_MAP = win.PdsIcons.map = win.PdsIcons.map || new Map();
    }

    return CACHED_MAP;
  }
}

export const getName = (
  iconName: string | undefined,
  icon: string | undefined,
) => {
  if(!iconName && icon && !isSrc(icon)) {
    iconName = icon;
  }

  if (isStr(iconName)) {
    iconName = toLower(iconName);
  }

  if (!isStr(iconName) || iconName.trim() === '') {
    return null;
  }

  const invalidChars = iconName.replace(/[a-z]|-|\d/gi,'');
  if (invalidChars != '') { return null; }

  return iconName;
}

const getNamedUrl = (iconName: string) => {
  const url = getIconMap().get(iconName);
  if (url) {
    return url;
  }

  return getAssetPath(`svg/${iconName}.svg`);
};

export const getSrc = (src: string | undefined) => {
  if (isStr(src)) {
    src = src.trim();

    if (isSrc(src)) {
      return src;
    }
  }

  return null;
}

export const getUrl = (i: PdsIcon) => {
  let url = getName(i.name, i.icon);
  if (url) {
    return getNamedUrl(url);
  }

  if (i.icon) {
    url = getSrc(i.icon);
    if (url) {
      return url;
    }
  }

  return null;
};

export const isSrc = (str: string) => str.length > 0 && /(\/|\.)/.test(str);
export const isStr = (val: any): val is string => typeof val === 'string';
export const toLower = (val: string) => val.toLowerCase();

/**
 * Elements inside of web components sometimes need to inherit global attributes
 * set on the host. For example, the inner input in `ion-input` should inherit
 * the `title` attribute that developers set directly on `ion-input`. This
 * helper function should be called in componentWillLoad and assigned to a variable
 * that is later used in the render function.
 *
 * This does not need to be reactive as changing attributes on the host element
 * does not trigger a re-render.
 */
 export const inheritAttributes = (el: HTMLElement, attributes: string[] = []) => {
  const attributeObject: { [k: string]: any } = {};

  attributes.forEach(attr => {
    if (el.hasAttribute(attr)) {
      const value = el.getAttribute(attr);
      if (value !== null) {
        attributeObject[attr] = el.getAttribute(attr);
      }
      el.removeAttribute(attr);
    }
  });

  return attributeObject;
}
