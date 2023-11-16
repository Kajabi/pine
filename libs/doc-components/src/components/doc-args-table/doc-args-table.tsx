import { Component, Host, h, Prop } from '@stencil/core';

@Component({
  tag: 'doc-args-table',
  styleUrl: 'doc-args-table.scss',
  shadow: false,
})
export class DocArgsTable {
  @Prop() of: string;

  render() {
    // TODO: Consider structuredClone() as alternative to JSON.parse()
    const props = JSON.parse(this.of);
    console.log(props);

    return (
      <Host>
        <table>
          <thead>
            <tr>
              <td>Name</td>
              <td>Description</td>
              <td>Default</td>
            </tr>
          </thead>
          <tbody>
            {Object.values(props).map((prop: object) => {
              return (
                <tr>
                  <td>{prop['name']}</td>
                  <td>
                    <div>{prop['description']}</div>
                    <div><em>{prop['table']['type']['summary']}</em></div>
                  </td>
                  <td>{prop['table']['defaultValue']['summary']}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </Host>
    );
  }

}