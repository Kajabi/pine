import React from 'react';
import allTokenJson from '../../../../core/src/global/styles/tokens/tokens.json';

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
}

const findValueByKey = (obj: Record<string, any>, keyPath: string): string | undefined => {
  if (obj === null || typeof obj !== 'object') {
    return undefined;
  }

  const keys = keyPath.split('.');
  let value = obj;

  for (const key of keys) {
    if (typeof value !== 'object' || !Object.prototype.hasOwnProperty.call(value, key)) {
      return undefined;
    }
    value = value[key];
  }

  return 'value' in value ? value.value : undefined;
};

const DocTokenTable: React.FC<DocTokenTableProps> = ({ category }) => {
  const pineTokens = allTokenJson.core[category as keyof typeof allTokenJson.core] as Token;

  const buildValue = (item: string | { [s: string]: unknown; } | ArrayLike<unknown>): string => {
    const boxShadowValue = Object.values(item) as unknown as string[];
    const filteredBoxShadowValue = boxShadowValue.filter(prop => prop !== 'dropShadow');
    
    return filteredBoxShadowValue.join(' ');
  };

  const categoryStyleMapping: Record<string, Partial<React.CSSProperties>> = {
    color: { width: "100%", height: "40px", borderRadius: "4px"},
    border: { width: "100%", height: "40px", borderRadius: "4px" },
    "border-radius": { border: "1px solid #d3d5d9", width: "100%", height: "40px" },
    "border-width": { border: "1px solid #d3d5d9", width: "100%", height: "40px" },
    "box-shadow": { width: "100%", height: "40px" },
  };
  
  const renderTableRows = (tokens: Token, parentKey?: string): JSX.Element[] => {
    return Object.entries(tokens).map(([key, token]): JSX.Element => {
      const fullKey = parentKey ? `${parentKey}-${key}` : key;
      const prefixedKey = `--pine-${category}-${fullKey}`;
      const style: React.CSSProperties = {};
  
      if ('value' in token) {
        let matchingValue: string | undefined;

        if (typeof token.value === 'object') {
          if ('value' in token.value) {
            matchingValue = token.value.value as string;
          } else {
            if (token.type = 'box-shadow') {
              if (Array.isArray(token.value)) {
                const boxShadows = [] ;
                for (const item of token.value as string[]){
                  boxShadows.push(buildValue(item));
                }
                matchingValue = boxShadows.join(', ');
              } else {
                matchingValue = buildValue(token.value);
              }
            }
          }
        } else {
          matchingValue = token.value.startsWith('{') && token.value.endsWith('}')
            ? findValueByKey(allTokenJson.core, token.value.slice(1, -1))
            : token.value;
        }
        
        if (matchingValue) {
          const categoryStyles = categoryStyleMapping[category];
          Object.assign(style, categoryStyles);

          switch (category) {
            case 'color':
              style.backgroundColor = matchingValue;
              break;
            case 'border':
              style.border = matchingValue;
              break;
            case 'border-radius':
              style.borderRadius = matchingValue;
              break;
            case 'border-width':
              style.borderWidth = matchingValue;
              break;
            case 'box-shadow':
              style.boxShadow = matchingValue;
              break;
            case 'letter-spacing':
              style.letterSpacing = matchingValue;
              break;
            case 'line-height':
              style.lineHeight = matchingValue;
              break;
            case 'font-weight':
              style.fontWeight = matchingValue;
              break;
            case 'font-family':
              style.fontFamily = matchingValue;
              break;
            case 'font-size':
              style.fontSize = matchingValue;
              break;
            case 'spacing':
              // Render spacing row
              return (
                <tr key={fullKey}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: `var(${prefixedKey})`}}>
                      <div style={{ border: '1px solid black', width: '60px', height: '30px', borderRadius: '4px' }}></div>
                      <div style={{ border: '1px solid black', width: '60px', height: '30px', borderRadius: '4px' }}></div>
                    </div>
                  </td>
                  <td>{prefixedKey}</td>
                  <td>{matchingValue}</td>
                </tr>
              );
            default:
              // For other categories, render an empty div with the computed style
              return (
                <tr key={fullKey}>
                  <td>
                    <div style={style}></div>
                  </td>
                  <td>{prefixedKey}</td>
                  <td>{matchingValue}</td>
                </tr>
              );
          }
        }

        // Render "Aa" preview only for text-based styles
        const isTextBasedStyle = ['letter-spacing', 'line-height', 'font-weight', 'font-family', 'font-size'].includes(category);
        const preview = isTextBasedStyle ? <div style={style}>Aa</div> : <div style={style}></div>;

        return (
          <tr key={fullKey}>
            <td>{preview}</td>
            <td>{prefixedKey}</td>
            <td>{matchingValue}</td>
          </tr>
        );
      } else {
        return <>{renderTableRows(token as Token, fullKey)}</>;
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
