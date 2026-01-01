import { HealthScoreCard } from '@/components/Dashboard/HealthScoreCard';
import { DashboardView } from '@/components/Dashboard/DashboardView';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import React from "react";
import { LandingPage } from '@/components/LandingPage';

export default async function Dashboard() {
  const session = await getServerSession(authOptions);

  // If no session, show Landing Page instead of redirecting
  if (!session) {
    return <LandingPage />;
  }

  await dbConnect();

  // Fetch Transactions
  const transactions = await Transaction.find({ userId: session.user.id }).sort({ tanggal: -1 });

  // Fetch User Data for Debt and Budgets
  // Use lean() for performance
  const user = await User.findById(session.user.id).select('debts budgets hasSeenOnboarding').lean();
  const debts = user?.debts || [];

  // Calculate Transaction Stats
  const totalBalance = transactions.reduce((acc, curr) => acc + curr.jumlah, 0);
  const incomeThisMonth = transactions
    .filter(t => t.jumlah > 0)
    .reduce((acc, curr) => acc + curr.jumlah, 0);
  const expenseThisMonth = transactions
    .filter(t => t.jumlah < 0)
    .reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);

  // Calculate Debt Stats
  const receivables = debts.filter((d: any) => d.amount > 0).reduce((acc: number, curr: any) => acc + curr.amount, 0);
  const debtAmount = debts.filter((d: any) => d.amount < 0).reduce((acc: number, curr: any) => acc + Math.abs(curr.amount), 0);

  // Calculate Budget Stats (Server Side Aggregation)
  const budgets = user?.budgets || [];
  const budgetStats = budgets.map((b: any) => {
    // Filter transactions based on period
    const now = new Date();
    const period = b.period || 'monthly';

    const spent = transactions
      .filter(t => {
        if (t.kategori !== b.category || t.jumlah >= 0) return false;

        const tDate = new Date(t.tanggal);
        if (period === 'daily') {
          return tDate.toDateString() === now.toDateString();
        } else {
          return tDate.getMonth() === now.getMonth() && tDate.getFullYear() === now.getFullYear();
        }
      })
      .reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);

    return {
      ...b,
      _id: b._id.toString(), // Ensure ID is a string
      spent,
      period
    };
  });

  // Innovative Metric: "Real Net Worth" (Safe Money)
  // Balance + (Money people owe me) - (Money I owe)
  const netWorth = totalBalance + receivables - debtAmount;

  // Calculate Health Score Logic
  // 1. Savings Rate Score (Max 40) - Target 20% savings
  const income = transactions.filter(t => t.type === 'income' || t.jumlah > 0).reduce((acc, curr) => acc + curr.jumlah, 0); // Recalculate robustly
  const totalExpense = transactions.filter(t => t.jumlah < 0).reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);

  const realIncome = incomeThisMonth; // Reuse existing calculation
  const savingsRate = realIncome > 0 ? ((realIncome - expenseThisMonth) / realIncome) * 100 : 0;
  const savingsScore = Math.min((savingsRate / 20) * 40, 40); // 20% savings = 40 points

  // 2. Want Ratio Score (Max 30) - Target < 30% wants
  const wants = transactions.filter(t => t.type === 'want').reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0);
  const wantRatio = totalExpense > 0 ? (wants / totalExpense) * 100 : 0;
  let wantScore = 0;
  if (wantRatio <= 30) wantScore = 30; // Perfect
  else if (wantRatio <= 50) wantScore = 15; // Okay
  else wantScore = 0; // Bad

  // 3. Debt Ratio Score (Max 30) - Target 0 Debt
  // If Debt < 10% of Balance => Excellent
  const debtRatio = totalBalance > 0 ? (debtAmount / totalBalance) * 100 : (debtAmount > 0 ? 100 : 0);
  let debtScore = 0;
  if (debtRatio === 0) debtScore = 30;
  else if (debtRatio < 30) debtScore = 15;
  else debtScore = 0;

  const totalScore = Math.round(Math.max(savingsScore + wantScore + debtScore, 0));

  let grade = 'C';
  if (totalScore >= 90) grade = 'A+';
  else if (totalScore >= 80) grade = 'A';
  else if (totalScore >= 70) grade = 'B';
  else if (totalScore >= 50) grade = 'C';
  else grade = 'D';

  // Prepare Chart Data (Last 7 Days)
  const chartData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dailyTrans = transactions.filter(t =>
      new Date(t.tanggal).toDateString() === d.toDateString()
    );

    return {
      name: dayName,
      income: dailyTrans.filter(t => t.jumlah > 0).reduce((acc, curr) => acc + curr.jumlah, 0),
      expense: dailyTrans.filter(t => t.jumlah < 0).reduce((acc, curr) => acc + Math.abs(curr.jumlah), 0)
    };
  });

  // Pass serializable data
  const safeTransactions = JSON.parse(JSON.stringify(transactions));

  return (
    <DashboardView
      session={session}
      totalBalance={totalBalance}
      netWorth={netWorth}
      incomeThisMonth={incomeThisMonth}
      expenseThisMonth={expenseThisMonth}
      chartData={chartData}
      transactions={safeTransactions}
      receivables={receivables}
      debtAmount={debtAmount}
      totalScore={totalScore}
      grade={grade}
      metrics={{ savingsRate, wantRatio, debtRatio }}

      budgets={budgetStats}
      hasSeenOnboarding={user?.hasSeenOnboarding || false}
    />
  );
}