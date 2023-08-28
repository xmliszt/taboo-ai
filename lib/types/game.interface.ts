export default interface IGame {
  game_id: string;
  player_nickname: string;
  player_id: string;
  level: string;
  total_score: number;
  created_at: string;
  prompt_visible: boolean;
  ai_score?: number;
  ai_explanation?: string;
}
