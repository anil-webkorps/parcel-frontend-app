import React, { useState, useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { BigNumber } from "@ethersproject/bignumber";

import { Assets } from "./styles";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import dashboardReducer from "store/dashboard/reducer";
import dashboardSaga from "store/dashboard/saga";
import { Card } from "components/common/Card";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import { SideNavContext } from "context/SideNavContext";
import { getSafeBalances } from "store/dashboard/actions";
import {
  makeSelectLoading,
  makeSelectBalances,
  // makeSelectError,
} from "store/dashboard/selectors";
import Loading from "components/common/Loading";

const dashboardKey = "dashboard";

const DEFAULT_TOKENS = {
  ETH: "ETH",
  DAI: "DAI",
  USDC: "USDC",
};

const defaultTokenDetails = [
  {
    id: 0,
    name: DEFAULT_TOKENS.ETH,
    icon: ETHIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 1,
    name: DEFAULT_TOKENS.DAI,
    icon: DAIIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 2,
    name: DEFAULT_TOKENS.USDC,
    icon: USDCIcon,
    balance: "0.00",
    usd: "0.00",
  },
];

export default function AccountCard() {
  const [toggled] = useContext(SideNavContext);
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  // Reducers
  useInjectReducer({ key: dashboardKey, reducer: dashboardReducer });

  // Sagas
  useInjectSaga({ key: dashboardKey, saga: dashboardSaga });

  const dispatch = useDispatch();

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const balances = useSelector(makeSelectBalances());
  // const error = useSelector(makeSelectError());

  const [totalBalance, setTotalBalance] = useState("0.00");
  // eslint-disable-next-line
  const [interestEarned, setInterestEarned] = useState("0.00");
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getSafeBalances(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (balances && balances.length > 0) {
      const seenTokens = {};
      const allTokenDetails = balances
        .map((bal, idx) => {
          // erc20
          if (bal.token && bal.tokenAddress) {
            const balance = BigNumber.from(bal.balance)
              .div(BigNumber.from(String(10 ** bal.token.decimals)))
              .toString();
            // mark as seen
            seenTokens[bal.token.symbol] = true;

            return {
              id: idx,
              name: bal.token && bal.token.symbol,
              icon: bal.token.logoUri,
              balance,
              usd: bal.balanceUsd,
            };
          }
          // eth
          else if (bal.balance) {
            seenTokens[DEFAULT_TOKENS.ETH] = true;
            return {
              id: idx,
              name: "ETH",
              icon: ETHIcon,
              balance: bal.balance / 10 ** 18,
              usd: bal.balanceUsd,
            };
          } else return "";
        })
        .filter(Boolean);

      if (allTokenDetails.length < 3) {
        const zeroBalanceTokensToShow = defaultTokenDetails.filter(
          (token) => !seenTokens[token.name]
        );
        setTokenDetails([...allTokenDetails, ...zeroBalanceTokensToShow]);
      } else {
        setTokenDetails(allTokenDetails.split(0, 3));
      }
    }
  }, [balances]);

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
          width: toggled ? "37em" : "45em",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">Account</div>
            <div className="card-subtitle">
              Find overview of your wallets and manage payments
            </div>
          </div>
          <div className="circle">
            <FontAwesomeIcon icon={faArrowRight} color="#fff" />
          </div>
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
              <div className="overview-card">
                <div className="overview-text">Interest Earned</div>
                <div className="overview-amount">${interestEarned}</div>
              </div>
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
