import { firestore } from '@/lib/firebase-client';
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  setDoc,
} from 'firebase/firestore';
import IGame from '../types/game.type';
import { IHighlight } from '../types/highlight.type';
import { IChat, IScore } from '../types/score.type';

export const recordCompletedGameForUser = async (
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
