import ILevel from '../../../types/level.interface';

export async function getLevels(): Promise<ILevel[]> {
  const response = await fetch('/api/levels/get', {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const json = await response.json();
  const levels = json.levels as ILevel[];

  levels.sort((a) => (a.new ?? false ? -1 : 1));
  levels.sort((a, b) => (b.createdAt ?? Infinity) - (a.createdAt ?? Infinity));
  return levels;
}
