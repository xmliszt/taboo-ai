drop policy "Allow full access for authenticated user with matching id" on "public"."users";

create policy "Allow full access for authenticated user with matching uid"
on "public"."users"
as permissive
for all
to public
using ((auth.uid() = id))
with check ((auth.uid() = id));



