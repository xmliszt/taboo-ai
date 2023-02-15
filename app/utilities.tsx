import { Highlight } from './level/[id]/(models)/Chat.interface';

/**
 * Sanitize the array of Highlight objects such that Highlight
 * with same start but different end will only keep the one
 * that has the larget end.
 * @param highlights The array of Highlight object
 */
export const sanitizeHighlights = (highlights: Highlight[]): Highlight[] => {
  const highlightMap: { [key: number]: Highlight } = {};
  for (const highlight of highlights) {
    const start = highlight.start;
    if (start in highlightMap) {
      const currentHighlight = highlightMap[start];
      highlightMap[start] =
        highlight.end > currentHighlight.end ? highlight : currentHighlight;
    } else {
      highlightMap[start] = highlight;
    }
  }
  const highlightsArray = Object.values(highlightMap);
  highlightsArray.sort((a, b) => a.start - b.start);
  const results: Highlight[] = [];
  let prevEnd = 0;
  let idx = 0;
  for (const highlight of highlightsArray) {
    if (highlight.start < prevEnd) {
      results[idx - 1].end = highlight.end;
    } else {
      results.push(highlight);
      prevEnd = highlight.end;
      idx++;
    }
  }
  return results;
};

export const applyHighlightsToMessage = (
  message: string,
  highlights: Highlight[],
  onNormalMessagePart: (s: string) => JSX.Element,
  onHighlightMessagePart: (s: string) => JSX.Element
): JSX.Element[] => {
  let parts = [];
  if (highlights.length === 0) parts = [<span key={message}>{message}</span>];
  else {
    let startIndex = 0;
    let endIndex = 0;
    for (const highlight of highlights) {
      endIndex = highlight.start;
      // Normal part
      parts.push(onNormalMessagePart(message.substring(startIndex, endIndex)));
      startIndex = endIndex;
      endIndex = highlight.end;
      // Highlighted part
      parts.push(
        onHighlightMessagePart(message.substring(startIndex, endIndex))
      );
      startIndex = endIndex;
    }
    parts.push(onNormalMessagePart(message.substring(endIndex)));
  }
  return parts;
};
