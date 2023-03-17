import ILevel from '../../../types/level.interface';
import IScore from '../../../types/score.interface';

interface ErrorResponse {
  error: string;
}

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
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

export const saveGame = async (level: ILevel, scores: IScore[]) => {
  const url = `/api/games/save`;
  await request<{ message: string }>(url, 'POST', {
    level,
    scores,
  });
};
