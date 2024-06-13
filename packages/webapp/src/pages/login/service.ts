import { request } from '~/request';

export const login = async (payload: { username: string; password: string }): Promise<any> => {
  return request({
    url: '/api/v1/user/login',
    method: 'POST',
    data: payload,
  });
};
