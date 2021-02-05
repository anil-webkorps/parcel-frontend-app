import produce from "immer";
import { BigNumber } from "@ethersproject/bignumber";
import {
  GET_TOKENS,
  GET_TOKENS_ERROR,
  GET_TOKENS_SUCCESS,
  ADD_CUSTOM_TOKEN,
  ADD_CUSTOM_TOKEN_ERROR,
  ADD_CUSTOM_TOKEN_SUCCESS,
  SET_SUCCESS,
} from "./action-types";
import { getDefaultIconIfPossible } from "constants/index";
import ETHIcon from "assets/icons/tokens/ETH-icon.png";

export const initialState = {
  tokens: undefined,
  log: "",
  loading: false,
  updating: false,
  success: false,
  error: false,
  tokenList: [],
};

/* eslint-disable default-case, no-param-reassign */
const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case GET_TOKENS:
        draft.loading = true;
        draft.error = false;
        break;

      case GET_TOKENS_SUCCESS:
        const allTokenDetails =
          action.tokens &&
          action.tokens
            .map(({ tokenDetails, balanceDetails }, idx) => {
              if (!tokenDetails) return null;
              if (!balanceDetails) {
                const tokenIcon = getDefaultIconIfPossible(
                  tokenDetails.tokenInfo.symbol
                );
                return {
                  id: idx,
                  name: tokenDetails.tokenInfo.symbol,
                  icon: tokenIcon || tokenDetails.tokenInfo.logoUri || ETHIcon,
                  balance: 0,
                  usd: 0,
                };
              }
              // erc20
              const balance = BigNumber.from(balanceDetails.balance)
                .div(
                  BigNumber.from(String(10 ** tokenDetails.tokenInfo.decimals))
                )
                .toString();

              return {
                id: idx,
                name: tokenDetails.tokenInfo.symbol,
                icon: tokenDetails.tokenInfo.logoUri || ETHIcon,
                balance,
                usd: balance * balanceDetails.usdConversion,
              };
            })
            .filter(Boolean);
        draft.tokenList = allTokenDetails;
        draft.loading = false;
        draft.log = action.log;
        draft.tokens = action.tokens;
        break;

      case GET_TOKENS_ERROR:
        draft.loading = false;
        draft.error = action.error;
        break;

      case ADD_CUSTOM_TOKEN:
        draft.updating = true;
        draft.success = false;
        draft.error = false;
        break;

      case ADD_CUSTOM_TOKEN_SUCCESS:
        draft.updating = false;
        draft.log = action.log;
        draft.success = true;
        break;

      case ADD_CUSTOM_TOKEN_ERROR:
        draft.error = action.error;
        draft.updating = false;
        draft.success = false;
        break;

      case SET_SUCCESS:
        draft.success = action.bool;
    }
  });

export default reducer;
