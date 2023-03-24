export const positionTooltip = (elem, elemPlacement, overlay, offset = 8) => {
  const rect = elem.getBoundingClientRect();
  const contentRect = overlay.getBoundingClientRect();
  // const panelNewLoc = {
  //   top: (rect.height / 2) + contentRect.height
  // };

  if (elemPlacement.includes("right")) {
    overlay.style.top = '50%';
    overlay.style.left = `calc(${rect.width}px + ${offset}px)`;
    overlay.style.transform = 'translateY(-50%)';

    if (elemPlacement.includes("start")) {
      overlay.style.top = '0';
      overlay.style.transform = 'translateY(0)';
    }

    if (elemPlacement.includes("end")) {
      overlay.style.bottom = '0';
      overlay.style.top = 'initial';
      overlay.style.transform = 'translateY(0)';
    }
  }

  if (elemPlacement.includes("left")) {
    overlay.style.top = '50%';
    overlay.style.right = `calc((${rect.width}px + ${offset}px))`;
    overlay.style.transform = 'translateY(-50%)';

    // console.log('rect: ', rect);
    // console.log('contentRect: ', contentRect);

    if (elemPlacement.includes("start")) {
      overlay.style.top = '0';
      overlay.style.transform = 'translateY(0)';
    }

    if (elemPlacement.includes("end")) {
      overlay.style.bottom = '0';
      overlay.style.top = 'initial';
      overlay.style.transform = 'translateY(0)';
    }
  }

  if (elemPlacement.includes("bottom")) {
    overlay.style.top = `calc(${rect.height}px + ${offset}px)`;
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';

    if (elemPlacement.includes("start")) {
      overlay.style.left = '0';
      overlay.style.transform = 'translateX(0)';
    }

    if (elemPlacement.includes("end")) {
      overlay.style.left = 'initial';
      overlay.style.right = '0';
      overlay.style.transform = 'translateX(0)';
    }
  }

  if (elemPlacement.includes("top")) {
    overlay.style.top = `calc((${contentRect.height}px + ${offset}px) * -1)`;
    overlay.style.left = '50%';
    overlay.style.transform = 'translateX(-50%)';

    if (elemPlacement.includes("start")) {
      overlay.style.left = '0';
      overlay.style.transform = 'translateX(0)';
    }
    if (elemPlacement.includes("end")) {
      overlay.style.left = 'initial';
      overlay.style.right = '0';
      overlay.style.transform = 'translateX(0)';
    }
  }

  // this.createObserver();

  // ARROW

  // const win = overlay.ownerDocument.defaultView;
  // const docEl = window.document.documentElement;

  // const viewport = {
  //   top: docEl.scrollTop,
  //   bottom: window.pageYOffset + docEl.clientHeight,
  // };

  // const offset = {
  //   top: contentRect.top + win.pageYOffset,
  //   left: contentRect.left + win.pageXOffset,
  //   bottom: (contentRect.top + win.pageYOffset)
  // };

  // const panelHeight = contentRect.height;
  // const enoughSpaceAbove = viewport.top < (offset.top + panelHeight);
  // const enoughSpaceBelow = viewport.bottom > (offset.bottom + panelHeight);

  // console.log('outside');
  // console.log('placement: ', elemPlacement);
  // console.log('below: ', enoughSpaceBelow, 'above: ', enoughSpaceAbove);
  // if (!enoughSpaceBelow && enoughSpaceAbove) {
  //   console.log('inside 1');
  //   switch(elemPlacement) {
  //     case 'bottom-end':
  //       elemPlacement = 'top-end';
  //       overlay.style.left = 'initial';
  //       overlay.style.right = '0'
  //       overlay.style.transform = 'translateX(0)';
  //     case 'bottom':
  //       elemPlacement = 'top';
  //       break;
  //     case 'bottom-start':
  //       elemPlacement = 'top-start';
  //       overlay.style.left = '0';
  //       overlay.style.transform = 'translateX(0)';
  //   }
  // } else if (enoughSpaceAbove && enoughSpaceBelow) {
  //   switch(elemPlacement) {
  //     case 'top-end':
  //       elemPlacement = 'bottom-end';
  //       overlay.style.left = 'initial';
  //       overlay.style.right = '0'
  //       overlay.style.transform = 'translateX(0)';
  //       console.log('last');
  //       break;
  //     case 'top':
  //       elemPlacement = 'bottom';
  //       break;
  //     case 'top-start':
  //       elemPlacement = 'bottom-start';
  //       overlay.style.left = '0';
  //       overlay.style.transform = 'translateX(0)';
  //       break;
  //   }
  //   // elemPlacement = elemPlacement.replace("top", "bottom");
  //   console.log('inside 2');
  // }

  // if (elemPlacement.includes('top')) {
  //   console.log('inside 3');
  //   overlay.style.top = `-${panelNewLoc.top}px`;
  // }
}

export const createObserver = (
  // TODO Q: why is IntersectionObserver not working?
  intersectionObserver: any,
  xRootMargin: string,
  el: HTMLElement,
  callback: () => void
): void => {
  intersectionObserver = new IntersectionObserver(
    (entries) => {
      console.log('yo');
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log('entry: ', entry);
          intersectionObserver.disconnect();
          intersectionObserver = undefined;
          callback();
        }
      });
    },
    { rootMargin: xRootMargin }
  );

  intersectionObserver.observe(el);
};


