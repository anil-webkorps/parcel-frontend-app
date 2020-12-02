import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faLongArrowAltLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { show } from "redux-modal";

// import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useHistory } from "react-router-dom";
import { cryptoUtils } from "parcel-sdk";

import { Info } from "components/Dashboard/styles";
import { useLocalStorage } from "hooks";
import Button from "components/common/Button";
import viewTeammatesReducer from "store/view-teammates/reducer";
import viewTeammatesSaga from "store/view-teammates/saga";
import {
  getAllTeammates,
  getTeammatesByDepartment,
} from "store/view-teammates/actions";
import {
  makeSelectTeammates,
  makeSelectLoading,
} from "store/view-teammates/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import { makeSelectOwnerSafeAddress } from "store/global/selectors";
import { numToOrd } from "utils/date-helpers";
import Loading from "components/common/Loading";

import { Container, Table, ActionItem } from "./styles";
import { Circle } from "components/Header/styles";
import TeammateDetailsModal, {
  MODAL_NAME as TEAMMATE_DETAILS_MODAL,
} from "./TeammateDetailsModal";

const { TableBody, TableHead, TableRow } = Table;

const viewTeammatesKey = "viewTeammates";

export default function ViewTeammate() {
  const [sign] = useLocalStorage("SIGNATURE");
  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });

  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });

  const dispatch = useDispatch();
  const params = useParams();
  const history = useHistory();

  const teammates = useSelector(makeSelectTeammates());
  const loading = useSelector(makeSelectLoading());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());

  useEffect(() => {
    if (ownerSafeAddress) {
      if (params && params.departmentId) {
        dispatch(
          getTeammatesByDepartment(ownerSafeAddress, params.departmentId)
        );
      } else {
        dispatch(getAllTeammates(ownerSafeAddress));
      }
    }
  }, [dispatch, params, ownerSafeAddress]);

  const getDecryptedDetails = (data) => {
    if (!sign) return "";
    return JSON.parse(cryptoUtils.decryptData(data, sign));
  };

  const goBack = () => {
    history.goBack();
  };

  const showDetails = (props) => {
    dispatch(show(TEAMMATE_DETAILS_MODAL, { ...props }));
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
            maxWidth: "1280px",
          }}
          className="mx-auto"
        >
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
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
              <div className="title mx-3 my-0" style={{ fontSize: "20px" }}>
                All Employees
              </div>
            </div>

            <Button
              iconOnly
              className="p-0"
              to={
                params && params.departmentId
                  ? `/dashboard/people/new?departmentId=${params.departmentId}`
                  : `/dashboard/people/new`
              }
            >
              <ActionItem>
                <Circle>
                  <FontAwesomeIcon icon={faPlus} color="#fff" />
                </Circle>
                <div className="mx-3">
                  <div className="name">Add Employee</div>
                </div>
              </ActionItem>
            </Button>
          </div>
        </div>
      </Info>

      <Container>
        <div>
          <TableHead>
            <div>Employee Name</div>
            <div>Department</div>
            <div>Payroll Cycle</div>
            <div>Disbursement</div>
            <div></div>
          </TableHead>

          <TableBody>
            {loading ? (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                <Loading color="primary" width="50px" height="50px" />
              </div>
            ) : teammates.length > 0 ? (
              teammates.map(({ data, departmentName, payCycleDate }, idx) => {
                const {
                  firstName,
                  lastName,
                  salaryAmount,
                  salaryToken,
                  address,
                } = getDecryptedDetails(data);
                return (
                  <TableRow key={`${address}-${idx}`}>
                    <div>
                      {firstName} {lastName}
                    </div>
                    <div>{departmentName}</div>
                    <div>{numToOrd(payCycleDate)} of every month</div>
                    <div>
                      {salaryAmount} {salaryToken}
                    </div>
                    <div className="d-flex justify-content-end">
                      <Button
                        iconOnly
                        onClick={() =>
                          showDetails({
                            firstName,
                            lastName,
                            salary: salaryAmount,
                            currency: salaryToken,
                            departmentName,
                            payCycleDate,
                            address,
                          })
                        }
                        className="p-0"
                      >
                        <div className="circle circle-grey mr-3">
                          <FontAwesomeIcon icon={faEye} color="#7367f0" />
                        </div>
                      </Button>

                      <div className="circle circle-grey">
                        <FontAwesomeIcon icon={faEdit} color="#7367f0" />
                      </div>
                    </div>
                  </TableRow>
                );
              })
            ) : (
              <div
                className="d-flex align-items-center justify-content-center"
                style={{ height: "400px" }}
              >
                No teammates found!
              </div>
            )}
          </TableBody>
        </div>
      </Container>
      <TeammateDetailsModal />
    </div>
  );
}
