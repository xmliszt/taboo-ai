drop trigger if exists "update_objects_updated_at" on "storage"."objects";

alter table "storage"."migrations" drop constraint "migrations_name_key";

alter table "storage"."objects" drop constraint "objects_bucketId_fkey";

drop function if exists "storage"."can_insert_object"(bucketid text, name text, owner uuid, metadata jsonb);

drop function if exists "storage"."extension"(name text);

drop function if exists "storage"."filename"(name text);

drop function if exists "storage"."foldername"(name text);

drop function if exists "storage"."search"(prefix text, bucketname text, limits integer, levels integer, offsets integer, search text, sortcolumn text, sortorder text);

drop function if exists "storage"."get_size_by_bucket"();

alter table "storage"."buckets" drop constraint "buckets_pkey";

alter table "storage"."migrations" drop constraint "migrations_pkey";

alter table "storage"."objects" drop constraint "objects_pkey";

alter table "storage"."buckets" alter column "allowed_mime_types" set data type "text"[] using "allowed_mime_types"::"text"[];

alter table "storage"."buckets" alter column "created_at" set default "now"();

alter table "storage"."buckets" alter column "id" set data type "text" using "id"::"text";

alter table "storage"."buckets" alter column "name" set data type "text" using "name"::"text";

alter table "storage"."buckets" alter column "owner" set data type "uuid" using "owner"::"uuid";

alter table "storage"."buckets" alter column "owner_id" set data type "text" using "owner_id"::"text";

alter table "storage"."buckets" alter column "updated_at" set default "now"();

alter table "storage"."objects" alter column "bucket_id" set data type "text" using "bucket_id"::"text";

alter table "storage"."objects" alter column "created_at" set default "now"();

alter table "storage"."objects" alter column "id" set default "gen_random_uuid"();

alter table "storage"."objects" alter column "id" set data type "uuid" using "id"::"uuid";

alter table "storage"."objects" alter column "last_accessed_at" set default "now"();

alter table "storage"."objects" alter column "metadata" set data type "jsonb" using "metadata"::"jsonb";

alter table "storage"."objects" alter column "name" set data type "text" using "name"::"text";

alter table "storage"."objects" alter column "owner" set data type "uuid" using "owner"::"uuid";

alter table "storage"."objects" alter column "owner_id" set data type "text" using "owner_id"::"text";

alter table "storage"."objects" alter column "path_tokens" set default "string_to_array"("name", '/'::"text");

alter table "storage"."objects" alter column "path_tokens" set data type "text"[] using "path_tokens"::"text"[];

alter table "storage"."objects" alter column "updated_at" set default "now"();

alter table "storage"."objects" alter column "version" set data type "text" using "version"::"text";

alter table "storage"."buckets" add constraint "buckets_pkey" PRIMARY KEY using index "buckets_pkey";

alter table "storage"."migrations" add constraint "migrations_pkey" PRIMARY KEY using index "migrations_pkey";

alter table "storage"."objects" add constraint "objects_pkey" PRIMARY KEY using index "objects_pkey";

alter table "storage"."migrations" add constraint "migrations_name_key" UNIQUE using index "migrations_name_key";

alter table "storage"."objects" add constraint "objects_bucketId_fkey" FOREIGN KEY ("bucket_id") REFERENCES "storage"."buckets"("id") not valid;

alter table "storage"."objects" validate constraint "objects_bucketId_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION "storage"."can_insert_object"("bucketid" "text", "name" "text", "owner" "uuid", "metadata" "jsonb")
 RETURNS "void"
 LANGUAGE "plpgsql"
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

CREATE OR REPLACE FUNCTION "storage"."extension"("name" "text")
 RETURNS "text"
 LANGUAGE "plpgsql"
AS $function$
DECLARE
_parts text[];
_filename text;
BEGIN
    select string_to_array(name, '/') into _parts;
    select _parts[array_length(_parts,1)] into _filename;
    -- @todo return the last part instead of 2
    return split_part(_filename, '.', 2);
END
$function$
;

CREATE OR REPLACE FUNCTION "storage"."filename"("name" "text")
 RETURNS "text"
 LANGUAGE "plpgsql"
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[array_length(_parts,1)];
END
$function$
;

CREATE OR REPLACE FUNCTION "storage"."foldername"("name" "text")
 RETURNS "text"[]
 LANGUAGE "plpgsql"
AS $function$
DECLARE
_parts text[];
BEGIN
    select string_to_array(name, '/') into _parts;
    return _parts[1:array_length(_parts,1)-1];
END
$function$
;

CREATE OR REPLACE FUNCTION "storage"."search"("prefix" "text", "bucketname" "text", "limits" integer DEFAULT 100, "levels" integer DEFAULT 1, "offsets" integer DEFAULT 0, "search" "text" DEFAULT ''::"text", "sortcolumn" "text" DEFAULT 'name'::"text", "sortorder" "text" DEFAULT 'asc'::"text")
 RETURNS TABLE("name" "text", "id" "uuid", "updated_at" timestamp with time zone, "created_at" timestamp with time zone, "last_accessed_at" timestamp with time zone, "metadata" "jsonb")
 LANGUAGE "plpgsql"
 STABLE
AS $function$
declare
  v_order_by text;
  v_sort_order text;
begin
  case
    when sortcolumn = 'name' then
      v_order_by = 'name';
    when sortcolumn = 'updated_at' then
      v_order_by = 'updated_at';
    when sortcolumn = 'created_at' then
      v_order_by = 'created_at';
    when sortcolumn = 'last_accessed_at' then
      v_order_by = 'last_accessed_at';
    else
      v_order_by = 'name';
  end case;

  case
    when sortorder = 'asc' then
      v_sort_order = 'asc';
    when sortorder = 'desc' then
      v_sort_order = 'desc';
    else
      v_sort_order = 'asc';
  end case;

  v_order_by = v_order_by || ' ' || v_sort_order;

  return query execute
    'with folders as (
       select path_tokens[$1] as folder
       from storage.objects
         where objects.name ilike $2 || $3 || ''%''
           and bucket_id = $4
           and array_length(regexp_split_to_array(objects.name, ''/''), 1) <> $1
       group by folder
       order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(regexp_split_to_array(objects.name, ''/''), 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$function$
;

CREATE OR REPLACE FUNCTION "storage"."get_size_by_bucket"()
 RETURNS TABLE("size" bigint, "bucket_id" "text")
 LANGUAGE "plpgsql"
AS $function$
BEGIN
    return query
        select sum((metadata->>'size')::int) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$function$
;

CREATE OR REPLACE FUNCTION "storage"."update_updated_at_column"()
 RETURNS "trigger"
 LANGUAGE "plpgsql"
AS $function$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$function$
;

CREATE TRIGGER "update_objects_updated_at" BEFORE UPDATE ON "storage"."objects" FOR EACH ROW EXECUTE FUNCTION "storage"."update_updated_at_column"();


