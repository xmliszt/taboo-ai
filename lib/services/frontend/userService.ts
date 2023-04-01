import IUser from '../../../types/user.interface';

interface ErrorResponse {
  error: string;
}

async function request<T>(url: string, method: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }

  const data: T = await response.json();
  return data;
}

async function requestWithoutReturn(
  url: string,
  method: string,
  body?: any
): Promise<void> {
  const response = await fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    throw new Error(error.error);
  }
  return;
}

export const createUser = async (nickname: string): Promise<IUser> => {
  const url = '/api/users/create';
  const userAgent = navigator.userAgent;
  const { user } = await request<{ user: IUser }>(url, 'POST', {
    nickname,
    userAgent,
  });
  return user;
};

export const getUserInfo = async (nickname: string): Promise<IUser> => {
  const url = '/api/users/' + nickname + '/getUser';
  return await request<IUser>(url, 'GET');
};

export const getUserInfoByRecoveryKey = async (
  recoveryKey: string
): Promise<IUser> => {
  const url = '/api/users/recover/' + recoveryKey + '/get';
  return await request<IUser>(url, 'GET');
};

export const removeUser = async (nickname: string, rKey: string) => {
  const url = '/api/users/' + nickname + '/' + rKey + '/delete';
  return await request(url, 'DELETE');
};

export const updateUserLastLoginTime = async (
  nickname: string,
  rKey: string,
  lastLoginAt: number
) => {
  const url = '/api/users/' + nickname + '/' + rKey + '/updateLastLogin';
  await requestWithoutReturn(url, 'PUT', { lastLoginAt });
};

export const addDeviceToUser = async (
  nickname: string,
  rKey: string,
  userAgent: string
) => {
  const url = '/api/users/' + nickname + '/' + rKey + '/addDevice';
  return await request<{ message: string }>(url, 'POST', { device: userAgent });
};

export const removeDeviceFromUser = async (
  nickname: string,
  rKey: string,
  deviceIndex: number
) => {
  const url = '/api/users/' + nickname + '/' + rKey + '/removeDevice';
  return await request(url, 'PUT', { deviceIndex });
};
