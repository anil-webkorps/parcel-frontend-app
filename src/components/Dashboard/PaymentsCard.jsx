import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { useSelector, useDispatch } from "react-redux";
import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { Link } from "react-router-dom";

import { useLocalStorage } from "hooks";
import { Card } from "components/common/Card";
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
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";
import { TransactionUrl } from "components/common/Web3Utils";
import StatusText from "components/Transactions/StatusText";

import TeamMembersPng from "assets/images/team-members.png";
import TeamPng from "assets/images/user-team.png";
import { GreyCard, TransactionDetails, TeammateCard } from "./styles";

const transactionsKey = "transactions";
const viewTeammatesKey = "viewTeammates";

const STATES = {
  EMPTY_STATE: "EMPTY_STATE",
  TEAMMATES_ADDED: "TEAMMATES_ADDED",
  TRANSACTION_EXECUTED: "TRANSACTION_EXECUTED",
};

export default function PaymentsCard() {
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
  const teammates = useSelector(makeSelectTeammates());

  const getDecryptedDetails = useCallback(
    (data) => {
      if (!encryptionKey) return "";
      return JSON.parse(
        cryptoUtils.decryptDataUsingEncryptionKey(data, encryptionKey)
      );
    },
    [encryptionKey]
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
    )
      setState(STATES.TEAMMATES_ADDED);
  }, [teammates, state]);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      setState(STATES.TRANSACTION_EXECUTED);
      const latestTx = transactions[transactions.length - 1];
      const transactionData = {
        amountPaid: latestTx.fiatValue,
        currency: latestTx.fiatCurrency,
        tokenCurrency: latestTx.tokenCurrency,
        date: latestTx.createdOn,
        numOfPeople: latestTx.addresses.length,
        status: latestTx.status,
        transactionHash: latestTx.transactionHash,
      };

      setTransactionData(transactionData);
    }
  }, [transactions, getDecryptedDetails]);

  const renderStepTitle = () => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return `Add Team Members`;
      case STATES.TEAMMATES_ADDED:
        return `Your Teammates`;
      case STATES.TRANSACTION_EXECUTED:
        return `Transaction Status`;
      default:
        return null;
    }
  };

  const renderStepSubtitle = () => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return `To send money to your teammates`;
      case STATES.TEAMMATES_ADDED:
        return `Teammates you recently added`;
      case STATES.TRANSACTION_EXECUTED:
        return `Most recent transaction`;
      default:
        return null;
    }
  };

  const getLinkByState = () => {
    switch (state) {
      case STATES.EMPTY_STATE:
        return `/dashboard/people`;
      case STATES.TEAMMATES_ADDED:
        return `/dashboard/people`;
      case STATES.TRANSACTION_EXECUTED:
        return `/dashboard/transactions`;
      default:
        return null;
    }
  };

  return (
    <div className="payments">
      <Card className="p-4" style={{ width: "33em" }}>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="card-title">{renderStepTitle()}</div>
            <div className="card-subtitle">{renderStepSubtitle()}</div>
          </div>
          <Link to={getLinkByState()}>
            <div className="circle">
              <FontAwesomeIcon icon={faArrowRight} color="#fff" />
            </div>
          </Link>
        </div>
        {loading && (
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ height: "250px" }}
          >
            <Loading color="primary" width="50px" height="50px" />
          </div>
        )}
        {!loading && state === STATES.TRANSACTION_EXECUTED && (
          <TransactionDetails>
            <div className="grid-two">
              <div className="detail b-right b-bottom">
                <div className="title">Amount Paid</div>
                <div className="desc">
                  {transactionData.amountPaid} {transactionData.currency}
                </div>
              </div>
              <div className="detail b-bottom">
                <div className="title">Date</div>
                <div className="desc">
                  {format(new Date(transactionData.date), "dd MMM yyyy")}
                </div>
              </div>
            </div>
            <div className="detail b-bottom">
              <div className="title">Transaction Hash</div>
              <div className="desc">
                <TransactionUrl hash={transactionData.transactionHash}>
                  {transactionData.transactionHash.substring(0, 30)}...
                </TransactionUrl>
              </div>
            </div>
            <div className="grid-two">
              <div className="detail b-right">
                <div className="title">Paid To</div>
                <div className="desc">{transactionData.numOfPeople} people</div>
              </div>
              <div className="detail">
                <div className="title">Status</div>
                <div className="desc">
                  <StatusText status={transactionData.status} />
                </div>
              </div>
            </div>
          </TransactionDetails>
        )}

        {!loading && state === STATES.EMPTY_STATE && (
          <GreyCard>
            <img src={TeamMembersPng} alt="teams" width="320" />
            <div className="card-subtitle text-center">
              You can add team members to set-up your teams and their payroll.
            </div>
          </GreyCard>
        )}

        {!loading &&
          state === STATES.TEAMMATES_ADDED &&
          teammates &&
          teammates.slice(0, 3).map((teammate) => {
            const { firstName, lastName } = getDecryptedDetails(teammate.data);
            return (
              <TeammateCard key={teammate.data}>
                <img src={TeamPng} alt="teams" width="32" />
                <div className="ml-3">
                  <div className="team-title">
                    {firstName} {lastName}
                  </div>
                  <div className="team-subtitle">{teammate.departmentName}</div>
                </div>
              </TeammateCard>
            );
          })}
      </Card>
    </div>
  );
}
