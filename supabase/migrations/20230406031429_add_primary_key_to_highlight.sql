alter table "public"."highlight" drop constraint "highlight_pkey";

drop index if exists "public"."highlight_pkey";

alter table "public"."highlight" add column "highlight_id" integer not null;

CREATE UNIQUE INDEX highlight_pkey ON public.highlight USING btree (game_id, score_id, highlight_id);

alter table "public"."highlight" add constraint "highlight_pkey" PRIMARY KEY using index "highlight_pkey";


