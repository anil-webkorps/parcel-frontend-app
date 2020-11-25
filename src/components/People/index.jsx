import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";

import { Container } from "./styles";

export default function People() {
  const [toggled] = useContext(SideNavContext);

  const renderForNewUser = () => {
    return (
      <div className="new-user">
        <Card className="p-4" style={{ minHeight: "532px" }}>
          <div className="card-title">
            Hassle- Free team and People management
          </div>
          <div className="card-subtitle">
            Add team members, set-up your teams and their payroll. Enjoy a
            hassle free payroll management
          </div>

          <Button
            iconOnly
            // onClick={() => console.log("add")}
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
        {renderForNewUser()}
      </Container>
    </div>
  );
}
