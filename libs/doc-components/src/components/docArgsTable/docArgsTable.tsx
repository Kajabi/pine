/* eslint-disable @typescript-eslint/no-explicit-any */
import Markdown from 'markdown-to-jsx';

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

  const generateTableSection = (section: string) => {
    const sectionTitle: string = Object.keys(sectionNameMapping).find((k) => k == section) || '';
    return (
      <>
        <tr key={sectionTitle}>
          <td colSpan={3}>{sectionTitle.toUpperCase()}</td>
        </tr>
        { generateSubSection(typedComponents[section]) }
      </>
    );
  };

  const generateSubSection = (sectionProps: any) => {

    const tableRows = sectionProps.map((prop: any, i: number) => (
      <tr key={`rowIndex-${i}`}>
        <td>{prop.attr || prop.event || prop.name}</td>
        <td>
          <Markdown>{prop.docs}</Markdown>
          <div className="args-type"><em>{prop.type || prop.detail}</em></div>
        </td>
        <td>{prop.default}</td>
      </tr>
    ))

    return (
      <>
        { tableRows }
      </>
    )
  }

  return (
    <>
      <table className="args-table">
        <thead>
          <tr>
            <td>Name</td>
            <td>Description</td>
            <td>Default</td>
          </tr>
        </thead>
        <tbody>
          { Object.keys(typedComponents).map((section) => {
            if (typedComponents[section].length > 0 ) {
              return generateTableSection(section)
            }
          })
          }
        </tbody>
      </table>
    </>
  )
};

export default DocArgsTable
