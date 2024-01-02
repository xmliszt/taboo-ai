create table "public"."app_stats" (
    "id" uuid not null default uuid_generate_v4(),
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "stat_name" character varying(255) not null,
    "stat_value" text not null
);


alter table "public"."app_stats" enable row level security;

create table "public"."user_attempted_levels" (
    "user_id" uuid not null,
    "level_id" uuid not null
);


alter table "public"."curated_level_category" enable row level security;

alter table "public"."curated_levels" enable row level security;

alter table "public"."game_ai_evaluations" enable row level security;

alter table "public"."game_score_conversations" enable row level security;

alter table "public"."game_score_highlights" enable row level security;

alter table "public"."game_scores" add column "duration" integer not null default 0;

alter table "public"."game_scores" enable row level security;

alter table "public"."games" alter column "finished_at" set default now();

alter table "public"."games" alter column "finished_at" set not null;

alter table "public"."games" enable row level security;

alter table "public"."levels" enable row level security;

alter table "public"."subscriptions" enable row level security;

alter table "public"."users" add column "is_anonymous" boolean not null default false;

alter table "public"."users" enable row level security;

alter table "public"."words" enable row level security;

CREATE UNIQUE INDEX app_stats_pkey ON public.app_stats USING btree (id);

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);

alter table "public"."app_stats" add constraint "app_stats_pkey" PRIMARY KEY using index "app_stats_pkey";

alter table "public"."user_attempted_levels" add constraint "user_attempted_levels_level_id_fkey" FOREIGN KEY (level_id) REFERENCES levels(id) not valid;

alter table "public"."user_attempted_levels" validate constraint "user_attempted_levels_level_id_fkey";

alter table "public"."user_attempted_levels" add constraint "user_attempted_levels_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) not valid;

alter table "public"."user_attempted_levels" validate constraint "user_attempted_levels_user_id_fkey";

alter table "public"."users" add constraint "users_email_key" UNIQUE using index "users_email_key";

set check_function_bodies = off;

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
            NEW.updated_at)
    on conflict (email) do update set
                                      -- overwrite the UUID to be the one stored in auth instead of auto generated from migration
                                      id        = NEW.id,
                                      name      = NEW.raw_user_meta_data ->> 'name',
                                      photo_url = NEW.raw_user_meta_data ->> 'avatar_url',
                                      last_login_at = NEW.updated_at;
    return new;
end
$function$
;

CREATE OR REPLACE FUNCTION public.delete_user_profile_after_user_delete()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
    delete from public.users where id = OLD.id;
    return old;
end$function$
;

CREATE OR REPLACE FUNCTION public.get_game_ranks_desc_for_level(_level_id uuid)
 RETURNS TABLE(player_name character varying, game_id uuid, total_score numeric)
 LANGUAGE plpgsql
AS $function$
begin
    return query
        select
            case
                when u.is_anonymous = false then coalesce(u.nickname, u.name)
                else 'Anonymous'
            end player_name,
            g.id as game_id,
            case
                when l.difficulty = 1 then sum(gae.ai_score * 0.6 + (100 - gs.duration) * 0.4)
                when l.difficulty = 2 then sum(gae.ai_score * 0.7 + (100 - gs.duration) * 0.3)
                when l.difficulty = 3 then sum(gae.ai_score * 0.8 + (100 - gs.duration) * 0.2)
                else sum(gae.ai_score * 0.6 + gs.duration * 0.4)
            end total_score
        from public.games g
            join public.users u on u.id = g.user_id
            join public.levels l on g.level_id = l.id
            join public.game_scores gs on g.id = gs.game_id
            join public.game_ai_evaluations gae on gs.id = gae.score_id
        where level_id = _level_id
        group by
            u.name,
            u.nickname,
            g.id,
            l.difficulty,
            u.is_anonymous
        order by
            total_score desc;
end
$function$
;

CREATE OR REPLACE FUNCTION public.get_total_score_for_game(_game_id uuid)
 RETURNS TABLE(total_score numeric)
 LANGUAGE plpgsql
AS $function$
    begin
    return query
select
    case
        when l.difficulty = 1 then sum(gae.ai_score * 0.6 + (100 - gs.duration) * 0.4)
        when l.difficulty = 2 then sum(gae.ai_score * 0.7 + (100 - gs.duration) * 0.3)
        when l.difficulty = 3 then sum(gae.ai_score * 0.8 + (100 - gs.duration) * 0.2)
        else sum(gae.ai_score * 0.6 + gs.duration * 0.4)
    end total_score
from public.games g
    join public.levels l on g.level_id = l.id
    join public.game_scores gs on g.id = gs.game_id
    join public.game_ai_evaluations gae on gs.id = gae.score_id
where g.id = 'e7c7574e-4664-41c8-b73a-602acf1f56a6'
group by
    l.difficulty;
end
    $function$
;

CREATE OR REPLACE FUNCTION public.increment(_table_name text, _row_id integer, _x integer, _field_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', _table_name, _field_name, _field_name)
        USING _x, _row_id;
END
$function$
;

CREATE OR REPLACE FUNCTION public.increment(_table_name text, _row_id uuid, _x integer, _field_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', _table_name, _field_name, _field_name)
        USING _x, _row_id;
END
$function$
;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
    NEW.updated_at = now();
    return new;
end
$function$
;

grant delete on table "public"."app_stats" to "anon";

grant insert on table "public"."app_stats" to "anon";

grant references on table "public"."app_stats" to "anon";

grant select on table "public"."app_stats" to "anon";

grant trigger on table "public"."app_stats" to "anon";

grant truncate on table "public"."app_stats" to "anon";

grant update on table "public"."app_stats" to "anon";

grant delete on table "public"."app_stats" to "authenticated";

grant insert on table "public"."app_stats" to "authenticated";

grant references on table "public"."app_stats" to "authenticated";

grant select on table "public"."app_stats" to "authenticated";

grant trigger on table "public"."app_stats" to "authenticated";

grant truncate on table "public"."app_stats" to "authenticated";

grant update on table "public"."app_stats" to "authenticated";

grant delete on table "public"."app_stats" to "service_role";

grant insert on table "public"."app_stats" to "service_role";

grant references on table "public"."app_stats" to "service_role";

grant select on table "public"."app_stats" to "service_role";

grant trigger on table "public"."app_stats" to "service_role";

grant truncate on table "public"."app_stats" to "service_role";

grant update on table "public"."app_stats" to "service_role";

grant delete on table "public"."user_attempted_levels" to "anon";

grant insert on table "public"."user_attempted_levels" to "anon";

grant references on table "public"."user_attempted_levels" to "anon";

grant select on table "public"."user_attempted_levels" to "anon";

grant trigger on table "public"."user_attempted_levels" to "anon";

grant truncate on table "public"."user_attempted_levels" to "anon";

grant update on table "public"."user_attempted_levels" to "anon";

grant delete on table "public"."user_attempted_levels" to "authenticated";

grant insert on table "public"."user_attempted_levels" to "authenticated";

grant references on table "public"."user_attempted_levels" to "authenticated";

grant select on table "public"."user_attempted_levels" to "authenticated";

grant trigger on table "public"."user_attempted_levels" to "authenticated";

grant truncate on table "public"."user_attempted_levels" to "authenticated";

grant update on table "public"."user_attempted_levels" to "authenticated";

grant delete on table "public"."user_attempted_levels" to "service_role";

grant insert on table "public"."user_attempted_levels" to "service_role";

grant references on table "public"."user_attempted_levels" to "service_role";

grant select on table "public"."user_attempted_levels" to "service_role";

grant trigger on table "public"."user_attempted_levels" to "service_role";

grant truncate on table "public"."user_attempted_levels" to "service_role";

grant update on table "public"."user_attempted_levels" to "service_role";

create policy "Enable read access for all users"
on "public"."app_stats"
as permissive
for select
to public
using (true);


create policy "Logged in user have read access"
on "public"."curated_level_category"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "Logged in user have read access"
on "public"."curated_levels"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "Only service_role have full access"
on "public"."game_ai_evaluations"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text))
with check ((auth.role() = 'service_role'::text));


create policy "Only service_role have full access"
on "public"."game_score_conversations"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text))
with check ((auth.role() = 'service_role'::text));


create policy "Only service_role have full access"
on "public"."game_score_highlights"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text))
with check ((auth.role() = 'service_role'::text));


create policy "Only service_role can have full access"
on "public"."game_scores"
as permissive
for all
to public
using ((auth.role() = 'service_role'::text))
with check ((auth.role() = 'service_role'::text));


create policy "Authenticated user with matching uid can manage own games"
on "public"."games"
as permissive
for all
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Enable read access for all users"
on "public"."levels"
as permissive
for select
to public
using (true);


create policy "Allow read access for authenticated user with matching uid"
on "public"."subscriptions"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Allow read access for authenticated user with matching uid"
on "public"."users"
as permissive
for select
to public
using ((auth.uid() = id));


create policy "Enable read access for all users"
on "public"."words"
as permissive
for select
to public
using (true);


CREATE TRIGGER update_app_stats_change_updated_at_timestamp BEFORE UPDATE ON public.app_stats FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_words_change_updated_at_timestamp BEFORE UPDATE ON public.words FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


