import React, { useEffect, useState } from 'react';

import './docTokenTable.css';

interface TokenEntry {
  value: string;
  type: string;
}

interface Token {
  [key: string]: TokenEntry | Token;
}

interface DocTokenTableProps {
  category: string;
  tier: string;
  use: string;
}
interface CategoryLookup {
  [key: string]: {
    [key: string]: string[];
  }
}

const categoryStyleMapping: Record<string, Partial<React.CSSProperties>> = {
  color: { width: "75%", height: "60px", border: "1px solid #d3d5d9", borderRadius: "4px"},
  border: { width: "75%", height: "60px", border: "1px solid #d3d5d9", borderRadius: "4px" },
  "border-radius": { border: "1px solid #d3d5d9", width: "75%", height: "60px" },
  "border-width": { border: "1px solid #d3d5d9", width: "75%", height: "60px" },
  "box-shadow": { width: "75%", height: "60px" },
};

const applyStyle = (category: string, value: string, use?: string): React.CSSProperties => {
  const style: React.CSSProperties = {};
  const categoryStyles = categoryStyleMapping[category];
  const transformVal = (val: string) => `var(${val})`;

  Object.assign(style, categoryStyles);

  const styleMap: { [key: string]: (value: string) => void } = {
    'border': (val) => style.border = transformVal(val),
    'border-radius': (val) => style.borderRadius = transformVal(val),
    'border-width': (val) => style.borderWidth = transformVal(val),
    'box-shadow': (val) => style.boxShadow = transformVal(val),
    'color': (val) => style.backgroundColor = transformVal(val),
    'dimension': (val) => {
      if (use === 'spacing') {
        style.margin = transformVal(val); // Example: apply margin for spacing
      } else {
        style.borderRadius = transformVal(val);
      }
    },
    'font-family': (val) => style.fontFamily = transformVal(val),
    'font-size': (val) => style.fontSize = transformVal(val),
    'font-weight': (val) => style.fontWeight = transformVal(val),
    'letter-spacing': (val) => style.letterSpacing = transformVal(val),
    'line-height': (val) => style.lineHeight = transformVal(val),
    'outline': (val) => style.outline = transformVal(val),
    'typography': (val) => style.font = transformVal(val),
  };

  styleMap[category]?.(value);

  return style;
}

const categoryLookup: CategoryLookup = {
  "border-radius": {
    "core": ['dimension'],
    "semantic": ['border-radius', 'dimension'],
  },
};

const formattedCategoryName = {
  "fontFamilies": "font-family",
  "fontSizes": "font-size",
  "fontWeights": "font-weight",
  "lineHeights": "line-height",
}

const DocTokenTable: React.FC<DocTokenTableProps> = ({ category, tier, use }) => {
  const [pineTokens, setPineTokens] = useState<Token | null>(null);

  useEffect(() => {
    const loadTokens = async () => {
      try {
        const tokenModule = await import(`../../../../../node_modules/@kajabi-ui/styles/dist/tokens/${tier}.json`);
        const categories = categoryLookup[category]?.[tier] || null;
        if (categories) {
          const tempTokens: Token[] = [];
          categories.forEach((cat: string) => {
            tempTokens.push(tokenModule.default[cat as keyof typeof tokenModule.default]);
          });
          const mergedTokens = tempTokens.reduce((result, tokenObj) => ({...result, ...tokenObj}), {});
          setPineTokens(mergedTokens as Token);
        }
        else {
          setPineTokens(tokenModule.default[category as keyof typeof tokenModule.default] as Token);
        }
      } catch (error) {
        console.error('Error loading token JSON:', error);
      }
    };

    loadTokens();
  }, [category, tier]);

  const buildValue = (item: string | Record<string, unknown> | ArrayLike<unknown>): string => {
    const boxShadowValue = Object.values(item) as unknown as string[];
    const filteredBoxShadowValue = boxShadowValue.filter(prop => prop !== 'dropShadow');

    return filteredBoxShadowValue.join(' ');
  };

  const camelToKebab = (str: string): string => {
    return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
  };

  const renderTableRows = (tokens: Token, parentKey?: string): JSX.Element[] => {
    const entries = Object.entries(tokens);

    // sets and sorts data based on numerical value
    // and ignores box-shadow and color
    const data = entries.sort((tokenKeyA, tokenKeyB) => parseInt(tokenKeyA[0]) - parseInt(tokenKeyB[0]));

    return data.map(([key, token]): JSX.Element => {
      const tokenKeyName = parentKey ? `${parentKey}-${key}` : key;
      let label: string | Token | TokenEntry = token.type || category;

      if (formattedCategoryName[token.type as keyof typeof formattedCategoryName]) {
        label = formattedCategoryName[token.type as keyof typeof formattedCategoryName];
      }

      // Rule for outline tokens since they are best handled as borders in Tokens Studio
      if (category === 'outline') {
        label = category;
      }

      // Rule for z-index tokens since they use "other" type in Token Studio
      if (category === 'z-index') {
        label = 'z-index';
      }

      const cssVariableName = `--pine-${camelToKebab(label as string)}-${tokenKeyName}`.replace(/-@/g, '');

      if ('value' in token) {
        let cssPropertyValue: string | undefined;
        cssPropertyValue = token.value as string;

        if (typeof token.value === 'object') {
          if ('value' in token.value) {
            cssPropertyValue = token.value.value as string;
          }
          else if (
            token.type === 'boxShadow'
            || token.type === 'typography'
            || token.type === 'border'
          ) {
            if (Array.isArray(token.value)) {
              cssPropertyValue = (token.value as string[]).map(buildValue).join(', ');
            } else {
              cssPropertyValue = buildValue(token.value);
            }
          }
        }

        let style: React.CSSProperties = {};
        // Render "Aa" preview only for text-based styles
        let previewDiv = <div style={style}>Aa</div>;

        if (cssPropertyValue) {
          style = applyStyle(category, cssVariableName, use);

          const isTextBasedStyle = ['letter-spacing', 'line-height', 'font-weight', 'font-family', 'font-size', 'typography'].includes(category);
          previewDiv = isTextBasedStyle ? <div style={style}>Aa</div> : <div style={{ ...style, width: '75%', height: '60px', }}></div>;

          switch (category) {
            case 'dimension':
              switch (use) {
                case 'spacing':
                  previewDiv =
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: `var(${cssVariableName})`}}>
                      <div key={`${Math.floor(Math.random() * (100000 - 1 + 1)) + 1}`} style={{ border: 'var(--pine-border)', width: '60px', height: '60px', borderRadius: '4px' }}></div>
                      <div style={{ border: 'var(--pine-border)', width: '60px', height: '60px', borderRadius: '4px' }}></div>
                    </div>
                  break;
                }
              break;
          }
        }

        return (
          <tr key={`${cssVariableName}-${new Date().getUTCMilliseconds()}`}>
            <td>{previewDiv}</td>
            <td>{cssVariableName}</td>
            <td>{cssPropertyValue}</td>
          </tr>
        );
      }
      else {
        return <>
          { renderTableRows(token as Token, tokenKeyName) }
        </>;
      }
    });
  };

  return (
    <table className="doc-token-table">
      <thead>
        <tr>
          <th>Preview</th>
          <th>Token</th>
          <th>Value</th>
        </tr>
      </thead>
      <tbody>
        {pineTokens && renderTableRows(pineTokens)}
      </tbody>
    </table>
  );
}

export default DocTokenTable;
