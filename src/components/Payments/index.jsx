import React, { useContext, useEffect, useState } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faLongArrowAltRight, faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import { cryptoUtils } from "parcel-sdk";

import { useLocalStorage } from "hooks";
import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewDepartmentsReducer from "store/view-departments/reducer";
import { getDepartments } from "store/view-departments/actions";
import viewDepartmentsSaga from "store/view-departments/saga";
import viewTeammatesSaga from "store/view-teammates/saga";

import viewTeammatesReducer from "store/view-teammates/reducer";
import { getAllTeammates } from "store/view-teammates/actions";
import {
  makeSelectDepartments,
  makeSelectTotalEmployees,
  makeSelectLoading as makeSelectDepartmentsLoading,
} from "store/view-departments/selectors";
import {
  makeSelectTeammates,
  makeSelectLoading as makeSelectTeammatesLoading,
} from "store/view-teammates/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
// import { numToOrd } from "utils/date-helpers";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
// import Loading from "components/common/Loading";

// import GuyPng from "assets/icons/guy.png";

import { Container, Table } from "./styles";
// import { Circle } from "components/Header/styles";
import { minifyAddress } from "components/common/Web3Utils";

const { TableBody, TableHead, TableRow } = Table;
const viewTeammatesKey = "viewTeammates";
const viewDepartmentsKey = "viewDepartments";

const TABS = {
  PEOPLE: "1",
  DEPARTMENT: "2",
};

const navStyles = `
  .nav-tabs {
    box-shadow: 0 3px 10px 0 rgba(0, 0, 0, 0.05);
    border-bottom: solid 1px #f2f2f2;
    background-color: #ffffff;
  }

  .nav-link {
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #aaaaaa;
    cursor: pointer;
    opacity: 0.4;
    padding-bottom: 15px;
    padding-top: 15px;
  }

  .nav-tabs .nav-item.show .nav-link, .nav-tabs .nav-link.active {
    border-bottom: 5px solid #7367f0;
  }

  .nav-tabs .nav-link:focus, .nav-tabs .nav-link:hover {
    border: none;
    border-bottom: 5px solid #7367f0;
    opacity: 1;
  }

  .nav-link.active {
    opacity: 1;
    border: none;
    font-size: 20px;
    font-weight: bold;
    font-stretch: normal;
    font-style: normal;
    line-height: 1.2;
    letter-spacing: normal;
    text-align: left;
    color: #373737;
  }
`;

export default function People() {
  const [sign] = useLocalStorage("SIGNATURE");
  const [toggled] = useContext(SideNavContext);
  const [activeTab, setActiveTab] = useState(TABS.PEOPLE);

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });
  useInjectReducer({
    key: viewDepartmentsKey,
    reducer: viewDepartmentsReducer,
  });

  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });
  useInjectSaga({ key: viewDepartmentsKey, saga: viewDepartmentsSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectDepartments());
  const totalEmployees = useSelector(makeSelectTotalEmployees()); // eslint-disable-line
  const loadingDepartments = useSelector(makeSelectDepartmentsLoading()); // eslint-disable-line
  const loadingTeammates = useSelector(makeSelectTeammatesLoading()); // eslint-disable-line
  const teammates = useSelector(makeSelectTeammates());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  const { register, handleSubmit } = useForm();

  useEffect(() => {
    if (!teammates || !teammates.length) {
      dispatch(getAllTeammates(ownerSafeAddress));
    }
    if (!allDepartments || !allDepartments.length) {
      dispatch(getDepartments(ownerSafeAddress));
    }
  }, [dispatch, ownerSafeAddress, teammates, allDepartments]);

  const getDecryptedDetails = (data) => {
    if (!sign) return "";
    return JSON.parse(cryptoUtils.decryptData(data, sign));
  };

  const onSubmit = (values) => {
    const selectedIndexes = Object.values(values)
      .filter(Boolean)
      .map((v) => JSON.parse(v));
    console.log({ selectedIndexes });
  };

  return (
    <div
      className="position-relative"
      style={{
        transition: "all 0.25s linear",
      }}
    >
      <div>
        <Info>
          <div
            style={{
              maxWidth: toggled ? "900px" : "1280px",
              transition: "all 0.25s linear",
            }}
            className="mx-auto"
          >
            <div className="title">Payments</div>
            <div className="subtitle">
              You can instantly pay or manage team payrolls
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
            <style>{navStyles}</style>
            <Card style={{ minHeight: "532px" }} className="pt-3">
              <Nav tabs>
                <NavItem className="px-3">
                  <NavLink
                    className={`${activeTab === TABS.PEOPLE ? "active" : ""}`}
                    onClick={() => toggle(TABS.PEOPLE)}
                  >
                    People
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={`${
                      activeTab === TABS.DEPARTMENT ? "active" : ""
                    }`}
                    onClick={() => toggle(TABS.DEPARTMENT)}
                  >
                    Department
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={TABS.PEOPLE}>
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <TableHead>
                      <div className="form-check d-flex">
                        <input
                          className="form-check-input position-static mr-3"
                          type="checkbox"
                          id="allCheckbox"
                          value="all"
                        />
                        <div>Employee Name</div>
                      </div>
                      <div>Department</div>
                      <div>Pay Token</div>
                      <div>Pay Amount</div>
                      <div>Address</div>
                      <div></div>
                    </TableHead>
                    <TableBody>
                      {teammates.length > 0 &&
                        teammates.map(({ data, departmentName }, idx) => {
                          const {
                            firstName,
                            lastName,
                            salaryAmount,
                            salaryToken,
                            address,
                          } = getDecryptedDetails(data);
                          return (
                            <TableRow key={address}>
                              <div className="form-check d-flex">
                                <input
                                  className="form-check-input position-static mr-3"
                                  type="checkbox"
                                  id={`checkbox${idx}`}
                                  ref={register}
                                  name={`checkbox${idx}`}
                                  value={JSON.stringify({
                                    address,
                                    salaryToken,
                                    salaryAmount,
                                  })}
                                />
                                <div>
                                  {firstName} {lastName}
                                </div>
                              </div>
                              <div>{departmentName}</div>
                              <div>{salaryToken}</div>
                              <div>
                                {salaryAmount} {salaryToken} (US${salaryAmount})
                              </div>
                              <div>{minifyAddress(address)}</div>
                              <div className="text-right">
                                <Button type="button">PAY</Button>
                              </div>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                    <Button>Submit</Button>
                  </form>
                </TabPane>
                <TabPane tabId={TABS.DEPARTMENT}>
                  <div className="p-4">Departments</div>
                </TabPane>
              </TabContent>
            </Card>
          </div>
        </Container>
      </div>
    </div>
  );
}
