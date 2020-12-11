import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLink,
  faLongArrowAltLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { cryptoUtils } from "parcel-sdk";
import { useSelector, useDispatch } from "react-redux";

import { useLocalStorage } from "hooks";
import Button from "components/common/Button";
import { Card } from "components/common/Card";
import CopyButton from "components/common/Copy";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { viewTransactions } from "store/transactions/actions";
import {
  makeSelectTransactions,
  makeSelectLoading,
} from "store/transactions/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";
import { minifyAddress, TransactionUrl } from "components/common/Web3Utils";

import { Table, ActionItem } from "../People/styles";
import { Circle } from "components/Header/styles";
import { Info } from "components/Dashboard/styles";
import { StatusCircle, Container, Detail } from "./styles";

const { TableBody, TableHead, TableRow } = Table;

const transactionsKey = "transactions";

export default function Transactions() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const dispatch = useDispatch();

  const transactions = useSelector(makeSelectTransactions());
  const loading = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(viewTransactions(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress]);

  const goBack = () => {
    setSelectedTransaction(null);
  };

  const getDecryptedDetails = (data) => {
    if (!sign) return "";
    return JSON.parse(cryptoUtils.decryptData(data, sign));
  };

  const displayStatus = (status) => {
    switch (status) {
      case 0:
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "110px" }}
          >
            <div>Completed</div>
            <StatusCircle color="#3bd800" />
          </div>
        );

      case 1:
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "110px" }}
          >
            <div>Pending</div>
            <StatusCircle color="#f7e72e" />
          </div>
        );

      case 2:
        return (
          <div
            className="d-flex justify-content-between align-items-center"
            style={{ width: "110px" }}
          >
            <div>Failed</div>
            <StatusCircle color="#f71ea3" />
          </div>
        );

      default:
        return null;
    }
  };

  const renderTransactions = () => (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <Info>
        <div
          style={{
            maxWidth: "1200px",
          }}
          className="mx-auto"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <div>
                <div className="title">Transactions</div>
                <div className="subtitle">
                  Track your transaction status here
                </div>
              </div>
            </div>

            <Button iconOnly className="p-0">
              <ActionItem>
                <Circle>
                  <FontAwesomeIcon icon={faPlus} color="#fff" />
                </Circle>
                <div className="mx-3">
                  <div className="name">Export</div>
                </div>
              </ActionItem>
            </Button>
          </div>
        </div>
      </Info>

      <Container>
        <div>
          <TableHead>
            <div>Transaction Hash</div>
            <div>Total Amount</div>
            <div>Date & Time</div>
            <div>Status</div>
            <div></div>
          </TableHead>

          <TableBody>
            {loading ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                <Loading color="primary" width="50px" height="50px" />
              </div>
            ) : transactions && transactions.length > 0 ? (
              transactions.map(
                (
                  {
                    transactionId,
                    addresses,
                    transactionHash,
                    safeAddress,
                    to,
                    tokenValue,
                    tokenCurrency,
                    fiatValue,
                    fiatCurrency,
                    transactionFees,
                    status,
                    createdOn,
                  },
                  idx
                ) => {
                  return (
                    <TableRow key={`${transactionId}-${idx}`}>
                      <div>
                        <TransactionUrl hash={transactionHash}>
                          {minifyAddress(transactionHash)}
                        </TransactionUrl>
                      </div>
                      <div>
                        {tokenValue} {tokenCurrency} (US ${fiatValue})
                      </div>
                      <div>
                        {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
                      </div>
                      <div>{displayStatus(status)}</div>
                      <div
                        className="d-flex justify-content-end purple-text"
                        onClick={() =>
                          setSelectedTransaction({
                            transactionId,
                            addresses,
                            transactionHash,
                            safeAddress,
                            to,
                            tokenValue,
                            tokenCurrency,
                            fiatValue,
                            fiatCurrency,
                            transactionFees,
                            status,
                            createdOn,
                          })
                        }
                      >
                        VIEW
                      </div>
                    </TableRow>
                  );
                }
              )
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                No transactions found!
              </div>
            )}
          </TableBody>
        </div>
      </Container>
    </div>
  );

  const renderTransactionDetails = ({
    transactionId,
    transactionHash,
    safeAddress,
    to,
    fiatValue,
    transactionFees,
    status,
    createdOn,
  }) => {
    const paidTeammates = getDecryptedDetails(to);
    console.log({ paidTeammates });

    return (
      <div
        className="position-relative"
        style={{
          transition: "all 0.25s linear",
        }}
      >
        <Info>
          <div
            style={{
              maxWidth: "1200px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                {
                  <Button iconOnly className="p-0" onClick={goBack}>
                    <ActionItem>
                      <Circle>
                        <FontAwesomeIcon
                          icon={faLongArrowAltLeft}
                          color="#fff"
                        />
                      </Circle>
                      <div className="mx-3">
                        <div className="name">Back</div>
                      </div>
                    </ActionItem>
                  </Button>
                }
              </div>
            </div>
          </div>
        </Info>

        <Container>
          <div
            style={{
              position: "absolute",
              top: "-100px",
              left: "0",
              right: "0",
            }}
          >
            <TableHead col={3} style={{ width: "683px" }} className="mx-auto">
              <div>Full Name</div>
              <div>Disbursement</div>
              <div>Address</div>
            </TableHead>

            <TableBody
              className="mx-auto"
              style={{
                height: "220px",
                minHeight: "0",
                overflow: "auto",
                width: "683px",
              }}
            >
              {paidTeammates && paidTeammates.length > 0 ? (
                paidTeammates.map(
                  ({
                    firstName,
                    lastName,
                    address,
                    salaryAmount,
                    salaryToken,
                  }) => {
                    return (
                      <TableRow col={3} key={`${transactionId}-${address}`}>
                        <div>
                          {firstName} {lastName}
                        </div>
                        <div>
                          {salaryAmount} {salaryToken}
                        </div>
                        <div>{minifyAddress(address)}</div>
                      </TableRow>
                    );
                  }
                )
              ) : (
                <div
                  className="d-flex align-items-center justify-content-center"
                  style={{ height: "400px" }}
                >
                  No transactions found!
                </div>
              )}
            </TableBody>
          </div>
          <Card className="details-card">
            <div className="d-flex justify-content-between align-items-center">
              <div className="details-title">Details</div>
              <div className="d-flex justify-content-between align-items-center">
                <Detail style={{ borderRadius: "24px", width: "200px" }}>
                  <div className="title">Transaction Hash</div>
                  <div className="desc">{minifyAddress(transactionHash)}</div>
                </Detail>
                <Detail
                  style={{ borderRadius: "50%" }}
                  className="d-flex justify-content-center align-items-center ml-3"
                >
                  <CopyButton
                    id="address"
                    tooltip="transaction hash"
                    value={transactionHash}
                    size="lg"
                    color="#7367f0"
                  />
                </Detail>
                <Detail
                  style={{ borderRadius: "50%" }}
                  className="d-flex justify-content-center align-items-center ml-3"
                >
                  <TransactionUrl hash={transactionHash}>
                    <FontAwesomeIcon icon={faLink} size="lg" color="#7367f0" />
                  </TransactionUrl>
                </Detail>
              </div>
            </div>
            <div className="grid mt-4">
              <Detail style={{ width: "300px" }}>
                <div className="title">Paid From</div>
                <div className="desc">{minifyAddress(safeAddress)}</div>
              </Detail>
              <Detail style={{ width: "300px" }}>
                <div className="title">Paid To</div>
                <div className="desc">
                  {paidTeammates && paidTeammates.length} people
                </div>
              </Detail>
              <Detail style={{ width: "300px" }}>
                <div className="title">Total Amount</div>
                <div className="desc">US ${fiatValue}</div>
              </Detail>
              <Detail style={{ width: "300px" }}>
                <div className="title">Transaction Fees</div>
                <div className="desc">
                  {parseFloat(transactionFees).toFixed(2)} ETH
                </div>
              </Detail>
              <Detail style={{ width: "300px" }}>
                <div className="title">Created Date & Time</div>
                <div className="desc">
                  {format(new Date(createdOn), "dd/MM/yyyy HH:mm:ss")}
                </div>
              </Detail>
              <Detail style={{ width: "300px" }}>
                <div className="title">Status</div>
                <div className="desc">{displayStatus(status)}</div>
              </Detail>
            </div>
          </Card>
        </Container>
      </div>
    );
  };

  return !selectedTransaction
    ? renderTransactions()
    : renderTransactionDetails(selectedTransaction);
}
