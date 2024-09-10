CREATE UNIQUE INDEX subscriptions_pkey ON public.subscriptions USING btree (user_id);

alter table "public"."subscriptions" add constraint "subscriptions_pkey" PRIMARY KEY using index "subscriptions_pkey";

create or replace view "public"."v_levels_with_created_by_and_ranks" as  SELECT levels.id,
    levels.name,
    levels.difficulty,
    levels.is_new,
    levels.is_verified,
    levels.words,
    levels.popularity,
    levels.created_at,
        CASE
            WHEN (u.email = 'xmliszt@gmail.com'::citext) THEN 'Taboo AI'::text
            WHEN (u.is_anonymous = true) THEN 'Anonymous'::text
            ELSE COALESCE(u.nickname, u.name, 'Anonymous'::text)
        END AS created_by,
    v.best_score,
    v.top_scorer_names,
    v.top_scorer_ids
   FROM ((levels
     LEFT JOIN users u ON ((u.id = levels.created_by)))
     LEFT JOIN v_level_with_best_score_and_top_scorers v ON ((v.level_id = levels.id)));



