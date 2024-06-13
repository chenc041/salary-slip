import { request } from '~/request';

export const fileUpload = (payload: any) => {
  return request({
    url: '/api/v1/user/notify',
    method: 'POST',
    data: payload,
  });
};
