// filters tokens by themable and from which tokenset they originate
// must match per component name, in this repository we currently only have "button"
export const componentFilter =
  (cat, themeable = false) =>
    (token) => {
      const tokenThemable = Boolean(token.attributes.themeable);

      return (
        themeable === tokenThemable && token.filePath.endsWith(`${cat}.json`)
      );
  };
