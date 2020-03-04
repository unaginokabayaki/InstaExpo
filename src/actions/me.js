export const ME_SET = 'ME_SET';
export const ME_DELETE = 'ME_DELETE';

export function setMe(user) {
  return { type: ME_SET, payload: user };
}

export function deleteMe() {
  return { type: ME_DELETE };
}
