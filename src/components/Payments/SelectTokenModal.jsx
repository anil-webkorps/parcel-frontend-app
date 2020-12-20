import React, { useState, useEffect } from "react";
import { Modal, ModalHeader } from "reactstrap";
import { connectModal as reduxModal } from "redux-modal";
import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { BigNumber } from "@ethersproject/bignumber";

import Button from "components/common/Button";
import { tokens } from "constants/index";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import dashboardReducer from "store/dashboard/reducer";
import marketRatesReducer from "store/market-rates/reducer";
import dashboardSaga from "store/dashboard/saga";
import marketRatesSaga from "store/market-rates/saga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { getSafeBalances } from "store/dashboard/actions";
import {
  makeSelectLoading,
  makeSelectBalances,
} from "store/dashboard/selectors";
import { makeSelectPrices } from "store/market-rates/selectors";
import { getMarketRates } from "store/market-rates/actions";
import Loading from "components/common/Loading";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
import DAIIcon from "assets/icons/tokens/DAI-icon.png";
import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import USDTIcon from "assets/icons/tokens/USDT-icon.png";

import { Title, Heading } from "../People/styles";
import { TokenCard } from "./styles";

export const MODAL_NAME = "select-token-modal";

const modalStyles = `
  .modal-content {
    border-radius: 20px;
    border: none;
    padding: 20px;
  }
`;

const defaultTokenDetails = [
  {
    id: 1,
    name: tokens.DAI,
    icon: DAIIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 2,
    name: tokens.USDC,
    icon: USDCIcon,
    balance: "0.00",
    usd: "0.00",
  },
  {
    id: 3,
    name: tokens.USDT,
    icon: USDTIcon,
    balance: "0.00",
    usd: "0.00",
  },
];

const dashboardKey = "dashboard";
const marketRatesKey = "marketRates";

function SelectTokenModal(props) {
  const {
    show,
    handleHide,
    selectedTokenDetails,
    setSelectedTokenDetails,
  } = props;
  // Reducers
  useInjectReducer({ key: dashboardKey, reducer: dashboardReducer });
  useInjectReducer({ key: marketRatesKey, reducer: marketRatesReducer });

  // Sagas
  useInjectSaga({ key: dashboardKey, saga: dashboardSaga });
  useInjectSaga({ key: marketRatesKey, saga: marketRatesSaga });

  const dispatch = useDispatch();

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const balances = useSelector(makeSelectBalances());
  const prices = useSelector(makeSelectPrices());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const [tokenName, setTokenName] = useState(tokens.DAI);
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);

  useEffect(() => {
    if (ownerSafeAddress && !balances) {
      dispatch(getSafeBalances(ownerSafeAddress));
    }
  }, [ownerSafeAddress, balances, dispatch]);
  useEffect(() => {
    if (!prices) dispatch(getMarketRates());
  }, [dispatch, prices]);

  useEffect(() => {
    if (selectedTokenDetails) setTokenName(selectedTokenDetails.name);
  }, [selectedTokenDetails]);

  const getDefaultIconIfPossible = (tokenSymbol) => {
    switch (tokenSymbol) {
      case "DAI":
        return DAIIcon;
      case "USDC":
        return USDCIcon;
      case "USDT":
        return USDTIcon;
      default:
        return null;
    }
  };

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
        setTokenDetails(allTokenDetails);
      }
    }
  }, [balances, prices]);

  const confirmToken = () => {
    setSelectedTokenDetails(
      tokenDetails.filter(({ name }) => name === tokenName)[0]
    );
    handleHide();
  };

  return (
    <Modal isOpen={show} centered>
      <style>{modalStyles}</style>
      <ModalHeader toggle={handleHide} style={{ borderBottom: "none" }}>
        <Title className="mb-2">Choose Token</Title>
        <Heading>Here is the list of all supported tokens</Heading>
      </ModalHeader>
      {loading && (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "400px" }}
        >
          <Loading color="primary" width="50px" height="50px" />
        </div>
      )}
      {!loading &&
        tokenDetails &&
        tokenDetails.map(({ balance, icon, id, name, usd }) => (
          <Row key={id}>
            <TokenCard
              active={tokenName === name}
              onClick={() => setTokenName(name)}
            >
              <div className="token-icon">
                <img src={icon} alt={name} width="35" />
              </div>
              <div>
                <div className="value">{parseFloat(balance).toFixed(2)}</div>
                <div className="text">{name}</div>
              </div>
              <div className="divider"></div>
              <div>
                <div className="value">US$ {parseFloat(usd).toFixed(2)}</div>
                <div className="text">Balance</div>
              </div>
              <div className="radio"></div>
              <div className="current">Selected</div>
            </TokenCard>
          </Row>
        ))}
      <Row className="mt-4">
        <Col lg="5" sm="12" className="pr-0">
          <Button
            large
            type="button"
            onClick={handleHide}
            className="secondary"
          >
            Back
          </Button>
        </Col>
        <Col lg="7" sm="12">
          <Button large type="button" onClick={confirmToken}>
            Confirm
          </Button>
        </Col>
      </Row>
    </Modal>
  );
}

export default reduxModal({ name: MODAL_NAME })(SelectTokenModal);
