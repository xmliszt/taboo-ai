drop policy "Allow full access for authenticated user with matching uid" on "public"."users";

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


create policy "Allow full access for authenticated user with matching id"
on "public"."users"
as permissive
for all
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));



