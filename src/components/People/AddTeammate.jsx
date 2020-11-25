import React, { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLongArrowAltLeft,
  faLongArrowAltRight,
} from "@fortawesome/free-solid-svg-icons";
import { Col, Row } from "reactstrap";
import { useForm } from "react-hook-form";

import { Info } from "components/Dashboard/styles";
import { SideNavContext } from "context/SideNavContext";
import { Card } from "components/common/Card";
import Button from "components/common/Button";
import { Input, ErrorMessage } from "components/common/Form";

import { Container, Title, Heading, ChooseDepartment } from "./styles";

export default function AddTeammate() {
  const [toggled] = useContext(SideNavContext);
  const { register, errors, handleSubmit } = useForm();

  const onSubmit = (values) => {
    console.log({ values });
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
        </div>
      </Info>

      <Container
        style={{
          maxWidth: toggled ? "900px" : "1280px",
          transition: "all 0.25s linear",
        }}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="add-teammate">
            <Title>Add Teammate</Title>
            <Heading>PERSONAL DETAILS</Heading>
            <Row className="mb-4">
              <Col lg="6" sm="12">
                <Input
                  type="text"
                  name="firstName"
                  register={register}
                  required={`First Name is required`}
                  placeholder="First Name"
                />
                <ErrorMessage name="firstName" errors={errors} />
              </Col>
              <Col lg="6" sm="12">
                <Input
                  type="text"
                  name="lastName"
                  register={register}
                  required={`Last Name is required`}
                  placeholder="Last Name"
                />
                <ErrorMessage name="lastName" errors={errors} />
              </Col>
            </Row>

            <Heading>SALARY PAYMENT DETAILS</Heading>
            <Row className="mb-3">
              <Col lg="12">
                <Input
                  type="text"
                  name="address"
                  register={register}
                  required={`Wallet Address is required`}
                  pattern={{
                    value: /^0x[a-fA-F0-9]{40}$/g,
                    message: "Invalid Ethereum Address",
                  }}
                  placeholder="Wallet Address"
                />
                <ErrorMessage name="address" errors={errors} />
              </Col>
            </Row>

            <Row className="mb-4">
              <Col lg="6" sm="12">
                <Input
                  type="number"
                  name="salary"
                  register={register}
                  required={`Salary is required`}
                  placeholder="Salary"
                />
                <ErrorMessage name="salary" errors={errors} />
              </Col>
              <Col lg="6" sm="12">
                <Input
                  name="currency"
                  register={register}
                  required={`Token is required`}
                  placeholder="Select Token"
                />
                <ErrorMessage name="currency" errors={errors} />
              </Col>
            </Row>

            <Heading>DEPARTMENT</Heading>
            <ChooseDepartment>
              <div>
                <div className="choose-title">Choose Department</div>
                <div className="choose-subtitle">
                  Employee will be paid as per department date.
                </div>
              </div>
              <Button iconOnly className="p-0">
                <div
                  className="circle p-0 m-0"
                  style={{ width: "36px", height: "36px" }}
                >
                  <FontAwesomeIcon icon={faLongArrowAltRight} color="#fff" />
                </div>
              </Button>
            </ChooseDepartment>

            <Button large type="submit" className="mt-3">
              Add Employee
            </Button>
          </Card>
        </form>
      </Container>
    </div>
  );
}
