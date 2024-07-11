import React from 'react';
import allTokenJson from '../../../../core/src/global/styles/tokens/core/core.json';

import './docTokenTable.css';

interface TokenEntry {
  $value: string;
  $type: string;
}

interface Token {
  [key: string]: TokenEntry | Token;
}

interface DocTokenTableProps {
  category: string;
}

const categoryStyleMapping: Record<string, Partial<React.CSSProperties>> = {
  color: { width: "100%", height: "40px", borderRadius: "4px"},
  border: { width: "100%", height: "40px", borderRadius: "4px" },
  "border-radius": { border: "1px solid #d3d5d9", width: "100%", height: "40px" },
  "border-width": { border: "1px solid #d3d5d9", width: "100%", height: "40px" },
  "box-shadow": { width: "100%", height: "40px" },
};

const applyStyle = (category: string, value: string): React.CSSProperties => {
  const style: React.CSSProperties = {};
  const categoryStyles = categoryStyleMapping[category];

  Object.assign(style, categoryStyles);

  const styleMap: { [key: string ]: (value: string) => void } = {
    'border': (val) => style.border = val,
    'color': (val) => style.backgroundColor = val,
    'border-radius': (val) => style.borderRadius = val,
    'border-width': (val) => style.borderWidth = val,
    'box-shadow': (val) => style.boxShadow = val,
    'font-family': (val) => style.fontFamily = val,
    'font-size': (val) => style.fontSize = val,
    'font-weight': (val) => style.fontWeight = val,
    'letter-spacing': (val) => style.letterSpacing =  val,
    'line-height': (val) => style.lineHeight = val,
  };

  styleMap[category]?.(value);

  return style;
}

const DocTokenTable: React.FC<DocTokenTableProps> = ({ category }) => {
  const pineTokens = allTokenJson[category as keyof typeof allTokenJson] as unknown as Token;

  const buildValue = (item: string | Record<string, unknown> | ArrayLike<unknown>): string => {
    const boxShadowValue = Object.values(item) as unknown as string[];
    const filteredBoxShadowValue = boxShadowValue.filter(prop => prop !== 'dropShadow');

    return filteredBoxShadowValue.join(' ');
  };

  const renderTableRows = (tokens: Token, parentKey?: string): JSX.Element[] => {
    const entries = Object.entries(tokens);

    // sets and sorts data based on numerical value
    // and ignores box-shadow and color
    const data = entries.sort((tokenKeyA, tokenKeyB) => parseInt(tokenKeyA[0]) - parseInt(tokenKeyB[0]));

    return data.map(([key, token]): JSX.Element => {

      const tokenKeyName = parentKey ? `${parentKey}-${key}` : key;
      const cssVariableName =  `--pine-${category}-${tokenKeyName}`;

      if ('$value' in token) {
        let cssPropertyValue: string | undefined;
        cssPropertyValue = token.$value as string;

        if (typeof token.$value === 'object') {
          if ('$value' in token.$value) {
            cssPropertyValue = token.$value.$value as string;
          }
          else if (token.$type === 'boxShadow') {
            if (Array.isArray(token.$value)) {
              cssPropertyValue = (token.$value as string[]).map(buildValue).join(', ');
            } else {
              cssPropertyValue = buildValue(token.$value);
            }
          }
        }

        let style: React.CSSProperties = {};
        // Render "Aa" preview only for text-based styles
        let previewDiv = <div style={style}>Aa</div>;

        if (cssPropertyValue) {
          style = applyStyle(category, cssPropertyValue);

          const isTextBasedStyle = ['letter-spacing', 'line-height', 'font-weight', 'font-family', 'font-size'].includes(category);
          previewDiv = isTextBasedStyle ? <div style={style}>Aa</div> : <div style={style}></div>;

           switch (category) {
            case 'spacing':
              previewDiv =
                <div style={{ display: 'flex', alignItems: 'center', gap: `var(${cssVariableName})`}}>
                  <div key={`${Math.floor(Math.random() * (100000 - 1 + 1)) + 1}`} style={{ border: '1px solid #eceeef', width: '60px', height: '30px', borderRadius: '4px' }}></div>
                  <div style={{ border: '1px solid #eceeef', width: '60px', height: '30px', borderRadius: '4px' }}></div>
                </div>
              ;
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
        {renderTableRows(pineTokens)}
      </tbody>
    </table>
  );
}

export default DocTokenTable;
