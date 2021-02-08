import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faMinus,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import Container from "react-bootstrap/Container";
import { useActiveWeb3React, useLocalStorage, useContract } from "hooks";
import ConnectButton from "components/Connect";
import { Card } from "components/common/Card";
import { useInjectReducer } from "utils/injectReducer";
import registerWizardReducer from "store/registerWizard/reducer";
import registerReducer from "store/register/reducer";
import { Background, InnerCard, Image, StepDetails, StepInfo } from "./styles";
import {
  makeSelectFormData,
  makeSelectStep,
} from "store/registerWizard/selectors";
import { chooseStep, updateForm } from "store/registerWizard/actions";
import { setOwnerDetails, setOwnersAndThreshold } from "store/global/actions";
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
import { getPublicKey } from "utils/encryption";
import addresses from "constants/addresses";
import GnosisSafeABI from "constants/abis/GnosisSafe.json";
import ProxyFactoryABI from "constants/abis/ProxyFactory.json";
import registerSaga from "store/register/saga";
import { makeSelectError as makeSelectRegisterError } from "store/register/selectors";
import { useInjectSaga } from "utils/injectSaga";
import { registerUser, createMetaTx } from "store/register/actions";
import { cryptoUtils } from "parcel-sdk";
import { MESSAGE_TO_SIGN, DEFAULT_GAS_PRICE } from "constants/index";
import Loading from "components/common/Loading";
import gasPriceSaga from "store/gas/saga";
import gasPriceReducer from "store/gas/reducer";
import { makeSelectAverageGasPrice } from "store/gas/selectors";
import { getGasPrice } from "store/gas/actions";
import NoReferralModal from "./NoReferralModal";
import ParcelLogo from "assets/images/parcel-logo-purple.png";

const { GNOSIS_SAFE_ADDRESS, PROXY_FACTORY_ADDRESS, ZERO_ADDRESS } = addresses;

const registerKey = "register";
const registerWizardKey = "registerWizard";
const gasPriceKey = "gas";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

const FLOWS = {
  COMPANY: "COMPANY",
  INDIVIDUAL_WITH_COMPANY: "INDIVIDUAL_WITH_COMPANY", // a temporary flow for company, till multi owner is supported
  INDIVIDUAL: "INDIVIDUAL",
};

const getStepsByFlow = (flow) => {
  switch (flow) {
    case FLOWS.COMPANY:
      return COMPANY_REGISTER_STEPS;
    case FLOWS.INDIVIDUAL:
    case FLOWS.INDIVIDUAL_WITH_COMPANY:
      return INDIVIDUAL_REGISTER_STEPS;
    default:
      return COMPANY_REGISTER_STEPS;
  }
};

const getStepsCountByFlow = (flow) => {
  switch (flow) {
    case FLOWS.COMPANY:
      return Object.keys(COMPANY_REGISTER_STEPS).length - 1;
    case FLOWS.INDIVIDUAL:
    case FLOWS.INDIVIDUAL_WITH_COMPANY:
      return Object.keys(INDIVIDUAL_REGISTER_STEPS).length - 1;
    default:
      return Object.keys(COMPANY_REGISTER_STEPS).length - 1;
  }
};

const COMPANY_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Owner Name/Address",
  [STEPS.FOUR]: "Payment Threshold",
  [STEPS.FIVE]: "Privacy",
};

const INDIVIDUAL_REGISTER_STEPS = {
  [STEPS.ZERO]: "Connect",
  [STEPS.ONE]: "About you",
  [STEPS.TWO]: "Owner Details",
  [STEPS.THREE]: "Privacy",
};

const Register = () => {
  const [sign, setSign] = useLocalStorage("SIGNATURE"); //eslint-disable-line
  const setEncryptionKey = useLocalStorage("ENCRYPTION_KEY")[1];
  const [loadingTx, setLoadingTx] = useState(false);
  const [createSafeLoading, setCreateSafeLoading] = useState(false);
  const [loadingAccount, setLoadingAccount] = useState(true);
  const [isMetaTxEnabled, setIsMetaTxEnabled] = useState(false);

  const { active, account, library } = useActiveWeb3React();
  // Reducers
  useInjectReducer({ key: registerWizardKey, reducer: registerWizardReducer });
  useInjectReducer({ key: registerKey, reducer: registerReducer });
  useInjectReducer({ key: gasPriceKey, reducer: gasPriceReducer });

  // Sagas
  useInjectSaga({ key: registerKey, saga: registerSaga });
  useInjectSaga({ key: gasPriceKey, saga: gasPriceSaga });

  // Route
  const location = useLocation();

  const dispatch = useDispatch();

  // Selectors
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const averageGasPrice = useSelector(makeSelectAverageGasPrice());
  const errorInRegister = useSelector(makeSelectRegisterError());

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
    if (!averageGasPrice)
      // get gas prices
      dispatch(getGasPrice());
  }, [dispatch, averageGasPrice]);

  useEffect(() => {
    let timer;
    if (!active) {
      timer = setTimeout(() => {
        dispatch(chooseStep(STEPS.ZERO));
        setLoadingAccount(false);
      }, 300);
    }
    if (active) {
      dispatch(chooseStep(STEPS.ONE));
      setLoadingAccount(false);
    }

    return () => clearTimeout(timer);
  }, [active, dispatch]);

  useEffect(() => {
    reset({
      flow: FLOWS.INDIVIDUAL,
      owners: [{ name: "", owner: account }],
      ...formData,
    });
  }, [reset, formData, account]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const referralId = searchParams.get("referralId");
    if (referralId) {
      dispatch(updateForm({ referralId }));
      setIsMetaTxEnabled(true);
    }
  }, [location, dispatch]); // eslint-disable-line

  useEffect(() => {
    if (errorInRegister) setLoadingTx(false);
  }, [errorInRegister]);

  const onSubmit = async (values) => {
    // console.log(values);
    dispatch(updateForm(values));
    // const lastStep = getStepsCountByFlow(formData.flow);
    if (
      (((formData.flow === FLOWS.INDIVIDUAL ||
        formData.flow === FLOWS.INDIVIDUAL_WITH_COMPANY) &&
        step === STEPS.TWO) ||
        (formData.flow === FLOWS.COMPANY && step === STEPS.FOUR)) &&
      !formData.referralId
    ) {
      try {
        await createSafe(values.threshold || 1); // ugly hack - TODO: Fix race condition and remove arg
        dispatch(chooseStep(step + 1));
      } catch (err) {
        console.error(err);
      }
    } else {
      dispatch(chooseStep(step + 1));
    }
  };

  const signTerms = useCallback(async () => {
    if (!!library && !!account) {
      try {
        await library
          .getSigner(account)
          .signMessage(MESSAGE_TO_SIGN)
          .then(async (signature) => {
            setSign(signature);
            if (formData.referralId)
              await createSafeWithMetaTransaction(signature);
            else {
              const encryptionKey = cryptoUtils.getEncryptionKey(
                signature,
                formData.safeAddress
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
                        owner: account,
                        name: cryptoUtils.encryptDataUsingEncryptionKey(
                          formData.name,
                          encryptionKey
                        ),
                      },
                    ];

              const publicKey = getPublicKey(signature);

              let encryptionKeyData;
              try {
                encryptionKeyData = await cryptoUtils.encryptUsingSignatures(
                  encryptionKey,
                  signature
                );
              } catch (error) {
                console.error(error);
                return;
              }

              const threshold = formData.threshold
                ? parseInt(formData.threshold)
                : 1;

              const body = {
                name: cryptoUtils.encryptDataUsingEncryptionKey(
                  formData.name,
                  encryptionKey
                ),
                safeAddress: formData.safeAddress,
                createdBy: account,
                owners: encryptedOwners,
                proxyData: {
                  from: account,
                  params: [GNOSIS_SAFE_ADDRESS, formData.creationData],
                },
                email: "",
                encryptionKeyData,
                publicKey,
                threshold,
              };
              dispatch(
                setOwnerDetails(formData.name, formData.safeAddress, account)
              );
              dispatch(setOwnersAndThreshold(encryptedOwners, threshold));
              dispatch(registerUser(body));
            }
          });
      } catch (error) {
        console.error("Transaction Failed");
      }
    }
  }, [library, account, setSign, dispatch, formData]); //eslint-disable-line

  const goBack = () => {
    dispatch(chooseStep(step - 1));
  };

  const createSafe = async (_threshold) => {
    if (gnosisSafeMasterContract && proxyFactory && account) {
      const ownerAddresses =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ owner }) => owner)
          : [account];

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

      // Execute normal transaction
      // Create Proxy
      const estimateGas = await proxyFactory.estimateGas.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData
      );

      const tx = await proxyFactory.createProxy(
        GNOSIS_SAFE_ADDRESS,
        creationData,
        {
          gasLimit: estimateGas,
          gasPrice: averageGasPrice || DEFAULT_GAS_PRICE,
        }
      );

      proxyFactory.once("ProxyCreation", (proxy) => {
        dispatch(
          updateForm({
            safeAddress: proxy,
            creationData,
          })
        );
      });

      setCreateSafeLoading(true);
      const result = await tx.wait();
      setCreateSafeLoading(false);
      console.log("tx success", result);
    }
  };

  const createSafeWithMetaTransaction = async (sign) => {
    let body;

    if (account && sign) {
      const ownerAddresses =
        formData.owners && formData.owners.length
          ? formData.owners.map(({ owner }) => owner)
          : [account];

      const threshold = formData.threshold ? Number(formData.threshold) : 1;
      // console.log({ threshold, ownerAddresses });

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

      // Execute Meta transaction

      setLoadingTx(true);
      // const publicKey = getPublicKey(sign);

      const metaTxBody = {
        referralId: formData.referralId,
        createdBy: account,
        proxyData: {
          from: account,
          params: [GNOSIS_SAFE_ADDRESS, creationData],
        },
      };

      dispatch(createMetaTx(metaTxBody));

      proxyFactory.once("ProxyCreation", async (proxy) => {
        if (proxy) {
          const publicKey = getPublicKey(sign);
          // set encryptionKey
          const encryptionKey = cryptoUtils.getEncryptionKey(sign, proxy);
          setEncryptionKey(encryptionKey);
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
                    owner: account,
                    name: cryptoUtils.encryptDataUsingEncryptionKey(
                      formData.name,
                      encryptionKey
                    ),
                  },
                ];

          body = {
            name: cryptoUtils.encryptDataUsingEncryptionKey(
              formData.name,
              encryptionKey
            ),
            referralId: formData.referralId,
            safeAddress: proxy,
            createdBy: account,
            owners: encryptedOwners,
            proxyData: {
              from: account,
              params: [GNOSIS_SAFE_ADDRESS, creationData],
            },
            email: "",
            encryptionKeyData,
            publicKey,
            threshold,
          };
          dispatch(registerUser(body));
          dispatch(setOwnerDetails(formData.name, proxy, account));
          dispatch(setOwnersAndThreshold(encryptedOwners, threshold));
          setLoadingTx(false);
          // history.push("/dashboard");
        }
      });
    }
  };

  const renderConnect = () => {
    return (
      <div>
        <Image minHeight="323px" />
        <InnerCard height="257px">
          <h2 className="text-center mb-4">
            <img src={ParcelLogo} alt="parcel" width="240" />
          </h2>
          <div className="mt-2 mb-4 text-center">
            Your one stop for crypto treasury management.
            <br />
            {!active && `Please connect your Ethereum wallet to proceed.`}
          </div>
          {loadingAccount && (
            <div className="d-flex align-items-center justify-content-center">
              <Loading color="primary" width="50px" height="50px" />
            </div>
          )}
          {!loadingAccount && (
            <ConnectButton large className="mx-auto d-block mt-3" />
          )}
        </InnerCard>
      </div>
    );
  };

  const renderStepHeader = () => {
    const steps = getStepsByFlow(formData.flow);
    return (
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
            <h3 className="title">Sign Up</h3>
            <p className="next">
              {steps[step + 1] ? `Next: ${steps[step + 1]}` : `Finish`}
            </p>
          </div>
          {step > STEPS.ONE && (
            <div className="step-progress">
              <CircularProgress
                current={step}
                max={getStepsCountByFlow(formData.flow)}
                color="#7367f0"
              />
            </div>
          )}
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
          className="my-3"
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

  const renderIndividualName = () => {
    return (
      <StepDetails>
        <Img
          src={CompanyPng}
          alt="company"
          className="my-3"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title">What is your Name</h3>
        <p className="subtitle">
          You’ll be registered with this name on Parcel.
        </p>
        <Input
          name="name"
          register={register}
          required={`Individual Name is required`}
          placeholder="John Doe"
        />
        <ErrorMessage name="name" errors={errors} />
        <Button
          large
          type="submit"
          className="mt-4"
          loading={createSafeLoading}
          disabled={createSafeLoading}
        >
          {isMetaTxEnabled ? `Proceed` : `Create Safe and Proceed`}
        </Button>
      </StepDetails>
    );
  };

  const renderIndividualWithCompanyName = () => {
    return (
      <StepDetails>
        <Img
          src={CompanyPng}
          alt="company"
          className="my-3"
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
          required={`Individual Name is required`}
          placeholder="John Doe"
        />
        <ErrorMessage name="name" errors={errors} />
        <Button
          large
          type="submit"
          className="mt-4"
          loading={createSafeLoading}
          disabled={createSafeLoading}
        >
          {isMetaTxEnabled ? `Proceed` : `Create Safe and Proceed`}
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
        <Button
          large
          type="submit"
          className="mt-3"
          loading={createSafeLoading}
          disabled={createSafeLoading}
        >
          {isMetaTxEnabled ? `Proceed` : `Create Safe and Proceed`}
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
          disabled={loadingTx}
          loading={loadingTx}
        >
          I'm in
        </Button>
        {loadingTx && (
          <div className="ml-2 my-3">
            Waiting for transaction confirmation...
          </div>
        )}
        {errorInRegister && (
          <div className="text-danger ml-2 my-3">{errorInRegister}</div>
        )}
      </StepDetails>
    );
  };

  const renderAboutYou = () => {
    return (
      <StepDetails>
        <Img
          src={CompanyPng}
          alt="individual"
          className="my-3"
          width="130px"
          style={{ minWidth: "130px" }}
        />
        <h3 className="title mb-4">What best defines you?</h3>
        <div
          className="row mr-4 align-items-center justify-content-between radio-toolbar"
          style={{ padding: "10px 16px 0" }}
        >
          <Input
            name={`flow`}
            register={register}
            type="radio"
            id={`flow-individual`}
            value={FLOWS.INDIVIDUAL}
            defaultChecked
            label={"I'm an Individual"}
            labelStyle={{ minWidth: "265px" }}
          />
          <Input
            name={`flow`}
            register={register}
            type="radio"
            id={`flow-company`}
            value={FLOWS.COMPANY}
            label={"I have a Company"}
            labelStyle={{ minWidth: "265px" }}
          />
        </div>

        <ErrorMessage name="flow" errors={errors} />
        <Button large type="submit" className="mt-4">
          Proceed
        </Button>
      </StepDetails>
    );
  };

  const renderSteps = () => {
    switch (step) {
      case STEPS.ZERO: {
        return renderConnect();
      }

      case STEPS.ONE: {
        return renderAboutYou();
      }

      case STEPS.TWO: {
        if (formData.flow === FLOWS.COMPANY) return renderCompanyName();
        else if (formData.flow === FLOWS.INDIVIDUAL_WITH_COMPANY)
          return renderIndividualWithCompanyName();
        else return renderIndividualName();
      }

      case STEPS.THREE: {
        if (formData.flow === FLOWS.COMPANY) return renderOwnerDetails();
        else return renderPrivacy();
      }

      case STEPS.FOUR: {
        return renderThreshold();
      }

      case STEPS.FIVE: {
        return renderPrivacy();
      }

      default:
        return null;
    }
  };

  return (
    <Background withImage minHeight="92vh">
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
      <NoReferralModal />
    </Background>
  );
};

export default Register;
