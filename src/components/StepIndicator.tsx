import './StepIndicator.css';

interface StepIndicatorProps {
  steps: string[];
  currentStep: number;
}

export const StepIndicator = ({ steps, currentStep }: StepIndicatorProps) => (
  <ol className="step-indicator">
    {steps.map((step, index) => {
      const isActive = index === currentStep;
      const isCompleted = index < currentStep;
      return (
        <li key={step} className={`step-indicator__item ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
          <span className="step-indicator__circle">{index + 1}</span>
          <span className="step-indicator__label">{step}</span>
        </li>
      );
    })}
  </ol>
);

export default StepIndicator;
