drop policy "logged in user can manage own level" on "public"."levels";

create policy "Auth user full access to their own level"
on "public"."levels"
as permissive
for all
to public
using ((auth.uid() = created_by))
with check ((auth.uid() = created_by));



