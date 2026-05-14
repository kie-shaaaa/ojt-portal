import { JSX } from "react";

type FormStepperProps = {
  currentStep: number;
};

export const FormStepper = ({ currentStep }: FormStepperProps): JSX.Element => {
  const steps = [
    {
      id: 1,
      label: "Personal Details",
    },
    {
      id: 2,
      label: "OJT Information",
    },
    {
      id: 3,
      label: "Documents",
    },
    {
      id: 4,
      label: "Data Privacy",
    },
  ];

  const getStatus = (stepId: number): "completed" | "current" | "upcoming" => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "upcoming";
  };

  const progressPercentage = ((currentStep - 1) / 3) * 100;

  return (
    <section className="flex flex-col items-center px-12 py-6 relative self-stretch w-full flex-[0_0_auto] bg-white" aria-label="Application progress">
      <div className="relative flex w-full max-w-4xl items-center justify-between">
        <div aria-hidden="true" className="absolute left-0 right-0 top-5 h-0.5 bg-slate-200" />
        <div aria-hidden="true" className="absolute left-0 top-5 h-0.5 bg-green-500" style={{ width: `${progressPercentage}%` }} />
        <ol className="relative z-10 flex w-full items-center justify-between">
          {steps.map((step) => {
            const status = getStatus(step.id);
            const isCompleted = status === "completed";
            const isCurrent = status === "current";

            return (
              <li key={step.id} className="inline-flex flex-col items-center relative flex-[0_0_auto]">
                <div
                  className={`flex w-10 h-10 items-center justify-center relative rounded-full ${
                    isCompleted
                      ? "bg-green-500"
                      : isCurrent
                        ? "bg-blue-700"
                        : "bg-slate-200"
                  }`}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCurrent ? (
                    <div className="absolute top-0 left-[calc(50.00%_-_20px)] w-10 h-10 bg-[#ffffff01] rounded-full shadow-[0px_2px_4px_-2px_#0000001a,0px_4px_6px_-1px_#0000001a,0px_0px_0px_2px_#0047ab33]" />
                  ) : null}

                  <div
                    className={`relative flex items-center justify-center w-fit [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-base text-center tracking-[0] leading-6 whitespace-nowrap ${
                      isCompleted || isCurrent ? "text-white" : "text-slate-400"
                    }`}
                  >
                    {step.id}
                  </div>
                </div>
                <div className="inline-flex flex-col items-start pt-2 pb-0 px-0 relative flex-[0_0_auto]">
                  <div
                    className={`relative flex items-center w-fit [font-family:'Nimbus_Sans-Bold',Helvetica] font-bold text-xs tracking-[0] leading-4 whitespace-nowrap ${
                      isCompleted
                        ? "text-green-600"
                        : isCurrent
                          ? "text-blue-700"
                          : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default FormStepper;