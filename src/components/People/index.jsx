import React, { useContext, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLongArrowAltRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { Info } from "components/Dashboard-old/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewDepartmentsReducer from "store/view-departments/reducer";
import { getDepartments } from "store/view-departments/actions";
import viewDepartmentsSaga from "store/view-departments/saga";
import {
  makeSelectDepartments,
  makeSelectTotalEmployees,
  makeSelectLoading,
} from "store/view-departments/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import Loading from "components/common/Loading";

import TeamMembersPng from "assets/images/team-members.png";
import TeamPng from "assets/images/user-team.png";

import { Container, FiltersCard } from "./styles";
import { Circle } from "components/Header/styles";

const viewDepartmentsKey = "viewDepartments";

export default function People() {
  // New users have different UI at first
  const [isNewUser, setIsNewUser] = useState();

  useInjectReducer({
    key: viewDepartmentsKey,
    reducer: viewDepartmentsReducer,
  });

  useInjectSaga({ key: viewDepartmentsKey, saga: viewDepartmentsSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectDepartments());
  const totalEmployees = useSelector(makeSelectTotalEmployees());
  const loading = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    dispatch(getDepartments(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (allDepartments && allDepartments.length > 0) {
      setIsNewUser(false);
    } else {
      setIsNewUser(true);
    }
  }, [allDepartments]);

  const renderForNewUser = () => {
    return (
      <div>
        <Container>
          <div className="new-user">
            <Card className="p-4" style={{ minHeight: "532px" }}>
              <div className="text-center">
                <img src={TeamMembersPng} alt="humans" width="400px" />
              </div>
              <div className="card-title">
                Hassle-Free Team and People management
              </div>
              <div className="card-subtitle">
                Add teams and manage people with easy imports.
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
        <FiltersCard>
          <div>
            <div className="title">People</div>
            <div className="subtitle">Manage teams and people here</div>
          </div>
          <div>Search for people</div>
        </FiltersCard>
        <FiltersCard className="mt-3">
          <div>
            <div className="title mb-0">Showing 100 teammates</div>
          </div>
          <div>Search for people</div>
        </FiltersCard>
        {/* {allDepartments &&
            allDepartments.map(({ departmentId, name, employees }) => (
              <Link
                to={`/dashboard/people/view/${departmentId}`}
                key={departmentId}
              >
                <Card className="department-card">
                  <div className="upper">
                    <div className="d-flex justify-content-between">
                      <img src={TeamPng} alt={name} width="50" />
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
                    <div>Teammates : {employees}</div>
                  </div>
                </Card>
              </Link>
            ))} */}
      </div>
    );
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : !isNewUser ? (
        renderForNormalUser()
      ) : (
        renderForNewUser()
      )}
    </div>
  );
}
