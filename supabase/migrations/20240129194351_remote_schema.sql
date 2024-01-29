set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.f_upload_a_game(_user_id uuid, _level_id uuid, _game jsonb)
 RETURNS uuid
 LANGUAGE plpgsql
AS $function$
declare
    _game_id uuid;
    _score jsonb;
    _score_id uuid;
    _highlight jsonb;
    _conversation jsonb;
begin
    insert into games (level_id, user_id, started_at, finished_at) values (_level_id, _user_id, (_game->>'started_at')::timestamptz, (_game->>'finished_at')::timestamptz) returning id into _game_id;
    -- for each score in _game->>scores, insert into game_scores
    for _score in select jsonb_array_elements(_game->'scores')::jsonb
        loop
            insert into game_scores (game_id, target_word, duration, score_index) values (_game_id, (_score->>'target_word')::citext, (_score->>'duration')::integer, (_score->>'score_index')::integer) returning id into _score_id;
            -- for each highlight in _score->>highlights, insert into game_score_highlights
            for _highlight in select jsonb_array_elements(_score->'highlights')::jsonb
                loop
                    insert into game_score_highlights (score_id, start_position, end_position) values (_score_id, (_highlight->>'start_position')::integer, (_highlight->>'end_position')::integer);
                end loop;
            -- for each conversation in _score->>conversation, insert into game_score_conversations
            for _conversation in select jsonb_array_elements(_score->'conversations')::jsonb
                loop
                    insert into game_score_conversations (score_id, role, content, timestamp) values (_score_id, (_conversation->>'role')::conversation_chat_role, (_conversation->>'content')::text, (_conversation->>'timestamp')::timestamptz);
                end loop;
            -- insert ai evaluation into game_ai_evaluations
            insert into game_ai_evaluations (score_id, ai_score, ai_explanation, ai_suggestion) values (_score_id, (_score->'ai_evaluation'->>'ai_score')::numeric, (_score->'ai_evaluation'->>'ai_explanation')::text,
                                                                                                        case
                                                                                                            when (_score->'ai_evaluation'->'ai_suggestion') is null then null
                                                                                                            when jsonb_typeof(_score->'ai_evaluation'->'ai_suggestion') != 'array' then null                                                                                                     else ARRAY(select jsonb_array_elements(_score->'ai_evaluation'->'ai_suggestion')::jsonb)::text[]
                                                                                                            end
                                                                                                       );
        end loop;
    return _game_id;
end;
$function$
;


