create type "public"."feature_status" as enum ('complete', 'partial', 'absent');

drop policy "Enable read access for all users" on "public"."app_stats";

drop policy "Only service_role have full access" on "public"."game_ai_evaluations";

drop policy "Only service_role have full access" on "public"."game_score_conversations";

drop policy "Only service_role have full access" on "public"."game_score_highlights";

drop policy "Only service_role can have full access" on "public"."game_scores";

drop policy "Allow read access for authenticated user with matching uid" on "public"."subscriptions";

drop policy "Allow read access for authenticated user with matching uid" on "public"."users";

alter table "public"."games" drop constraint "games_level_id_fkey";

alter table "public"."games" drop constraint "games_user_id_fkey";

alter table "public"."levels" drop constraint "levels_created_by_fkey";

alter table "public"."subscriptions" drop constraint "subscriptions_user_id_fkey";

alter table "public"."user_attempted_levels" drop constraint "user_attempted_levels_user_id_fkey";

drop function if exists "public"."get_game_ranks_desc_for_level"(_level_id uuid);

drop function if exists "public"."get_total_score_for_game"(_game_id uuid);

drop function if exists "public"."increment"(_table_name text, _row_id integer, _x integer, _field_name text);

create table "public"."plan_features" (
    "id" uuid not null default uuid_generate_v4(),
    "plan_id" uuid not null,
    "title" text not null,
    "description" text not null,
    "status" feature_status not null
);


create table "public"."plans" (
    "id" uuid not null default uuid_generate_v4(),
    "type" customer_plan_type not null,
    "price_id" text,
    "price_per_month" integer not null,
    "trial_days" integer not null default 0,
    "tier" integer not null default 0,
    "name" text not null
);


alter table "public"."app_stats" drop column "stat_name";

alter table "public"."app_stats" drop column "stat_value";

alter table "public"."app_stats" add column "value" integer not null;

alter table "public"."app_stats" alter column "id" drop default;

alter table "public"."app_stats" alter column "id" set data type text using "id"::text;

alter table "public"."game_ai_evaluations" alter column "ai_suggestion" set data type text[] using "ai_suggestion"::text[];

alter table "public"."game_score_conversations" add column "timestamp" timestamp with time zone not null default now();

alter table "public"."game_scores" add column "score_index" integer not null default 0;

alter table "public"."games" alter column "level_id" set not null;

alter table "public"."user_attempted_levels" enable row level security;

alter table "public"."users" add column "login_times" integer not null default 0;

alter table "public"."words" add column "created_by" uuid;

CREATE UNIQUE INDEX game_ai_evaluations_score_id_key ON public.game_ai_evaluations USING btree (score_id);

CREATE UNIQUE INDEX plan_features_pkey ON public.plan_features USING btree (id);

CREATE UNIQUE INDEX plans_pkey ON public.plans USING btree (id);

CREATE UNIQUE INDEX plans_price_id_key ON public.plans USING btree (price_id);

CREATE UNIQUE INDEX plans_type_key ON public.plans USING btree (type);

alter table "public"."plan_features" add constraint "plan_features_pkey" PRIMARY KEY using index "plan_features_pkey";

alter table "public"."plans" add constraint "plans_pkey" PRIMARY KEY using index "plans_pkey";

alter table "public"."game_ai_evaluations" add constraint "game_ai_evaluations_score_id_key" UNIQUE using index "game_ai_evaluations_score_id_key";

alter table "public"."plan_features" add constraint "plan_features_plan_id_fkey" FOREIGN KEY (plan_id) REFERENCES plans(id) not valid;

alter table "public"."plan_features" validate constraint "plan_features_plan_id_fkey";

alter table "public"."plans" add constraint "plans_price_id_key" UNIQUE using index "plans_price_id_key";

alter table "public"."plans" add constraint "plans_type_key" UNIQUE using index "plans_type_key";

alter table "public"."words" add constraint "words_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."words" validate constraint "words_created_by_fkey";

alter table "public"."games" add constraint "games_level_id_fkey" FOREIGN KEY (level_id) REFERENCES levels(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."games" validate constraint "games_level_id_fkey";

alter table "public"."games" add constraint "games_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."games" validate constraint "games_user_id_fkey";

alter table "public"."levels" add constraint "levels_created_by_fkey" FOREIGN KEY (created_by) REFERENCES users(id) ON UPDATE CASCADE ON DELETE SET NULL not valid;

alter table "public"."levels" validate constraint "levels_created_by_fkey";

alter table "public"."subscriptions" add constraint "subscriptions_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."subscriptions" validate constraint "subscriptions_user_id_fkey";

alter table "public"."user_attempted_levels" add constraint "user_attempted_levels_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_attempted_levels" validate constraint "user_attempted_levels_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.f_delete_auth_user()
 RETURNS void
 LANGUAGE sql
 SECURITY DEFINER
AS $function$
    delete from auth.users where id = auth.uid();
$function$
;

CREATE OR REPLACE FUNCTION public.f_increment_with_text_as_id(_table_name text, _row_id text, _x integer, _field_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', _table_name, _field_name, _field_name)
        USING _x, _row_id;
END
$function$
;

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
            insert into game_ai_evaluations (score_id, ai_score, ai_explanation, ai_suggestion) values (_score_id, (_score->'ai_evaluation'->>'ai_score')::numeric, (_score->'ai_evaluation'->>'ai_explanation')::text, ARRAY(select jsonb_array_elements(_score->'ai_evaluation'->'ai_suggestion')::jsonb)::text[]);
        end loop;
    return _game_id;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_user_login_times_after_user_login()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
        begin
            update public.users
            set login_times = login_times + 1,
                last_login_at = coalesce(NEW.last_sign_in_at, now())
            where id = NEW.id;
            return new;
        end;
    $function$
;

create or replace view "public"."v_game_level_info" as  SELECT g.id AS game_id,
    l.id AS level_id,
    l.name AS level_name,
    l.difficulty AS level_difficulty,
    sum(gs.duration) AS total_time_taken,
        CASE
            WHEN (l.difficulty = 1) THEN sum(((gae.ai_score * 0.6) + (((100 - gs.duration))::numeric * 0.4)))
            WHEN (l.difficulty = 2) THEN sum(((gae.ai_score * 0.7) + (((100 - gs.duration))::numeric * 0.3)))
            WHEN (l.difficulty = 3) THEN sum(((gae.ai_score * 0.8) + (((100 - gs.duration))::numeric * 0.2)))
            ELSE sum(((gae.ai_score * 0.6) + ((gs.duration)::numeric * 0.4)))
        END AS total_score
   FROM (((games g
     JOIN levels l ON ((g.level_id = l.id)))
     JOIN game_scores gs ON ((gs.game_id = g.id)))
     JOIN game_ai_evaluations gae ON ((gae.score_id = gs.id)))
  GROUP BY g.id, l.id, l.name, l.difficulty;


create or replace view "public"."v_level_with_best_score_and_top_scorers" as  WITH game_player_total_score_with_ranks_table AS (
         SELECT levels.id AS level_id,
            g.id AS game_id,
            u.id AS player_id,
                CASE
                    WHEN (u.is_anonymous = true) THEN 'Anonymous'::character varying
                    WHEN (u.nickname IS NULL) THEN 'Anonymous'::character varying
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


CREATE OR REPLACE FUNCTION public.create_user_profile_after_user_signup()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
    insert into public.users (id,
                              name,
                              email,
                              photo_url,
                              last_login_at)
    values (NEW.id,
            NEW.raw_user_meta_data ->> 'name',
            NEW.email,
            NEW.raw_user_meta_data ->> 'avatar_url',
            coalesce(NEW.created_at, now()))
    on conflict (email) do update set
                                      -- overwrite the UUID to be the one stored in auth instead of auto generated from migration
                                      id        = NEW.id,
                                      name      = NEW.raw_user_meta_data ->> 'name',
                                      photo_url = NEW.raw_user_meta_data ->> 'avatar_url',
                                      last_login_at = coalesce(NEW.last_sign_in_at, now()),
                                      login_times = users.login_times + 1;
    insert into public.subscriptions (user_id, customer_id, customer_plan_type)
    values (NEW.id, null, 'free')
    on conflict (user_id) do nothing;
    return new;
end
$function$
;

grant delete on table "public"."plan_features" to "anon";

grant insert on table "public"."plan_features" to "anon";

grant references on table "public"."plan_features" to "anon";

grant select on table "public"."plan_features" to "anon";

grant trigger on table "public"."plan_features" to "anon";

grant truncate on table "public"."plan_features" to "anon";

grant update on table "public"."plan_features" to "anon";

grant delete on table "public"."plan_features" to "authenticated";

grant insert on table "public"."plan_features" to "authenticated";

grant references on table "public"."plan_features" to "authenticated";

grant select on table "public"."plan_features" to "authenticated";

grant trigger on table "public"."plan_features" to "authenticated";

grant truncate on table "public"."plan_features" to "authenticated";

grant update on table "public"."plan_features" to "authenticated";

grant delete on table "public"."plan_features" to "service_role";

grant insert on table "public"."plan_features" to "service_role";

grant references on table "public"."plan_features" to "service_role";

grant select on table "public"."plan_features" to "service_role";

grant trigger on table "public"."plan_features" to "service_role";

grant truncate on table "public"."plan_features" to "service_role";

grant update on table "public"."plan_features" to "service_role";

grant delete on table "public"."plans" to "anon";

grant insert on table "public"."plans" to "anon";

grant references on table "public"."plans" to "anon";

grant select on table "public"."plans" to "anon";

grant trigger on table "public"."plans" to "anon";

grant truncate on table "public"."plans" to "anon";

grant update on table "public"."plans" to "anon";

grant delete on table "public"."plans" to "authenticated";

grant insert on table "public"."plans" to "authenticated";

grant references on table "public"."plans" to "authenticated";

grant select on table "public"."plans" to "authenticated";

grant trigger on table "public"."plans" to "authenticated";

grant truncate on table "public"."plans" to "authenticated";

grant update on table "public"."plans" to "authenticated";

grant delete on table "public"."plans" to "service_role";

grant insert on table "public"."plans" to "service_role";

grant references on table "public"."plans" to "service_role";

grant select on table "public"."plans" to "service_role";

grant trigger on table "public"."plans" to "service_role";

grant truncate on table "public"."plans" to "service_role";

grant update on table "public"."plans" to "service_role";

create policy "read access for all user"
on "public"."app_stats"
as permissive
for select
to public
using (true);


create policy "update access to all user"
on "public"."app_stats"
as permissive
for update
to public
using (true);


create policy "auth user full access to own"
on "public"."game_ai_evaluations"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (games
     JOIN game_scores gs ON ((games.id = gs.game_id)))
  WHERE ((gs.id = game_ai_evaluations.score_id) AND (games.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (games
     JOIN game_scores gs ON ((games.id = gs.game_id)))
  WHERE ((gs.id = game_ai_evaluations.score_id) AND (games.user_id = auth.uid())))));


create policy "auth user full access to own game_score_conversations"
on "public"."game_score_conversations"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (games
     JOIN game_scores gs ON ((games.id = gs.game_id)))
  WHERE ((gs.id = game_score_conversations.score_id) AND (games.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (games
     JOIN game_scores gs ON ((games.id = gs.game_id)))
  WHERE ((gs.id = game_score_conversations.score_id) AND (games.user_id = auth.uid())))));


create policy "auth user full access to their own game score highlights"
on "public"."game_score_highlights"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM (games
     JOIN game_scores gs ON ((games.id = gs.game_id)))
  WHERE ((gs.id = game_score_highlights.score_id) AND (games.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM (games
     JOIN game_scores gs ON ((games.id = gs.game_id)))
  WHERE ((gs.id = game_score_highlights.score_id) AND (games.user_id = auth.uid())))));


create policy "auth user have full access to their own game"
on "public"."game_scores"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM games
  WHERE ((games.id = game_scores.game_id) AND (games.user_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM games
  WHERE ((games.id = game_scores.game_id) AND (games.user_id = auth.uid())))));


create policy "full access to xmliszt@gmail.com"
on "public"."levels"
as permissive
for all
to public
using ((auth.uid() = '9f63e892-04f0-4f8b-b7e6-bb945f013fe8'::uuid))
with check ((auth.uid() = '9f63e892-04f0-4f8b-b7e6-bb945f013fe8'::uuid));


create policy "logged in user can manage own level"
on "public"."levels"
as permissive
for all
to public
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));


create policy "Full access to authenticated user with matching uid"
on "public"."subscriptions"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Allow full access to authenticated user matching uid"
on "public"."user_attempted_levels"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Allow full access for authenticated user with matching uid"
on "public"."users"
as permissive
for all
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));


create policy "full access for xmliszt@gmail.com"
on "public"."words"
as permissive
for all
to public
using ((auth.uid() = '9f63e892-04f0-4f8b-b7e6-bb945f013fe8'::uuid))
with check ((auth.uid() = '9f63e892-04f0-4f8b-b7e6-bb945f013fe8'::uuid));


CREATE TRIGGER t_update_updated_at_after_update_stat_value_on_app_stats AFTER UPDATE OF value ON public.app_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


