import type { IHighlight } from '../../../types/chat.interface';
import { selectHighlightsByIDs } from '../../database/highlightRepository';

const getHighlightsByIDs = async (
  gameID: string,
  scoreID: number
): Promise<IHighlight[]> => {
  const { data } = await selectHighlightsByIDs(gameID, scoreID);
  return data as IHighlight[];
};

export { getHighlightsByIDs };
