import { combineReducers } from 'redux';

import userReducer from './userReducer';
import tokensReducer from './tokensReducer';

const rootReducer = combineReducers({
  user: userReducer,
  tokens: tokensReducer,
});

export default rootReducer;
