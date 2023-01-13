import ILevel from "../levels/(models)/level.interface";

export async function getLevels(): Promise<ILevel[]> {
  const response = await fetch("/api/level");
  const json = await response.json();
  return json.levels as ILevel[];
}
