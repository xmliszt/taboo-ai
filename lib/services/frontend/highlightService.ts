import { IHighlight } from '../../../types/chat.interface';

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

export async function getHighlights(
  gameID: string,
  scoreID: number
): Promise<IHighlight[]> {
  const { highlights } = await request<{ highlights: IHighlight[] }>(
    `/api/highlights/${gameID}/${scoreID}/get`,
    'GET'
  );
  return highlights;
}
