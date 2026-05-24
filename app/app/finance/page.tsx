import { redirect } from "next/navigation";
import { AlertCircle, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Stat } from "@/components/ui/stat";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartArea } from "@/components/charts/area-chart";
import { ChartDonut } from "@/components/charts/donut-chart";
import { FinanceActions } from "@/components/finance/finance-actions";
import { SavingsGoalCard } from "@/components/finance/savings-goal-card";
import { TransactionsTable } from "@/components/finance/transactions-table";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  getTransactions, getSavingsGoals, getDebts,
  aggregateMonthlyFlow, aggregateSpendingBreakdown, calculateMonthSummary,
} from "@/lib/supabase/queries";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function FinancePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const [transactions, savingsGoals, debts] = await Promise.all([
    getTransactions(user.id, 200),
    getSavingsGoals(user.id),
    getDebts(user.id),
  ]);

  const monthSummary = calculateMonthSummary(transactions);
  const monthlyFlow = aggregateMonthlyFlow(transactions);
  const spendingBreakdown = aggregateSpendingBreakdown(transactions);

  const recurring = transactions.filter(t => t.recurring && t.type === "expense").slice(0, 5);

  // Net worth = (lifetime income − lifetime expenses) + savings.saved − debt.remaining
  // Subtract savings-category expenses since they're already counted in goal.saved
  // (contributions logged via Contribute increment goal.saved AND log an expense).
  const lifetimeIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const lifetimeExpenses = transactions
    .filter(t => t.type === "expense" && t.category !== "savings")
    .reduce((s, t) => s + t.amount, 0);
  const totalSaved = savingsGoals.reduce((s, g) => s + g.saved, 0);
  const totalDebt = debts.reduce((s, d) => s + (d.total - d.paid), 0);
  const netWorth = (lifetimeIncome - lifetimeExpenses) + totalSaved - totalDebt;

  return (
    <div className="space-y-6">
      <PageHeader
        code="▢ Module 02 · Financial Command Center"
        title={<>Money, <span className="italic font-light text-ember-300">quantified.</span></>}
        subtitle="Every dollar accounted for. Every dollar working. Track income, burn, debt, and the savings that compound into freedom."
        action={<FinanceActions />}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card><Stat label="Net Worth"  value={formatCurrency(netWorth)} hint={transactions.length === 0 ? "log to begin" : "saved − debt"} /></Card>
        <Card><Stat label="Income · this month" value={formatCurrency(monthSummary.income)} /></Card>
        <Card><Stat label="Burn · this month"   value={formatCurrency(monthSummary.expenses)} /></Card>
        <Card><Stat label="Net · this month"    value={formatCurrency(monthSummary.net)} hint="income − burn" /></Card>
      </div>

      {/* Cash flow + Donut */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <CardHeader
            label="▢ Cash flow"
            title="Income vs Burn"
            action={
              <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-ember-500" /> Income</span>
                <span className="inline-flex items-center gap-1.5"><span className="size-2 rounded-2xs bg-edge" /> Burn</span>
              </div>
            }
          />
          {transactions.length > 0 ? (
            <ChartArea
              data={monthlyFlow}
              xKey="month"
              yKeys={[
                { key: "income", label: "Income", color: "#ff5e1a" },
                { key: "expenses", label: "Burn", color: "#3a3a44" },
              ]}
              height={260}
              format="currencyK"
            />
          ) : (
            <EmptyState
              icon={<TrendingUp className="size-5" />}
              title="No cash flow data yet"
              description="Log your first transaction to start building the chart."
              action={<FinanceActions compact />}
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <CardHeader label="▢ Burn breakdown · this month" title="Where it went" />
          {spendingBreakdown.length > 0 ? (
            <>
              <ChartDonut data={spendingBreakdown} />
              <div className="mt-5 space-y-2">
                {spendingBreakdown.map((c, i) => (
                  <div key={c.category} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2">
                      <span className="size-2.5 rounded-2xs" style={{ backgroundColor: ["#ff5e1a","#e74508","#bf3406","#982a08","#7a240a","#3a3a44"][i % 6] }} />
                      <span className="text-ink-primary">{c.category}</span>
                    </span>
                    <span className="stat text-ink-secondary tabular-nums">${c.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState title="No expenses this month" description="Log one to see the breakdown." />
          )}
        </Card>
      </div>

      {/* Goals + Debts */}
      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-7">
          <CardHeader
            label="▢ Savings · active campaigns"
            title="Goal trajectory"
            action={<FinanceActions onlySavings />}
          />
          {savingsGoals.length > 0 ? (
            <div className="space-y-3">
              {savingsGoals.map((g) => <SavingsGoalCard key={g.id} goal={g} />)}
            </div>
          ) : (
            <EmptyState
              title="No savings goals yet"
              description="A target you can measure. A deadline you defend."
              action={<FinanceActions onlySavings />}
            />
          )}
        </Card>

        <Card className="col-span-12 lg:col-span-5">
          <CardHeader
            label="▢ Debt · payoff schedule"
            title="What you owe"
            action={debts.length > 0 && <Badge tone="amber"><AlertCircle className="size-3" /> {debts.length} active</Badge>}
          />
          {debts.length > 0 ? (
            <div className="space-y-5">
              {debts.map((d) => {
                const pct = Math.round((d.paid / d.total) * 100);
                return (
                  <div key={d.id}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="text-sm text-ink-primary">{d.lender}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">
                          {d.interest_rate}% APR{d.monthly_payment ? ` · $${d.monthly_payment}/mo` : ""}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="stat text-sm text-ink-primary">{formatCurrency(d.total - d.paid)}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">remaining</div>
                      </div>
                    </div>
                    <Progress value={pct} />
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyState title="No debts tracked" description="Add via the Supabase table editor for now — debt management coming as a follow-up." />
          )}

          <div className="divider-x my-6" />
          <CardHeader label="▢ Recurring · this month" title="Locked-in burn" />
          {recurring.length > 0 ? (
            <div className="space-y-2">
              {recurring.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-2 text-sm border-b border-edge-subtle last:border-0">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-muted w-6">
                      {`d${new Date(r.date).getDate()}`}
                    </span>
                    <span className="text-ink-primary">{r.description}</span>
                  </div>
                  <span className="stat text-ink-secondary tabular-nums">${r.amount}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-sm text-ink-muted text-center py-4">
              No recurring transactions yet. Mark transactions as recurring in the table editor.
            </div>
          )}
        </Card>
      </div>

      {/* Transactions table — client component with filter + edit/delete */}
      <Card>
        <TransactionsTable transactions={transactions} />
      </Card>
    </div>
  );
}
