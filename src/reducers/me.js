import { ME_SET, ME_DELETE } from 'app/src/actions/me';

const initState = null;

export default (state = initState, action) => {
  const { type, payload } = action;
  switch (type) {
    case ME_SET:
      return {
        uid: payload.uid,
        name: payload.name,
        img: payload.img,
      };
    case ME_DELETE:
      return null;
    default:
      return state;
  }
};
