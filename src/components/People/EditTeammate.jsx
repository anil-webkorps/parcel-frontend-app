import React, { useCallback, useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm, Controller } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage, CurrencyInput } from "components/common/Form";
import addTeammateReducer from "store/add-teammate/reducer";
import { useLocalStorage } from "hooks";
import {
  chooseStep,
  updateForm,
  chooseDepartment,
  editTeammate,
  getDepartmentById,
} from "store/add-teammate/actions";
import addTeammateSaga from "store/add-teammate/saga";
import {
  makeSelectStep,
  makeSelectFormData,
  makeSelectChosenDepartment,
  makeSelectPeopleId,
} from "store/add-teammate/selectors";
import viewDepartmentsReducer from "store/view-departments/reducer";
import { getDepartments } from "store/view-departments/actions";
import viewDepartmentsSaga from "store/view-departments/saga";
import { makeSelectDepartments } from "store/view-departments/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import TeamPng from "assets/images/user-team.png";

import {
  Container,
  Title,
  Heading,
  ChooseDepartment,
  StepsCard,
  PayrollCard,
  DoneCard,
  Departments,
  Summary,
  ActionItem,
} from "./styles";

import { Circle } from "components/Header/styles";

const STEPS = {
  ZERO: 0,
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
  SIX: 6,
};

const ADD_SINGLE_TEAMMATE_STEPS = {
  [STEPS.ZERO]: "Edit Teammate",
  [STEPS.ONE]: "Choose Team",
  [STEPS.TWO]: "Summary",
};

const addTeammateKey = "addTeammate";
const viewDepartmentsKey = "viewDepartments";

export default function EditTeammate() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
  const [toggled] = useContext(SideNavContext);

  const [success, setSuccess] = useState(false);

  const { register, errors, handleSubmit, reset, formState, control } = useForm(
    {
      mode: "onChange",
    }
  );

  useInjectReducer({ key: addTeammateKey, reducer: addTeammateReducer });
  useInjectReducer({
    key: viewDepartmentsKey,
    reducer: viewDepartmentsReducer,
  });

  useInjectSaga({ key: viewDepartmentsKey, saga: viewDepartmentsSaga });

  useInjectSaga({ key: addTeammateKey, saga: addTeammateSaga });

  const dispatch = useDispatch();
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const chosenDepartment = useSelector(makeSelectChosenDepartment());
  const allDepartments = useSelector(makeSelectDepartments());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const organisationType = useSelector(makeSelectOrganisationType());
  const peopleId = useSelector(makeSelectPeopleId());

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    reset({
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      address: formData.address || "",
      amount: formData.amount || "",
    });
  }, [reset, formData]);

  useEffect(() => {
    if (step === STEPS.ONE) {
      dispatch(getDepartments(ownerSafeAddress));
    }
  }, [step, ownerSafeAddress, dispatch]);

  useEffect(() => {
    if (!chosenDepartment) dispatch(chooseStep(STEPS.ZERO));
  }, [dispatch, chosenDepartment]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const departmentId = searchParams.get("departmentId");
    if (departmentId) {
      dispatch(chooseStep(STEPS.ZERO));
      dispatch(getDepartmentById(ownerSafeAddress, departmentId));
    } else {
      dispatch(chooseDepartment(null));
    }
  }, [dispatch, location, ownerSafeAddress]);

  const onSubmit = (values) => {
    if (chosenDepartment) {
      dispatch(chooseStep(step + 2));
    } else {
      dispatch(chooseStep(step + 1));
    }
    dispatch(updateForm({ ...formData, ...values }));
  };

  const onChangeDepartmentClicked = () => {
    dispatch(chooseStep(step + 1));
  };

  const onSelectDepartment = (chosenDepartment) => {
    dispatch(chooseDepartment(chosenDepartment));
    dispatch(chooseStep(STEPS.ZERO));
    history.push(
      `${location.pathname}?departmentId=${chosenDepartment.departmentId}`
    );
  };

  const goBack = () => {
    history.goBack();
  };

  const resetAll = useCallback(() => {
    reset({
      firstName: "",
      lastName: "",
      address: "",
      amount: "",
    });
    dispatch(updateForm(null));
    setSuccess(false);
    dispatch(chooseStep(STEPS.ZERO));
    dispatch(chooseDepartment(null));
  }, [dispatch, reset]);

  useEffect(() => {
    return () => resetAll();
  }, [resetAll]);

  const onViewAllClick = () => {
    resetAll();
    history.push("/dashboard/people/view");
  };

  const handleEditTeammate = () => {
    if (!encryptionKey || !ownerSafeAddress) return;
    console.log({ formData });
    const encryptedEmployeeDetails = cryptoUtils.encryptDataUsingEncryptionKey(
      JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        salaryAmount: formData.amount,
        address: formData.address,
        joiningDate: Date.now(),
      }),
      encryptionKey,
      organisationType
    );

    const body = {
      encryptedEmployeeDetails,
      safeAddress: ownerSafeAddress,
      createdBy: ownerSafeAddress,
      departmentId: chosenDepartment.departmentId,
      departmentName: chosenDepartment.name,
      joiningDate: Date.now(),
      peopleId: peopleId,
    };

    dispatch(editTeammate(body));
    setSuccess(true);
  };

  const renderTeammateDetails = () => (
    <Card className="add-teammate">
      <Title className="mb-4">Edit Teammate</Title>
      <Heading>PERSONAL DETAILS</Heading>
      <Row className="mb-4">
        <Col lg="6" sm="12">
          <Input
            type="text"
            name="firstName"
            register={register}
            required={`First Name is required`}
            placeholder="First Name"
          />
          <ErrorMessage name="firstName" errors={errors} />
        </Col>
        <Col lg="6" sm="12">
          <Input
            type="text"
            name="lastName"
            register={register}
            placeholder="Last Name"
          />
          <ErrorMessage name="lastName" errors={errors} />
        </Col>
      </Row>

      <Heading>PAYMENT DETAILS</Heading>
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
        <Col lg="12" sm="12">
          <Controller
            control={control}
            name="amount"
            rules={{
              required: "Amount is required",
              validate: (value) => {
                if (value <= 0) return "Please check your input";
                return true;
              },
            }}
            render={({ onChange, value }) => (
              <CurrencyInput
                type="number"
                name="amount"
                required={`Amount is required`}
                value={value}
                onChange={onChange}
                showUsdOnly={true}
              />
            )}
          />
          <ErrorMessage name="amount" errors={errors} />
        </Col>
      </Row>

      <Heading>TEAM</Heading>
      {!chosenDepartment ? (
        <ChooseDepartment type="submit">
          <div>
            <div className="choose-title">Choose Team</div>
            <div className="choose-subtitle mt-2">Choose a team</div>
          </div>
          <div className="p-0">
            <div
              className="circle p-0 m-0"
              style={{ width: "36px", height: "36px" }}
            >
              <FontAwesomeIcon icon={faLongArrowAltRight} color="#fff" />
            </div>
          </div>
        </ChooseDepartment>
      ) : (
        <ChooseDepartment onClick={onChangeDepartmentClicked}>
          <div className="d-flex align-items-center">
            <div className="text-left mr-2">
              <img src={TeamPng} alt={chosenDepartment.name} width="50" />
            </div>
            <Title className="choosen-dept">{chosenDepartment.name}</Title>
          </div>
          <div className="choose-title">EDIT</div>
        </ChooseDepartment>
      )}

      <Button
        large
        type="submit"
        className="mt-4"
        disabled={!formState.isValid}
      >
        Next
      </Button>
    </Card>
  );

  const renderChooseDepartment = () => {
    return (
      <Card className="choose-department">
        <Title>Choose Team</Title>
        <Heading>You can choose an existing team.</Heading>
        <Departments>
          {allDepartments &&
            allDepartments.map((department) => (
              <div
                className="department-details"
                key={department.departmentId}
                onClick={() => onSelectDepartment(department)}
              >
                <div className="small-card">
                  <img src={TeamPng} alt={department.name} width="50" />
                </div>
                <div className="department-name">{department.name}</div>
              </div>
            ))}
        </Departments>
      </Card>
    );
  };

  const renderSummary = () => {
    return (
      chosenDepartment && (
        <Card className="paydate">
          <Title>Summary</Title>
          <Heading>Please check the details of the teammate</Heading>

          <PayrollCard>
            <div className="dept-name">{chosenDepartment.name}</div>
            <div className="dept-info">
              {formData.firstName} {formData.lastName}
            </div>
            <div className="dept-info mb-0">{formData.amount} USD</div>
          </PayrollCard>

          <Button
            large
            type="button"
            onClick={handleEditTeammate}
            className="mt-5"
          >
            Confirm
          </Button>
        </Card>
      )
    );
  };

  const renderStepCompletedText = (stepNo) => {
    switch (parseInt(stepNo)) {
      case STEPS.ZERO:
        return `${formData.firstName} ${formData.lastName}`;
      case STEPS.ONE:
        return chosenDepartment && `${chosenDepartment.name}`;
      default:
        return null;
    }
  };

  const renderDoneSteps = () => {
    return Object.keys(ADD_SINGLE_TEAMMATE_STEPS).map(
      (stepNo) =>
        stepNo < step && (
          <DoneCard
            onClick={() => dispatch(chooseStep(parseInt(stepNo)))}
            key={stepNo}
          >
            <Title className="grey">{ADD_SINGLE_TEAMMATE_STEPS[stepNo]}</Title>
            <Heading className="grey">
              {renderStepCompletedText(stepNo)}
            </Heading>
          </DoneCard>
        )
    );
  };

  const renderEditSingleTeammate = () => {
    if (!success)
      return (
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepsCard>
            {step > STEPS.ZERO && renderDoneSteps()}
            {step === STEPS.ZERO && renderTeammateDetails()}
            {step === STEPS.ONE && renderChooseDepartment()}
            {step === STEPS.TWO && renderSummary()}
          </StepsCard>
        </form>
      );

    return (
      <StepsCard>
        <Card className="add-teammate">
          <Title className="mb-2">Teammate Updated!</Title>
          <Heading>You have successfully updated the details</Heading>
          <Summary style={{ marginBottom: "16em" }}>
            <div className="left">
              <img src={TeamPng} alt="teammate" width="80" />
            </div>
            <div className="right">
              <div className="mb-3">
                <div className="section-title mb-1">Name</div>
                <div className="section-desc">
                  {formData.firstName} {formData.lastName}
                </div>
              </div>
              <div className="mb-3">
                <div className="section-title mb-1">Team</div>
                <div className="section-desc">{chosenDepartment.name}</div>
              </div>
              <div>
                <div className="section-title mb-1">Pay Amount</div>
                <div className="section-desc">{formData.amount} USD</div>
              </div>
            </div>
          </Summary>

          <Row>
            <Col lg="12" sm="12" className="pr-0">
              <Button
                large
                type="button"
                onClick={onViewAllClick}
                className="secondary"
              >
                View All
              </Button>
            </Col>
          </Row>
        </Card>
      </StepsCard>
    );
  };

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
            maxWidth: toggled ? "900px" : "1200px",
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
          maxWidth: toggled ? "900px" : "1200px",
          transition: "all 0.25s linear",
        }}
      >
        {renderEditSingleTeammate()}
      </Container>
    </div>
  );
}
