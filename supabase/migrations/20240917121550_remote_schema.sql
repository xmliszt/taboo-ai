alter table "public"."subscriptions" drop constraint "subscriptions_pkey";

drop index if exists "public"."subscriptions_pkey";

create or replace view "public"."v_levels_with_created_by_and_ranks" as  SELECT levels.id,
    levels.name,
    levels.difficulty,
    levels.is_new,
    levels.is_verified,
    levels.words,
    levels.popularity,
    levels.created_at,
    COALESCE(u.name, u.nickname, 'Anonymous'::text) AS created_by,
    v.best_score,
    v.top_scorer_names,
    v.top_scorer_ids
   FROM ((levels
     LEFT JOIN users u ON ((u.id = levels.created_by)))
     LEFT JOIN v_level_with_best_score_and_top_scorers v ON ((v.level_id = levels.id)));



