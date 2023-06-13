import * as React from 'react';
import { WebPartContext } from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import styles from './DocRows.module.scss';

//import { IColumnTwoProps } from '../models/ColumnTwoProps';

interface IColumnTwoState {
  imageUrl: string;
  overlayText: string;
  linkUrl: string;
}

interface IColumnTwoProps {
  context: WebPartContext;
}

//const [listItems, setListItems] = useState<any[]>([]);


export default class ColumnTwo extends React.Component<IColumnTwoProps, IColumnTwoState> {
  constructor(props: IColumnTwoProps) {
    super(props);
    this.state = {
      imageUrl: '',
      overlayText: '',
      linkUrl:''
    };
  }

  componentDidMount() {
    this.fetchImage();
    this.fetchOverlayText();
  }

  async fetchImage() {
    try {
      const siteUrl = this.props.context.pageContext.site.absoluteUrl;
      const imageUrl = `${siteUrl}/assets/DocRow2.png`;
      this.setState({ imageUrl });
    } catch (error) {
      console.log('Error fetching image:', error);
    }
  }

  async fetchOverlayText() {
    try {
      const listName = 'DocRow';
      const response = await fetch(`${this.props.context.pageContext.web.absoluteUrl}/_api/web/lists/getbytitle('${listName}')/items?$select=Title,linkUrl`);
const data = await response.json();

if (data && data.value && data.value.length > 0) {
  const firstItem = data.value[1];
  const overlayText = firstItem.Title;
  const linkUrl = firstItem.linkUrl;
  console.log(linkUrl);
  console.log(overlayText);
}
  

    } catch (error) {
      console.log('Error fetching overlay text:', error);
    }
  }

  render() {
    const { imageUrl, overlayText,linkUrl } = this.state;

    return (
      <div className={styles.columnTwo}>
      <a href={linkUrl}>
        <img src={imageUrl} alt="Image" />
        <div className={styles.overlay}>
          <span className={styles.overlayText}>{overlayText}</span>
        </div>
      </a>
    </div>
    );
  }
}
