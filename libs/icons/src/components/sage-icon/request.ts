import { validateContent } from './validate';

export const sageIconContent = new Map<string, string>();
const requests = new Map<string, Promise<any>>();

export const getSvgContent = (url: string, sanitize = false) => {
  let req = requests.get(url);

  if(!req) {
    if (typeof fetch != 'undefined' && typeof document !== 'undefined') {
      // we don't have a request
      req = fetch(url).then((rsp) => {
        if (rsp.ok) {
          return rsp.text().then((svgContent) => {
            if (svgContent && sanitize !== false) {
              svgContent = validateContent(svgContent);
            }
            sageIconContent.set(url, svgContent || '');
          });
        }
        sageIconContent.set(url, '');
      });

      requests.set(url, req);
    } else {
      sageIconContent.set(url, '');
      return Promise.resolve();
    }
  }
  return req;
}
