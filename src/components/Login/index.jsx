import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { cryptoUtils } from "parcel-sdk";
import { utils } from "ethers";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { useInjectReducer } from "utils/injectReducer";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
import {
  makeSelectFormData,
  makeSelectStep,
  makeSelectFlow,
  makeSelectChosenSafeAddress,
  makeSelectLoading,
  makeSelectSafes,
  makeSelectCreatedBy,
  makeSelectGnosisSafeOwners,
  makeSelectGnosisSafeThreshold,
  makeSelectFetchingSafeDetails,
} from "store/loginWizard/selectors";
import {
  chooseStep,
  updateForm,
  selectFlow,
  getSafes,
  getParcelSafes,
  fetchSafes,
  chooseSafe,
  getSafeOwners,
} from "store/loginWizard/actions";
import { makeSelectFlag } from "store/login/selectors";
import { setOwnerDetails } from "store/global/actions";
import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";
import { Input, ErrorMessage } from "components/common/Form";
import { useForm, useFieldArray } from "react-hook-form";
import Img from "components/common/Img";
import CompanyPng from "assets/images/register/company.png";
// import OwnerPng from "assets/images/register/owner.png";
import ThresholdPng from "assets/images/register/threshold.png";
import PrivacyPng from "assets/images/register/privacy.png";
import { Error } from "components/common/Form/styles";
import { getPublicKey } from "utils/encryption";

import { MESSAGE_TO_SIGN } from "constants/index";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import registerReducer from "store/register/reducer";
import registerSaga from "store/register/saga";
import {
  makeSelectError as makeSelectRegisterError,
  makeSelectLoading as makeSelectLoadingRegister,
} from "store/register/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { loginUser } from "store/login/actions";
import { registerUser } from "store/register/actions";
import Loading from "components/common/Loading";
import TeamPng from "assets/images/user-team.png";

import {
  Background,
  InnerCard,
  Image,
  StepDetails,
  StepInfo,
  Safe,
  RetryText,
} from "./styles";

const loginKey = "login";
const loginWizardKey = "loginWizard";
const registerKey = "register";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

const FLOWS = {
  IMPORT: "IMPORT",
  LOGIN: "LOGIN",
  IMPORT_INDIVIDUAL: "IMPORT_INDIVIDUAL",
};

const getStepsByFlow = (flow) => {
  switch (flow) {
    case FLOWS.IMPORT:
      return IMPORT_STEPS;
    case FLOWS.LOGIN:
      return LOGIN_STEPS;
    case FLOWS.IMPORT_INDIVIDUAL:
      return IMPORT_INDIVIDUAL_STEPS;
    default:
      return LOGIN_STEPS;
  }
};

const getStepsCountByFlow = (flow) => {
  switch (flow) {
    case FLOWS.IMPORT:
      return Object.keys(IMPORT_STEPS).length - 1;
    case FLOWS.LOGIN:
      return Object.keys(LOGIN_STEPS).length - 1;
    case FLOWS.IMPORT_INDIVIDUAL:
      return Object.keys(IMPORT_INDIVIDUAL_STEPS).length - 1;
    default:
      return Object.keys(LOGIN_STEPS).length - 1;
  }
};
const LOGIN_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Choose Safe",
};

const IMPORT_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Choose Safe",
  [STEPS.THREE]: "Owner Address/Name",
  [STEPS.FOUR]: "Owner Details",
  [STEPS.FIVE]: "Threshold",
};

const IMPORT_INDIVIDUAL_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Privacy",
  [STEPS.TWO]: "Choose Safe",
  [STEPS.THREE]: "Company Name",
};

const Login = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");
  const [encryptionKey, setEncryptionKey] = useLocalStorage("ENCRYPTION_KEY"); // eslint-disable-line
  const [hasAlreadySigned, setHasAlreadySigned] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [finalSubmitted, setFinalSubmitted] = useState(false);
  const [safeDetails, setSafeDetails] = useState([]);

  const { active, account, library } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });
  useInjectReducer({ key: registerKey, reducer: registerReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });
  useInjectSaga({ key: registerKey, saga: registerSaga });

  const dispatch = useDispatch();
  const location = useLocation();

  // Selectors
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const safes = useSelector(makeSelectSafes());
  const createdBy = useSelector(makeSelectCreatedBy());
  const getSafesLoading = useSelector(makeSelectLoading());
  const flow = useSelector(makeSelectFlow());
  const chosenSafeAddress = useSelector(makeSelectChosenSafeAddress());
  const flag = useSelector(makeSelectFlag());
  const fetching = useSelector(makeSelectFetchingSafeDetails());
  const gnosisSafeOwners = useSelector(makeSelectGnosisSafeOwners());
  const gnosisSafeThreshold = useSelector(makeSelectGnosisSafeThreshold());
  const errorInRegister = useSelector(makeSelectRegisterError());
  const creating = useSelector(makeSelectLoadingRegister());

  // Form
  const { register, handleSubmit, errors, reset, control } = useForm();
  const { fields } = useFieldArray({
    control,
    name: "owners",
  });

  useEffect(() => {
    let timer;
    if (!active) {
      timer = setTimeout(() => {
        dispatch(chooseStep(STEPS.ZERO));
        setLoadingAccount(false);
      }, 300);
    }
    if (active) setLoadingAccount(false);

    return () => clearTimeout(timer);
  }, [active, dispatch]);

  useEffect(() => {
    dispatch(chooseStep(STEPS.ZERO)); // start from beginning, when component mounts
  }, [dispatch]);

  useEffect(() => {
    reset({
      owners: [{ name: "", owner: account }],
      ...formData,
    });
  }, [reset, formData, account]);

  useEffect(() => {
    reset({
      owners: gnosisSafeOwners.map((owner) => ({ name: "", owner })),
      ...formData,
    });
  }, [reset, gnosisSafeOwners, formData]);

  useEffect(() => {
    if (step === STEPS.ONE && account) {
      if (sign) {
        const msgHash = utils.hashMessage(MESSAGE_TO_SIGN);
        const recoveredAddress = utils.recoverAddress(msgHash, sign);
        if (recoveredAddress === account) {
          setHasAlreadySigned(true);
        }
      }
      dispatch(fetchSafes(account));
    }
    if (step === STEPS.TWO && account) {
      if (flow === FLOWS.IMPORT || flow === FLOWS.IMPORT_INDIVIDUAL) {
        dispatch(getSafes(account));
      } else {
        dispatch(getParcelSafes(account));
      }
    }
  }, [step, dispatch, account, sign, flow]);

  useEffect(() => {
    if (step === STEPS.THREE && flow === FLOWS.IMPORT) {
      dispatch(getSafeOwners(chosenSafeAddress));
    }
  }, [step, dispatch, chosenSafeAddress, flow]);

  useEffect(() => {
    if (finalSubmitted) {
      signup(1); // one owner
    }
  }, [finalSubmitted]); //eslint-disable-line

  useEffect(() => {
    // when an address is clicked in import flow,
    // the login api is called, and it returns
    // 145 => user not registered with parcel
    // In this case, we take them through the register flow (with existing safe)
    if (flag === 145) {
      // dispatch(selectFlow(FLOWS.IMPORT));
      dispatch(selectFlow(FLOWS.IMPORT_INDIVIDUAL)); // remove this line later
      dispatch(chooseStep(STEPS.THREE));
      // goNext();
    }
  }, [flag, dispatch]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralId = searchParams.get("referralId");
    if (referralId) {
      dispatch(updateForm({ referralId }));
    }
  }, [location, dispatch]);

  const completeImport = async () => {
    await signup(gnosisSafeThreshold);
  };

  const onSubmit = async (values) => {
    dispatch(updateForm(values));

    if (
      flow === FLOWS.IMPORT_INDIVIDUAL &&
      step === getStepsCountByFlow(FLOWS.IMPORT_INDIVIDUAL)
    ) {
      setFinalSubmitted(true);
      // await signup(1); // only one owner
    } else {
      goNext();
    }
  };

  const signTerms = useCallback(async () => {
    if (!!library && !!account) {
      try {
        await library
          .getSigner(account)
          .signMessage(MESSAGE_TO_SIGN)
          .then((signature) => {
            setSign(signature);
            goNext();
          });
      } catch (error) {
        console.error("Transaction Failed");
      }
    }
  }, [library, account, setSign, dispatch, formData]); //eslint-disable-line

  const goBack = () => {
    dispatch(chooseStep(step - 1));
  };

  const goNext = () => {
    dispatch(chooseStep(step + 1));
  };

  const signup = async (_threshold) => {
    // let body;
    if (account) {
      // set encryptionKey
      const encryptionKey = cryptoUtils.getEncryptionKey(
        sign,
        chosenSafeAddress
      );
      // set encryptionKey
      setEncryptionKey(encryptionKey);

      const encryptedOwners =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ name, owner }) => ({
              name: cryptoUtils.encryptDataUsingEncryptionKey(
                name,
                encryptionKey
              ),
              owner,
            }))
          : [
              {
                name: cryptoUtils.encryptDataUsingEncryptionKey(
                  formData.name,
                  encryptionKey
                ),
                owner: account,
              },
            ];

      const threshold = formData.threshold
        ? parseInt(formData.threshold)
        : _threshold;

      const publicKey = getPublicKey(sign);

      let encryptionKeyData;
      try {
        encryptionKeyData = await cryptoUtils.encryptUsingSignatures(
          encryptionKey,
          sign
        );
      } catch (error) {
        console.error(error);
        return;
      }

      const body = {
        name: cryptoUtils.encryptDataUsingEncryptionKey(
          formData.name,
          encryptionKey
        ),
        safeAddress: chosenSafeAddress,
        createdBy: account,
        owners: encryptedOwners,
        referralId: formData.referralId,
        threshold,
        publicKey,
        encryptionKeyData,
      };

      dispatch(setOwnerDetails(formData.name, chosenSafeAddress, account));
      dispatch(registerUser(body));
    }
  };

  const handleSelectFlow = (flow) => {
    dispatch(selectFlow(flow));
    goNext();
  };

  const renderConnect = () => (
    <div>
      <Image minHeight="323px" />
      <InnerCard height="257px">
        <h2 className="text-center">Welcome to Parcel</h2>
        <div className="pb-5 mt-2 text-center">
          Please connect your Ethereum wallet to proceed.
        </div>
        {loadingAccount && (
          <div className="d-flex align-items-center justify-content-center mt-5">
            <Loading color="primary" width="50px" height="50px" />
          </div>
        )}

        {!loadingAccount &&
          (!active ? (
            <ConnectButton large className="mx-auto d-block mt-3" />
          ) : (
            <div className="row mt-3">
              <div className="col-6">
                <Button
                  type="button"
                  large
                  className="secondary"
                  onClick={() => handleSelectFlow(FLOWS.IMPORT)}
                  disabled={!formData.referralId}
                >
                  Import Existing Safe
                </Button>
              </div>
              <div className="col-6">
                <Button
                  type="button"
                  large
                  onClick={() => handleSelectFlow(FLOWS.LOGIN)}
                >
                  Login
                </Button>
              </div>
            </div>
          ))}
      </InnerCard>
    </div>
  );

  const renderStepHeader = () => {
    const steps = getStepsByFlow(flow);
    return (
      <div>
        <div style={{ height: "50px", padding: "8px 32px" }}>
          <Button iconOnly onClick={goBack} className="px-0">
            <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
          </Button>
        </div>
        <StepInfo>
          <div>
            <h3 className="title">
              {flow === FLOWS.LOGIN ? `Login` : `Import`}
            </h3>
            <p className="next">
              {steps[step + 1] ? `NEXT: ${steps[step + 1]}` : `Finish`}
            </p>
          </div>
          <div className="step-progress">
            <CircularProgress
              current={step}
              max={getStepsCountByFlow(flow)}
              color="#7367f0"
            />
          </div>
        </StepInfo>
      </div>
    );
  };

  const renderCompanyName = () => {
    return (
      <StepDetails>
        <Img
          src={CompanyPng}
          alt="company"
          className="my-4"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title">What is your Company Name</h3>
        <p className="subtitle">You’ll be known by this name on Parcel.</p>
        <Input
          name="name"
          register={register}
          required={`Company Name is required`}
          placeholder="Awesome Company Inc"
        />
        <ErrorMessage name="name" errors={errors} />
        <Button large type="submit" className="mt-4">
          Proceed
        </Button>
      </StepDetails>
    );
  };

  const renderOwnerDetails = () => {
    if (fetching) {
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="50px" height="50px" />
        </div>
      );
    }
    return (
      <StepDetails>
        <h3 className="title">Owner Name & Address</h3>
        <p className="subtitle">Please enter the name of the owners</p>
        {fields.map(({ id, name, owner }, index) => {
          return (
            <div
              key={id}
              className="row mb-3 align-items-baseline"
              style={{ minHeight: "60px" }}
            >
              <div className="col-4 pr-0">
                <Input
                  name={`owners[${index}].name`}
                  register={register}
                  required={`Owner Name is required`}
                  placeholder="John Doe"
                  defaultValue={name}
                />
                {errors["owners"] &&
                  errors["owners"][index] &&
                  errors["owners"][index].name && (
                    <Error>{errors["owners"][index].name.message}</Error>
                  )}
              </div>
              <div className="col-8">
                <Input
                  name={`owners[${index}].owner`}
                  register={register}
                  required={`Owner Address is required`}
                  pattern={{
                    value: /^0x[a-fA-F0-9]{40}$/g,
                    message: "Invalid Ethereum Address",
                  }}
                  defaultValue={owner}
                  className="default-address"
                />
                {errors["owners"] &&
                  errors["owners"][index] &&
                  errors["owners"][index].owner && (
                    <Error>{errors["owners"][index].owner.message}</Error>
                  )}
              </div>
            </div>
          );
        })}

        <Button large type="submit" className="mt-3">
          Add Owners
        </Button>
      </StepDetails>
    );
  };

  const renderThreshold = () => {
    return (
      <StepDetails>
        <Img
          src={ThresholdPng}
          alt="threshold"
          className="my-2"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title">Threshold</h3>
        <p className="subtitle pb-5">
          Any transaction requires the confirmation of {gnosisSafeThreshold} out
          of {gnosisSafeOwners && gnosisSafeOwners.length} owners.
        </p>
        <Button
          large
          type="button"
          onClick={completeImport}
          loading={creating}
          disabled={creating}
          className="mt-5"
        >
          Complete Import
        </Button>
        {errorInRegister && (
          <div className="text-danger ml-2 my-3">{errorInRegister}</div>
        )}
      </StepDetails>
    );
  };

  const renderPrivacy = () => {
    return (
      <StepDetails>
        <Img
          src={PrivacyPng}
          alt="privacy"
          className="my-2"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title">We care for Your Privacy </h3>

        {!hasAlreadySigned ? (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              Please sign this message using your private key and authorize
              Parcel.
            </p>
            <Button
              type="button"
              onClick={signTerms}
              large
              className="mx-auto d-block"
            >
              I'm in
            </Button>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <p className="subtitle mb-5 pb-5">
              You have already authorized Parcel. Simply click Next to continue.
            </p>
            <Button
              type="button"
              onClick={goNext}
              large
              className="mx-auto d-block"
            >
              Next
            </Button>
          </React.Fragment>
        )}
      </StepDetails>
    );
  };

  const getEncryptionKey = async (data, sign) => {
    const encryptionKey = await cryptoUtils.decryptUsingSignatures(data, sign);
    return encryptionKey;
  };

  const getSafeDetails = useCallback(async () => {
    if (!safes || !safes.length) {
      setSafeDetails([]);
      return;
    }

    const safeDetails = [];

    for (let i = 0; i < safes.length; i++) {
      if (flow === FLOWS.IMPORT || flow === FLOWS.IMPORT_INDIVIDUAL) {
        safeDetails.push({
          safe: safes[i],
          name: "Gnosis Safe User",
          balance: "0",
          encryptionKeyData: "",
          createdBy,
        });
      } else {
        const encryptionKey = await getEncryptionKey(
          safes[i].encryptionKeyData,
          sign
        );

        safeDetails.push({
          safe: safes[i].safeAddress,
          name: cryptoUtils.decryptDataUsingEncryptionKey(
            safes[i].name,
            encryptionKey
          ),
          balance: "0",
          encryptionKeyData: safes[i].encryptionKeyData,
          createdBy,
        });
      }
    }
    setSafeDetails(safeDetails);

    return safeDetails;
  }, [createdBy, flow, safes, sign]);

  useEffect(() => {
    if (step === STEPS.TWO) {
      getSafeDetails();
    }
  }, [step, getSafeDetails]);

  const handleSelectSafe = async (name, safe, encryptionKeyData, createdBy) => {
    dispatch(chooseSafe(safe));
    dispatch(setOwnerDetails(name, safe, createdBy));

    if (sign) {
      const encryptionKey = await getEncryptionKey(encryptionKeyData, sign);
      setEncryptionKey(encryptionKey);
    }

    dispatch(loginUser(safe));
  };

  const handleImportSelectedSafe = async (safe) => {
    dispatch(chooseSafe(safe));
    goNext();
  };

  const handleRefetch = useCallback(() => {
    if (flow === FLOWS.IMPORT || flow === FLOWS.IMPORT_INDIVIDUAL) {
      dispatch(getSafes(account, 1)); // 1 => get safes from gnosis api
    } else {
      dispatch(getParcelSafes(account));
    }
  }, [dispatch, account, flow]);

  const renderSafes = () => {
    if (getSafesLoading)
      return (
        <div className="d-flex align-items-center justify-content-center mt-5">
          <Loading color="primary" width="50px" height="50px" />
        </div>
      );
    if (!safes.length)
      return (
        <div className="text-center my-5">
          <p className="mb-4">Oops, no safe found...</p>
          <Button
            to="/signup"
            style={{ maxWidth: "200px" }}
            className="mx-auto mb-5"
          >
            Sign Up
          </Button>

          <RetryText onClick={handleRefetch}>Safe not loaded?</RetryText>
        </div>
      );

    return (
      <StepDetails>
        <h3 className="title">Choose Safe</h3>
        <p className="subtitle">
          Select the safe with which you would like to continue
        </p>
        {safeDetails &&
          safeDetails.map(({ safe, name, balance, encryptionKeyData }) => (
            <Safe
              key={safe}
              onClick={() =>
                encryptionKeyData
                  ? handleSelectSafe(name, safe, encryptionKeyData, createdBy)
                  : handleImportSelectedSafe(safe)
              }
            >
              <div className="top">
                <div className="details">
                  <div className="icon">
                    <img src={TeamPng} alt="user" width="50" />
                  </div>
                  <div className="info">
                    <div className="desc">Name</div>
                    <div className="val">{name}</div>
                  </div>
                </div>
                {/* <div className="details">
                <div className="icon">
                  <FontAwesomeIcon icon={faWallet} color="#aaa" />
                </div>
                <div className="info">
                  <div className="desc">Balance</div>
                  <div className="val">{balance} ETH</div>
                </div>
              </div> */}
              </div>

              <div className="bottom">
                <div className="details">
                  <div className="icon">
                    <FontAwesomeIcon icon={faLock} color="#aaa" />
                  </div>
                  <div className="info">
                    <div className="desc">Address</div>
                    <div className="val">{safe}</div>
                  </div>
                </div>
              </div>

              <div className="select-safe">
                <Button iconOnly onClick={goBack} className="px-0">
                  <FontAwesomeIcon icon={faArrowRight} color="#fff" />
                </Button>
              </div>
            </Safe>
          ))}
        <RetryText onClick={handleRefetch}>Safe not loaded?</RetryText>
      </StepDetails>
    );
  };

  const renderSteps = () => {
    switch (step) {
      case STEPS.ZERO: {
        return renderConnect();
      }

      case STEPS.ONE: {
        return renderPrivacy();
      }

      case STEPS.TWO: {
        return renderSafes();
      }

      case STEPS.THREE: {
        if (flow === FLOWS.IMPORT) return renderOwnerDetails();
        if (flow === FLOWS.IMPORT_INDIVIDUAL) return renderCompanyName();
        return null;
      }

      case STEPS.FOUR: {
        if (flow === FLOWS.IMPORT) return renderCompanyName();
        return null;
      }

      case STEPS.FIVE: {
        if (flow === FLOWS.IMPORT) return renderThreshold();
        return null;
      }

      default:
        return null;
    }
  };

  return (
    <Background withImage minHeight="92vh" className="py-3">
      <Container>
        <Card
          className="mx-auto"
          style={{
            maxWidth: "668px",
            minHeight: "580px",
          }}
        >
          {step !== STEPS.ZERO && renderStepHeader()}
          <form onSubmit={handleSubmit(onSubmit)}>{renderSteps()}</form>
        </Card>
      </Container>
    </Background>
  );
};

export default Login;
