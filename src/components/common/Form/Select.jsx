import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { CustomSelect } from "./styles";

const SelectField = ({ name, register, required, options, ...rest }) => (
  <CustomSelect>
    <select name={name} ref={register({ required })} {...rest}>
      <option value="" selected disabled>
        Select Token
      </option>
      {options &&
        options.map(({ name, value }) => (
          <option key={value} value={value}>
            {name}
          </option>
        ))}
    </select>
    <span className="custom-arrow">
      <FontAwesomeIcon className="arrow" icon={faChevronDown} color="#373737" />
    </span>
  </CustomSelect>
);

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ),
};

export default SelectField;
