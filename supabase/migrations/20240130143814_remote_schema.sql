alter table "public"."plan_features" enable row level security;

alter table "public"."plans" enable row level security;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.f_increment_with_text_as_id(_table_name text, _row_id text, _x integer, _field_name text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
    if ((select current_user) <> 'service_role') then
        raise exception 'This function can be executed only by service_role';
    end if;

    EXECUTE format('UPDATE %I SET %I = %I + $1 WHERE id = $2', _table_name, _field_name, _field_name)
        USING _x, _row_id;
END
$function$
;

create policy "Enable read access for all users"
on "public"."plan_features"
as permissive
for select
to public
using (true);


create policy "Enable read access for all users"
on "public"."plans"
as permissive
for select
to public
using (true);



