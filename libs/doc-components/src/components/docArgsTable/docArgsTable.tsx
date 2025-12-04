/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import Markdown from 'markdown-to-jsx';

import './docArgsTable.css';


export interface DocArgsTableProps {
  componentName: string
  docSource: Array<any>
}

const sectionNameMapping = {
  props: "properties",
  events: "events",
  methods: "methods",
  slots: "slots",
  styles: "css custom properties",
  parts: "css shadow parts"
} as const;

function isSectionKey(key: string): key is keyof typeof sectionNameMapping {
  return key in sectionNameMapping;
}

function lookupValueByKey(key: string): string {
  if (isSectionKey(key)) {
    return sectionNameMapping[key];
  } else {
    throw new Error(`Invalid key: ${key}`);
  }
}

const HEADER_COLUMNS: Array<string> = [
  'Name',
  'Description',
  'Default'
];

const DocArgsTable: React.FC<DocArgsTableProps> = ({
  componentName,
  docSource
}) => {
  let component: any;
  const typedComponents: Record<string, any> = {};

  if (docSource) {
    component = docSource.find((c: { tag: string; }) => c.tag === componentName)
  }

  if (component) {
    Object.keys(sectionNameMapping).forEach((sectionName: string) => {
      typedComponents[sectionName] = component[sectionName];
    });
  }

  const renderHeaders = () => {
    return HEADER_COLUMNS.map((name: string, idx: number) => (
      <div key={`header-${idx}`} className='args-table-header'>{name}</div>
    ))
  }

  const renderSections = () => {
    return Object.keys(typedComponents).map((section, idx) => {
      if (typedComponents[section] && typedComponents[section].length > 0) {
        return (
          <React.Fragment key={`section-${idx}`}>
            <section className="args-section">
              <div className="args-table-cell">{lookupValueByKey(section).toUpperCase()}</div>
            </section>
            {typedComponents[section].map((prop: any, propIdx: number) => (
              <div className='arg-table-row' key={`row-${idx}-${propIdx}`}>
                <div className='arg-table-cell'>
                  <strong>{prop.attr || prop.event || prop.name}</strong>
                  <span style={{ color: 'red', cursor: 'help' }} title="Required">{prop.required === true ? '*' : ''}</span>
                </div>
                <div className='arg-table-cell'>
                  <Markdown>{prop.docs || ''}</Markdown>
                  <div className="args-type"><code>{prop.type || prop.detail || ''}</code></div>
                </div>
                <div className='arg-table-cell'>
                  <Markdown>{prop.default !== undefined ? `\`\`\`${prop.default}\`\`\`` : ''}</Markdown>
                </div>
              </div>
            ))}
          </React.Fragment>
        );
      }
      return null;
    });
  }

  const inlineStyles = {
    gridTemplateColumns: `repeat(${HEADER_COLUMNS.length}, 1fr)`,
    marginBottom: '40px'
  };

  return (
    <div className="args-table" style={inlineStyles}>
      {renderHeaders()}
      {renderSections()}
    </div>
  );
};

export default DocArgsTable;
