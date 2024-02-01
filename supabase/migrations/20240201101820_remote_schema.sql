CREATE TRIGGER new_user_signup AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_profile_after_user_signup();

CREATE TRIGGER update_user_login_times_after_user_login AFTER UPDATE OF last_sign_in_at ON auth.users FOR EACH ROW EXECUTE FUNCTION update_user_login_times_after_user_login();

CREATE TRIGGER user_deleted AFTER DELETE ON auth.users FOR EACH ROW EXECUTE FUNCTION delete_user_profile_after_user_delete();


