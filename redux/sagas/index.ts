import { spawn } from 'redux-saga/effects';
import tokensSaga from './tokensSaga';

import userSaga from './userSaga';

function* rootSaga() {
  yield spawn(userSaga);
  yield spawn(tokensSaga);
}

export default rootSaga;
