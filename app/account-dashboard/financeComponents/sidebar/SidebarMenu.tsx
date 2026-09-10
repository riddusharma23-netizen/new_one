'use client';

import {
  LayoutDashboard,
  GraduationCap,
  IndianRupee,
  Wallet,
  BadgeIndianRupee,
  Wrench,
  Building2,
  Hospital,
  Trophy,
  ShieldCheck,
  Landmark,
  FileBarChart2,
  Settings,
} from "lucide-react";

import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";

export default function SidebarMenu() {
  return (
    <nav className="space-y-2">

      {/* Dashboard */}

      <SidebarItem
        title="Dashboard"
        href="/account-dashboard"
        icon={LayoutDashboard}
      />

      {/* Academic */}

      <SidebarDropdown
        title="Academic"
        icon={GraduationCap}
        childrenItems={[
          {
            title: "Academic Dashboard",
            href: "/account-dashboard/academic",
          },
          {
            title: "Library Expense",
            href: "/account-dashboard/academic/library",
          },
          {
            title: "Laboratory Expense",
            href: "/account-dashboard/academic/laboratory",
          },
          {
            title: "Stationery Expense",
            href: "/account-dashboard/academic/stationery",
          },
          {
            title: "Printing Expense",
            href: "/account-dashboard/academic/printing",
          },
        ]}
      />

      {/* Income */}

      <SidebarDropdown
        title="Income"
        icon={IndianRupee}
        childrenItems={[
          {
            title: "Income Overview",
            href: "/account-dashboard/income",
          },
          {
            title: "School Fees",
            href: "/account-dashboard/income/school-fees",
          },
          {
            title: "Clinic Income",
            href: "/account-dashboard/income/clinic-income",
          },
          {
            title: "Other Income",
            href: "/account-dashboard/income/other-income",
          },
          {
            title: "Annual Income",
            href: "/account-dashboard/income/annual-income",
          },
        ]}
      />

      {/* Expenses */}

      <SidebarDropdown
        title="Expenses"
        icon={Wallet}
        childrenItems={[
          {
            title: "Expense Dashboard",
            href: "/account-dashboard/expenses",
          },
          {
            title: "Annual Expense",
            href: "/account-dashboard/expenses/annual",
          },
        ]}
      />

      {/* Salary */}

      <SidebarDropdown
        title="Salary"
        icon={BadgeIndianRupee}
        childrenItems={[
          {
            title: "Teachers Salary",
            href: "/account-dashboard/salary/teachers",
          },
          {
            title: "Doctors Fees",
            href: "/account-dashboard/salary/doctors",
          },
          {
            title: "Compounder Salary",
            href: "/account-dashboard/salary/compounder",
          },
          {
            title: "Office Staff Salary",
            href: "/account-dashboard/salary/office-staff",
          },
        ]}
      />

      {/* Utility */}

      <SidebarDropdown
        title="Utility Bills"
        icon={Building2}
        childrenItems={[
          {
            title: "Electricity Bills",
            href: "/account-dashboard/utility/electricity",
          },
          {
            title: "Water Bills",
            href: "/account-dashboard/utility/water",
          },
          {
            title: "Internet Bills",
            href: "/account-dashboard/utility/internet",
          },
          {
            title: "Telephone Bills",
            href: "/account-dashboard/utility/telephone",
          },
        ]}
      />

      {/* Maintenance */}

      <SidebarDropdown
        title="Maintenance"
        icon={Wrench}
        childrenItems={[
          {
            title: "Campus Maintenance",
            href: "/account-dashboard/maintenance/campus",
          },
          {
            title: "Building Maintenance",
            href: "/account-dashboard/maintenance/building",
          },
          {
            title: "Furniture",
            href: "/account-dashboard/maintenance/furniture",
          },
          {
            title: "Equipment",
            href: "/account-dashboard/maintenance/equipment",
          },
        ]}
      />

      {/* Clinic */}

      <SidebarDropdown
        title="Clinic"
        icon={Hospital}
        childrenItems={[
          {
            title: "Clinic Income",
            href: "/account-dashboard/clinic/income",
          },
          {
            title: "Medicine Purchase",
            href: "/account-dashboard/clinic/medicine",
          },
          {
            title: "Medical Equipment",
            href: "/account-dashboard/clinic/equipment",
          },
          {
            title: "Medical Consumables",
            href: "/account-dashboard/clinic/consumables",
          },
          {
            title: "Clinic Maintenance",
            href: "/account-dashboard/clinic/maintenance",
          },
        ]}
      />

      {/* Events */}

      <SidebarDropdown
        title="Events"
        icon={Trophy}
        childrenItems={[
          {
            title: "Sports Expenses",
            href: "/account-dashboard/events/sports",
          },
          {
            title: "Annual Function",
            href: "/account-dashboard/events/annual-function",
          },
          {
            title: "Cultural Event",
            href: "/account-dashboard/events/cultural",
          },
        ]}
      />

      {/* Housekeeping */}

      <SidebarDropdown
        title="Housekeeping"
        icon={ShieldCheck}
        childrenItems={[
          {
            title: "Cleaning",
            href: "/account-dashboard/housekeeping/cleaning",
          },
          {
            title: "Security",
            href: "/account-dashboard/housekeeping/security",
          },
        ]}
      />

      {/* Bank */}

      <SidebarItem
        title="Bank Details"
        href="/account-dashboard/bank"
        icon={Landmark}
      />

      {/* Reports */}

      <SidebarItem
        title="Reports"
        href="/account-dashboard/reports"
        icon={FileBarChart2}
      />

      {/* Settings */}

      <SidebarItem
        title="Settings"
        href="/account-dashboard/settings"
        icon={Settings}
      />

    </nav>
  );
}