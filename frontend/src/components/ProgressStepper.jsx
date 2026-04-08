export default function ProgressStepper({ currentStep = 1 }) {
  const steps = [
    "Car Details",
    "Consent",
    "Upload ID",
    "Face Verification",
    "Trips",
  ];

  return (
    <div className="stepper-wrap">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isDone = stepNumber < currentStep;

        return (
          <div className="stepper-item" key={label}>
            <div className={`step-circle ${isDone ? "done" : ""} ${isActive ? "active" : ""}`}>
              {isDone ? "✓" : stepNumber}
            </div>
            <span className={`step-label ${isActive ? "active" : ""}`}>{label}</span>
            {index < steps.length - 1 && <div className={`step-line ${isDone ? "done" : ""}`} />}
          </div>
        );
      })}
    </div>
  );
}