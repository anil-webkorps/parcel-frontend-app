import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faEye,
  faLongArrowAltLeft,
} from "@fortawesome/free-solid-svg-icons";
// import { Col, Row } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
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

import { Container, Table } from "./styles";
import Loading from "components/common/Loading";
const { TableBody, TableHead, TableRow } = Table;

const viewTeammatesKey = "viewTeammates";

export default function ViewTeammate() {
  const [sign] = useLocalStorage("SIGNATURE");
  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });

  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });

  const dispatch = useDispatch();
  const params = useParams();

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

  const getDecryptedName = (name) => {
    if (!sign) return "";
    return cryptoUtils.decryptData(name, sign);
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
              teammates.map(({ data, departmentName, payCycleDate }) => (
                <TableRow>
                  <div>{getDecryptedName(data)}</div>
                  <div>{departmentName}</div>
                  <div>{numToOrd(payCycleDate)} of every month</div>
                  <div>2.0 ETH</div>
                  <div className="d-flex justify-content-end">
                    <div className="circle circle-grey mr-3">
                      <FontAwesomeIcon icon={faEye} color="#7367f0" />
                    </div>
                    <div className="circle circle-grey">
                      <FontAwesomeIcon icon={faEdit} color="#7367f0" />
                    </div>
                  </div>
                </TableRow>
              ))
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
    </div>
  );
}
