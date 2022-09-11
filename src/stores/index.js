import { 
  createStore, 
  combineReducers, 
  applyMiddleware,
  compose
} from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger'
import getPass from './passwords/passwords.reducer';

const combineReducer = combineReducers({
  pass: getPass
})

const composeEnhancers =
  typeof window === 'object' &&
  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?   
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
      // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
    }) : compose;

const enhancer = composeEnhancers(
  applyMiddleware(thunk, logger),
  // other store enhancers if any
);
const store = createStore(combineReducer, enhancer);

export default store;