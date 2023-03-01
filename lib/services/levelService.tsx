import ILevel from '../../app/levels/(models)/level.interface';

export async function getLevels(): Promise<ILevel[]> {
  const response = await fetch('/api/level');
  const json = await response.json();
  const levels = json.levels as ILevel[];

  levels.sort((a) => (a.new ?? false ? -1 : 1));
  levels.sort((a, b) => (b.createdAt ?? Infinity) - (a.createdAt ?? Infinity));
  return levels;
}
