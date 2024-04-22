import React from 'react';
import allTokenJson from '../../../../core/src/global/styles/tokens/tokens.json';

interface TokenEntry {
  value: string;
}

interface Token {
  [key: string]: TokenEntry;
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

  return 'value' in value ? value.value : undefined;
};

const DocTokenTable: React.FC<DocTokenTableProps> = ({ category }) => {
  console.log('all core tokens: ', allTokenJson);

  const semanticTokens: Token = allTokenJson.semantic[category];
  
  const renderTableRows = (tokens: Token, parentKey?: string) => {
    return Object.keys(tokens).map((key) => {
      const token = tokens[key];
      const fullKey = parentKey ? `${parentKey}-${key}` : key;
      const prefixedKey = `--pine-${category}-${fullKey}`;
  
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
  
        return (
          <tr key={fullKey}>
            <td style={{ backgroundColor: `var(${prefixedKey})` }}></td>
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
        {renderTableRows(semanticTokens)}
      </tbody>
    </table>
  );
}

export default DocTokenTable;
