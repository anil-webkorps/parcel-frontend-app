import React from "react";
import { useSelector } from "react-redux";

import {
  makeSelectTotalBalance,
  makeSelectLoading as makeSelectLoadingTokens,
} from "store/tokens/selectors";
import Loading from "components/common/Loading";
import { formatNumber } from "utils/number-helpers";

import { Overview } from "./styles";

export default function OverviewCard() {
  const totalBalance = useSelector(makeSelectTotalBalance());
  const loading = useSelector(makeSelectLoadingTokens());

  const renderLoading = () => {
    return (
      loading && (
        <Loading
          color="primary"
          width="1.25rem"
          height="1.25rem"
          className="d-inline ml-2"
        />
      )
    );
  };
  return (
    <Overview>
      <div className="left">
        <div className="total-balance">Total Balance</div>
        <div className="amount">
          <span className="symbol">$</span>
          <span className="value">
            {formatNumber(totalBalance.split(".")[0], 0)}
          </span>
          <span className="decimals">.{totalBalance.split(".")[1]}</span>
          {renderLoading()}
        </div>
      </div>
      <div className="right">
        <div className="money-in">
          <div className="heading">Money in last month</div>
          <div className="value-container">
            <span className="plus">+</span> $19,324.00
            {renderLoading()}
          </div>
        </div>
        <div className="money-out">
          <div className="heading">Money out last month</div>
          <div className="value-container grey">
            <span className="minus">-</span> $3,324.00{renderLoading()}
          </div>
        </div>
      </div>
    </Overview>
  );
}
