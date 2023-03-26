alter table "public"."daily_level" drop column "created_at";

alter table "public"."daily_level" add column "created_date" text not null;


