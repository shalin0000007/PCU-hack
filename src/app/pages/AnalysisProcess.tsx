import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  { id: 1, label: "Fetching company data", duration: 2000 },
  { id: 2, label: "Processing GST returns", duration: 2500 },
  { id: 3, label: "Comparing bank transactions", duration: 3000 },
  { id: 4, label: "Detecting anomalies", duration: 2500 },
  { id: 5, label: "Generating risk score", duration: 2000 },
];

export default function AnalysisProcess() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let stepIndex = 0;
    let accumulatedTime = 0;

    const timer = setInterval(() => {
      if (stepIndex < steps.length) {
        setCurrentStep(stepIndex + 1);
        setProgress(((stepIndex + 1) / steps.length) * 100);
        accumulatedTime += steps[stepIndex].duration;
        stepIndex++;
      } else {
        clearInterval(timer);
        setTimeout(() => {
          navigate(`/credit-analysis/${id}`);
        }, 500);
      }
    }, steps[stepIndex]?.duration || 2000);

    return () => clearInterval(timer);
  }, [navigate, id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f0fdf4] via-[#fafafa] to-[#ecfdf5] dark:from-[#0f172a] dark:via-[#1e293b] dark:to-[#0f766e]/20 flex items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-white/90 dark:bg-[#1e293b]/90 backdrop-blur-xl rounded-[20px] shadow-2xl border border-white/50 dark:border-[#334155] p-8 space-y-8">
          <div className="text-center space-y-2">
            <motion.div
              className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-[#00b386] to-[#059669] rounded-full mb-4 shadow-lg"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Loader2 className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl text-[#1a1a1a] dark:text-white">Analyzing Credit Risk</h1>
            <p className="text-sm text-[#737373] dark:text-[#94a3b8]">
              Processing financial data with AI-powered analysis
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#737373] dark:text-[#94a3b8]">Progress</span>
              <span className="text-[#00b386]">{Math.round(progress)}%</span>
            </div>
            <div className="w-full h-3 bg-[#e5e5e5] dark:bg-[#334155] rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-[#00b386] to-[#059669] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              />
            </div>
          </div>

          <div className="space-y-3">
            {steps.map((step, index) => {
              const isCompleted = currentStep > step.id;
              const isCurrent = currentStep === step.id;
              const isPending = currentStep < step.id;

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 ${isCurrent
                    ? "bg-[#e5f7f3] dark:bg-[#0f766e]/20 border border-[#00b386]"
                    : isCompleted
                      ? "bg-[#f5f5f5] dark:bg-[#334155]"
                      : "bg-white dark:bg-transparent border border-[#e5e5e5] dark:border-[#334155]"
                    }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isCompleted
                      ? "bg-[#10b981]"
                      : isCurrent
                        ? "bg-[#00b386]"
                        : "bg-[#e5e5e5] dark:bg-[#475569]"
                      }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5 text-white" />
                    ) : isCurrent ? (
                      <Loader2 className="w-5 h-5 text-white animate-spin" />
                    ) : (
                      <span className="text-sm text-[#737373] dark:text-[#94a3b8]">{step.id}</span>
                    )}
                  </div>
                  <span
                    className={`text-sm transition-colors duration-300 ${isCompleted
                      ? "text-[#10b981]"
                      : isCurrent
                        ? "text-[#00b386]"
                        : "text-[#737373] dark:text-[#94a3b8]"
                      }`}
                  >
                    {step.label}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="pt-4 border-t border-[#e5e5e5] dark:border-[#334155] text-center">
            <p className="text-xs text-[#737373] dark:text-[#94a3b8]">
              This may take a few moments. Please do not close this window.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}