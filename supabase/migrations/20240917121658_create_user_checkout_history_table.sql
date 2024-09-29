create table "public"."users_checkout_history" (
    "user_id" uuid,
    "checkout_session_id" text not null,
    "price_id" text not null,
    "price" real not null,
    "tokens" integer not null
);


alter table "public"."users_checkout_history" add constraint "users_checkout_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE not valid;

alter table "public"."users_checkout_history" validate constraint "users_checkout_history_user_id_fkey";

grant delete on table "public"."users_checkout_history" to "anon";

grant insert on table "public"."users_checkout_history" to "anon";

grant references on table "public"."users_checkout_history" to "anon";

grant select on table "public"."users_checkout_history" to "anon";

grant trigger on table "public"."users_checkout_history" to "anon";

grant truncate on table "public"."users_checkout_history" to "anon";

grant update on table "public"."users_checkout_history" to "anon";

grant delete on table "public"."users_checkout_history" to "authenticated";

grant insert on table "public"."users_checkout_history" to "authenticated";

grant references on table "public"."users_checkout_history" to "authenticated";

grant select on table "public"."users_checkout_history" to "authenticated";

grant trigger on table "public"."users_checkout_history" to "authenticated";

grant truncate on table "public"."users_checkout_history" to "authenticated";

grant update on table "public"."users_checkout_history" to "authenticated";

grant delete on table "public"."users_checkout_history" to "service_role";

grant insert on table "public"."users_checkout_history" to "service_role";

grant references on table "public"."users_checkout_history" to "service_role";

grant select on table "public"."users_checkout_history" to "service_role";

grant trigger on table "public"."users_checkout_history" to "service_role";

grant truncate on table "public"."users_checkout_history" to "service_role";

grant update on table "public"."users_checkout_history" to "service_role";


-- RLS
alter table "public"."users_checkout_history" enable row level security;

create policy "Users can view their own checkout history" on "public"."users_checkout_history" for select using (auth.uid() = user_id);