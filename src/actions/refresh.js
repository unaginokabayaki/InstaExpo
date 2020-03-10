export const REFRESH_HOME = 'REFRESH_HOME';

export function doRefresh(bool) {
  return { type: REFRESH_HOME, payload: bool };
}
