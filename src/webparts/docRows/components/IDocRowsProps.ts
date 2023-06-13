import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IDocRowsProps {
  description: string;
  context: WebPartContext; // Add the context prop
}
