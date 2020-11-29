import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import addTeammateReducer from "store/add-teammate/reducer";
import { getDepartments } from "store/add-teammate/actions";
import addTeammateSaga from "store/add-teammate/saga";
import {
  makeSelectDepartments,
  makeSelectTotalEmployees,
  makeSelectLoading,
} from "store/add-teammate/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { numToOrd } from "utils/date-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";

import GuyPng from "assets/icons/guy.png";

import { Container, AllEmployees } from "./styles";
import { Circle } from "components/Header/styles";
import { format } from "date-fns";

const addTeammateKey = "addTeammate";

export default function People() {
  // Normal users and New users have different UI at first
  const [isNormalUser, setIsNormalUser] = useState();
  const [toggled] = useContext(SideNavContext);

  useInjectReducer({ key: addTeammateKey, reducer: addTeammateReducer });

  useInjectSaga({ key: addTeammateKey, saga: addTeammateSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectDepartments());
  const totalEmployees = useSelector(makeSelectTotalEmployees()); // eslint-disable-line
  const loading = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    dispatch(getDepartments(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (allDepartments && allDepartments.length > 0) {
      setIsNormalUser(true);
    }
  }, [allDepartments]);

  const renderForNewUser = () => {
    return (
      <div>
        <Info>
          <div
            style={{
              maxWidth: toggled ? "900px" : "1280px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="title">People</div>
            <div className="subtitle">
              You can add teams and manage people payroll
            </div>
          </div>
        </Info>
        <Container
          style={{
            maxWidth: toggled ? "900px" : "1280px",
            transition: "all 0.25s linear",
          }}
        >
          <div className="new-user">
            <Card className="p-4" style={{ minHeight: "532px" }}>
              <div className="card-title">
                Hassle-Free team and People management
              </div>
              <div className="card-subtitle">
                Add team members, set-up your teams and their payroll. Enjoy a
                hassle free payroll management
              </div>

              <Button
                iconOnly
                className="d-block mx-auto"
                to="/dashboard/people/new"
              >
                <div className="circle">
                  <FontAwesomeIcon icon={faPlus} color="#fff" />
                </div>
                <div className="add-now">Add Now</div>
              </Button>
            </Card>
          </div>
        </Container>
      </div>
    );
  };

  const renderForNormalUser = () => {
    return (
      <div>
        <Info>
          <div
            style={{
              maxWidth: toggled ? "900px" : "1280px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="title">Your Teams</div>
            <div className="subtitle">Manage Teams and People within them.</div>
            <AllEmployees>
              <div>
                <div className="all-employees-title mb-4">All Employees</div>
                <div className="all-employees-subtitle mb-2">
                  Total - <span>{40} Employees</span>
                </div>
                <div className="all-employees-subtitle">
                  Last updated : {format(Date.now(), "dd MMM yyyy")}
                </div>
              </div>
              <div>
                <Button iconOnly className="p-0" to="/dashboard/people/view">
                  <Circle>
                    <FontAwesomeIcon icon={faLongArrowAltRight} color="#fff" />
                  </Circle>
                </Button>
              </div>
            </AllEmployees>
          </div>
        </Info>
        <Container
          className="show-departments"
          style={{
            maxWidth: toggled ? "900px" : "1280px",
            transition: "all 0.25s linear",
          }}
        >
          <div className="department-cards">
            {allDepartments.map(
              ({ departmentId, name, payCycleDate, employees }) => (
                <Link
                  to={`/dashboard/people/view/${departmentId}`}
                  key={departmentId}
                >
                  <Card className="department-card">
                    <div className="upper">
                      <div className="d-flex justify-content-between">
                        <img src={GuyPng} alt="guy" width="50px" />
                        <div className="circle circle-grey">
                          <FontAwesomeIcon
                            icon={faLongArrowAltRight}
                            color="#7367f0"
                          />
                        </div>
                      </div>
                      <div className="mt-2">{name}</div>
                    </div>

                    <div className="line" />
                    <div className="lower">
                      <div className="mb-3">Employees : {employees}</div>
                      <div>
                        Paydate : {numToOrd(payCycleDate)} of every month
                      </div>
                    </div>
                  </Card>
                </Link>
              )
            )}
            <Link to={`/dashboard/department/new`}>
              <Card className="department-card d-flex justify-content-center align-items-center">
                <Button iconOnly className="d-block mx-auto">
                  <div className="circle">
                    <FontAwesomeIcon icon={faPlus} color="#fff" />
                  </div>
                  <div className="add-now">Add Department</div>
                </Button>
              </Card>
            </Link>
          </div>
        </Container>
      </div>
    );
  };

  return (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      {loading ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "200px" }}
        >
          <Loading color="primary" width="50px" height="50px" />
        </div>
      ) : isNormalUser ? (
        renderForNormalUser()
      ) : (
        renderForNewUser()
      )}
    </div>
  );
}
