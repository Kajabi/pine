import React from 'react';
import { components } from '../../assets/docs.json'
import './docArgsTable.css';

export interface DocArgsTableProps {
  componentName: string
  docSource: Array<any>
}

const DocArgsTable: React.FC<DocArgsTableProps> = ({
  componentName,
  docSource
}) => {
  let props: object = {};

  if (docSource) {
    props = docSource.find((component: { tag: string; }) => component.tag === componentName)?.props || {};
  }
  else {
    props = components.find((component) => component.tag === componentName)?.props || {};
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
          {props && Object.values(props).map((prop: any, i: number) => {
            return (
              <tr key={`rowIndex-${i}`}>
                <td>{prop.name}</td>
                <td>
                  <div>{prop.docs}</div>
                  <div className="args-type"><em>{prop.type}</em></div>
                </td>
                <td>{prop.default}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </>
  )
};

export default DocArgsTable
