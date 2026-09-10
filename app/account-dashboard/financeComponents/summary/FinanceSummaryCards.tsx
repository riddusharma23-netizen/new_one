'use client';

import {
  GraduationCap,
  Hospital,
  Pill,
  Stethoscope,
  Users,
  Wallet,
  TrendingUp,
  Landmark,
} from 'lucide-react';

const cards = [
  {
    title: 'School Fees Income',
    amount: '₹12,45,000',
    icon: GraduationCap,
    bg: 'bg-blue-50',
    iconBg: 'bg-blue-600',
    text: 'text-blue-700',
  },
  {
    title: 'Clinic Income',
    amount: '₹3,85,000',
    icon: Hospital,
    bg: 'bg-green-50',
    iconBg: 'bg-green-600',
    text: 'text-green-700',
  },
  {
    title: 'Medicine Expenses',
    amount: '₹92,500',
    icon: Pill,
    bg: 'bg-red-50',
    iconBg: 'bg-red-600',
    text: 'text-red-700',
  },
  {
    title: 'Doctors Fees',
    amount: '₹1,45,000',
    icon: Stethoscope,
    bg: 'bg-orange-50',
    iconBg: 'bg-orange-600',
    text: 'text-orange-700',
  },
  {
    title: 'Teachers Salary',
    amount: '₹5,20,000',
    icon: Users,
    bg: 'bg-indigo-50',
    iconBg: 'bg-indigo-600',
    text: 'text-indigo-700',
  },
  {
    title: 'Total Expenses',
    amount: '₹9,85,000',
    icon: Wallet,
    bg: 'bg-pink-50',
    iconBg: 'bg-pink-600',
    text: 'text-pink-700',
  },
  {
    title: 'Net Profit',
    amount: '₹6,45,000',
    icon: TrendingUp,
    bg: 'bg-emerald-50',
    iconBg: 'bg-emerald-600',
    text: 'text-emerald-700',
  },
  {
    title: 'Bank Balance',
    amount: '₹18,75,000',
    icon: Landmark,
    bg: 'bg-cyan-50',
    iconBg: 'bg-cyan-600',
    text: 'text-cyan-700',
  },
];

export default function FinanceSummaryCards() {
  return (
    <section>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {cards.map((card, index) => {

          const Icon = card.icon;

          return (

            <div
              key={index}
              className={`${card.bg} rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-lg transition-all duration-300`}
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-slate-500">
                    {card.title}
                  </p>

                  <h2 className={`mt-2 text-2xl font-bold ${card.text}`}>
                    {card.amount}
                  </h2>

                  <p className="mt-3 text-xs text-green-600">
                    +12.5% this month
                  </p>

                </div>

                <div
                  className={`h-14 w-14 rounded-xl ${card.iconBg} flex items-center justify-center text-white`}
                >
                  <Icon size={28} />
                </div>

              </div>

            </div>

          );
        })}

      </div>

    </section>
  );
}