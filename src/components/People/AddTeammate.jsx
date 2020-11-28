import React, { useContext, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Link, useLocation } from "react-router-dom";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import addTeammateReducer from "store/add-teammate/reducer";
import addDepartmentReducer from "store/add-department/reducer";
import {
  chooseStep,
  updateForm,
  chooseDepartment,
  getDepartments,
} from "store/add-teammate/actions";
import addTeammateSaga from "store/add-teammate/saga";
import {
  makeSelectStep,
  makeSelectFormData,
  makeSelectChosenDepartment,
  makeSelectPayCycleDate,
  makeSelectDepartments,
} from "store/add-teammate/selectors";
import { makeSelectFormData as makeSelectDepartmentFormData } from "store/add-department/selectors";
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
} from "./styles";

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
const addDepartmentKey = "addDepartment";

export default function AddTeammate() {
  const [toggled] = useContext(SideNavContext);
  const { register, errors, handleSubmit, reset, formState } = useForm({
    mode: "onChange",
  });

  useInjectReducer({ key: addTeammateKey, reducer: addTeammateReducer });
  useInjectReducer({ key: addDepartmentKey, reducer: addDepartmentReducer });

  useInjectSaga({ key: addTeammateKey, saga: addTeammateSaga });

  const dispatch = useDispatch();
  const step = useSelector(makeSelectStep());
  const formData = useSelector(makeSelectFormData());
  const departmentFormData = useSelector(makeSelectDepartmentFormData());
  const chosenDepartment = useSelector(makeSelectChosenDepartment());
  const payCycleDate = useSelector(makeSelectPayCycleDate());
  const allDepartments = useSelector(makeSelectDepartments());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const location = useLocation();

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
    if (
      departmentFormData &&
      departmentFormData.name &&
      departmentFormData.payCycleDate
    ) {
      dispatch(chooseStep(STEPS.ZERO));
      dispatch(
        chooseDepartment(
          departmentFormData.name,
          departmentFormData.payCycleDate
        )
      );
    } else {
      const searchParams = new URLSearchParams(location.search);
      const department = searchParams.get("department");
      if (department) {
        dispatch(chooseStep(STEPS.ZERO));
        dispatch(chooseDepartment(department, 1)); // TODO: Fetch the paycycle date for dept from BE
      }
    }
  }, [departmentFormData, dispatch, location]);

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

  const onSelectDepartment = (name, payCycleDate) => {
    dispatch(chooseDepartment(name, payCycleDate));
    dispatch(chooseStep(STEPS.ZERO));
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
      {!chosenDepartment && !payCycleDate ? (
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
            <Title className="mb-1 choosen-dept">{chosenDepartment}</Title>
            <Heading className="choosen-dept">
              PAYROLL DATE : {numToOrd(payCycleDate)} of Every Month
            </Heading>
          </div>
          <div className="choose-title">EDIT</div>
        </ChooseDepartment>
      )}

      <Button
        large
        type="submit"
        className="mt-5"
        disabled={!chosenDepartment || !formState.isValid}
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
                onClick={() =>
                  onSelectDepartment(department.name, department.payCycleDate)
                }
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
      <Card className="paydate">
        <Title>Department Paydate</Title>
        <Heading>The user will be paid as per department pay date.</Heading>

        <PayrollCard>
          <div className="dept-name">{chosenDepartment}</div>
          <div className="dept-info">
            PAYROLL DATE : {numToOrd(payCycleDate)} of Every Month
          </div>
          <div className="change-date mt-4">Change Payroll date </div>
        </PayrollCard>

        <Button large type="submit" className="mt-5">
          Confirm
        </Button>
      </Card>
    );
  };

  const renderStepCompletedText = (stepNo) => {
    switch (parseInt(stepNo)) {
      case STEPS.ZERO:
        return `${formData.firstName} ${formData.lastName}`;
      case STEPS.ONE:
        return `${chosenDepartment}`;
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
          <Button className="secondary">
            <span>
              <FontAwesomeIcon
                icon={faLongArrowAltLeft}
                color="#333"
                className="mr-2"
              />
            </span>
            <span>Back</span>
          </Button>
        </div>
      </Info>

      <Container
        style={{
          maxWidth: toggled ? "900px" : "1280px",
          transition: "all 0.25s linear",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <StepsCard>
            {step > STEPS.ZERO && renderDoneSteps()}
            {step === STEPS.ZERO && renderTeammateDetails()}
            {step === STEPS.ONE && renderChooseDepartment()}
            {step === STEPS.TWO && renderPaydate()}
          </StepsCard>
        </form>
      </Container>
    </div>
  );
}
