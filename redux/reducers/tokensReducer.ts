import { SET_TOKENS } from '../actions/tokens';
import { HYDRATE } from 'next-redux-wrapper';
import { ITokenInfo } from '../../interfaces';

const initialState = {
  tokens: [],
  totalLockedUSD: undefined,
  isPending: true,
};

export interface ITokens {
  tokens: ITokenInfo[];
  totalLockedUSD: string | undefined;
  isPending: boolean;
}

const tokens = (state = initialState, { type, payload }) => {
  switch (type) {
    case HYDRATE:
      return { ...state, ...payload.tokens };

    case SET_TOKENS:
      return {
        ...state,
        ...payload,
        isPending: false,
      };

    default:
      return state;
  }
};

export default tokens;
