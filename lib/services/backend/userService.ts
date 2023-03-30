import {
  insertUser,
  deleteUser,
  updateUserLastLoginAt,
  getUserDevices,
  updateUserDevices,
  selectUserByNickname,
  selectAllUsers,
  selectUserByRecoveryKey,
} from '../../database/userRepository';
import { generateHashedString } from '../../utilities';
import type IUser from '../../../types/user.interface';

const createUser = async (
  nickname: string,
  userAgent: string
): Promise<IUser> => {
  const now = Date.now();
  const recoveryKey = generateHashedString(nickname, String(now));
  const { data } = await insertUser(nickname, recoveryKey, userAgent);
  return data[0] as IUser;
};

const deleteUserByNicknameAndRecoveryKey = async (
  nickname: string,
  recoveryKey: string
): Promise<void> => {
  await deleteUser(nickname, recoveryKey);
};

const updateLastLoginAt = async (
  nickname: string,
  recoveryKey: string,
  lastLoginAt: number
): Promise<void> => {
  await updateUserLastLoginAt(nickname, recoveryKey, new Date(lastLoginAt));
};

const addDeviceToUser = async (
  nickname: string,
  recoveryKey: string,
  device: string
): Promise<void> => {
  const { data } = await getUserDevices(nickname, recoveryKey);
  if (data.length <= 0) {
    throw Error('User devices not found!');
  }
  const devices = data[0].devices as string[];
  if (!devices.includes(device)) {
    devices.push(device);
  }
  await updateUserDevices(nickname, recoveryKey, devices);
};

const removeDeviceFromUser = async (
  nickname: string,
  recoveryKey: string,
  deviceIndex: number
): Promise<void> => {
  const { data } = await getUserDevices(nickname, recoveryKey);
  if (data.length <= 0) {
    throw Error('Cannot find any devices');
  }
  const devices = data[0].devices as string[];
  devices.splice(deviceIndex, 1);
  await updateUserDevices(nickname, recoveryKey, devices);
};

const getUserByNickname = async (nickname: string): Promise<IUser | null> => {
  const { data } = await selectUserByNickname(nickname);
  if (data.length === 0) {
    return null;
  }
  return data[0] as IUser;
};

const getUserByRecoveryKey = async (key: string): Promise<IUser | null> => {
  const { data } = await selectUserByRecoveryKey(key);
  if (data.length === 0) {
    return null;
  }
  return data[0] as IUser;
};

const getAllUsers = async (): Promise<IUser[]> => {
  const { data } = await selectAllUsers();
  if (data.length === 0) {
    return [];
  }
  return data as IUser[];
};

export {
  getAllUsers,
  createUser,
  getUserByNickname,
  getUserByRecoveryKey,
  updateLastLoginAt,
  removeDeviceFromUser,
  addDeviceToUser,
  deleteUserByNicknameAndRecoveryKey,
};
