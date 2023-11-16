import { firestore } from '@/firebase/firebase-client';
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import moment from 'moment';
import IGame from '../types/game.type';
import { IHighlight } from '../types/highlight.type';
import { IChat, IScore } from '../types/score.type';

/**
 * Uploads a completed game to the cloud firestore.
 * @param {string} email The email of the user who completed the game.
 * @param {string} levelId The id of the level that was completed.
 * @param {IGame} game The game object to upload.
 */
export const uploadCompletedGameForUser = async (
  email: string,
  levelId: string,
  game: IGame
) => {
  // Check if the given game already exists
  const gameRef = doc(firestore, 'users', email, 'games', game.id);
  const existingGameRef = await getDoc(gameRef);
  const finishedAt = existingGameRef.data()?.finishedAt;
  // Create the game document
  await setDoc(gameRef, {
    levelRef: doc(firestore, 'levels', levelId),
    finishedAt: finishedAt ?? game.finishedAt,
    totalScore: game.totalScore,
    totalDuration: game.totalDuration,
    difficulty: game.difficulty,
  });

  // Add scores collection into the game document and populate with scores
  for (const score of game.scores) {
    await setDoc(doc(gameRef, 'scores', score.id.toString()), {
      id: score.id,
      target: score.target,
      taboos: JSON.stringify(score.taboos),
      duration: score.completion,
      aiScore: score.aiScore,
      aiExplanation: score.aiExplanation,
      conversation: JSON.stringify(score.conversation),
      highlights: JSON.stringify(score.responseHighlights),
    });
  }
};

export const fetchGameForUser = async (
  email: string | undefined | null,
  gameID: string | undefined | null
): Promise<IGame | null> => {
  if (!email || !gameID) return null;
  const gameRef = doc(firestore, 'users', email, 'games', gameID);
  const gameDoc = await getDoc(gameRef);
  const game = gameDoc.data();
  if (!game) return null;
  const levelRef = game.levelRef as DocumentReference;
  const scoresRef = collection(gameRef, 'scores');
  const scoresSnapshot = await getDocs(scoresRef);
  const scores: IScore[] = scoresSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      target: data.target as string,
      taboos: data.taboos ? (JSON.parse(data.taboos) as string[]) : [],
      completion: data.duration as number,
      aiScore: data.aiScore as number,
      aiExplanation: data.aiExplanation as string,
      conversation: JSON.parse(data.conversation) as IChat[],
      responseHighlights: JSON.parse(data.highlights) as IHighlight[],
    };
  });
  return {
    id: gameID,
    levelId: levelRef.id,
    finishedAt: game.finishedAt,
    totalScore: game.totalScore,
    totalDuration: game.totalDuration,
    difficulty: game.difficulty,
    scores,
  };
};

/**
 * Fetches all scores for a given game ID.
 */
export const fetchScoresForGame = async (
  email: string | undefined | null,
  gameID: string | undefined | null
): Promise<IScore[]> => {
  if (!email || !gameID) return [];
  const gameRef = doc(firestore, 'users', email, 'games', gameID);
  const scoresRef = collection(gameRef, 'scores');
  const scoresSnapshot = await getDocs(scoresRef);
  const scores: IScore[] = scoresSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: data.id,
      target: data.target as string,
      taboos: data.taboos ? (JSON.parse(data.taboos) as string[]) : [],
      completion: data.duration as number,
      aiScore: data.aiScore as number,
      aiExplanation: data.aiExplanation as string,
      conversation: JSON.parse(data.conversation) as IChat[],
      responseHighlights: JSON.parse(data.highlights) as IHighlight[],
    };
  });
  return scores;
};

/**
 * Fetches the most recent n number of games, sorted by finishedAt.
 * finishedAt is in '2023-11-11T17:28:24.807Z' format. Use moment to
 * convert.
 * @param {string} email The email of the user to fetch games for.
 * @param {number} limit The number of games to fetch.
 * @param {number} offset The offset to start fetching games from.
 * @returns {IGame[]} The list of games.
 */
export const fetchRecentGames = async (
  email: string | undefined | null,
  limit: number,
  offset: number
): Promise<IGame[]> => {
  if (!email) return [];
  const gamesRef = collection(firestore, 'users', email, 'games');
  const gamesSnapshot = await getDocs(gamesRef);
  const games: IGame[] = gamesSnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      levelId: data.levelRef.id,
      finishedAt: moment(data.finishedAt).toDate(),
      totalScore: data.totalScore as number,
      totalDuration: data.totalDuration as number,
      difficulty: data.difficulty as number,
      scores: [],
    };
  });
  // Populate scores for each game
  for (const game of games) {
    const scores = await fetchScoresForGame(email, game.id);
    game.scores = scores;
  }
  games.sort((a, b) => b.finishedAt.getTime() - a.finishedAt.getTime());
  return games.slice(offset, offset + limit);
};
