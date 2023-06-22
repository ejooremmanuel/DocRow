import * as React from "react";
import { SearchBox, Icon } from "office-ui-fabric-react";
import "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/fields";
//import "@pnp/sp/items/get-all";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import styles from "./DocRows.module.scss";

//import { sp } from "@pnp/sp";

import { Web } from "@pnp/sp/presets/all";
import { sp } from "@pnp/sp";
import { IDocument } from "./interfaces";
//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
//import { faDownload } from '@fortawesome/free-solid-svg-icons';

export interface IColumnThreeProps {
  documentLibraryUrl: string;
  siteUrl: string;
  context?: WebPartContext;
}

export interface IColumnThreeState {
  documents: IDocument[];
  searchText: string;
}

export default class ColumnThree extends React.Component<
  IColumnThreeProps,
  IColumnThreeState
> {
  constructor(props: IColumnThreeProps) {
    super(props);

    this.state = {
      documents: [],
      searchText: "",
    };
  }

  public componentDidMount(): void {
    this.fetchDocuments().catch(console.error);
  }

  public componentwillUpdate(): void {
    console.log("update here...");
  }

  private async fetchDocuments(): Promise<void> {
    try {
      const { siteUrl } = this.props;
      const web = Web(siteUrl);
      const list = web.lists.getByTitle("Documents");
      const items = await list.items
        .select("ID", "FileLeafRef", "FileRef")
        .get();

      const documents: IDocument[] = items.map((item) => ({
        id: item.Id,
        title: item.FileLeafRef,
        fileRef: item.FileRef,
      }));
      console.log(documents);

      this.setState({ documents });
    } catch (error) {
      console.log("Error fetching documents:", error);
    }
  }

  private handleSearch(event: React.ChangeEvent<HTMLInputElement>): void {
    this.setState({ searchText: event.target.value });
  }

  private handleUploadClick: React.MouseEventHandler<HTMLElement> = async (
    event
  ) => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";

    // Handle file selection
    fileInput.addEventListener("change", async () => {
      try {
        const file = fileInput.files?.[0];
        if (file) {
          const { context } = this.props;
          // console.log(sp.profiles.);

          const fileServerRelativeUrl = `/Shared Documents/${file.name}`;
          const response = await sp.web
            .getFolderByServerRelativeUrl("Documents")
            .files.add(file.name, file, false);

          await response.file.listItemAllFields.get();

          // File uploaded successfully
          console.log("File uploaded:", response);

          // Fetch updated document list
          await this.fetchDocuments();
        }
      } catch (error) {
        console.log("Error uploading file:", error);
      }
    });

    // Trigger file input click event
    fileInput.click();
  };

  private filterDocuments = (
    documents: IDocument[],
    searchText: string
  ): IDocument[] => {
    if (!searchText) {
      return documents; // Return all documents when no search text is entered
    }

    const lowerCaseSearchText = searchText.toLowerCase();
    return documents.filter((document) =>
      document.title.toLowerCase().includes(lowerCaseSearchText)
    );
  };

  public render(): React.ReactElement<IColumnThreeProps> {
    const { documents, searchText } = this.state;

    // Filter the documents based on the search text
    const filteredDocuments = this.filterDocuments(documents, searchText);

    return (
      <div className={styles.columnThree}>
        <h2 className={styles.headerText}>Important Documents</h2>
        <div className={styles.topDoc}>
          <SearchBox
            placeholder="Search documents..."
            value={searchText}
            onChange={(event) => {
              this.handleSearch(event);
            }}
            className={styles.searchInput}
          />
          <Icon
            iconName="Upload"
            title="Upload"
            onClick={this.handleUploadClick}
            className={styles.uploadIcon}
          />
        </div>
        <div style={{ padding: "1.5rem" }}>
          <p>Recent Documents</p>
          <div className={styles.container}>
            <ul>
              {filteredDocuments.map((document: IDocument) => (
                <li key={document.id}>
                  <a
                    href={document.fileRef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.documentLink}
                  >
                    {document.title}
                  </a>
                  <a href={document.fileRef} className={styles.downloadIcon}>
                    <Icon iconName="Downloadx" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
