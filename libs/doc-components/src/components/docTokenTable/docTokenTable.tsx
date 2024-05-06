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

  switch (category) {
    case 'color':
      style.backgroundColor = value;
      break;
    case 'border':
      style.border = value;
      break;
    case 'border-radius':
      style.borderRadius = value;
      break;
    case 'border-width':
      style.borderWidth = value;
      break;
    case 'box-shadow':
      style.boxShadow = value;
      break;
    case 'letter-spacing':
      style.letterSpacing = value;
      break;
    case 'line-height':
      style.lineHeight = value;
      break;
    case 'font-weight':
      style.fontWeight = value;
      break;
    case 'font-family':
      style.fontFamily = value;
      break;
    case 'font-size':
      style.fontSize = value;
      break;
  }

  return style;
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

  const renderTableRows = (tokens: Token, parentKey?: string): JSX.Element[] => {
    return Object.entries(tokens).map(([key, token]): JSX.Element => {
      
      const tokenKeyName = parentKey ? `${parentKey}-${key}` : key;
      const cssVariableName =  `--pine-${category}-${tokenKeyName}`;
            
      if ('value' in token) {
        let cssPropertyValue: string | undefined;
                
        if (typeof token.value === 'object') {
          if ('value' in token.value) {
            cssPropertyValue = token.value.value as string;
          }
          else { // For BoxShadow's
            if (token.type = 'box-shadow') {
              if (Array.isArray(token.value)) {
                const boxShadows = [] ;
                for (const item of token.value as string[]){
                  boxShadows.push(buildValue(item));
                }
                cssPropertyValue = boxShadows.join(', ');
              } else {
                cssPropertyValue = buildValue(token.value);
              }
            }
          }
        }
        else {
          cssPropertyValue = token.value.startsWith('{') && token.value.endsWith('}')
          ? findValueByKey(allTokenJson.core, token.value.slice(1, -1))
          : token.value;  
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
                  <div key={`${Math.floor(Math.random() * (100000 - 1 + 1)) + 1}`} style={{ border: '1px solid #B5BAC0', width: '60px', height: '30px', borderRadius: '4px' }}></div>
                  <div style={{ border: '1px solid #B5BAC0', width: '60px', height: '30px', borderRadius: '4px' }}></div>
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
