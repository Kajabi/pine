/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const typedComponents: Record<string, any> = docSource;

  if (docSource) {
    component = docSource.find((component: { tag: string; }) => component.tag === componentName)
  }

  if ( component) {
    Object.keys(sectionNameMapping).forEach((sectionName: string) => {
      typedComponents[sectionName] = component[sectionName];
    });
  }


  const renderHeaders = () => {
   return HEADER_COLUMNS.map( (name: string) => (
      <div className='args-table-header'>{name}</div>
    ))
  }

  const renderSections = () => {
    return (
      Object.keys(typedComponents).map((section) => {
        if ( typedComponents[section].length > 0 ) {
          return generateSection(section);
        }
      })
    )
  }

  const generateSection = (section: string) => (
    <>
      <section className="args-section">
        <div className="args-table-cell">{lookupValueByKey(section).toUpperCase()}</div>
      </section>
      { generateSectionRows(typedComponents[section] )}
    </>
  )


  const generateSectionRows = (sectionProps: any) => {
    const rows = sectionProps.map((prop: any, idx: number) => (
      <div className='arg-table-row' key={`rowIndex-${idx}`}>
        <div className='arg-table-cell'>
          <strong>{prop.attr || prop.event || prop.name }</strong>
        </div>
        <div className='arg-table-cell'>
          <Markdown>{prop.docs}</Markdown>
          <div className="args-type"><code>{prop.type || prop.detail}</code></div>
        </div>
        <div className='arg-table-cell'>
          <Markdown>{renderDefaultOrEmpty(prop.default)}</Markdown>
        </div>
      </div>
    ));

    return (
      <>
        { rows }
      </>
    )
  }

  const renderDefaultOrEmpty = (value: string | undefined) => {
    if (value === undefined)
      return '';

    return `\`\`\`${value}\`\`\``
  }

  const inlineStyles = () => (
    {
      "gridTemplateColumns":  `repeat(${HEADER_COLUMNS.length}, 1fr)`,
      'marginBottom': '40px'
    }
  );

  return (
    <>
    <div className="args-table" style={inlineStyles()}>
      { renderHeaders() }
      { renderSections() }
    </div>
    </>
  )
};

import './docArgsTable.css';

export default DocArgsTable
