import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { BigNumber } from "@ethersproject/bignumber";

import { Assets } from "./styles";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import tokensReducer from "store/tokens/reducer";
import tokensSaga from "store/tokens/saga";
import { getTokens } from "store/tokens/actions";
import {
  makeSelectLoading as makeSelectLoadingTokens,
  makeselectTokens,
} from "store/tokens/selectors";
import { Card } from "components/common/Card";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import { defaultTokenDetails, getDefaultIconIfPossible } from "constants/index";
import Loading from "components/common/Loading";

const tokensKey = "tokens";

export default function AccountCard() {
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // Reducers
  useInjectReducer({ key: tokensKey, reducer: tokensReducer });

  // Sagas
  useInjectSaga({ key: tokensKey, saga: tokensSaga });

  const dispatch = useDispatch();

  // Selectors
  const tokenList = useSelector(makeselectTokens());
  const loading = useSelector(makeSelectLoadingTokens());
  // const error = useSelector(makeSelectError());

  const [totalBalance, setTotalBalance] = useState("0.00");
  // eslint-disable-next-line
  const [interestEarned, setInterestEarned] = useState("0.00");
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getTokens(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (tokenList && tokenList.length > 0) {
      const allTokenDetails = tokenList
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
            .div(BigNumber.from(String(10 ** tokenDetails.tokenInfo.decimals)))
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
      setTokenDetails(allTokenDetails.slice(0, 3));
    }
  }, [tokenList]);

  useEffect(() => {
    const total = tokenDetails.reduce(
      (sum, token) => (sum += parseFloat(token.usd)),
      0
    );
    setTotalBalance(parseFloat(total).toFixed(2));
  }, [tokenDetails]);

  return (
    <div className="account">
      <Card
        className="p-4"
        style={{
          width: "45em",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Account</div>
            <div className="card-subtitle">
              Find overview of your account balances
            </div>
          </div>
          <Link to="/dashboard">
            <div className="circle">
              <FontAwesomeIcon icon={faArrowRight} color="#fff" />
            </div>
          </Link>
        </div>

        {loading ? (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "400px" }}
          >
            <Loading color="primary" width="50px" height="50px" />
          </div>
        ) : (
          <React.Fragment>
            <div className="overview-cards">
              <div className="overview-card">
                <div className="overview-text">Total Balance</div>
                <div className="overview-amount">${totalBalance}</div>
              </div>
              {/* <div className="overview-card">
                <div className="overview-text">Interest Earned</div>
                <div className="overview-amount">${interestEarned}</div>
              </div> */}
            </div>
            {tokenDetails.map(({ id, name, icon, usd, balance }) => (
              <Assets key={id}>
                <div className="d-flex align-items-center">
                  <img src={icon} alt="ether" width="30" />
                  <div>
                    <div className="token-balance">
                      {parseFloat(balance).toFixed(2)}
                    </div>
                    <div className="token-name">{name}</div>
                  </div>
                </div>
                <div className="token-usd">
                  <div className="token-usd-title">Total Value</div>
                  <div className="token-usd-amount">
                    ${parseFloat(usd).toFixed(2)}
                  </div>
                </div>
              </Assets>
            ))}
          </React.Fragment>
        )}
      </Card>
    </div>
  );
}
