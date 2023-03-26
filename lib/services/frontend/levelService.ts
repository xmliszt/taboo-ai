import IDailyLevel from '../../../types/dailyLevel.interface';
import ILevel from '../../../types/level.interface';

interface ErrorResponse {
  error: string;
}

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  const data: T = await response.json();
  return data;
}

export async function getLevels(): Promise<ILevel[]> {
  const response = await request<{ levels: ILevel[] }>(
    '/api/levels/get',
    'GET'
  );
  const levels = response.levels as ILevel[];

  levels.sort((a) => (a.new ?? false ? -1 : 1));
  levels.sort((a, b) => (b.createdAt ?? Infinity) - (a.createdAt ?? Infinity));
  return levels;
}

export async function createDailyLevel(level: IDailyLevel) {
  await request('/api/levels/daily/create', 'POST', level);
}

export async function getDailyLevel(
  date: moment.Moment
): Promise<IDailyLevel | null> {
  const response = await fetch(
    '/api/levels/daily/get?date=' + date.format('DD-MM-YYYY')
  );
  const status = response.status;
  if (status === 404) {
    return null;
  } else if (response.ok) {
    const json: { level: IDailyLevel } = await response.json();
    return json.level;
  } else {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }
}

export async function getDailyLevelByName(
  name: string
): Promise<IDailyLevel | null> {
  const response = await fetch('/api/levels/daily/get?name=' + name);
  const status = response.status;
  if (status === 404) {
    return null;
  } else if (response.ok) {
    const json: { level: IDailyLevel } = await response.json();
    return json.level;
  } else {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }
}
