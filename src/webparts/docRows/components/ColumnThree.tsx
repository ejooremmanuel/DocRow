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
            placeholder="Search..."
            value={searchText}
            onChange={(event) => {
              this.handleSearch(event);
            }}
            className={styles.searchInput}
          />
          <div onClick={this.handleUploadClick} style={{ fontWeight: "bold" }}>
            Upload
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <p style={{ fontSize: "16px" }}>Recent Documents</p>
          <ul>
            {filteredDocuments.map((document: IDocument) => (
              <li
                key={document.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  width: "100%",
                  justifyContent: "space-between",
                }}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "1rem" }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="24"
                    viewBox="0 0 25 24"
                    fill="none"
                  >
                    <path
                      d="M4.54973 4V22H20.6702V24H4.54973C3.44145 24 2.53467 23.1 2.53467 22V4H4.54973ZM15.6326 7H21.174L15.6326 1.5V7ZM8.57985 0H16.6401L22.6853 6V18C22.6853 19.11 21.7886 20 20.6702 20H8.57985C8.04542 20 7.53288 19.7893 7.15499 19.4142C6.77709 19.0391 6.56479 18.5304 6.56479 18V2C6.56479 0.89 7.46149 0 8.57985 0ZM17.6476 16V14H8.57985V16H17.6476ZM20.6702 12V10H8.57985V12H20.6702Z"
                      fill="black"
                    />
                  </svg>
                  <a
                    href={document.fileRef}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.documentLink}
                  >
                    {document.title.split(".")[0]}
                  </a>
                </div>

                <a
                  href={document.fileRef}
                  className={styles.downloadIcon}
                  download={document.title}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="15"
                    height="17"
                    viewBox="0 0 15 17"
                    fill="none"
                  >
                    <path
                      d="M14.2919 6H10.2618V0H4.21664V6H0.186523L7.23923 13L14.2919 6ZM0.186523 15V17H14.2919V15H0.186523Z"
                      fill="black"
                    />
                  </svg>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}
