import { supabase } from '../supabaseClient';

export const selectAllUsers = async () => {
  const { data, error } = await supabase.from('user').select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};

export const selectUserByNickname = async (nickname: string) => {
  const { data, error } = await supabase
    .from('user')
    .select()
    .eq('nickname', nickname);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};

export const selectUserByRecoveryKey = async (key: string) => {
  const { data, error } = await supabase
    .from('user')
    .select()
    .eq('recovery_key', key);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};

export const insertUser = async (
  nickname: string,
  recoveryKey: string,
  primaryDevice: string
) => {
  const { data, error } = await supabase
    .from('user')
    .insert({
      nickname: nickname,
      recovery_key: recoveryKey,
      created_at: new Date().toISOString(),
      last_login_at: new Date().toISOString(),
      devices: [primaryDevice],
    })
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};

export const deleteUser = async (nickname: string, recoveryKey: string) => {
  const { error } = await supabase
    .from('user')
    .delete()
    .eq('nickname', nickname)
    .eq('recovery_key', recoveryKey);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
};

export const updateUserLastLoginAt = async (
  nickname: string,
  recoveryKey: string,
  lastLoginAt: Date
) => {
  const { data, error } = await supabase
    .from('user')
    .update({ last_login_at: lastLoginAt.toISOString() })
    .eq('nickname', nickname)
    .eq('recovery_key', recoveryKey)
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};

export const getUserDevices = async (nickname: string, recoveryKey: string) => {
  const { data, error } = await supabase
    .from('user')
    .select('devices')
    .eq('nickname', nickname)
    .eq('recovery_key', recoveryKey);
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};

export const updateUserDevices = async (
  nickname: string,
  recoveryKey: string,
  devices: string[]
) => {
  const { data, error } = await supabase
    .from('user')
    .update({ devices: devices })
    .eq('nickname', nickname)
    .eq('recovery_key', recoveryKey)
    .select();
  if (error) {
    console.error(error);
    throw Error(error.message);
  }
  return { data };
};
