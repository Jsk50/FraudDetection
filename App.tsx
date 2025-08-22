
import React from 'react';
import { useState } from 'react';
import type { Transaction } from './types';
import SearchBar from './components/SearchBar';
import ResultsTable from './components/ResultsTable';
import AlertModal from './components/AlertModal';
import { fetchTransactionAnalysis } from './services/geminiService';

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setError(null);
    setTransactions([]); // Clear previous results

    try {
      const result = await fetchTransactionAnalysis(searchQuery);
      setTransactions(result.transactions);
      if (result.suspiciousFound) {
        setShowAlert(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 lg:p-8">
      <AlertModal isOpen={showAlert} onClose={() => setShowAlert(false)} />
      
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300">
            Fraud Detection Dashboard
          </h1>
          <p className="mt-3 text-lg text-slate-400">
            Monitor digital payments and identify suspicious activity with AI-powered analysis.
          </p>
        </header>

        <main>
          <div className="flex justify-center">
            <SearchBar 
              query={searchQuery}
              setQuery={setSearchQuery}
              onSearch={handleSearch}
              isLoading={isLoading}
            />
          </div>
          
          {error && (
            <div className="mt-6 text-center bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md max-w-2xl mx-auto">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          <ResultsTable transactions={transactions} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default App;
