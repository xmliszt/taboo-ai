// {id} {word} {your question} {ai response} {completion time in seconds}
export default interface IScore {
  id: number;
  target: string;
  question: string;
  response: string;
  difficulty: number;
  completion: number;
}
