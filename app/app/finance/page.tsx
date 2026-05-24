import { redirect } from "next/navigation";
import { ArrowUpRight, ArrowDownRight, Plus, AlertCircle, Calendar, Wallet, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/app-shell/page-header";
import { Card, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Stat } from "@/components/ui/stat";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ChartArea } from "@/components/charts/area-chart";
import { ChartDonut } from "@/components/charts/donut-chart";
import { FinanceActions } from "@/components/finance/finance-actions";
import { TransactionTypeFilter } from "@/components/finance/transaction-type-filter";
import { getCurrentUser } from "@/lib/supabase/auth";
import {
  getTransactions, getSavingsGoals, getDebts,
  aggregateMonthlyFlow, aggregateSpendingBreakdown, calculateMonthSummary,
} from "@/lib/supabase/queries";
import { formatCurrency, cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const CATEGORY_TONE: Record<string, string> = {
  salary: "text-signal-green",
  business: "text-ember-300",
  freelance: "text-ember-300",
  investments: "text-signal-green",
  rent: "text-ink-secondary",
  food: "text-ink-secondary",
  subscriptions: "text-ink-secondary",
  fitness: "text-ink-secondary",
  transport: "text-ink-secondary",
  savings: "text-signal-amber",
  education: "text-ink-secondary",
  debt: "text-signal-red",
  other: "text-ink-muted",
};

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

  // Recurring (any transaction marked recurring)
  const recurring = transactions.filter(t => t.recurring && t.type === "expense").slice(0, 5);

  // Naive net worth = savings - debt
  const totalSaved = savingsGoals.reduce((s, g) => s + g.saved, 0);
  const totalDebt = debts.reduce((s, d) => s + (d.total - d.paid), 0);
  const netWorth = totalSaved - totalDebt;

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
            <div className="space-y-6">
              {savingsGoals.map((g) => {
                const pct = Math.round((g.saved / g.target) * 100);
                const remaining = g.target - g.saved;
                return (
                  <div key={g.id} className="p-4 rounded-xs bg-surface-3/40 border border-edge-subtle">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="text-ink-primary font-medium">{g.name}</div>
                        {g.deadline && (
                          <div className="mt-0.5 font-mono text-[10px] uppercase tracking-widest text-ink-muted inline-flex items-center gap-1">
                            <Calendar className="size-3" /> Target · {g.deadline}
                          </div>
                        )}
                      </div>
                      <div className="text-right">
                        <div className="stat text-lg text-ink-primary tracking-tight">{formatCurrency(g.saved)}</div>
                        <div className="font-mono text-[10px] uppercase tracking-widest text-ink-muted">of {formatCurrency(g.target)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={pct} className="flex-1" glow />
                      <span className="font-mono text-[11px] text-ember-400 tabular-nums w-12 text-right">{pct}%</span>
                    </div>
                    <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted text-right">
                      {formatCurrency(remaining)} remaining
                    </div>
                  </div>
                );
              })}
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

      {/* Transactions table */}
      <Card>
        <CardHeader
          label="▢ Transactions · recent"
          title="The ledger"
          action={<TransactionTypeFilter />}
        />
        {transactions.length === 0 ? (
          <EmptyState
            icon={<Wallet className="size-5" />}
            title="The ledger is empty"
            description="Log your first transaction to start building the picture."
            action={<FinanceActions compact />}
          />
        ) : (
          <div className="overflow-x-auto -mx-5 px-5">
            <table className="w-full">
              <thead>
                <tr className="border-b border-edge-subtle">
                  {["Date","Description","Category","Type","Amount"].map((h, i) => (
                    <th key={h} className={cn(
                      "py-2 font-mono text-[10px] uppercase tracking-widest text-ink-muted text-left",
                      i === 4 && "text-right",
                    )}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 30).map((t) => (
                  <tr key={t.id} className="border-b border-edge-subtle/50 last:border-0 hover:bg-surface-3/30 transition-colors">
                    <td className="py-3 font-mono text-xs text-ink-muted tabular-nums">{t.date.slice(5)}</td>
                    <td className="py-3 text-sm text-ink-primary">{t.description}</td>
                    <td className="py-3">
                      <span className={cn(
                        "inline-block px-2 py-0.5 rounded-2xs font-mono text-[10px] uppercase tracking-widest",
                        "bg-surface-3 border border-edge-subtle",
                        CATEGORY_TONE[t.category] ?? "text-ink-secondary",
                      )}>
                        {t.category}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={cn(
                        "inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-widest",
                        t.type === "income" ? "text-signal-green" : "text-signal-red",
                      )}>
                        {t.type === "income"
                          ? <ArrowUpRight className="size-3" strokeWidth={2.4} />
                          : <ArrowDownRight className="size-3" strokeWidth={2.4} />}
                        {t.type}
                      </span>
                    </td>
                    <td className={cn(
                      "py-3 text-right stat text-sm tabular-nums",
                      t.type === "income" ? "text-signal-green" : "text-ink-primary",
                    )}>
                      {t.type === "income" ? "+" : "−"}${t.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
