import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import addTeammateReducer from "store/add-teammate/reducer";
import { useLocalStorage } from "hooks";
import {
  chooseStep,
  updateForm,
  chooseDepartment,
  getDepartments,
  getDepartmentById,
  addTeammate,
} from "store/add-teammate/actions";
import addTeammateSaga from "store/add-teammate/saga";
import {
  makeSelectStep,
  makeSelectFormData,
  makeSelectChosenDepartment,
  makeSelectDepartments,
} from "store/add-teammate/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { numToOrd } from "utils/date-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";

import GuyPng from "assets/icons/guy.png";

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

const ADD_TEAMMATE_STEPS = {
  [STEPS.ZERO]: "Add Teammate",
  [STEPS.ONE]: "Choose Department",
  [STEPS.TWO]: "Payroll Details",
};

const addTeammateKey = "addTeammate";

export default function AddTeammate() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [toggled] = useContext(SideNavContext);

  const [success, setSuccess] = useState(false);

  const { register, errors, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
  });

  useInjectReducer({ key: addTeammateKey, reducer: addTeammateReducer });

  useInjectSaga({ key: addTeammateKey, saga: addTeammateSaga });

  const dispatch = useDispatch();
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const chosenDepartment = useSelector(makeSelectChosenDepartment());
  const allDepartments = useSelector(makeSelectDepartments());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    reset({
      firstName: formData.firstName || "",
      lastName: formData.lastName || "",
      address: formData.address || "",
      salary: formData.salary || "",
      currency: formData.currency || "",
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
      dispatch(getDepartmentById(ownerSafeAddress, departmentId)); // TODO: Fetch the paycycle date for dept from BE
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

  const onAddNewDepartmentClick = () => {
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

  const resetAll = () => {
    reset({
      firstName: "",
      lastName: "",
      address: "",
      salary: "",
      currency: "",
    });
    dispatch(updateForm(null));
    setSuccess(false);
    dispatch(chooseStep(STEPS.ZERO));
    dispatch(chooseDepartment(null));
  };

  const onAddMoreTeammates = () => {
    resetAll();
    history.push(location.pathname);
  };

  const onViewAllClick = () => {
    resetAll();
    history.push("/dashboard/people/view");
  };

  const handleCreateTeammate = () => {
    if (!sign || !ownerSafeAddress) return;

    const encryptedEmployeeDetails = cryptoUtils.encryptData(
      JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        salaryAmount: formData.salary,
        salaryToken: formData.currency,
        payCycleDate: chosenDepartment.payCycleDate,
        joiningDate: Date.now(),
      }),
      sign
    );

    const body = {
      encryptedEmployeeDetails,
      payCycleDate: chosenDepartment.payCycleDate,
      safeAddress: ownerSafeAddress,
      createdBy: ownerSafeAddress,
      departmentId: chosenDepartment.departmentId,
      departmentName: chosenDepartment.name,
      joiningDate: Date.now(),
    };

    console.log({ body });
    dispatch(addTeammate(body));
    setSuccess(true);
  };

  const renderTeammateDetails = () => (
    <Card className="add-teammate">
      <Title className="mb-4">Add Teammate</Title>
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
            required={`Last Name is required`}
            placeholder="Last Name"
          />
          <ErrorMessage name="lastName" errors={errors} />
        </Col>
      </Row>

      <Heading>SALARY PAYMENT DETAILS</Heading>
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
            name="salary"
            register={register}
            required={`Salary is required`}
            placeholder="Salary"
          />
          <ErrorMessage name="salary" errors={errors} />
        </Col>
        <Col lg="6" sm="12">
          <Input
            name="currency"
            register={register}
            required={`Token is required`}
            placeholder="Select Token"
          />
          <ErrorMessage name="currency" errors={errors} />
        </Col>
      </Row>

      <Heading>DEPARTMENT</Heading>
      {!chosenDepartment ? (
        <ChooseDepartment type="submit">
          <div>
            <div className="choose-title">Choose Department</div>
            <div className="choose-subtitle">
              Employee will be paid as per department date.
            </div>
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
          <div>
            <div className="text-left mb-2">
              <img src={GuyPng} alt="guy" width="40" />
            </div>
            <Title className="mb-1 choosen-dept">{chosenDepartment.name}</Title>
            <Heading className="choosen-dept">
              PAYROLL DATE : {numToOrd(chosenDepartment.payCycleDate)} of Every
              Month
            </Heading>
          </div>
          <div className="choose-title">EDIT</div>
        </ChooseDepartment>
      )}

      <Button
        large
        type="submit"
        className="mt-5"
        disabled={!formState.isValid}
      >
        Add Employee
      </Button>
    </Card>
  );

  const renderChooseDepartment = () => {
    return (
      <Card className="choose-department">
        <Title>Choose Department</Title>
        <Heading>You can choose from existing department or add new.</Heading>
        <Departments>
          {allDepartments &&
            allDepartments.map((department) => (
              <div
                className="department-details"
                key={department.departmentId}
                onClick={() => onSelectDepartment(department)}
              >
                <div className="small-card">
                  <img src={GuyPng} width="50px" alt="guy" />
                </div>
                <div className="department-name">{department.name}</div>
              </div>
            ))}
        </Departments>
        <Link to="/dashboard/department/new">
          <Button
            type="button"
            className="mx-auto my-5"
            style={{
              borderRadius: "24px",
              backgroundColor: "#f2f2f2",
              color: "#7367f0",
            }}
            onClick={onAddNewDepartmentClick}
          >
            <span>
              <FontAwesomeIcon
                icon={faPlus}
                size="sm"
                color="#7367f0"
                className="mr-2"
              />
            </span>
            Add New Department
          </Button>
        </Link>
      </Card>
    );
  };

  const renderPaydate = () => {
    return (
      chosenDepartment && (
        <Card className="paydate">
          <Title>Department Paydate</Title>
          <Heading>The user will be paid as per department pay date.</Heading>

          <PayrollCard>
            <div className="dept-name">{chosenDepartment.name}</div>
            <div className="dept-info">
              PAYROLL DATE : {numToOrd(chosenDepartment.payCycleDate)} of Every
              Month
            </div>
            <div className="change-date mt-4">Change Payroll date </div>
          </PayrollCard>

          <Button
            large
            type="button"
            onClick={handleCreateTeammate}
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
    return Object.keys(ADD_TEAMMATE_STEPS).map(
      (stepNo) =>
        stepNo < step && (
          <DoneCard
            onClick={() => dispatch(chooseStep(parseInt(stepNo)))}
            key={stepNo}
          >
            <Title className="grey">{ADD_TEAMMATE_STEPS[stepNo]}</Title>
            <Heading className="grey">
              {renderStepCompletedText(stepNo)}
            </Heading>
          </DoneCard>
        )
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
            maxWidth: toggled ? "900px" : "1280px",
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
          maxWidth: toggled ? "900px" : "1280px",
          transition: "all 0.25s linear",
        }}
      >
        {!success ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            <StepsCard>
              {step > STEPS.ZERO && renderDoneSteps()}
              {step === STEPS.ZERO && renderTeammateDetails()}
              {step === STEPS.ONE && renderChooseDepartment()}
              {step === STEPS.TWO && renderPaydate()}
            </StepsCard>
          </form>
        ) : (
          <StepsCard>
            <Card className="add-teammate">
              <Title className="mb-2">Teammate Saved!</Title>
              <Heading>Wow! You have a new champ on-board</Heading>
              <Summary style={{ marginBottom: "13em" }}>
                <div className="left">
                  <img src={GuyPng} alt="guy" width="80" />
                </div>
                <div className="right">
                  <div className="mb-3">
                    <div className="section-title mb-1">Name</div>
                    <div className="section-desc">
                      {formData.firstName} {formData.lastName}
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="section-title mb-1">Department</div>
                    <div className="section-desc">{chosenDepartment.name}</div>
                  </div>
                  <div className="mb-3">
                    <div className="section-title mb-1">Pay Date</div>
                    <div className="section-desc">
                      {numToOrd(chosenDepartment.payCycleDate)} of every month
                    </div>
                  </div>
                  <div>
                    <div className="section-title mb-1">Pay Amount</div>
                    <div className="section-desc">
                      {formData.salary} {formData.currency}
                    </div>
                  </div>
                </div>
              </Summary>

              <Row>
                <Col lg="5" sm="12" className="pr-0">
                  <Button
                    large
                    type="button"
                    onClick={onViewAllClick}
                    className="secondary"
                  >
                    View All
                  </Button>
                </Col>
                <Col lg="7" sm="12">
                  <Button large type="button" onClick={onAddMoreTeammates}>
                    Add More Teammates
                  </Button>
                </Col>
              </Row>
            </Card>
          </StepsCard>
        )}
      </Container>
    </div>
  );
}
