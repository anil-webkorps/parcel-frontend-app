import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";

import { Card } from "components/common/Card";
import Button from "components/common/Button";
import viewTeamsReducer from "store/view-teams/reducer";
import { getTeams } from "store/view-teams/actions";
import viewTeamsSaga from "store/view-teams/saga";
import {
  makeSelectDepartments,
  makeSelectTeammatesCount,
  makeSelectLoading as makeSelectLoadingTeams,
} from "store/view-teams/selectors";
import viewTeammatesReducer from "store/view-teammates/reducer";
import { getAllTeammates } from "store/view-teammates/actions";
import viewTeammatesSaga from "store/view-teammates/saga";
import {
  makeSelectTeammates,
  makeSelectLoading as makeSelectLoadingTeammates,
} from "store/view-teammates/selectors";
import { useInjectReducer } from "utils/injectReducer";
import { useInjectSaga } from "utils/injectSaga";
import {
  makeSelectOrganisationType,
  makeSelectOwnerSafeAddress,
} from "store/global/selectors";
import Loading from "components/common/Loading";

import TeamMembersPng from "assets/images/team-members.png";
import ControlledInput from "components/common/Input";
import TeamsDropdown from "./TeamsDropdown";
import AddPeopleDropdown from "./AddPeopleDropdown";
import SearchByTeamDropdown from "./SearchByTeamDropdown";
import ExportButton from "./ExportButton";
import Avatar from "components/common/Avatar";
import {
  Table,
  TableHead,
  TableBody,
  TableTitle,
} from "components/common/Table";

import { Container, FiltersCard } from "./styles";
import { useLocalStorage } from "hooks";
import { getDecryptedDetails } from "utils/encryption";
import Img from "components/common/Img";
import { getDefaultIconIfPossible } from "constants/index";
import { makeSelectTokenIcons } from "store/tokens/selectors";
import PeopleDetailsSidebar from "./PeopleDetailsSidebar";
import { makeSelectIsPeopleDetailsOpen } from "store/layout/selectors";
import { togglePeopleDetails, setPeopleDetails } from "store/layout/actions";

const viewTeamsKey = "viewTeams";
const viewTeammatesKey = "viewTeammates";

export default function People() {
  const [encryptionKey] = useLocalStorage("ENCRYPTION_KEY");

  const [isNewUser, setIsNewUser] = useState();
  const [searchPeopleValue, setSearchPeopleValue] = useState("");
  const [teammatesByAlphabet, setTeammatesByAlphabet] = useState();
  const [sortedTeammates, setSortedTeammates] = useState();
  const [teammatesByDepartment, setTeammatesByDepartment] = useState();

  useInjectReducer({
    key: viewTeamsKey,
    reducer: viewTeamsReducer,
  });
  useInjectReducer({ key: viewTeammatesKey, reducer: viewTeammatesReducer });

  useInjectSaga({ key: viewTeamsKey, saga: viewTeamsSaga });
  useInjectSaga({ key: viewTeammatesKey, saga: viewTeammatesSaga });

  const dispatch = useDispatch();
  const allDepartments = useSelector(makeSelectDepartments());
  const teammatesCount = useSelector(makeSelectTeammatesCount());
  const loadingTeams = useSelector(makeSelectLoadingTeams());
  const loadingTeammates = useSelector(makeSelectLoadingTeammates());
  const ownerSafeAddress = useSelector(makeSelectOwnerSafeAddress());
  const allTeammates = useSelector(makeSelectTeammates());
  const organisationType = useSelector(makeSelectOrganisationType());
  const icons = useSelector(makeSelectTokenIcons());

  useEffect(() => {
    dispatch(getTeams(ownerSafeAddress));
    dispatch(getAllTeammates(ownerSafeAddress));
  }, [dispatch, ownerSafeAddress]);

  useEffect(() => {
    if (allDepartments && allDepartments.length === 0) {
      setIsNewUser(true);
    }
  }, [allDepartments]);

  const handleSearchPeople = (e) => {
    setSearchPeopleValue(e.target.value);
  };

  useEffect(() => {
    if (
      allTeammates &&
      allTeammates.length > 0 &&
      encryptionKey &&
      organisationType
    ) {
      const sortedDecryptedTeammates = allTeammates
        .map(({ data, ...rest }) => {
          const {
            firstName,
            lastName,
            salaryAmount,
            salaryToken,
            address,
          } = getDecryptedDetails(data, encryptionKey, organisationType);
          return {
            firstName,
            lastName,
            salaryAmount,
            salaryToken,
            address,
            ...rest,
          };
        })
        .sort((a, b) => (a.firstName > b.firstName ? 1 : -1));

      setSortedTeammates(sortedDecryptedTeammates);

      const teammatesByAlphabet = sortedDecryptedTeammates.reduce(
        (accumulator, teammate) => {
          const alphabet = teammate.firstName[0];
          if (!accumulator[alphabet]) {
            accumulator[alphabet] = [teammate];
          } else {
            accumulator[alphabet].push(teammate);
          }

          return accumulator;
        },
        {}
      );

      setTeammatesByAlphabet(teammatesByAlphabet);

      const teammatesByDepartment = sortedDecryptedTeammates.reduce(
        (accumulator, teammate) => {
          const departmentName = teammate.departmentName;
          if (!accumulator[departmentName]) {
            accumulator[departmentName] = [teammate];
          } else {
            accumulator[departmentName].push(teammate);
          }

          return accumulator;
        },
        {}
      );

      setTeammatesByDepartment(teammatesByDepartment);
    }
  }, [allTeammates, encryptionKey, organisationType]);

  const openSidebar = (peopleDetails) => {
    dispatch(togglePeopleDetails(true));
    dispatch(setPeopleDetails(peopleDetails));
  };

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
          <div>
            <ControlledInput
              type="text"
              id="search-people"
              name="search-people"
              placeholder={"Search for people"}
              onChange={handleSearchPeople}
              value={searchPeopleValue}
            />
          </div>
        </FiltersCard>
        <FiltersCard className="mt-3">
          <div>
            <div className="title mb-0">Showing {teammatesCount} teammates</div>
          </div>
          <div className="flex">
            <TeamsDropdown />
            <AddPeopleDropdown />
            <SearchByTeamDropdown />
            <ExportButton />
          </div>
        </FiltersCard>
        <Table style={{ marginTop: "3rem" }}>
          <TableHead>
            <tr>
              <th style={{ width: "25%" }}>Teammates</th>
              <th style={{ width: "20%" }}>Team</th>
              <th style={{ width: "20%" }}>Disbursement</th>
              <th style={{ width: "30%" }}>Address</th>
            </tr>
          </TableHead>
          <TableBody>
            {teammatesByAlphabet &&
              Object.keys(teammatesByAlphabet).map((alphabet) => (
                <React.Fragment key={alphabet}>
                  <TableTitle>{alphabet}</TableTitle>
                  {teammatesByAlphabet[alphabet].map(
                    ({
                      firstName,
                      lastName,
                      departmentName,
                      departmentId,
                      peopleId,
                      salaryAmount,
                      salaryToken,
                      address,
                    }) => (
                      <tr
                        key={peopleId}
                        onClick={() =>
                          openSidebar({
                            firstName,
                            lastName,
                            departmentName,
                            departmentId,
                            peopleId,
                            salaryAmount,
                            salaryToken,
                            address,
                          })
                        }
                      >
                        <td className="d-flex align-items-center">
                          <Avatar
                            className="mr-3"
                            firstName={firstName}
                            lastName={lastName}
                          />
                          <div>
                            {firstName} {lastName}
                          </div>
                        </td>
                        <td>{departmentName}</td>
                        <td>
                          <Img
                            src={getDefaultIconIfPossible(salaryToken, icons)}
                            alt="token"
                            className="mr-1"
                            width="16"
                          />{" "}
                          <span>
                            {salaryAmount} {salaryToken}
                          </span>
                        </td>
                        <td>{address}</td>
                      </tr>
                    )
                  )}
                </React.Fragment>
              ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div>
      {loadingTeams || loadingTeammates ? (
        <div
          className="d-flex align-items-center justify-content-center"
          style={{ height: "80vh" }}
        >
          <Loading color="primary" width="50px" height="50px" />
        </div>
      ) : !isNewUser ? (
        renderForNormalUser()
      ) : (
        renderForNewUser()
      )}
    </div>
  );
}
