drop view if exists "public"."v_levels_with_created_by_and_ranks";

alter table "public"."users" add column "is_dev" boolean not null default false;

create or replace view "public"."v_levels_with_created_by_and_ranks" as  SELECT levels.id,
    levels.name,
    levels.difficulty,
    levels.is_new,
    levels.is_verified,
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



