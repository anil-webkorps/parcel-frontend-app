import React, { useContext, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, Link } from "react-router-dom";
import DayPicker from "react-day-picker";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";
import addDepartmentReducer from "store/add-department/reducer";
import {
  addDepartment,
  addDepartmentSuccess,
  updateForm,
} from "store/add-department/actions";
import addDepartmentSaga from "store/add-department/saga";
import {
  makeSelectFormData,
  makeSelectDepartmentId,
  makeSelectLoading,
} from "store/add-department/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";

import { numToOrd } from "utils/date-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import TeamPng from "assets/images/user-team.png";

import { Container, Title, Heading, Text, Summary, ActionItem } from "./styles";
import { Circle } from "components/Header/styles";
import "react-day-picker/lib/style.css";

const dateStyles = `
.DayPicker-Day--highlighted {
  background-color: #7367f0;
  color: white;
}

.DayPicker-Caption, .DayPicker-Weekdays, .DayPicker-NavBar {
  display: none;
}

.DayPicker-Month {
  margin: 0 auto;
}

.DayPicker-Day {
  padding: 0.9em 1.05em;
}
.DayPicker-Day:focus, 
.DayPicker-wrapper:focus, 
.DayPicker:focus {
  outline: none;
}

.DayPicker-Day:hover {
    color: #000;
}
`;

const addDepartmentKey = "addDepartment";

export default function AddDepartment() {
  const [selectedDay, setSelectedDay] = useState();
  const [success, setSuccess] = useState(false);
  const [toggled] = useContext(SideNavContext);
  const { register, errors, handleSubmit } = useForm();

  useInjectReducer({ key: addDepartmentKey, reducer: addDepartmentReducer });
  useInjectSaga({ key: addDepartmentKey, saga: addDepartmentSaga });

  const dispatch = useDispatch();
  const formData = useSelector(makeSelectFormData());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const newDepartmentId = useSelector(makeSelectDepartmentId());
  const loading = useSelector(makeSelectLoading());

  const history = useHistory();

  useEffect(() => {
    if (newDepartmentId) setSuccess(true);
  }, [newDepartmentId]);

  useEffect(() => {
    // reset departmentId and log when component mounts
    dispatch(addDepartmentSuccess("", ""));
    setSuccess(false);
  }, [dispatch]);

  const onSubmit = (values) => {
    dispatch(updateForm({ ...formData, name: values.departmentName }));
    // dispatch async action to create dept
    dispatch(
      addDepartment({
        name: values.departmentName,
        payCycleDate: formData.payCycleDate,
        createdBy: ownerSafeAddress,
        safeAddress: ownerSafeAddress,
      })
    );
  };

  const handleDayClick = (day) => {
    dispatch(
      updateForm({ ...formData, payCycleDate: new Date(day).getDate() })
    );
    setSelectedDay(day);
  };

  const goBack = () => {
    history.goBack();
  };

  const renderAddDepartment = () => (
    <Card className="add-department">
      <Title className="mb-4">Add New Department</Title>
      <Heading>WHAT SHOULD IT BE CALLED?</Heading>
      <Row className="mb-4">
        <Col lg="12">
          <Input
            type="text"
            name="departmentName"
            register={register}
            required={`Department Name is required`}
            placeholder="Department Name"
          />
          <ErrorMessage name="departmentName" errors={errors} />
        </Col>
      </Row>

      <Heading>SELECT PAY CYCLE DATE</Heading>

      <style>{dateStyles}</style>
      <Row>
        <Col lg="12">
          <div
            style={{ border: "1px solid #aaa", borderRadius: "8px" }}
            className="px-3 py-2"
          >
            <DayPicker
              modifiers={{
                highlighted: selectedDay,
              }}
              onDayClick={handleDayClick}
              month={new Date(2019, 11)}
            />
          </div>
        </Col>
      </Row>

      <Text className="mt-4">
        All the teammates in this department will be paid on this date every
        month.
      </Text>

      <Button
        large
        type="submit"
        className="mt-3"
        disabled={!selectedDay}
        loading={loading}
      >
        Add Department
      </Button>
    </Card>
  );

  const renderSuccess = () => (
    <Card className="add-department">
      <Title className="mb-2">Department Saved</Title>
      <Heading>Wow! You have a department on-board</Heading>
      <Summary>
        <div className="left">
          <img src={TeamPng} alt="department" width="70" />
        </div>
        <div className="right">
          <div className="mb-4">
            <div className="section-title mb-1">Department Name</div>
            <div className="section-desc">{formData.name}</div>
          </div>
          <div>
            <div className="section-title mb-1">Pay Date</div>
            <div className="section-desc">
              {numToOrd(formData.payCycleDate)} of every month
            </div>
          </div>
        </div>
      </Summary>

      <Row>
        <Col lg="5" sm="12">
          <Link to="/dashboard">
            <Button large type="submit" className="secondary mt-3">
              Home
            </Button>
          </Link>
        </Col>
        <Col lg="7" sm="12">
          <Link to={`/dashboard/people/new?departmentId=${newDepartmentId}`}>
            <Button large type="submit" className="mt-3">
              Add Teammates
            </Button>
          </Link>
        </Col>
      </Row>
    </Card>
  );

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
        <form onSubmit={handleSubmit(onSubmit)}>
          {!success ? renderAddDepartment() : renderSuccess()}
        </form>
      </Container>
    </div>
  );
}
