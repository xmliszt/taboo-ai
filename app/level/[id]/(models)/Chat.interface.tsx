import { Author } from "../(models)/Author.enum";

export default interface Chat {
  message: string;
  target: string;
  highlights: number[];
  createdOn: number;
  byWho: Author | null;
}
