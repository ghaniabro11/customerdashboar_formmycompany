import { fetchWalletTransactions } from "@/apis/wallet";
import { DOMAIN_URL, FAVICON_URL, WEBNAME } from "@/constants/url";
import { gbp } from "@/lib/utils";
import { ArrowLeft, TrendingUp, TrendingDown } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

export async function generateMetadata() {
  return {
    title: `Transaction History - ${WEBNAME}`,
    description: "View your wallet transaction history.",
    alternates: {
      canonical: `${DOMAIN_URL}/account/wallet/transactions`,
    },
    openGraph: {
      type: "website",
      title: `Transaction History - ${WEBNAME}`,
      description: "View your wallet transaction history.",
      url: `${DOMAIN_URL}/account/wallet/transactions`,
      siteName: WEBNAME,
      images: [
        {
          url: `${DOMAIN_URL}/hero.png`,
          alt: "Transaction History",
          width: 1200,
          height: 630,
        },
      ],
      locale: "en",
    },
    twitter: {
      card: "summary_large_image",
      title: `Transaction History - ${WEBNAME}`,
      description: "View your wallet transaction history.",
      images: [`${DOMAIN_URL}/hero.png`],
    },
    robots: {
      index: false,
      follow: false,
    },
    icons: { icon: FAVICON_URL },
  };
}

interface Transaction {
  id: number;
  customer_id: number;
  type: "credit" | "debit";
  amount: string;
  reference: string | null;
  remarks: string;
  balance_after: string;
  created_at: string;
  updated_at: string;
}

const TransactionHistoryPage = async () => {
  const transactions = await fetchWalletTransactions() || [];

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/account/wallet"
          className="mb-6 inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to Wallet
        </Link>

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Transaction History
          </h1>
          <p className="text-slate-600">
            View all your wallet credit and debit transactions
          </p>
        </div>

        {transactions.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-12 text-center">
            <p className="text-slate-600 text-lg">No transactions found</p>
            <p className="text-slate-500 text-sm mt-2">
              Your transaction history will appear here once you add credit or make payments.
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Remarks
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-700 uppercase tracking-wider">
                      Balance After
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {transactions.map((transaction: Transaction) => (
                    <tr
                      key={transaction.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                        {format(
                          new Date(transaction.created_at),
                          "dd MMM yyyy, HH:mm"
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            transaction.type === "credit"
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {transaction.type === "credit" ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {transaction.type === "credit" ? "Credit" : "Debit"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-900">
                        {transaction.remarks || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-semibold text-slate-900">
                        <span
                          className={
                            transaction.type === "credit"
                              ? "text-green-600"
                              : "text-red-600"
                          }
                        >
                          {transaction.type === "credit" ? "+" : "-"}
                          {gbp(parseFloat(transaction.amount))}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-600">
                        {gbp(parseFloat(transaction.balance_after))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionHistoryPage;
