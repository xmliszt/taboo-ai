alter table "public"."highlight" drop constraint "fk_score_id";

alter table "public"."score" drop constraint "fk_game_id";

alter table "public"."game" drop constraint "game_pkey";

drop index if exists "public"."game_pkey";

alter table "public"."game" drop column "id";

alter table "public"."game" add column "game_id" text not null;

alter table "public"."highlight" alter column "game_id" set data type text using "game_id"::text;

alter table "public"."score" alter column "game_id" set data type text using "game_id"::text;

CREATE UNIQUE INDEX game_pkey ON public.game USING btree (game_id);

alter table "public"."game" add constraint "game_pkey" PRIMARY KEY using index "game_pkey";

alter table "public"."game" add constraint "fk_user" FOREIGN KEY (player_nickname, player_id) REFERENCES "user"(nickname, recovery_key) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."game" validate constraint "fk_user";

alter table "public"."highlight" add constraint "fk_score" FOREIGN KEY (game_id, score_id) REFERENCES score(game_id, score_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."highlight" validate constraint "fk_score";

alter table "public"."score" add constraint "fk_game_id" FOREIGN KEY (game_id) REFERENCES game(game_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."score" validate constraint "fk_game_id";


set check_function_bodies = off;

CREATE OR REPLACE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$function$
;


