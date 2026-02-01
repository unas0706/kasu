import React from "react";

function ProgressSteps({
  currentStep,
  onStepClick,
  selectedCategory,
  hasItems,
  hasSeat,
}) {
  const steps = [
    { number: 1, name: "Category", enabled: true },
    { number: 2, name: "Items", enabled: !!selectedCategory },
    { number: 3, name: "Seat", enabled: hasItems },
    { number: 4, name: "Payment", enabled: hasSeat },
  ];

  return (
    <div className="progress-steps">
      <div className="steps-container">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div
              className={`step ${step.number === currentStep ? "active" : ""} ${step.number < currentStep ? "completed" : ""} ${!step.enabled ? "disabled" : ""}`}
              onClick={() => step.enabled && onStepClick(step.number)}
            >
              <div className="step-number">{step.number}</div>
              <div className="step-name">{step.name}</div>
              {/* {index < steps.length - 1 && (
                <div className="step-line"></div>
              )} */}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default ProgressSteps;
