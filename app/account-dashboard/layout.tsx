'use client';

import { useState } from "react";
import FinanceSidebar from "./financeComponents/sidebar/FinanceSidebar";
import DashboardHeader from "./financeComponents/DashboardHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <FinanceSidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      <DashboardHeader collapsed={collapsed} />

      <main
        className={`
          pt-20
          transition-all
          duration-300
          ml-0
          ${collapsed ? "lg:ml-24" : "lg:ml-72"}
        `}
      >
        {children}
      </main>
    </>
  );
}