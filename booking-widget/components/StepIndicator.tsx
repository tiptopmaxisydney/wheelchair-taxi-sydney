import React from "react";

export const STEP_LABELS = [
  "Journey Details",
  "Passenger Info & Requirements",
  "Your Details",
  "Confirm & Book",
];

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  return (
    <div className="flex items-start w-full mb-4 overflow-x-auto px-1 py-2">
      {STEP_LABELS.map((label, index) => {
        const step = index + 1;
        const isActive = step === currentStep;
        const isComplete = step < currentStep;
        return (
          <React.Fragment key={label}>
            <div className="flex flex-col items-center flex-shrink-0 min-w-[64px]">
              <div
                className={[
                  "w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                  isActive
                    ? "bg-[#0d1b2e] text-white ring-4 ring-[#0d1b2e]/15"
                    : isComplete
                    ? "bg-white text-[#0d1b2e] border-2 border-[#0d1b2e]"
                    : "bg-[#E9EAF0] text-[#9AA0B4]",
                ].join(" ")}
              >
                {isComplete ? "✓" : step}
              </div>
              <span
                className={[
                  "mt-2 text-xs text-center whitespace-nowrap",
                  isActive ? "text-[#0d1b2e] font-semibold" : "text-[#9AA0B4]",
                ].join(" ")}
              >
                {label}
              </span>
            </div>
            {step < STEP_LABELS.length && (
              <div
                className={[
                  "h-px flex-1 mx-1 mt-[18px] md:mt-[20px]",
                  isComplete ? "bg-[#0d1b2e]" : "bg-[#E9EAF0]",
                ].join(" ")}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StepIndicator;
