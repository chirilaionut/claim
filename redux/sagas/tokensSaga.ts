import { put, takeLatest, call } from 'redux-saga/effects';
import { SET_TOKENS, SET_TOKENS_REQUESTED } from '../actions/tokens';
import { doGetTokensInfo } from './../../api/backend';
import { BigNumber } from 'bignumber.js';

function* updateTokens() {
  try {
    const res = yield call(doGetTokensInfo, { page: 0, size: 1000 });

    const totalLockedUSD = res.content.reduce(
      (acc, v) => new BigNumber(acc).plus(Number(v.totalLockedUSD)).toNumber(),
      0
    );

    yield put({
      type: SET_TOKENS,
      payload: {
        tokens: res.content,
        totalLockedUSD,
      },
    });
  } catch (error) {
    console.log('error getting tokens: ', error);
  }
}

export default function* tokens() {
  yield takeLatest(SET_TOKENS_REQUESTED, updateTokens);
}
