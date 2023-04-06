alter table "public"."game" drop constraint "fk_daily_level_name";

alter table "public"."player" drop constraint "player_pkey";

drop index if exists "public"."player_pkey";

drop table "public"."player";

alter table "public"."score" add column "ai_explanation" text;

alter table "public"."score" add column "ai_score" integer;

alter table "public"."game" add constraint "fk_daily_level_name" FOREIGN KEY (level) REFERENCES daily_level(name) ON UPDATE CASCADE ON DELETE CASCADE NOT VALID not valid;

alter table "public"."game" validate constraint "fk_daily_level_name";


