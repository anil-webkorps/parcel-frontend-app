import { combineReducers } from "redux";

import loginReducer from "store/login/reducer";
import logoutReducer from "store/logout/reducer";
import registerReducer from "store/register/reducer";

export default function auth() {
  return combineReducers({
    auth: { ...loginReducer, ...logoutReducer, ...registerReducer },
  });
}
