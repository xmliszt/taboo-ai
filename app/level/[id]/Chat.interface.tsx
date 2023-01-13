import { Author } from "./Author.enum";

export default interface Chat {
  message: string;
  createdOn: number;
  byWho: Author;
}
