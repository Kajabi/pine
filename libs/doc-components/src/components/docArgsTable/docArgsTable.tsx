import React from 'react';
import { components } from '../../assets/docs.json'

export interface DocArgsTableProps {
  componentName: string
}

const DocArgsTable: React.FC<DocArgsTableProps> = ({
  componentName
}) => {
  let props: object = {};

  props = components.find((component) => component.tag === componentName)?.props || {};

  return (
    <>
      <table>
        <thead>
          <tr>
            <td>Name</td>
            <td>Description</td>
            <td>Default</td>
          </tr>
        </thead>
        <tbody>
          {props && Object.values(props).map((prop: any) => {
            return (
              <tr>
                <td>{prop.name}</td>
                <td>
                  <div>{prop.docs}</div>
                  <div><em>{prop.type}</em></div>
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
