// filters only tokens originating from core.json
export const coreFilter = (token) => token.filePath.endsWith("core.json");

// filters only tokens originating from semantic sets (not core, not components) and also check themeable or not
export const brandFilter =
  (themeable = false) =>
  (token) => {
    const tokenThemable = Boolean(token.attributes.themeable);
    return (
      themeable === tokenThemable &&
      ["core"].every(
        (cat) => !token.filePath.endsWith(`${cat}.json`)
      )
    );
  };
