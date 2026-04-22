import React, { useEffect, useState } from "react";
import { Building2, CheckCircle, Loader2, Search, XCircle } from "lucide-react";
import { useStore } from "@/store/cart";

const NameSearchStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const { setCompanyName, companyName: persistedName } = useStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<{ available: boolean; message: string } | null>(null);
  const [selectedName, setSelectedName] = useState(persistedName || "");
  const [error, setError] = useState("");

  useEffect(() => {
    if (persistedName) {
      setSelectedName(persistedName);
    }
  }, [persistedName]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError("Please enter a company name");
      return;
    }
    setIsSearching(true);
    setError("");
    setSearchResult(null);
    try {
      const response = await fetch(`/api/search-companies?q=${encodeURIComponent(searchQuery.trim())}`);
      if (!response.ok) throw new Error("Failed to search company name");
      const data = await response.json();
      if (data.error) {
        setError(data.error || "Failed to search. Please try again.");
        return;
      }
      setSearchResult({ available: data.available, message: data.message });
      if (data.available) {
        setSelectedName(searchQuery.trim());
        setCompanyName(searchQuery.trim());
      } else {
        setSelectedName("");
        setCompanyName("");
      }
    } catch (err: any) {
      setError(err.message || "Failed to search. Please try again.");
      setSearchResult(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleContinue = () => {
    if (!selectedName) {
      setError("Please select a company name");
      return;
    }
    onNext();
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="mb-6">
          <Building2 className="h-12 w-12 text-sky-500 mb-3" />
          <h2 className="text-2xl font-bold text-slate-900">Search Company Name</h2>
          <p className="mt-2 text-slate-600">Enter your desired company name to check availability</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
            <div className="flex md:flex-row flex-col gap-2">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="e.g., Tech Innovations"
                className="flex-1 rounded-lg border border-slate-300 px-4 py-3 text-base focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                disabled={isSearching}
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="rounded-lg bg-sky-500 px-6 py-3 w-fit font-semibold text-white hover:bg-sky-600 disabled:bg-slate-300 flex items-center gap-2"
              >
                {isSearching ? <Loader2 className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
                Search
              </button>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>

          {/* Search Result Display */}
          {searchResult && (
            <div
              className={`mt-4 p-4 rounded-lg border-2 ${searchResult.available ? "bg-green-50 border-green-500" : "bg-red-50 border-red-500"}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                {searchResult.available ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${searchResult.available ? "text-green-800" : "text-red-800"}`}>
                    {searchResult.message}
                  </p>
                  {searchResult.available && selectedName && (
                    <p className="text-sm text-green-700 mt-1">
                      Selected: <span className="font-semibold">{selectedName}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {selectedName && searchResult?.available && (
            <button
              onClick={handleContinue}
              className="mt-6 w-full rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white hover:bg-orange-600"
            >
              Continue with "{selectedName}" →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NameSearchStep;
