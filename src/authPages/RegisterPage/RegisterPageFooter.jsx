import React from "react";
import CustomPrimaryButton from "../../shared/components/CustomPrimaryButton";
import RedirectInfo from "../../shared/components/RedirectInfo";
import { useNavigate } from "react-router-dom";

import ToolTip from "@mui/material/Tooltip";

const getFormNotValidMessage = () => {
  return "Username should contains between 3 and 12 characters and password should contains between 6 and 12 character. Also correct e-mail address should provided";
};
const getFormValidMessage = () => {
  return "Press to register";
};
const RegisterPageFooter = ({ handleRegister, isFormValid }) => {
  const navigate = useNavigate();

  const handlePushToLoginPage = () => {
    navigate("/login");
  };
  return (
    <>
      <ToolTip
        title={!isFormValid ? getFormNotValidMessage() : getFormValidMessage()}
      >
        <span>
          <CustomPrimaryButton
            label="Register"
            additionalStyles={{ marginTop: "30px" }}
            disabled={!isFormValid}
            onClick={handleRegister}
            isFormValid={isFormValid}
          />
        </span>
      </ToolTip>

      <RedirectInfo
        redirectText="Already have an account ?"
        additionalStyles={{ marginTop: "5px" }}
        redirectHandler={handlePushToLoginPage}
      />
    </>
  );
};

export default RegisterPageFooter;
