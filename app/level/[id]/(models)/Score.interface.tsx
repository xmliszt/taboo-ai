// {id} {word} {your question} {ai response} {completion time in seconds}
export default interface IScore {
  id: number;
  question: string;
  response: string;
  completion: number;
}
