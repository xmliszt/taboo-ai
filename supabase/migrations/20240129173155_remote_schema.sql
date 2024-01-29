drop view if exists "public"."v_levels_with_created_by_and_ranks";

drop view if exists "public"."v_user_played_level_game_with_scores_and_completed_times";

drop view if exists "public"."v_level_with_best_score_and_top_scorers";

alter table "public"."users" alter column "name" set data type text using "name"::text;

alter table "public"."users" alter column "nickname" set data type text using "nickname"::text;

alter table "public"."users" alter column "photo_url" set data type text using "photo_url"::text;

create or replace view "public"."v_level_with_best_score_and_top_scorers" as  WITH game_player_total_score_with_ranks_table AS (
         SELECT levels.id AS level_id,
            g.id AS game_id,
            u.id AS player_id,
                CASE
                    WHEN (u.is_anonymous = true) THEN ('Anonymous'::character varying)::text
                    WHEN (u.nickname IS NULL) THEN ('Anonymous'::character varying)::text
                    ELSE u.nickname
                END AS player_name,
                CASE
                    WHEN (levels.difficulty = 1) THEN sum(((gae.ai_score * 0.6) + (((100 - gs.duration))::numeric * 0.4)))
                    WHEN (levels.difficulty = 2) THEN sum(((gae.ai_score * 0.7) + (((100 - gs.duration))::numeric * 0.3)))
                    WHEN (levels.difficulty = 3) THEN sum(((gae.ai_score * 0.8) + (((100 - gs.duration))::numeric * 0.2)))
                    ELSE sum(((gae.ai_score * 0.6) + ((gs.duration)::numeric * 0.4)))
                END AS total_score,
            dense_rank() OVER (PARTITION BY levels.id ORDER BY
                CASE
                    WHEN (levels.difficulty = 1) THEN sum(((gae.ai_score * 0.6) + (((100 - gs.duration))::numeric * 0.4)))
                    WHEN (levels.difficulty = 2) THEN sum(((gae.ai_score * 0.7) + (((100 - gs.duration))::numeric * 0.3)))
                    WHEN (levels.difficulty = 3) THEN sum(((gae.ai_score * 0.8) + (((100 - gs.duration))::numeric * 0.2)))
                    ELSE sum(((gae.ai_score * 0.6) + ((gs.duration)::numeric * 0.4)))
                END DESC) AS rank
           FROM ((((games g
             JOIN users u ON ((u.id = g.user_id)))
             JOIN levels ON ((g.level_id = levels.id)))
             JOIN game_scores gs ON ((g.id = gs.game_id)))
             JOIN game_ai_evaluations gae ON ((gae.score_id = gs.id)))
          GROUP BY levels.difficulty, levels.id, g.id, u.nickname, u.id
        )
 SELECT game_player_total_score_with_ranks_table.level_id,
    max(game_player_total_score_with_ranks_table.total_score) AS best_score,
    array_agg(game_player_total_score_with_ranks_table.player_name) AS top_scorer_names,
    array_agg(game_player_total_score_with_ranks_table.player_id) AS top_scorer_ids
   FROM game_player_total_score_with_ranks_table
  WHERE (game_player_total_score_with_ranks_table.rank = 1)
  GROUP BY game_player_total_score_with_ranks_table.level_id;


create or replace view "public"."v_levels_with_created_by_and_ranks" as  SELECT levels.id,
    levels.name,
    levels.difficulty,
    levels.is_new,
    levels.words,
    levels.popularity,
    levels.created_at,
    u.nickname AS created_by,
    v.best_score,
    v.top_scorer_names,
    v.top_scorer_ids
   FROM ((levels
     LEFT JOIN users u ON ((u.id = levels.created_by)))
     LEFT JOIN v_level_with_best_score_and_top_scorers v ON ((v.level_id = levels.id)));


create or replace view "public"."v_user_played_level_game_with_scores_and_completed_times" as  SELECT u.id AS user_id,
    u.email AS user_email,
    l.id AS level_id,
    l.name AS level_name,
    l.difficulty AS level_difficulty,
    g.id AS game_id,
    g.finished_at AS game_finished_at,
    sum(gs.duration) AS total_time_taken,
        CASE
            WHEN (l.difficulty = 1) THEN sum(((gae.ai_score * 0.6) + (((100 - gs.duration))::numeric * 0.4)))
            WHEN (l.difficulty = 2) THEN sum(((gae.ai_score * 0.7) + (((100 - gs.duration))::numeric * 0.3)))
            WHEN (l.difficulty = 3) THEN sum(((gae.ai_score * 0.8) + (((100 - gs.duration))::numeric * 0.2)))
            ELSE sum(((gae.ai_score * 0.6) + ((gs.duration)::numeric * 0.4)))
        END AS total_score,
    (
        CASE
            WHEN (l.difficulty = 1) THEN sum(((gae.ai_score * 0.6) + (((100 - gs.duration))::numeric * 0.4)))
            WHEN (l.difficulty = 2) THEN sum(((gae.ai_score * 0.7) + (((100 - gs.duration))::numeric * 0.3)))
            WHEN (l.difficulty = 3) THEN sum(((gae.ai_score * 0.8) + (((100 - gs.duration))::numeric * 0.2)))
            ELSE sum(((gae.ai_score * 0.6) + ((gs.duration)::numeric * 0.4)))
        END = max(
        CASE
            WHEN (l.difficulty = 1) THEN sum(((gae.ai_score * 0.6) + (((100 - gs.duration))::numeric * 0.4)))
            WHEN (l.difficulty = 2) THEN sum(((gae.ai_score * 0.7) + (((100 - gs.duration))::numeric * 0.3)))
            WHEN (l.difficulty = 3) THEN sum(((gae.ai_score * 0.8) + (((100 - gs.duration))::numeric * 0.2)))
            ELSE sum(((gae.ai_score * 0.6) + ((gs.duration)::numeric * 0.4)))
        END) OVER (PARTITION BY l.id)) AS is_best_score,
    count(g.id) OVER (PARTITION BY l.id, u.id) AS completed_times
   FROM ((((users u
     JOIN games g ON ((g.user_id = u.id)))
     JOIN levels l ON ((l.id = g.level_id)))
     JOIN game_scores gs ON ((gs.game_id = g.id)))
     JOIN game_ai_evaluations gae ON ((gae.score_id = gs.id)))
  GROUP BY u.id, l.id, g.id, l.difficulty;



