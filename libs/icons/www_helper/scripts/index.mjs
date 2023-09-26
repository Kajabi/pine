import iconData from './icon-data.json' assert { type: "json"};

document.getElementById("icon-gallery").innerHTML = `
    ${iconData.icons.map((icon) => {
      return `
        <div class="icon-item">
          <div class="icon">
            <pds-icon name="${icon.name}" size="normal"></pds-icon>
            <input value="${icon.tags.join(',')}" />
          </div>
          <div class="icon-title">${icon.name}</div>
        </div>
      `
    }
  )}
`;
