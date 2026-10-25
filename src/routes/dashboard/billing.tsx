import { useState, useEffect } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { useCutflowAuth } from "@/lib/auth-context";
import { DashboardStore, type Invoice } from "@/lib/dashboard-store";
import {
  CreditCard,
  Download,
  CheckCircle2,
  Shield,
  ArrowRight,
  Receipt,
} from "lucide-react";

export const Route = createFileRoute("/dashboard/billing")({
  component: BillingPage,
});

function BillingPage() {
  const { user } = useCutflowAuth();
  const clientId = user?.id || "client-default";
  const [store] = useState(() => new DashboardStore(clientId));

  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    setInvoices(store.getInvoices());
  }, [store, clientId]);

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border/80 pb-6">
          <div>
            <div className="label text-primary font-bold">Subscription & Invoices</div>
            <h1 className="display mt-1 text-3xl sm:text-4xl text-snow font-extrabold">Billing & Plan</h1>
            <p className="mt-1 text-xs sm:text-sm text-gray">
              Manage your editing membership tier, download receipts, and manage payment methods.
            </p>
          </div>
        </div>

        {/* Current Plan Overview Card */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Active Plan (2 cols) */}
          <div className="md:col-span-2 border border-border bg-charcoal/80 p-6 sm:p-8 rounded-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/80 pb-6">
              <div>
                <span className="label text-[0.68rem] bg-soft text-gray border border-border px-2.5 py-0.5 rounded-xs">
                  Membership Status
                </span>
                <h2 className="display text-2xl sm:text-3xl font-extrabold text-snow mt-2">
                  No Active Retainer
                </h2>
                <p className="text-xs text-gray mt-1">
                  Choose an ongoing editing retainer or start an individual project.
                </p>
              </div>

              <div className="text-left sm:text-right">
                <Link
                  to="/pricing"
                  className="btn-slide btn-primary !py-2.5 !px-5 text-xs font-semibold inline-flex items-center gap-1.5"
                >
                  <span>Explore Retainers</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>

            {/* Plan Features */}
            <div className="pt-6 grid grid-cols-2 gap-3 text-xs text-snow/90">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>48-hour first cut turnaround</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>100% Halal Foley & Acoustic Mix</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>Unlimited asset storage vault</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                <span>2 revision rounds per video</span>
              </div>
            </div>
          </div>

          {/* Payment Method & Security Card (1 col) */}
          <div className="border border-border bg-charcoal/80 p-6 rounded-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase font-mono">
                <CreditCard className="h-4 w-4" />
                <span>Payment Method</span>
              </div>

              <div className="mt-5 p-4 bg-ink border border-border rounded-xs">
                <div className="text-xs text-gray">No payment method on file</div>
                <div className="text-[0.68rem] text-gray/70 mt-1">
                  Payment details are requested securely when subscribing or purchasing a project.
                </div>
              </div>

              <div className="mt-5 space-y-2 text-xs text-gray">
                <div className="flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span className="text-[0.7rem]">
                    Encrypted via Stripe 256-bit bank-grade PCI DSS compliance.
                  </span>
                </div>
              </div>
            </div>

            <Link
              to="/pricing"
              className="mt-6 block text-center w-full py-2 text-xs font-semibold bg-soft hover:bg-border text-snow rounded-xs transition-colors"
            >
              Select Plan
            </Link>
          </div>
        </div>

        {/* Invoice & Payment History */}
        <div className="border border-border bg-charcoal/60 rounded-sm overflow-hidden">
          <div className="p-5 border-b border-border/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              <h3 className="display text-lg text-snow font-bold">Invoices & Receipts</h3>
            </div>
            <span className="text-xs font-mono text-gray">{invoices.length} billing statements</span>
          </div>

          {invoices.length === 0 ? (
            <div className="py-12 text-center text-xs text-gray">
              <Receipt className="h-8 w-8 text-gray mx-auto mb-2 opacity-50" />
              <p className="text-snow font-medium">No billing invoices found</p>
              <p className="mt-1 max-w-sm mx-auto">
                Invoices and downloadable receipts will appear here once billing statements are generated.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border/80 bg-ink/50 text-[0.68rem] font-mono uppercase text-gray">
                    <th className="p-4 font-semibold">Invoice #</th>
                    <th className="p-4 font-semibold">Billing Date</th>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold">Amount</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-soft/40 transition-colors">
                      <td className="p-4 font-mono font-bold text-snow">{inv.invoiceNumber}</td>
                      <td className="p-4 font-mono text-gray">{inv.date}</td>
                      <td className="p-4 text-snow/90 font-medium">{inv.description}</td>
                      <td className="p-4 font-mono font-bold text-snow">{inv.amount}</td>
                      <td className="p-4">
                        <span
                          className={`label text-[0.65rem] px-2 py-0.5 rounded-xs border ${
                            inv.status === "Paid"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <a
                          href={inv.downloadUrl}
                          download
                          className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline font-mono"
                        >
                          <Download className="h-3 w-3" />
                          <span>PDF</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
