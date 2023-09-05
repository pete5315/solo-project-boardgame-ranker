import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Link } from "@mui/material";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function HorizontalNonLinearStepper() {
  let history = useHistory();
  const activeStep = useSelector((store) => store.currentStep);

  function handleNext(index) {
    history.push(address[index]);
  }

  const steps = ["Select List", "Add games", "Rank Games", "Ranked List"];
  const address = ["/user", "/inputs", "/rank", "/list"];

  function handleClick(label) {
    console.log("hello");
    dispatch({ type: "SET_CURRENT_STEP", payload: label });
  }

  return (
    <Box sx={{ width: "100%" }}>
      <Stepper activeStep={activeStep} onSelectionChange={() => handleClick}>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};
          return (
            <Step
              key={label}
              {...stepProps}
              sx={{
                "& .MuiStepLabel-root .Mui-completed": {
                  color: "grey.500",
                },
                "& .MuiStepLabel-label.Mui-completed.MuiStepLabel-alternativeLabel":
                  {
                    color: "grey.500",
                  },
                "& .MuiStepLabel-label.Mui-active.MuiStepLabel-alternativeLabel":
                  {
                    color: "common.white",
                  },
              }}
            >
              <Link to={address[index]}>
                <Button onClick={() => handleNext(index)} sx={{ mr: 1 }}>
                  <StepLabel {...labelProps}>
                    <div>{label}</div>
                  </StepLabel>
                </Button>
              </Link>
            </Step>
          );
        })}
      </Stepper>
    </Box>
  );
}
