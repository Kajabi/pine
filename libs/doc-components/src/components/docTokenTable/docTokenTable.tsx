import React from 'react';
import allTokenJson from '../../../../core/src/global/styles/tokens/tokens.json';

interface TokenEntry {
  value: string;
}

interface Token {
  [key: string]: TokenEntry | Token;
}

interface DocTokenTableProps {
  category: string;
}

const findValueByKey = (obj: any, keyPath: string): string | undefined => {
  if (obj === null || typeof obj !== 'object') {
    return undefined;
  }

  const keys = keyPath.split('.');
  let value = obj;

  for (const key of keys) {
    if (typeof value !== 'object' || !value.hasOwnProperty(key)) {
      return undefined;
    }
    value = value[key];
  }

  console.log('keypath: ', keyPath);

  return 'value' in value ? value.value : undefined;
};

const DocTokenTable: React.FC<DocTokenTableProps> = ({ type, category }) => {
  console.log('all core tokens: ', allTokenJson);
  
  let pineTokens: Token = {};

  if (type == 'core') {
    pineTokens = allTokenJson.core[category];
  } else if (type == 'semantic') {
    pineTokens = allTokenJson.semantic[category];
  }
  
  const renderTableRows = (tokens: Token, parentKey?: string) => {
    return Object.entries(tokens).map(([key, token]) => {
      const fullKey = parentKey ? `${parentKey}-${key}` : key;
      const prefixedKey = `--pine-${category}-${fullKey}`;
      let style: React.CSSProperties = {};
  
      if ('value' in token) {
        let matchingValue;
        if (typeof token.value === 'object') {
          const keys = Object.keys(token.value);
          const lastKey = keys[keys.length - 1];
          matchingValue = token.value[lastKey];
        } else {
          matchingValue = token.value.startsWith('{') && token.value.endsWith('}')
            ? findValueByKey(allTokenJson.core, token.value.slice(1, -1))
            : token.value;
        }
  
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
          default:
            // Handle other token types or use a default style
            break;
        }
        console.log('matchingvalue: ', matchingValue);

        // MOVE THIS TO THE FIRST TABLE CELL


        return (
          <tr key={fullKey}>
            <td>
              <div style={style}>Aa</div>
            </td>
            <td>{prefixedKey}</td>
            <td>{matchingValue}</td>
          </tr>
        );
      } else {
        return renderTableRows(token as Token, fullKey);
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
