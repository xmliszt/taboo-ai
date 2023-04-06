alter table "public"."game" drop constraint "fk_level_name";

create table "public"."daily_level" (
    "name" character varying(100) not null,
    "difficulty" integer,
    "words" text[],
    "created_at" timestamp with time zone not null default timezone('utc'::text, now())
);

CREATE UNIQUE INDEX daily_level_pkey ON public.daily_level USING btree (name);

alter table "public"."daily_level" add constraint "daily_level_pkey" PRIMARY KEY using index "daily_level_pkey";

alter table "public"."game" add constraint "fk_daily_level_name" FOREIGN KEY (level) REFERENCES daily_level(name) ON UPDATE CASCADE not valid;

alter table "public"."game" validate constraint "fk_daily_level_name";


