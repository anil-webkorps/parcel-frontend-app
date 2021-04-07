import React, { useState, useEffect, useCallback, memo, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { Link } from "react-router-dom";

import { useLocalStorage } from "hooks";
import { routeTemplates } from "constants/routes/templates";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectFetching as makeSelectLoadingTransactions,
} from "store/transactions/selectors";
import viewTeammatesReducer from "store/view-teammates/reducer";
import viewTeammatesSaga from "store/view-teammates/saga";
import { getAllTeammates } from "store/view-teammates/actions";
import {
  makeSelectTeammates,
  makeSelectLoading as makeSelectLoadingTeammates,
} from "store/view-teammates/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import Loading from "components/common/Loading";
import { TransactionUrl } from "components/common/Web3Utils";
import StatusText from "components/Transactions/StatusText";

import TeamMembersPng from "assets/images/team-members.png";
import TeamPng from "assets/images/user-team.png";
import IncomingIcon from "assets/icons/dashboard/incoming.svg";
import CancelledIcon from "assets/icons/dashboard/cancelled.svg";

import { RecentTx } from "./styles";
import Img from "components/common/Img";

const transactionsKey = "transactions";
const viewTeammatesKey = "viewTeammates";

const STATES = {
  EMPTY_STATE: "EMPTY_STATE",
  TEAMMATES_ADDED: "TEAMMATES_ADDED",
  TRANSACTION_EXECUTED: "TRANSACTION_EXECUTED",
};

function RecentTxCard() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [state, setState] = useState(STATES.EMPTY_STATE);
  const [loading, setLoading] = useState(true);
  const [transactionData, setTransactionData] = useState();

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });
  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });
  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectTransactions());
  const loadingTransactions = useSelector(makeSelectLoadingTransactions());
  const loadingTeammates = useSelector(makeSelectLoadingTeammates());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const teammates = useSelector(makeSelectTeammates());

  const getDecryptedDetails = useCallback(
    (data) => {
      if (!encryptionKey) return "";
      return JSON.parse(
        cryptoUtils.decryptDataUsingEncryptionKey(
          data,
          encryptionKey,
          organisationType
        )
      );
    },
    [encryptionKey, organisationType]
  );

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(viewTransactions(ownerSafeAddress));
      dispatch(getAllTeammates(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (!loadingTransactions && !loadingTeammates && loading) setLoading(false);
  }, [loadingTeammates, loadingTransactions, loading]);

  useEffect(() => {
    if (
      teammates &&
      teammates.length > 0 &&
      state !== STATES.TRANSACTION_EXECUTED
    ) {
      setState(STATES.TEAMMATES_ADDED);
    } else if (state !== STATES.TRANSACTION_EXECUTED) {
      setState(STATES.EMPTY_STATE);
    }
  }, [teammates, state]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setState(STATES.TRANSACTION_EXECUTED);
      // const latestTx = transactions[0];
      // const transactionData = {
      //   transactionId: latestTx.transactionId,
      //   amountPaid: latestTx.fiatValue,
      //   currency: latestTx.fiatCurrency,
      //   tokenCurrency: latestTx.tokenCurrency,
      //   date: latestTx.createdOn,
      //   numOfPeople: latestTx.addresses.length,
      //   status: latestTx.status,
      //   transactionHash: latestTx.transactionHash,
      // };

      setTransactionData(transactions);
    }
  }, [transactions, getDecryptedDetails]);

  const stepTitle = useMemo(() => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return `Add Team Members`;
      case STATES.TEAMMATES_ADDED:
        return `Your Teammates`;
      case STATES.TRANSACTION_EXECUTED:
        return `Recent Transactions`;
      default:
        return null;
    }
  }, [state]);

  const linkByState = useMemo(() => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return routeTemplates.dashboard.people;
      case STATES.TEAMMATES_ADDED:
        return routeTemplates.dashboard.people;
      case STATES.TRANSACTION_EXECUTED:
        return routeTemplates.dashboard.transactions;
      default:
        return null;
    }
  }, [state]);

  console.log({ transactionData });

  const renderTx = () => {
    return (
      <div className="tx">
        <div className="tx-info">
          <Img src={IncomingIcon} alt="tx-icon" className="mr-4" />
          <div>
            <div className="top">Raymond Holt</div>
            <div className="bottom">4/5/2021</div>
          </div>
        </div>
        <div className="tx-amounts">
          <div className="top">- $3490.35</div>
          <div className="bottom">DAI 3,539.2365</div>
        </div>
        <div className="tx-status">Completed</div>
      </div>
    );
  };
  return (
    <RecentTx>
      <div className="title-container">
        <div className="title">{stepTitle}</div>
        <Link to={linkByState} className="view">
          View All
        </Link>
      </div>
      <div className="tx-container">
        {renderTx()}
        {renderTx()}
        {renderTx()}
        {renderTx()}
        {renderTx()}
      </div>
    </RecentTx>
  );
}

export default memo(RecentTxCard);
