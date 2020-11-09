import React, { useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faArrowRight,
  faLock,
  faMinus,
  faPlus,
  faUser,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage, useContract } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
// import CreateSafeForm from "./CreateSafeForm";
// import AuthorizeButton from "../AuthorizeButton";
import { useInjectReducer } from "utils/injectReducer";
import loginWizardReducer from "store/loginWizard/reducer";
import loginReducer from "store/login/reducer";
import {
  Background,
  InnerCard,
  Image,
  StepDetails,
  StepInfo,
  Safe,
} from "./styles";
import {
  makeSelectFormData,
  makeSelectStep,
  makeSelectSelectedSafe,
  makeSelectLoading,
  makeSelectSafes,
  makeSelectError,
} from "store/loginWizard/selectors";
import {
  chooseStep,
  updateForm,
  selectSafe,
  getSafes,
} from "store/loginWizard/actions";
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
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";
import loginSaga from "store/login/saga";
import loginWizardSaga from "store/loginWizard/saga";
import { useInjectSaga } from "utils/injectSaga";
import { loginUser } from "store/login/actions";
import { makeSelectShouldRedirect } from "store/login/selectors";
import { cryptoUtils } from "parcel-sdk";

const loginKey = "login";
const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS } = addresses;

const loginWizardKey = "loginWizard";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
};

const LOGIN_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "Choose Safe",
  [STEPS.TWO]: "Privacy",
  // [STEPS.THREE]: "Payment Threshold",
  // [STEPS.FOUR]: "Privacy",
};

const Login = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE");

  const { active, account, library } = useActiveWeb3React();

  // Reducers
  useInjectReducer({ key: loginWizardKey, reducer: loginWizardReducer });
  useInjectReducer({ key: loginKey, reducer: loginReducer });

  // Sagas
  useInjectSaga({ key: loginKey, saga: loginSaga });
  useInjectSaga({ key: loginWizardKey, saga: loginWizardSaga });

  // Router
  const history = useHistory();
  const location = useLocation();

  const dispatch = useDispatch();

  // Selectors
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const shouldRedirect = useSelector(makeSelectShouldRedirect());
  const safes = useSelector(makeSelectSafes());
  const selectedSafe = useSelector(makeSelectSelectedSafe());
  const getSafesLoading = useSelector(makeSelectLoading());
  const getSafesError = useSelector(makeSelectError());
  // const loading = useSelector(makeSelectLoading());

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
    // if (active && step === STEPS.ZERO) dispatch(chooseStep(step + 1));
    if (!active) dispatch(chooseStep(STEPS.ZERO));
  }, [active, dispatch, step]);

  useEffect(() => {
    if (shouldRedirect) history.push("/dashboard");
  }, [shouldRedirect, history]);

  useEffect(() => {
    reset({
      owners: [{ name: "", owner: account }],
      ...formData,
    });
  }, [reset, formData, account]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralId = searchParams.get("referralId");
    if (referralId) dispatch(updateForm({ referralId }));
  }, [location, dispatch]); // eslint-disable-line

  const onSubmit = async (values) => {
    // console.log(values);
    dispatch(updateForm(values));
    dispatch(chooseStep(step + 1));
  };

  useEffect(() => {
    if (step === STEPS.ONE && account) {
      dispatch(getSafes(account));
    }
  }, [step, dispatch, account]);

  const signTerms = useCallback(async () => {
    if (!!library && !!account) {
      try {
        await library
          .getSigner(account)
          .signMessage(`sign your ${account} to create encryption key`)
          .then((signature) => {
            setSign(signature);
            dispatch(loginUser(selectedSafe));
          })
          .then(() => history.push("/dashboard"));
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

  const createSafe = async (_threshold) => {
    // let body;
    if (gnosisSafeMasterContract && proxyFactory && account) {
      const ownerAddresses = formData.owners.map(({ owner }) => owner);

      const threshold = formData.threshold
        ? parseInt(formData.threshold)
        : _threshold;
      console.log({ ownerAddresses, threshold });
      const creationData = gnosisSafeMasterContract.interface.encodeFunctionData(
        "setup",
        [
          ownerAddresses,
          threshold,
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          "0x0000000000000000000000000000000000000000",
          0,
          "0x0000000000000000000000000000000000000000",
        ]
      );

      console.log({ ownerAddresses, threshold, creationData });

      // Execute normal transaction
      // Create Proxy
      const estimateGas = await proxyFactory.estimateGas.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData
      );

      const tx = await proxyFactory.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData,
        { gasLimit: estimateGas, gasPrice: "10000000000" }
      );

      proxyFactory.once("ProxyCreation", (proxy) => {
        console.log({ proxy });
        dispatch(
          updateForm({
            safeAddress: proxy,
            creationData,
          })
        );
      });

      const result = await tx.wait();
      console.log("tx success", result);
    }
  };

  const renderConnect = () => (
    <div>
      <Image minHeight="323px" />
      <InnerCard height="257px">
        <h2 className="text-center">Welcome to Parcel</h2>
        <div className="mb-4 text-center">
          Your one stop for crypto payroll management.
          <br />
          Please connect your Ethereum wallet to proceed.
        </div>
        {!active ? (
          <ConnectButton large className="mx-auto d-block" />
        ) : (
          <div className="row">
            <div className="col-6">
              <Button large secondary>
                Import Existing Safe
              </Button>
            </div>
            <div className="col-6">
              <Button large>Login</Button>
            </div>
          </div>
        )}
      </InnerCard>
    </div>
  );

  const renderStepHeader = () => (
    <div>
      <div style={{ height: "50px", padding: "8px 32px" }}>
        {step > 1 && (
          <Button iconOnly onClick={goBack} className="px-0">
            <FontAwesomeIcon icon={faArrowLeft} color="#aaa" />
          </Button>
        )}
      </div>
      <StepInfo>
        <div>
          <h3 className="title">Login</h3>
          <p className="next">
            {LOGIN_STEPS[step + 1]
              ? `NEXT: ${LOGIN_STEPS[step + 1]}`
              : `Finish`}
          </p>
        </div>
        <div className="step-progress">
          <CircularProgress current={step} max={2} color="#7367f0" />
        </div>
      </StepInfo>
    </div>
  );

  const renderCompanyName = () => {
    return (
      <StepDetails>
        <Img
          src={CompanyPng}
          alt="company"
          className="my-2"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title">What is your Company Name</h3>
        <p className="subtitle">You’ll be know by this name on Parcel.</p>
        <Input
          name="name"
          register={register}
          required={`Company Name is required`}
          placeholder="Awesome Company Inc"
        />
        <ErrorMessage name="name" errors={errors} />
        <Button large type="submit" className="mt-3">
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
          Proceed
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
        <p className="subtitle mb-5 pb-5">
          Please sign this message using your private key and authorize Parcel.
        </p>

        <Button
          type="button"
          onClick={signTerms}
          large
          className="mx-auto d-block"
        >
          I'm in
        </Button>
      </StepDetails>
    );
  };

  const safeDetails = useMemo(() => {
    return safes.reduce((details, safe) => {
      // get name and balance from the api or from SC
      return details.concat({
        safe,
        name: "Parcel Safe",
        balance: "1",
      });
    }, []);
  }, [safes]);

  const handleSelectSafe = (safe) => {
    dispatch(selectSafe(safe));
    goNext();
  };

  const renderSafes = () => {
    if (getSafesLoading)
      return <div className="text-center my-5">Loading...</div>;
    if (!safes.length)
      return (
        <div className="text-center my-5">
          <p className="mb-4">Oops, no safe found...</p>
          <Button to="/">Sign Up</Button>
        </div>
      );

    return (
      <StepDetails>
        <h3 className="title">Choose Safe</h3>
        <p className="subtitle">
          Select the safe with which you would like to continue
        </p>
        {safeDetails.map(({ safe, name, balance }) => (
          <Safe key={safe} onClick={() => handleSelectSafe(safe)}>
            <div className="top">
              <div className="details">
                <div className="icon">
                  <FontAwesomeIcon icon={faUser} color="#aaa" />
                </div>
                <div className="info">
                  <div className="desc">Name</div>
                  <div className="val">{name}</div>
                </div>
              </div>
              <div className="details">
                <div className="icon">
                  <FontAwesomeIcon icon={faWallet} color="#aaa" />
                </div>
                <div className="info">
                  <div className="desc">Balance</div>
                  <div className="val">{balance} ETH</div>
                </div>
              </div>
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
      </StepDetails>
    );
  };

  return (
    <Background withImage minHeight="92vh" className="py-3">
      <Container>
        <Card className="mx-auto" style={{ backgroundColor: "#fff" }}>
          {step !== STEPS.ZERO && renderStepHeader()}
          <form onSubmit={handleSubmit(onSubmit)}>
            {step === STEPS.ZERO && renderConnect()}
            {step === STEPS.ONE && renderSafes()}
            {step === STEPS.TWO && renderPrivacy()}
          </form>
          {/* <div>
            {hasSigned ? (
              <div>
                <InnerCard height="80px" disabled>
                  <div className="row justify-content-between align-items-center mx-2">
                    <div>Authorization</div>
                    <div className="my-3">Successful</div>
                  </div>
                </InnerCard>
                <InnerCard height="420px">
                  <div className="my-2">
                    Please enter the details and create the Gnosis Safe:
                  </div>
                  <CreateSafeForm />
                </InnerCard>
              </div>
            ) : (
              <InnerCard height="500px">
                <div className="my-4">
                  Please sign this message using your private key and authorize
                  Parcel.
                </div>
                <SignButton
                  setSign={setSign}
                  large
                  className="mx-auto d-block mt-3"
                />
              </InnerCard>
            )}
          </div> */}
        </Card>
      </Container>
    </Background>
  );
};

export default Login;
