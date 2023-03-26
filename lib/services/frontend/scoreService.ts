import { IScore } from '../../../types/score.interface';

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

export async function getScoresByGameID(gameID: string): Promise<IScore[]> {
  const { scores } = await request<{ scores: IScore[] }>(
    `/api/scores/${gameID}/get`,
    'GET'
  );
  return scores;
}
