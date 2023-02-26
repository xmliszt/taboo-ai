import ILevel from '../../app/levels/(models)/level.interface';

export async function getLevels(): Promise<ILevel[]> {
  const response = await fetch('/api/level');
  const json = await response.json();
  let levels = json.levels as ILevel[];
  levels = levels.sort((a) => (a.new ?? false ? -1 : 1));
  return levels;
}
