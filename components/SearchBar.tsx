
import React from 'react';
import SearchIcon from './icons/SearchIcon';

interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  onSearch: () => void;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ query, setQuery, onSearch, isLoading }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <div className="flex w-full max-w-2xl items-center space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Enter transaction ID, amount, or query (e.g., 'amount > 50000')"
        disabled={isLoading}
        className="flex-grow bg-slate-800 border border-slate-600 rounded-md px-4 py-2 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
      />
      <button
        onClick={onSearch}
        disabled={isLoading}
        className="bg-sky-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-sky-500 active:bg-sky-700 transition duration-200 ease-in-out disabled:bg-slate-500 disabled:cursor-not-allowed flex items-center justify-center"
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : (
          <SearchIcon className="h-5 w-5 mr-2" />
        )}
        <span>Search</span>
      </button>
    </div>
  );
};

export default SearchBar;
