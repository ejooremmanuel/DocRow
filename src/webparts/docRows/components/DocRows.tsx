import * as React from "react";
import { IDocRowsProps } from "./IDocRowsProps";
import ColumnOne from "./ColumnOne";
import ColumnTwo from "./ColumnTwo";
import ColumnThree from "./ColumnThree";
import styles from "./DocRows.module.scss";
import * as jQuery from "jquery";

export default class MyWebPart extends React.Component<IDocRowsProps, {}> {
  public render(): React.ReactElement<IDocRowsProps> {
    jQuery("#workbenchPageContent").prop("style", "max-width: none");
    jQuery(".SPCanvas-canvas").prop("style", "max-width: none");
    jQuery(".CanvasZone").prop("style", "max-width: none");

    const { context } = this.props;

    return (
      <div className={styles.docCol}>
        <div className={styles.docRowContainer}>
          <ColumnOne context={context} />
          <ColumnTwo context={context} />
          <ColumnThree
            documentLibraryUrl="Shared Documents"
            siteUrl={this.props.context.pageContext.web.absoluteUrl}
          />
        </div>
      </div>
    );
  }
}
