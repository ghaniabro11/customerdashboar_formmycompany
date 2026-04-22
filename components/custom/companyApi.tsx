"use client";
import logger from "@/lib/logger/logger";
import { useState } from "react";

export default function SearchCompanies() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/search-companies?q=${encodeURIComponent(query)}`
      );
      const data = await res.json();
      logger.info(data.items, "companies data");
      if (data.items) setResults(data.items);
    } catch (err) {
      logger.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-xl font-semibold mb-4">Search Companies (UK)</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter company name..."
          className="border rounded p-2 flex-1"
        />
        <button
          onClick={handleSearch}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <ul className="space-y-2">
        {results.map((item) => (
          <li key={item.company_number} className="border p-3 rounded">
            <p className="font-semibold">{item.title}</p>
            <p className="text-sm text-gray-600">{item.company_number}</p>
            <p className="text-sm">{item.address_snippet}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
