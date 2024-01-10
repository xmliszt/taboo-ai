import { createClient } from '@/lib/utils/supabase/client';

import { IGame } from '../types/game.type';
import { IScore } from '../types/score.type';

/**
 * Uploads a completed game for a user.
 * @param {string} userId The id of the user that completed the game.
 * @param {string} levelId The id of the level that was completed.
 * @param {IGame} game The game object to upload.
 */
export const uploadCompletedGameForUser = async (userId: string, levelId: string, game: IGame) => {
  const supabaseClient = createClient();
  // insert game
  const insertGameResponse = await supabaseClient
    .from('games')
    .insert({
      level_id: levelId,
      user_id: userId,
      started_at: game.started_at,
      finished_at: game.finished_at,
    })
    .select()
    .single();
  if (insertGameResponse.error) throw insertGameResponse.error;
  const insertedGame = insertGameResponse.data;
  // insert scores
  const scores = game.scores;
  for (const score of scores) {
    const insertScoreResponse = await supabaseClient
      .from('game_scores')
      .insert({
        game_id: insertedGame.id,
        target_word: score.target_word,
        duration: score.duration,
        score_index: score.score_index,
      })
      .select()
      .single();
    if (insertScoreResponse.error) throw insertScoreResponse.error;
    const insertedScore = insertScoreResponse.data;
    // insert highlights
    const highlights = score.highlights;
    for (const highlight of highlights) {
      const insertHighlightResponse = await supabaseClient.from('game_score_highlights').insert({
        score_id: insertedScore.id,
        start_position: highlight.start_position,
        end_position: highlight.end_position,
      });
      if (insertHighlightResponse.error) throw insertHighlightResponse.error;
    }
    // insert conversations
    const conversation = score.conversation;
    for (const conversationItem of conversation) {
      const insertConversationResponse = await supabaseClient
        .from('game_score_conversations')
        .insert({
          score_id: insertedScore.id,
          role: conversationItem.role,
          content: conversationItem.content,
        });
      if (insertConversationResponse.error) throw insertConversationResponse.error;
    }
    // insert ai evaluations
    if (!score.ai_evaluation) throw new Error('AI evaluation is missing');
    const insertAIEvaluationResponse = await supabaseClient.from('game_ai_evaluations').insert({
      score_id: insertedScore.id,
      ai_score: score.ai_evaluation.ai_score,
      ai_explanation: score.ai_evaluation.ai_explanation,
      ai_suggestions: score.ai_evaluation.ai_suggestion,
    });
    if (insertAIEvaluationResponse.error) throw insertAIEvaluationResponse.error;
  }
};

/**
 * Fetches a game by id.
 * @param gameId The id of the game to fetch.
 */
export const fetchGame = async (gameId: string): Promise<IGame | null> => {
  const supabaseClient = createClient();
  const fetchGameResponse = await supabaseClient.from('games').select().eq('id', gameId).single();
  if (fetchGameResponse.error) throw fetchGameResponse.error;
  const game = fetchGameResponse.data;
  const scores = await fetchGameScores(gameId);
  return {
    ...game,
    scores: scores,
    is_custom_game: false,
  };
};

/**
 * Fetches all scores for a game.
 * @param gameId The id of the game to fetch scores for.
 */
export const fetchGameScores = async (gameId: string): Promise<IScore[]> => {
  const aggregatedScores: IScore[] = [];
  const supabaseClient = createClient();
  // fetch scores
  const fetchScoresResponse = await supabaseClient
    .from('game_scores')
    .select()
    .eq('game_id', gameId);
  if (fetchScoresResponse.error) throw fetchScoresResponse.error;
  const scores = fetchScoresResponse.data;
  for (const score of scores) {
    // fetch highlights
    const fetchHighlightsResponse = await supabaseClient
      .from('game_score_highlights')
      .select()
      .eq('score_id', score.id);
    if (fetchHighlightsResponse.error) throw fetchHighlightsResponse.error;
    // fetch conversations
    const fetchConversationsResponse = await supabaseClient
      .from('game_score_conversations')
      .select()
      .eq('score_id', score.id);
    if (fetchConversationsResponse.error) throw fetchConversationsResponse.error;
    // fetch AI evaluations
    const fetchAIEvaluationResponse = await supabaseClient
      .from('game_ai_evaluations')
      .select()
      .eq('score_id', score.id)
      .single();
    if (fetchAIEvaluationResponse.error) throw fetchAIEvaluationResponse.error;
    // fetch taboos
    const fetchWordResponse = await supabaseClient
      .from('words')
      .select()
      .eq('word', score.target_word)
      .single();
    if (fetchWordResponse.error) throw fetchWordResponse.error;
    // aggregate
    aggregatedScores.push({
      id: score.id,
      game_id: score.game_id,
      score_index: score.score_index,
      target_word: score.target_word,
      taboos: fetchWordResponse.data.taboos,
      duration: score.duration,
      ai_evaluation: fetchAIEvaluationResponse.data,
      conversation: fetchConversationsResponse.data,
      highlights: fetchHighlightsResponse.data,
    });
  }
  return aggregatedScores;
};

/**
 * Fetches the most recent n number of games, sorted by finishedAt.
 * @param {string} userId The id of the user to fetch games for.
 * @param {number} limit The number of games to fetch.
 * @param {number} offset The offset to start fetching games from.
 * @returns {IGame[]} The list of games.
 */
export const fetchRecentGames = async (
  userId: string,
  limit: number,
  offset: number
): Promise<IGame[]> => {
  const supabaseClient = createClient();
  const fetchRecentGamesResponse = await supabaseClient
    .from('games')
    .select()
    .eq('user_id', userId)
    .order('finished_at', { ascending: false })
    .range(offset, offset + limit);
  if (fetchRecentGamesResponse.error) throw fetchRecentGamesResponse.error;
  const fetchedGames = fetchRecentGamesResponse.data;
  const games: IGame[] = [];
  for (const game of fetchedGames) {
    const scores = await fetchGameScores(game.id);
    games.push({
      ...game,
      scores: scores,
      is_custom_game: false,
    });
  }
  return games;
};

/**
 * Fetches all games completed by a user.
 * @param uid The uid of the user to fetch games for.
 */
export async function getAllGamesCompletedByUser(uid: string) {
  const supabaseClient = createClient();
  const fetchAllGamesCompletedByUserResponse = await supabaseClient
    .from('games')
    .select()
    .eq('user_id', uid);
  if (fetchAllGamesCompletedByUserResponse.error) throw fetchAllGamesCompletedByUserResponse.error;
  return fetchAllGamesCompletedByUserResponse.data;
}
