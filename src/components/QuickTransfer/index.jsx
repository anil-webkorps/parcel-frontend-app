import React, { useEffect, useState, useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { BigNumber } from "@ethersproject/bignumber";
import { cryptoUtils } from "parcel-sdk";
import { show } from "redux-modal";

import TransactionSubmitted from "components/Payments/TransactionSubmitted";
import { Info } from "components/Dashboard/styles";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import Img from "components/common/Img";
import {
  Input,
  ErrorMessage,
  TextArea,
  SelectTokenDropdown,
} from "components/common/Form";
import { useMassPayout, useLocalStorage } from "hooks";
import transactionsReducer from "store/transactions/reducer";
import transactionsSaga from "store/transactions/saga";
import { addTransaction } from "store/transactions/actions";
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
  // makeSelectError,
} from "store/dashboard/selectors";
import { makeSelectPrices } from "store/market-rates/selectors";
import Loading from "components/common/Loading";
import { getMarketRates } from "store/market-rates/actions";
import {
  tokens,
  getDefaultIconIfPossible,
  defaultTokenDetails,
} from "constants/index";
import SelectTokenModal, {
  MODAL_NAME as SELECT_TOKEN_MODAL,
} from "components/Payments/SelectTokenModal";

import ETHIcon from "assets/icons/tokens/ETH-icon.png";
// import DAIIcon from "assets/icons/tokens/DAI-icon.png";
// import USDCIcon from "assets/icons/tokens/USDC-icon.png";
import {
  Container,
  Title,
  Heading,
  StepsCard,
  ActionItem,
} from "components/People/styles";
import { ShowToken } from "./styles";
import { Circle } from "components/Header/styles";

const dashboardKey = "dashboard";
const marketRatesKey = "marketRates";
const transactionsKey = "transactions";

export default function QuickTransfer() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const { txHash, loadingTx, massPayout } = useMassPayout();
  const [submittedTx, setSubmittedTx] = useState(false);
  const [selectedTokenDetails, setSelectedTokenDetails] = useState();
  // eslint-disable-next-line
  const [selectedTokenName, setSelectedTokenName] = useState(tokens.DAI);
  const [tokenDetails, setTokenDetails] = useState(defaultTokenDetails);
  const [payoutDetails, setPayoutDetails] = useState(null);

  // Reducers
  useInjectReducer({ key: dashboardKey, reducer: dashboardReducer });
  useInjectReducer({ key: marketRatesKey, reducer: marketRatesReducer });
  useInjectReducer({ key: transactionsKey, reducer: transactionsReducer });

  // Sagas
  useInjectSaga({ key: dashboardKey, saga: dashboardSaga });
  useInjectSaga({ key: marketRatesKey, saga: marketRatesSaga });
  useInjectSaga({ key: transactionsKey, saga: transactionsSaga });

  const { register, errors, handleSubmit, formState, control } = useForm({
    mode: "onChange",
  });

  const dispatch = useDispatch();
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const history = useHistory();

  // Selectors
  const loading = useSelector(makeSelectLoading());
  const balances = useSelector(makeSelectBalances());
  const prices = useSelector(makeSelectPrices());

  useEffect(() => {
    if (selectedTokenName)
      setSelectedTokenDetails(
        tokenDetails.filter(({ name }) => name === selectedTokenName)[0]
      );
  }, [tokenDetails, selectedTokenName]);

  useEffect(() => {
    if (ownerSafeAddress) {
      dispatch(getSafeBalances(ownerSafeAddress));
    }
  }, [ownerSafeAddress, dispatch]);

  useEffect(() => {
    dispatch(getMarketRates());
  }, [dispatch]);

  const totalAmountToPay = useMemo(() => {
    if (prices && payoutDetails && payoutDetails.length > 0) {
      return payoutDetails.reduce(
        (total, { salaryAmount, salaryToken }) =>
          (total += prices[salaryToken] * salaryAmount),
        0
      );
    }

    return 0;
  }, [prices, payoutDetails]);

  useEffect(() => {
    if (txHash) {
      setSubmittedTx(true);
      if (
        encryptionKey &&
        payoutDetails &&
        ownerSafeAddress &&
        totalAmountToPay &&
        selectedTokenDetails
      ) {
        const to = cryptoUtils.encryptDataUsingEncryptionKey(
          JSON.stringify(payoutDetails),
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
            addresses: payoutDetails.map(({ address }) => address),
            transactionMode: 1, // quick transfer
          })
        );
      }
    }
  }, [
    txHash,
    encryptionKey,
    payoutDetails,
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

  const onSubmit = async (values) => {
    const payoutDetails = [
      {
        address: values.address,
        salaryAmount: values.amount,
        salaryToken: values.currency.value,
        description: values.description || "",
      },
    ];
    setPayoutDetails(payoutDetails);
    await massPayout(payoutDetails, selectedTokenDetails.name);
  };

  const goBack = () => {
    history.goBack();
  };

  const showTokenModal = () => {
    dispatch(
      show(SELECT_TOKEN_MODAL, {
        selectedTokenDetails,
        setSelectedTokenDetails,
      })
    );
  };

  const renderTransferDetails = () => (
    <Card className="quick-transfer">
      <Title className="mb-4">Quick Fund Transfer</Title>
      <Heading>PAYING FROM</Heading>

      {loading && (
        <ShowToken>
          <Loading color="#7367f0" />
        </ShowToken>
      )}

      {!loading && selectedTokenDetails && (
        <ShowToken onClick={showTokenModal}>
          <div>
            <Img src={selectedTokenDetails.icon} alt="token icon" width="36" />
          </div>
          <div className="token-balance">
            <div className="value">
              {selectedTokenDetails.balance
                ? parseFloat(selectedTokenDetails.balance).toFixed(2)
                : "0.00"}
            </div>
            <div className="name">{selectedTokenDetails.name}</div>
          </div>
          <div className="change">Change</div>
        </ShowToken>
      )}

      <Heading>PAYING TO</Heading>
      <Row className="mb-3">
        <Col lg="12">
          <Input
            type="text"
            name="address"
            register={register}
            required={`Wallet Address is required`}
            pattern={{
              value: /^0x[a-fA-F0-9]{40}$/,
              message: "Invalid Ethereum Address",
            }}
            placeholder="Wallet Address"
          />
          <ErrorMessage name="address" errors={errors} />
        </Col>
      </Row>

      <Row className="mb-4">
        <Col lg="6" sm="12">
          <Input
            type="number"
            name="amount"
            register={register}
            required={`Amount is required`}
            placeholder="Amount"
          />
          <ErrorMessage name="amount" errors={errors} />
        </Col>
        <Col lg="6" sm="12">
          {/* <Select
            name="currency"
            register={register}
            required={`Token is required`}
            options={[
              { name: "DAI", value: "DAI" },
              { name: "USDC", value: "USDC" },
            ]}
          /> */}
          <Controller
            name="currency"
            control={control}
            rules={{ required: true }}
            as={SelectTokenDropdown}
          />
          <ErrorMessage name="currency" errors={errors} />
        </Col>
      </Row>

      <Heading>DESCRIPTION (Optional)</Heading>
      <Row className="mb-3">
        <Col lg="12">
          <TextArea
            name="description"
            register={register}
            placeholder="Paid 500 DAI to John Doe..."
            rows="5"
            cols="50"
          />
        </Col>
      </Row>

      <Button
        large
        type="submit"
        style={{ marginTop: "50px" }}
        disabled={!formState.isValid || loadingTx}
        loading={loadingTx}
      >
        Send
      </Button>
    </Card>
  );

  const renderQuickTransfer = () => {
    return (
      <form onSubmit={handleSubmit(onSubmit)}>
        <StepsCard>{renderTransferDetails()}</StepsCard>
      </form>
    );
  };

  return !submittedTx ? (
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
          <Button iconOnly className="p-0" onClick={goBack}>
            <ActionItem>
              <Circle>
                <FontAwesomeIcon icon={faLongArrowAltLeft} color="#fff" />
              </Circle>
              <div className="mx-3">
                <div className="name">Back</div>
              </div>
            </ActionItem>
          </Button>
        </div>
      </Info>

      <Container
        style={{
          maxWidth: "1200px",
          transition: "all 0.25s linear",
        }}
      >
        {renderQuickTransfer()}
      </Container>
      <SelectTokenModal />
    </div>
  ) : (
    <TransactionSubmitted txHash={txHash} selectedCount={1} />
  );
}
