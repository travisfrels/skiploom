import type { Step } from '../types';
import Card from './Card';

interface StepListProps {
  steps: Step[];
}

function StepList({ steps }: StepListProps) {
  const sortedSteps = [...steps].sort((a, b) => a.orderIndex - b.orderIndex);

  return (
    <Card>
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Instructions</h3>
      <ol className="space-y-4">
        {sortedSteps.map((step) => (
          <li key={step.orderIndex} className="flex gap-4">
            <span className="flex-shrink-0 w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-medium">
              {step.orderIndex}
            </span>
            <p className="text-slate-600 pt-1">{step.instruction}</p>
          </li>
        ))}
      </ol>
    </Card>
  );
}

export default StepList;
