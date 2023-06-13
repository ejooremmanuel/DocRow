import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'DocRowsWebPartStrings';
import DocRows from './components/DocRows';
import { IDocRowsProps } from './components/IDocRowsProps';

export interface IDocRowWebPartProps {
  description: string;
}

export default class DocRowsWebPart extends BaseClientSideWebPart<IDocRowWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IDocRowsProps> = React.createElement(
  DocRows,
  {
    description: this.properties.description,
    context: this.context, // Pass the context prop
  }
);


    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
