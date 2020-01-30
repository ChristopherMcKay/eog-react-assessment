import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import createSagaMiddleware from 'redux-saga';
import { combineReducers } from 'redux-starter-kit';
import sagas from './sagas';
import reducers from './reducers';

const reducer = combineReducers(reducers);

const initialState = {};


  const composeEnhancers = composeWithDevTools({});
  const sagaMiddleware = createSagaMiddleware();
  const middlewares = applyMiddleware(sagaMiddleware);
  const store = createStore(reducer, initialState, composeEnhancers(middlewares));

  sagaMiddleware.run(sagas);

export default store;
