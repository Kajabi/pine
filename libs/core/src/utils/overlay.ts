export const positionTooltip = (elem, elemPlacement, overlay, offset = 8) => {
  if (elem == undefined) return;

  const rect = elem.getBoundingClientRect();
  const contentRect = overlay.getBoundingClientRect();

  // Exit the function if the placement is not set
  if (!elemPlacement || elemPlacement == "") return;

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
    overlay.style.right = `calc(${rect.width}px + ${offset}px)`;
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
}
