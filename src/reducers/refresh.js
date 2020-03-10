import { REFRESH_HOME } from 'app/src/actions/refresh';

const initState = {
  refreshHome: false,
};

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case REFRESH_HOME:
      return {
        refreshHome: payload,
      };
    default:
      return state;
  }
};
