"use client";

import { useState } from "react";
import { Wallet, Plus, CreditCard, History } from "lucide-react";
import { gbp } from "@/lib/utils";
import WalletPaymentForm from "./wallet-payment-form";
import { useRouter } from "next/navigation";

interface WalletClientProps {
  initialBalance: string;
}

export default function WalletClient({ initialBalance }: WalletClientProps) {
  const [balance, setBalance] = useState(initialBalance);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [creditAmount, setCreditAmount] = useState("");
  const router = useRouter();

  const handleAddCredit = () => {
    const amount = parseFloat(creditAmount);
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    setShowPaymentForm(true);
  };

  const handlePaymentSuccess = () => {
    // Refresh balance
    router.refresh();
    setShowPaymentForm(false);
    setCreditAmount("");
    // You might want to refetch the balance here
  };

  if (showPaymentForm) {
    return (
      <WalletPaymentForm
        amount={creditAmount}
        onSuccess={handlePaymentSuccess}
        onCancel={() => setShowPaymentForm(false)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Credit</h1>
          <p className="text-slate-600">Manage your account wallet and credits</p>
        </div>

        {/* Balance Card */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 mb-1">Current Balance</p>
              <p className="text-4xl font-bold text-slate-900">
                {gbp(parseFloat(balance))}
              </p>
            </div>
            <div className="h-16 w-16 rounded-full bg-sky-100 flex items-center justify-center">
              <Wallet className="h-8 w-8 text-sky-600" />
            </div>
          </div>
        </div>

        {/* Add Credit Section */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm mb-6">
          <div className="mb-6">
            <CreditCard className="h-10 w-10 text-sky-500 mb-3" />
            <h2 className="text-2xl font-bold text-slate-900">Add Credit</h2>
            <p className="mt-1 text-slate-600">
              Add funds to your wallet using a secure payment method
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Amount (£)
              </label>
              <input
                type="number"
                value={creditAmount}
                onChange={(e) => setCreditAmount(e.target.value)}
                placeholder="0.00"
                min="0.01"
                step="0.01"
                className="w-full rounded-lg border border-slate-300 px-4 py-3 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <button
              onClick={handleAddCredit}
              disabled={!creditAmount || parseFloat(creditAmount) <= 0}
              className="w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600 disabled:bg-slate-400 flex items-center justify-center gap-2 transition-colors"
            >
              <Plus className="h-5 w-5" />
              Add Credit
            </button>
          </div>
        </div>

        {/* Quick Action - View Transaction History */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <button
            onClick={() => router.push("/account/wallet/transactions")}
            className="w-full rounded-lg border-2 border-slate-300 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 flex items-center justify-center gap-2 transition-colors"
          >
            <History className="h-5 w-5" />
            View Transaction History
          </button>
        </div>
      </div>
    </div>
  );
}
