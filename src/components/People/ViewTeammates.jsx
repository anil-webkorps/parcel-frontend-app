import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  // faLongArrowAltRight,
  // faPlus,
} from "@fortawesome/free-solid-svg-icons";
// import { Col, Row } from "reactstrap";
// import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
// import { Link, useLocation } from "react-router-dom";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
// import { Card } from "components/common/Card";
import Button from "components/common/Button";
// import { Input, ErrorMessage } from "components/common/Form";
import addTeammateReducer from "store/add-teammate/reducer";
// import addDepartmentReducer from "store/add-department/reducer";
// import {
//   chooseStep,
//   updateForm,
//   chooseDepartment,
// } from "store/add-teammate/actions";
// import {
//   makeSelectStep,
//   makeSelectFormData,
//   makeSelectChosenDepartment,
//   makeSelectPayCycleDate,
// } from "store/add-teammate/selectors";
// import { makeSelectFormData as makeSelectDepartmentFormData } from "store/add-department/selectors";
import { useInjectReducer } from "utils/injectReducer";
// import { numToOrd } from "utils/date-helpers";

// import GuyPng from "assets/icons/guy.png";

import {
  Container,
  // Title,
  // Heading,
  // ChooseDepartment,
  // StepsCard,
  // PayrollCard,
  // DoneCard,
} from "./styles";

const addTeammateKey = "addTeammate";

export default function ViewTeammate() {
  const [toggled] = useContext(SideNavContext);

  useInjectReducer({ key: addTeammateKey, reducer: addTeammateReducer });

  const dispatch = useDispatch();
  // const location = useLocation();

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
          <div className="d-flex">
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
            <div className="title mx-3 mt-2 mb-0" style={{ fontSize: "20px" }}>
              All Employees
            </div>
          </div>
        </div>
      </Info>

      <Container
        style={{
          maxWidth: toggled ? "900px" : "1280px",
          transition: "all 0.25s linear",
        }}
      >
        Hi
      </Container>
    </div>
  );
}
