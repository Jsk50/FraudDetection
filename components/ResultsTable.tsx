
import React from 'react';
import type { Transaction } from '../types';

interface ResultsTableProps {
  transactions: Transaction[];
  isLoading: boolean;
}

const ResultsTable: React.FC<ResultsTableProps> = ({ transactions, isLoading }) => {

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };
  
  const getScoreColor = (score: number) => {
    if (score > 75) return 'text-red-400';
    if (score > 50) return 'text-yellow-400';
    return 'text-green-400';
  };

  const renderSkeletonRows = () => {
    return Array.from({ length: 5 }).map((_, index) => (
      <tr key={index} className="border-b border-slate-700 animate-pulse">
        <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-3/4"></div></td>
        <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-1/2"></div></td>
        <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-1/4"></div></td>
        <td className="py-3 px-4"><div className="h-4 bg-slate-700 rounded w-full"></div></td>
        <td className="py-3 px-4"><div className="h-6 bg-slate-700 rounded-full w-24"></div></td>
      </tr>
    ));
  };

  return (
    <div className="w-full mt-8 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-900/50 text-xs text-slate-400 uppercase tracking-wider">
            <tr>
              <th scope="col" className="py-3 px-4 font-medium">Transaction ID</th>
              <th scope="col" className="py-3 px-4 font-medium">Amount</th>
              <th scope="col" className="py-3 px-4 font-medium">Fraud Score</th>
              <th scope="col" className="py-3 px-4 font-medium">Timestamp</th>
              <th scope="col" className="py-3 px-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700">
            {isLoading ? renderSkeletonRows() : transactions.map((tx) => (
              <tr key={tx.id} className={tx.isSuspicious ? 'bg-red-900/30 hover:bg-red-900/50' : 'hover:bg-slate-700/50'}>
                <td className="py-3 px-4 font-mono text-slate-400">{tx.id}</td>
                <td className="py-3 px-4 font-medium">{formatCurrency(tx.amount)}</td>
                <td className={`py-3 px-4 font-bold ${getScoreColor(tx.fraudScore)}`}>{tx.fraudScore}</td>
                <td className="py-3 px-4 text-slate-400">{formatDate(tx.timestamp)}</td>
                <td className="py-3 px-4">
                  {tx.isSuspicious ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/20 text-red-300">
                      Suspicious
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/20 text-green-300">
                      Normal
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!isLoading && transactions.length === 0 && (
            <div className="text-center py-12 text-slate-500">
                <p>No transactions to display.</p>
                <p className="text-sm mt-1">Enter a query above to begin.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ResultsTable;
