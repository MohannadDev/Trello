"use client";

import PlanProvider from "@/lib/contexts/plan-context";
import { useAuth } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { has } = useAuth();
  const hasProPlan = has?.({ plan: "pro_user" }) || false;
  const hasEnterprisePlan = has?.({ plan: "enterprise_user" }) || false;

  return (
    <PlanProvider hasProPlan={hasProPlan} hasEnterprisePlan={hasEnterprisePlan}>
      {children}
    </PlanProvider>
  );
}