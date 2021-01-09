import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faLock,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { cryptoUtils } from "parcel-sdk";
import { utils } from "ethers";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage, useContract } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { useInjectReducer } from "utils/injectReducer";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
// import registerWizardReducer from "store/registerWizard/reducer";
import {
  makeSelectFormData,
  makeSelectStep,
  makeSelectFlow,
  makeSelectChosenSafeAddress,
  makeSelectLoading,
  makeSelectSafes,
  makeSelectCreatedBy,
} from "store/loginWizard/selectors";
import {
  chooseStep,
  updateForm,
  selectFlow,
  getSafes,
  getParcelSafes,
  fetchSafes,
  chooseSafe,
} from "store/loginWizard/actions";
import { makeSelectFlag } from "store/login/selectors";
import { setOwnerDetails } from "store/global/actions";
import Button from "components/common/Button";
import CircularProgress from "components/common/CircularProgress";
import { Input, ErrorMessage } from "components/common/Form";
import { useForm, useFieldArray } from "react-hook-form";
import Img from "components/common/Img";
import CompanyPng from "assets/images/register/company.png";
import OwnerPng from "assets/images/register/owner.png";
import ThresholdPng from "assets/images/register/threshold.png";
import PrivacyPng from "assets/images/register/privacy.png";
import { Error } from "components/common/Form/styles";

import addresses from "constants/addresses";
import { MESSAGE_TO_SIGN } from "constants/index";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import registerSaga from "store/register/saga";
import { useInjectSaga } from "utils/injectSaga";
import { loginUser } from "store/login/actions";
import { registerUser } from "store/register/actions";
import Loading from "components/common/Loading";
import TeamPng from "assets/images/user-team.png";
import ParcelLogo from "assets/images/parcel-logo-purple.png";

import {
  Background,
  InnerCard,
  Image,
  StepDetails,
  StepInfo,
  Safe,
  RetryText,
} from "./styles";

const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS, ZERO_ADDRESS } = addresses;

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
  [STEPS.THREE]: "Company Name",
  [STEPS.FOUR]: "Owner Name",
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

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });
  useInjectSaga({ key: registerKey, saga: registerSaga });

  const dispatch = useDispatch();

  // Selectors
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const safes = useSelector(makeSelectSafes());
  const createdBy = useSelector(makeSelectCreatedBy());
  const getSafesLoading = useSelector(makeSelectLoading());
  const flow = useSelector(makeSelectFlow());
  const chosenSafeAddress = useSelector(makeSelectChosenSafeAddress());
  const flag = useSelector(makeSelectFlag());

  // Form
  const { register, handleSubmit, errors, reset, control } = useForm();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  // Contracts
  const gnosisSafeMasterContract = useContract(
    GNOSIS_SAFE_ADDRESS,
    GnosisSafeABI,
    true
  );

  const proxyFactory = useContract(
    PROXY_FACTORY_ADDRESS,
    ProxyFactoryABI,
    true
  );

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

  const onSubmit = async (values) => {
    dispatch(updateForm(values));

    if (flow === FLOWS.IMPORT && step === getStepsCountByFlow(FLOWS.IMPORT)) {
      await signup(values.threshold);
    } else if (
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
    if (gnosisSafeMasterContract && proxyFactory && account) {
      // set encryptionKey
      const encryptionKey = cryptoUtils.getEncryptionKey(
        sign,
        chosenSafeAddress
      );
      const ownerAddresses =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ owner }) => owner)
          : [account];
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
      const creationData = gnosisSafeMasterContract.interface.encodeFunctionData(
        "setup",
        [
          ownerAddresses,
          threshold,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          ZERO_ADDRESS,
          0,
          ZERO_ADDRESS,
        ]
      );

      const body = {
        name: cryptoUtils.encryptDataUsingEncryptionKey(
          formData.name,
          encryptionKey
        ),
        safeAddress: chosenSafeAddress,
        createdBy: account,
        owners: encryptedOwners,
        proxyData: {
          from: account,
          params: [GNOSIS_SAFE_ADDRESS, creationData],
        },
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
        <h2 className="text-center mb-4">
          <img src={ParcelLogo} alt="parcel" width="240" />
        </h2>
        <div className="mt-2 mb-4 text-center">
          Your one stop for crypto payroll management.
          <br />
          {!active && `Please connect your Ethereum wallet to proceed.`}
        </div>
        {loadingAccount && (
          <div className="d-flex align-items-center justify-content-center mt-5">
            <Loading color="primary" width="50px" height="50px" />
          </div>
        )}

        {!loadingAccount &&
          (!active ? (
            <ConnectButton large className="mx-auto d-block" />
          ) : (
            <div className="row">
              <div className="col-6">
                <Button
                  type="button"
                  large
                  className="secondary"
                  onClick={() => handleSelectFlow(FLOWS.IMPORT_INDIVIDUAL)}
                  disabled
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
            <h3 className="title">Login</h3>
            <p className="next">
              {steps[step + 1] ? `Next: ${steps[step + 1]}` : `Finish`}
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
        <p className="subtitle">
          You’ll be registered with this name on Parcel.
        </p>
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
    return (
      <StepDetails>
        {fields.length === 1 && (
          <Img
            src={OwnerPng}
            alt="owner"
            className="my-2"
            width="130px"
            style={{ minWidth: "130px" }}
          />
        )}
        <h3 className="title">Owner Name & Address</h3>
        <p className="subtitle">You can add multiple owners</p>
        {fields.map(({ id, name, owner }, index) => {
          return (
            <div
              key={id}
              className="row mb-3 align-items-baseline"
              style={{ minHeight: "60px" }}
            >
              <div className="col-5">
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
              <div className="col-5">
                <Input
                  name={`owners[${index}].owner`}
                  register={register}
                  required={`Owner Address is required`}
                  pattern={{
                    value: /^0x[a-fA-F0-9]{40}$/g,
                    message: "Invalid Ethereum Address",
                  }}
                  placeholder="0x32Be...2D88"
                  defaultValue={owner}
                />
                {errors["owners"] &&
                  errors["owners"][index] &&
                  errors["owners"][index].owner && (
                    <Error>{errors["owners"][index].owner.message}</Error>
                  )}
              </div>
              <div className="px-1">
                {index === fields.length - 1 && (
                  <div>
                    <Button
                      type="button"
                      iconOnly
                      onClick={() => append({})}
                      style={{ backgroundColor: "#7367f0" }}
                      className="px-2 py-2"
                    >
                      <FontAwesomeIcon icon={faPlus} color="#fff" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="px-1">
                {fields.length > 1 && index === fields.length - 1 && (
                  <div>
                    <Button
                      type="button"
                      iconOnly
                      onClick={() => remove(index)}
                      style={{ backgroundColor: "#ff1c46" }}
                      className="px-2 py-2"
                    >
                      <FontAwesomeIcon icon={faMinus} color="#fff" />
                    </Button>
                  </div>
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
        <p className="subtitle">
          How many people should authorize transactions?
        </p>
        <div
          className="row mr-4 align-items-center radio-toolbar"
          style={{ padding: "10px 16px 0" }}
        >
          {formData.owners.map(({ owner }, index) => (
            <Input
              name={`threshold`}
              register={register}
              type="radio"
              id={`threshold${index}`}
              value={index + 1}
              defaultChecked={index === 0}
              label={index + 1}
              key={owner}
            />
          ))}
        </div>

        <ErrorMessage name="threshold" errors={errors} />
        <Button large type="submit" className="mt-3">
          Complete Import
        </Button>
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
                handleSelectSafe(name, safe, encryptionKeyData, createdBy)
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
