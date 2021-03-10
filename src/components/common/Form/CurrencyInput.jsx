import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExchangeAlt } from "@fortawesome/free-solid-svg-icons";
import { CurrencyInput } from "./styles";
import Button from "components/common/Button";

const MultiCurrencyInputField = ({
  name,
  id,
  label,
  register,
  required,
  pattern,
  type,
  labelStyle = {},
  conversionRate,
  onChange,
  value,
  tokenName,
  selectedTokenDetails,
  showUsdOnly = false,
  ...rest
}) => {
  const [usdValueConvertedToTokens, setUsdValueConvertedToTokens] = useState(
    ""
  );
  const [toggleFlex, setToggleFlex] = useState(false);
  const [currentTokenName, setCurrentTokenName] = useState();

  const handleTokenValueChange = (e) => {
    setUsdValueConvertedToTokens(e.target.value);
    const tokenValue = e.target.value
      ? parseFloat(e.target.value * conversionRate).toFixed(4)
      : "";
    onChange(tokenValue);
  };

  const handleUsdValueChange = (e) => {
    const newConversionValue = e.target.value
      ? parseFloat(e.target.value / conversionRate).toFixed(4)
      : "";
    setUsdValueConvertedToTokens(newConversionValue);
    onChange(e.target.value);
  };

  useEffect(() => {
    if (!value) {
      setUsdValueConvertedToTokens("");
    } else {
      const newConversionValue = value
        ? parseFloat(value / conversionRate).toFixed(4)
        : "";
      if (!usdValueConvertedToTokens)
        setUsdValueConvertedToTokens(newConversionValue);
    }
  }, [value, conversionRate, usdValueConvertedToTokens]);

  useEffect(() => {
    // reset the conversion value so that it gets
    // calculated automatically
    if (!currentTokenName) setCurrentTokenName(tokenName);
    else setUsdValueConvertedToTokens("");
  }, [tokenName, currentTokenName]);

  const handleToggleFlex = () => {
    setToggleFlex((flex) => !flex);
  };

  const renderOnlyUsdInput = () => (
    <CurrencyInput className="position-relative">
      <div className="d-flex align-items-center">
        <div className="usdAmount">
          <span>US$</span>
          <input
            name={name}
            id={id || name}
            // ref={register({ required, pattern })}
            type={type}
            placeholder="0.00"
            value={value}
            onChange={handleUsdValueChange}
            step=".0001"
            {...rest}
          />
        </div>
      </div>
    </CurrencyInput>
  );

  const renderCurrencyInput = () => (
    <CurrencyInput className="position-relative">
      <div className="d-flex align-items-center">
        <div
          className="d-flex w-100"
          style={{
            flexDirection: toggleFlex ? "column-reverse" : "column",
          }}
        >
          <div className="usdAmount">
            <span>US$</span>
            <input
              name={name}
              id={id || name}
              // ref={register({ required, pattern })}
              type={type}
              placeholder="0.00"
              value={value}
              onChange={handleUsdValueChange}
              step=".0001"
              {...rest}
            />
          </div>
          <div className="tokenAmount">
            <span>{tokenName}</span>
            <input
              name={"convertion"}
              type={"number"}
              placeholder="0.00"
              value={usdValueConvertedToTokens}
              onChange={handleTokenValueChange}
            />
          </div>
        </div>
        <div>
          <div className="convert">
            <Button
              iconOnly
              type="button"
              onClick={handleToggleFlex}
              style={{ color: "#373737" }}
            >
              <FontAwesomeIcon icon={faExchangeAlt} color="#373737" />
            </Button>
          </div>
        </div>
      </div>
    </CurrencyInput>
  );

  return showUsdOnly ? renderOnlyUsdInput() : renderCurrencyInput();
};

export default MultiCurrencyInputField;
