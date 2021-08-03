import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createWrapper } from 'next-redux-wrapper';

import rootReducer from '../reducers';
import rootSaga from '../sagas';

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== 'production') {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const makeStore = () => {
  const isServer = typeof window === 'undefined';
  const sagaMiddleware = createSagaMiddleware();

  if (isServer) {
    const store = createStore(rootReducer, bindMiddleware([sagaMiddleware]));
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
  } else {
    const persistConfig = {
      key: 'root',
      whitelist: ['session'],
      storage,
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = createStore(persistedReducer, bindMiddleware([sagaMiddleware]));

    store.__persistor = persistStore(store);
    store.sagaTask = sagaMiddleware.run(rootSaga);

    return store;
  }
};

export const wrapper = createWrapper(makeStore, { debug: true });
