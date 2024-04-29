import React from 'react';
import allTokenJson from '../../../../core/src/global/styles/tokens/tokens.json';

interface TokenEntry {
  value: string;
}

interface Token {
  [key: string]: TokenEntry | Token;
}

interface DocTokenTableProps {
  type: string;
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

const DocTokenTable: React.FC<DocTokenTableProps> = ({ type, category }) => {
  let pineTokens: Token | TokenEntry = {};
  
  if (type == 'core') {
    pineTokens = allTokenJson.core[category as keyof typeof allTokenJson.core] as Token;
  } else if (type == 'semantic') {
    pineTokens = allTokenJson.semantic[category as keyof typeof allTokenJson.semantic] as Token || {};
  }
  
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
          }
        } else {
          matchingValue = token.value.startsWith('{') && token.value.endsWith('}')
            ? findValueByKey(allTokenJson.core, token.value.slice(1, -1))
            : token.value;
        }
        
        if (matchingValue) {
          switch (category) {
            case 'color':
              if (matchingValue.startsWith('#')) {
                style.backgroundColor = matchingValue;
                style.width = "30px";
                style.height = "30px";
              } else {
                style.color = matchingValue;
              }
              break;
            case 'border':
              style.border = matchingValue;
              style.width = "30px";
              style.height = "30px";
              break;
            case 'border-radius':
              style.borderRadius = matchingValue;
              style.width = "100px";
              style.height = "50px";
              style.border = "1px solid black";
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
                      <div style={{ border: '1px solid black', width: '30px', height: '30px' }}></div>
                      <div style={{ border: '1px solid black', width: '30px', height: '30px' }}></div>
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
    <table>
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
