"use client";
import { createContext, useContext } from "react";

interface PlanContextType {
  isFreeUser: boolean;

  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
}

// Provide default values
const PlanContext = createContext<PlanContextType>({
  isFreeUser: true,
  hasProPlan: false,
  hasEnterprisePlan: false
});

export default function PlanProvider({
  children,
  hasProPlan,
  hasEnterprisePlan
}: {
  children: React.ReactNode;
  hasProPlan: boolean;
  hasEnterprisePlan: boolean;
}) {
  const isFreeUser = !hasProPlan && !hasEnterprisePlan;
  return (
    <PlanContext.Provider
      value={{
        isFreeUser,
        hasProPlan,
        hasEnterprisePlan
      }}
    >
      {children}
    </PlanContext.Provider>
  );
}

export const usePlan = () => {
  const context = useContext(PlanContext);
  if (context === undefined) {
    throw new Error("usePlan needs to be inside the provider");
  }

  return context;
};
