import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";
import { BigNumber } from "@ethersproject/bignumber";

import { Info } from "components/Dashboard/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewDepartmentsReducer from "store/view-departments/reducer";
import { getDepartments } from "store/view-departments/actions";
import viewDepartmentsSaga from "store/view-departments/saga";
import viewTeammatesSaga from "store/view-teammates/saga";

import viewTeammatesReducer from "store/view-teammates/reducer";
import {
  getAllTeammates,
  getTeammatesByDepartment,
} from "store/view-teammates/actions";
import {
  makeSelectDepartments,
  makeSelectLoading as makeSelectDepartmentsLoading,
} from "store/view-departments/selectors";
import {
  makeSelectTeammates,
  makeSelectLoading as makeSelectTeammatesLoading,
} from "store/view-teammates/selectors";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { addTransaction } from "store/transactions/actions";
import marketRatesReducer from "store/market-rates/reducer";
import { getMarketRates } from "store/market-rates/actions";
import { makeSelectPrices } from "store/market-rates/selectors";
import marketRatesSaga from "store/market-rates/saga";
import dashboardReducer from "store/dashboard/reducer";
import { getSafeBalances } from "store/dashboard/actions";
import { makeSelectBalances } from "store/dashboard/selectors";
import dashboardSaga from "store/dashboard/saga";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { useLocalStorage, useMassPayout } from "hooks";
import { numToOrd } from "utils/date-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { minifyAddress } from "components/common/Web3Utils";
import Loading from "components/common/Loading";
import TeamPng from "assets/images/user-team.png";
import ETHIcon from "assets/icons/tokens/ETH-icon.png";

import {
  tokens,
  getDefaultIconIfPossible,
  defaultTokenDetails,
} from "constants/index";
import { Container, Table, PaymentSummary, TokenBalance } from "./styles";
import TransactionSubmitted from "./TransactionSubmitted";
import SelectTokenModal, {
  MODAL_NAME as SELECT_TOKEN_MODAL,
} from "./SelectTokenModal";

const { TableBody, TableHead, TableRow } = Table;

// reducer/saga keys
const viewTeammatesKey = "viewTeammates";
const viewDepartmentsKey = "viewDepartments";
const marketRatesKey = "marketRates";
const dashboardKey = "dashboard";
const transactionsKey = "transactions";

const TABS = {
  PEOPLE: "1",
  DEPARTMENT: "2",
};

const navStyles = `
  .nav-tabs {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border-bottom: solid 1px #f2f2f2;
    background-color: #ffffff;
  }

  .nav-link {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
    cursor: pointer;
    opacity: 0.4;
    padding-bottom: 15px;
    padding-top: 15px;
  }

  .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    border-bottom: 5px solid #7367f0;
  }

  .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {
    border: none;
    border-bottom: 5px solid #7367f0;
    opacity: 1;
  }

  .nav-link.active {
    opacity: 1;
    border: none;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
`;

export default function People() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const [checked, setChecked] = useState([]);
  const [isCheckedAll, setIsCheckedAll] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS.PEOPLE);
  // const [loadingTx, setLoadingTx] = useState(false);
  // const [txHash, setTxHash] = useState("");
  const { loadingTx, txHash, recievers, massPayout } = useMassPayout();
  const [selectedRows, setSelectedRows] = useState([]);
  const [departmentStep, setDepartmentStep] = useState(0);
  // const [payTokenBalanceInUSD, setPayTokenBalanceInUSD] = useState(0); // for now, this is DAI
  // const [payTokenBalance, setPayTokenBalance] = useState(0);
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });
  useInjectReducer({
    key: viewDepartmentsKey,
    reducer: viewDepartmentsReducer,
  });
  useInjectReducer({ key: marketRatesKey, reducer: marketRatesReducer });
  useInjectReducer({ key: dashboardKey, reducer: dashboardReducer });
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });
  useInjectSaga({ key: viewDepartmentsKey, saga: viewDepartmentsSaga });
  useInjectSaga({ key: marketRatesKey, saga: marketRatesSaga });
  useInjectSaga({ key: dashboardKey, saga: dashboardSaga });
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectDepartments());
  const loadingDepartments = useSelector(makeSelectDepartmentsLoading()); // eslint-disable-line
  const loadingTeammates = useSelector(makeSelectTeammatesLoading()); // eslint-disable-line
  const teammates = useSelector(makeSelectTeammates());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const prices = useSelector(makeSelectPrices());
  const balances = useSelector(makeSelectBalances());

  useEffect(() => {
    dispatch(getMarketRates());
  }, [dispatch]);

  useEffect(() => {
    dispatch(getSafeBalances(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    setSelectedTokenDetails(
      tokenDetails.filter(({ name }) => name === tokens.DAI)[0]
    );
  }, [tokenDetails]);

  useEffect(() => {
    // reset to initial state
    setSelectedRows([]);
    setChecked([]);
    setIsCheckedAll(false);
    if (activeTab === TABS.PEOPLE) {
      dispatch(getAllTeammates(ownerSafeAddress));
    } else {
      setDepartmentStep(0);
      dispatch(getDepartments(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, activeTab]);

  useEffect(() => {
    if (teammates && teammates.length > 0) {
      setChecked(new Array(teammates.length).fill(false));
    }
  }, [teammates]);

  const totalAmountToPay = useMemo(() => {
    if (prices) {
      return selectedRows.reduce(
        (total, { salaryAmount, salaryToken }) =>
          (total += prices[salaryToken] * salaryAmount),
        0
      );
    }

    return selectedRows.reduce(
      (total, { salaryAmount }) => (total += Number(salaryAmount)),
      0
    );
  }, [prices, selectedRows]);

  useEffect(() => {
    if (txHash) {
      setSubmittedTx(true);
      if (
        encryptionKey &&
        recievers &&
        ownerSafeAddress &&
        totalAmountToPay &&
        selectedTokenDetails
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(recievers),
          encryptionKey
        );
        // const to = selectedTeammates;

        dispatch(
          addTransaction({
            to,
            safeAddress: ownerSafeAddress,
            createdBy: ownerSafeAddress,
            transactionHash: txHash,
            tokenValue: totalAmountToPay,
            tokenCurrency: selectedTokenDetails.name,
            fiatValue: totalAmountToPay,
            addresses: recievers.map(({ address }) => address),
          })
        );
      }
    }
  }, [
    txHash,
    encryptionKey,
    recievers,
    dispatch,
    ownerSafeAddress,
    totalAmountToPay,
    selectedTokenDetails,
  ]);

  useEffect(() => {
    if (balances && balances.length > 0 && prices) {
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
            const tokenIcon = getDefaultIconIfPossible(bal.token.symbol);

            return {
              id: idx,
              name: bal.token && bal.token.symbol,
              icon: tokenIcon ? tokenIcon : bal.token.logoUri,
              balance,
              usd: bal.token
                ? balance * prices[bal.token.symbol]
                : balance * prices["ETH"],
            };
          }
          // eth
          else if (bal.balance) {
            seenTokens[tokens.ETH] = true;
            return {
              id: idx,
              name: tokens.ETH,
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
        setTokenDetails(allTokenDetails);
      }
    }
  }, [balances, prices]);

  const isNoneChecked = useMemo(() => checked.every((check) => !check), [
    checked,
  ]);

  const getDecryptedDetails = (data) => {
    if (!encryptionKey) return "";
    return JSON.parse(
      cryptoUtils.decryptDataUsingEncryptionKey(data, encryptionKey)
    );
  };

  const handleMassPayout = async (selectedTeammates) => {
    await massPayout(selectedTeammates, selectedTokenDetails.name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log({ selectedRows });

    await handleMassPayout(selectedRows);
  };

  const handleCheckAll = (e) => {
    if (checked.every((check) => check)) {
      // deselect all
      setChecked(new Array(checked.length).fill(false));
      setIsCheckedAll(false);
      setSelectedRows([]);
    } else {
      // select all
      setChecked(new Array(checked.length).fill(true));
      setIsCheckedAll(true);
      if (teammates && teammates.length > 0) {
        const allRows = teammates.map(({ data }) => getDecryptedDetails(data));
        setSelectedRows(allRows);
      }
    }
  };

  const handleChecked = (e, teammateDetails, index) => {
    const newChecked = [...checked];
    newChecked[index] = !checked[index];
    setChecked(newChecked);
    // if checked, push the details, provided it doesn't already exist in the array
    // else remove the unselected details from the array
    if (
      e.target.checked &&
      !selectedRows.some((row) => row.address === teammateDetails.address)
    ) {
      setSelectedRows([...selectedRows, teammateDetails]);
    } else {
      setSelectedRows(
        selectedRows.filter((row) => row.address !== teammateDetails.address)
      );
    }
  };

  const handleSelectDepartment = (departmentId) => {
    if (ownerSafeAddress && departmentId) {
      dispatch(getTeammatesByDepartment(ownerSafeAddress, departmentId));
      setDepartmentStep(departmentStep + 1);
      setSelectedRows([]);
    }
  };

  const goBackToDepartments = () => {
    setDepartmentStep(departmentStep - 1);
  };

  const getSelectedCount = () => {
    return checked.filter(Boolean).length;
  };

  const showTokenModal = () => {
    dispatch(
      show(SELECT_TOKEN_MODAL, {
        selectedTokenDetails,
        setSelectedTokenDetails,
      })
    );
  };

  const renderPayTable = () => {
    if (!teammates.length)
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          No Teammates Found!
        </div>
      );

    return (
      <div>
        <TableHead>
          <div className="form-check d-flex">
            <input
              className="form-check-input position-static mr-3"
              type="checkbox"
              id="allCheckbox"
              checked={isCheckedAll}
              onChange={handleCheckAll}
            />
            <div>Employee Name</div>
          </div>
          <div>Department</div>
          {/* <div>Pay Token</div> */}
          <div>Pay Amount</div>
          <div>Address</div>
          <div></div>
        </TableHead>
        <TableBody>
          {teammates.length > 0 &&
            teammates.map(({ data, departmentName }, idx) => {
              const {
                firstName,
                lastName,
                salaryAmount,
                salaryToken,
                address,
              } = getDecryptedDetails(data);
              return (
                <TableRow key={`${address}-${idx}`}>
                  <div className="form-check d-flex">
                    <input
                      className="form-check-input position-static mr-3"
                      type="checkbox"
                      id={`checkbox${idx}`}
                      name={`checkbox${idx}`}
                      checked={checked[idx] || false}
                      onChange={(e) => {
                        const teammateDetails = {
                          firstName,
                          lastName,
                          salaryToken,
                          salaryAmount,
                          address,
                        };
                        handleChecked(e, teammateDetails, idx);
                      }}
                    />
                    <div>
                      {firstName} {lastName}
                    </div>
                  </div>
                  <div>{departmentName}</div>
                  {/* <div>{salaryToken}</div> */}
                  <div>
                    <img
                      src={getDefaultIconIfPossible(salaryToken)}
                      alt={salaryToken}
                      width="16"
                    />{" "}
                    {salaryAmount} {salaryToken} (US$
                    {prices ? prices[salaryToken] * salaryAmount : 0})
                  </div>
                  <div>{minifyAddress(address)}</div>
                  <div className="text-right">
                    {checked.filter(Boolean).length <= 1 && (
                      <Button
                        type="submit"
                        iconOnly
                        disabled={!checked[idx] || loadingTx || isNoneChecked}
                        className="py-0"
                      >
                        <span className="pay-text">PAY</span>
                      </Button>
                    )}
                  </div>
                </TableRow>
              );
            })}
        </TableBody>
      </div>
    );
  };

  const renderDepartments = () => {
    if (!allDepartments || !allDepartments.length) {
      return (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          No Departments Found!
        </div>
      );
    }
    return (
      <div className="department-cards">
        {allDepartments &&
          allDepartments.map(
            ({ departmentId, name, payCycleDate, employees }) => (
              <Card
                className="department-card mb-4"
                key={departmentId}
                onClick={() => handleSelectDepartment(departmentId)}
              >
                <div className="upper">
                  <div className="d-flex justify-content-between">
                    <img src={TeamPng} alt={name} width="50" />
                    <div className="circle circle-grey">
                      <FontAwesomeIcon
                        icon={faLongArrowAltRight}
                        color="#7367f0"
                      />
                    </div>
                  </div>
                  <div className="mt-2">{name}</div>
                </div>

                <div className="line" />
                <div className="lower">
                  <div className="mb-3">Employees : {employees}</div>
                  <div>Paydate : {numToOrd(payCycleDate)} of every month</div>
                </div>
              </Card>
            )
          )}
      </div>
    );
  };

  const renderPaymentSummary = () => {
    const insufficientBalance =
      selectedTokenDetails.usd - totalAmountToPay > 0 ? false : true;
    return (
      <PaymentSummary>
        <div className="payment-info">
          <div>
            <div className="payment-title">Total Selected</div>
            <div className="payment-subtitle">{getSelectedCount()} people</div>
          </div>
          <div>
            <div className="payment-title">Total Amount</div>
            <div className="payment-subtitle">US$ {totalAmountToPay}</div>
          </div>
          <div>
            <div className="payment-title">Balance after payment</div>
            <div className="payment-subtitle">
              {!insufficientBalance
                ? `US$ ${parseFloat(
                    selectedTokenDetails.usd - totalAmountToPay
                  ).toFixed(2)}`
                : `Insufficient Balance`}
            </div>
          </div>
        </div>

        <div className="pay-button">
          <Button
            type="submit"
            large
            loading={loadingTx}
            disabled={loadingTx || insufficientBalance}
          >
            Pay Now
          </Button>
        </div>
      </PaymentSummary>
    );
  };

  return !submittedTx ? (
    <div
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <div>
        <Info>
          <div
            style={{
              maxWidth: "1200px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="title">Payments</div>
                <div className="subtitle">
                  You can instantly pay or manage team payrolls
                </div>
              </div>
              {!selectedTokenDetails && (
                <TokenBalance>
                  <div className="d-flex align-items-center justify-content-center">
                    <Loading color="primary" width="50px" height="50px" />
                  </div>
                </TokenBalance>
              )}
              {selectedTokenDetails && (
                <TokenBalance onClick={showTokenModal}>
                  <div className="token-icon">
                    <img
                      src={selectedTokenDetails.icon}
                      alt="token"
                      width="45"
                    />
                  </div>
                  <div className="balance-info">
                    <div className="balance-text">
                      Paying from {selectedTokenDetails.name}
                    </div>
                    <div className="balance-value">
                      {parseFloat(selectedTokenDetails.balance).toFixed(2)}{" "}
                      {selectedTokenDetails.name} (US$
                      {parseFloat(selectedTokenDetails.usd).toFixed(2)})
                    </div>
                  </div>
                  <div className="separator"></div>
                  <div className="change-text">CHANGE</div>
                </TokenBalance>
              )}
              <SelectTokenModal />
            </div>
          </div>
        </Info>
        <Container
          style={{
            maxWidth: "1200px",
            transition: "all 0.25s linear",
          }}
        >
          <form onSubmit={onSubmit}>
            <style>{navStyles}</style>
            <Card style={{ minHeight: "532px" }} className="pt-3">
              <Nav tabs>
                <NavItem className="px-3">
                  <NavLink
                    className={`${activeTab === TABS.PEOPLE ? "active" : ""}`}
                    onClick={() => toggle(TABS.PEOPLE)}
                  >
                    People
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${
                      activeTab === TABS.DEPARTMENT ? "active" : ""
                    }`}
                    onClick={() => toggle(TABS.DEPARTMENT)}
                  >
                    Department
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={TABS.PEOPLE}>
                  {loadingTeammates && (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: "400px" }}
                    >
                      <Loading color="primary" width="50px" height="50px" />
                    </div>
                  )}
                  {!loadingTeammates && teammates && renderPayTable()}
                </TabPane>
                <TabPane tabId={TABS.DEPARTMENT}>
                  {(loadingDepartments || loadingTeammates) && (
                    <div
                      className="d-flex align-items-center justify-content-center"
                      style={{ height: "400px" }}
                    >
                      <Loading color="primary" width="50px" height="50px" />
                    </div>
                  )}

                  {!loadingTeammates &&
                    !loadingDepartments &&
                    (departmentStep === 0 ? (
                      renderDepartments()
                    ) : (
                      <div>
                        <Button iconOnly onClick={goBackToDepartments}>
                          <div className="circle">
                            <FontAwesomeIcon
                              icon={faLongArrowAltLeft}
                              color="#fff"
                            />
                          </div>
                        </Button>
                        {teammates && renderPayTable()}
                      </div>
                    ))}
                </TabPane>
              </TabContent>

              {!isNoneChecked && renderPaymentSummary()}
            </Card>
          </form>
        </Container>
      </div>
    </div>
  ) : (
    <TransactionSubmitted txHash={txHash} selectedCount={getSelectedCount()} />
  );
}
