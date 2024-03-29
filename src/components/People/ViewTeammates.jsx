import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDownload,
  faEye,
  faLongArrowAltLeft,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { show } from "redux-modal";
import { CSVLink } from "react-csv";
import { format } from "date-fns";

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
import { getDefaultIconIfPossible } from "constants/index";

import { Container, Table, ActionItem } from "./styles";
import { Circle } from "components/Header/styles";
import TeammateDetailsModal, {
  MODAL_NAME as TEAMMATE_DETAILS_MODAL,
} from "./TeammateDetailsModal";

const { TableBody, TableHead, TableRow } = Table;

const viewTeammatesKey = "viewTeammates";

export default function ViewTeammate() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");
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
    if (!encryptionKey) return "";
    return JSON.parse(
      cryptoUtils.decryptDataUsingEncryptionKey(data, encryptionKey)
    );
  };

  const goBack = () => {
    history.push("/dashboard/people");
  };

  const showDetails = (props) => {
    dispatch(show(TEAMMATE_DETAILS_MODAL, { ...props }));
  };

  const renderExportEmployeeData = () => {
    let csvData = [];
    if (teammates && teammates.length > 0) {
      teammates.map(({ data, departmentName, payCycleDate }) => {
        const teammateDetails = getDecryptedDetails(data);
        const {
          firstName,
          lastName,
          salaryAmount,
          salaryToken,
          address,
        } = teammateDetails;
        csvData.push({
          "First Name": firstName,
          "Last Name": lastName,
          Address: address,
          "Salary Amount": salaryAmount,
          "Salary Token": salaryToken,
          "Department Name": departmentName,
          "Paycycle Date": payCycleDate,
        });
        return csvData;
      });
    }
    return (
      <CSVLink
        uFEFF={false}
        data={csvData}
        filename={`employees-${format(Date.now(), "dd/MM/yyyy-HH:mm:ss")}.csv`}
      >
        <Button iconOnly className="p-0 mr-3">
          <ActionItem>
            <Circle>
              <FontAwesomeIcon icon={faDownload} color="#fff" />
            </Circle>
            <div className="mx-3">
              <div className="name">Export as CSV</div>
            </div>
          </ActionItem>
        </Button>
      </CSVLink>
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
            maxWidth: "1200px",
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

            <div className="d-flex">
              {renderExportEmployeeData()}

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
            ) : teammates && teammates.length > 0 ? (
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
                      <img
                        src={getDefaultIconIfPossible(salaryToken)}
                        alt={salaryToken}
                        width="16"
                      />{" "}
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

                      {/* <div className="circle circle-grey">
                        <FontAwesomeIcon icon={faEdit} color="#7367f0" />
                      </div> */}
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
