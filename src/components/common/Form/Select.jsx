import React from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { CustomSelect } from "./styles";
//import { useForm } from "react-hook-form";

import { Controller } from "react-hook-form";

// const { register } = useForm();
const SelectField = ({ name, register, required, options, ...rest }) => {
  const defaultVal = rest.control.defaultValuesRef.current.team;
return (
  <>
    <Controller
      name={name}
      control={rest.control}
      rules={{ required }}
      render={({ onChange, value }) => (
        <CustomSelect>
          <select
            defaultValue={defaultVal ? defaultVal.value: ""}
            onChange={onChange}
            value={value}
            name={name}
            ref={register({ required})}
            {...rest}
          >
            <option value="" disabled>
              {rest.placeholder}
            </option>
            {options &&
              options.map(({ name, value, label }) => 
                {
                  return(
                    <>
                      {value &&
                      <option key={value} value={value}>
                        {name?name:label}
                      </option>
                      }
                    </>
                  )
                }
              )}
          </select>
          <span className="custom-arrow">
            <FontAwesomeIcon className="arrow" icon={faChevronDown} color="#373737" />
          </span>
        </CustomSelect>
      )}
    />
  </>
);
}

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
