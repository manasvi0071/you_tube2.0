import React from "react";
import { Button } from "./ui/button";

type Plan = {
  name: string;
  limit: number | string;
  price: number;
};

const plans: Plan[] = [
  { name: "Free", limit: 5, price: 0 },
  { name: "Bronze", limit: 7, price: 10 },
  { name: "Silver", limit: 10, price: 50 },
  { name: "Gold", limit: "Unlimited", price: 100 },
];

const UpgradePlan = ({ onSelect }: { onSelect: (plan: Plan) => void }) => {
  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold text-center">Choose Your Plan</h2>
      <div className="grid grid-cols-2 gap-4">
        {plans.map((plan) => (
          <Button
            key={plan.name}
            onClick={() => onSelect(plan)}
            className="p-4 flex flex-col items-center border rounded shadow"
          >
            <div className="text-lg font-medium">{plan.name}</div>
            <div className="text-sm text-gray-500">
              {plan.limit} {typeof plan.limit === "number" ? "mins" : ""}
            </div>
            <div className="text-sm font-semibold">₹{plan.price}</div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default UpgradePlan;
