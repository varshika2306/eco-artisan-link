import { CheckCircle, Circle, Package, Truck, Home } from "lucide-react";

type TimelineProps = {
  timeline: {
    ordered: boolean;
    packed: boolean;
    inTransit: boolean;
    delivered: boolean;
  };
};

export function OrderTimeline({ timeline }: TimelineProps) {
  const steps = [
    { key: "ordered", label: "Order Placed", icon: Package, completed: timeline.ordered },
    { key: "packed", label: "Packed", icon: Package, completed: timeline.packed },
    { key: "inTransit", label: "In Transit", icon: Truck, completed: timeline.inTransit },
    { key: "delivered", label: "Delivered", icon: Home, completed: timeline.delivered }
  ];

  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = step.completed;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.key} className="flex-1 relative">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-glow"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle className="h-6 w-6" />
                  ) : (
                    <Icon className="h-6 w-6" />
                  )}
                </div>
                <span
                  className={`mt-2 text-xs font-medium text-center ${
                    isCompleted ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {!isLast && (
                <div
                  className={`absolute top-6 left-1/2 w-full h-0.5 -z-10 transition-all duration-500 ${
                    steps[index + 1].completed ? "bg-primary" : "bg-border"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>

      {timeline.inTransit && !timeline.delivered && (
        <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground animate-pulse">
          <Truck className="h-4 w-4 text-primary" />
          <span>Package is on the way...</span>
        </div>
      )}
    </div>
  );
}
