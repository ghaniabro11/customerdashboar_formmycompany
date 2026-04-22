"use client";
import { Search } from "lucide-react";
import { useState, FormEvent } from "react";
import { useStore } from "@/store/cart";
import { useRouter } from "next/navigation";

interface SearchResponse {
  available: boolean;
  message: string;
  error?: string;
}

const sensitiveWords = [
  "royal",
  "bank",
  "insurance",
  "government",
  "authority",
  "association",
  "charity",
  "council",
  "trust",
  "university",
  "institute",
  "chamber",
  "foundation",
];

export default function CompanySearchForm() {
  const [companyName, setCompanyName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const { setCompanyName: saveCompanyName } = useStore();
  const router = useRouter();
  const validateCompanyName = (name: string): string | null => {
    const trimmed = name.trim();

    if (!trimmed) return "Please enter a company name.";
    if (trimmed.length < 2)
      return "Company name must be at least 2 characters long.";
    if (trimmed.length > 160)
      return "Company name cannot exceed 160 characters.";

    // Allow letters, numbers, spaces, and certain punctuation
    const validPattern = /^[A-Za-z0-9&().,'\-\s]+$/;
    if (!validPattern.test(trimmed))
      return "Company name contains invalid characters. Only letters, numbers, spaces, and basic punctuation are allowed.";

    // Check for sensitive or restricted words
    const foundWord = sensitiveWords.find((word) =>
      trimmed.toLowerCase().includes(word)
    );
    if (foundWord)
      return `The word "${foundWord}" is restricted and may require government approval.`;

    // Prevent names that look like code (e.g., <script>, { }, etc.)
    if (/[<>{}[\]]/.test(trimmed))
      return "Company name cannot include code or special symbols.";

    // Optional rule: prevent names ending with Ltd if handled elsewhere
    // if (/\b(ltd|limited)\b$/i.test(trimmed))
    //   return 'Please omit "Ltd" or "Limited" – it will be added automatically.';

    return null;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Run local validation first
    const error = validateCompanyName(companyName);
    if (error) {
      setValidationError(error);
      setResult(null);
      return;
    }

    setValidationError(null);
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(
        `/api/search-companies?q=${encodeURIComponent(companyName.trim())}`
      );

      const data: SearchResponse = await res.json();

      if (data.error) {
        setResult({
          available: false,
          message: data.error || "Failed to search. Please try again.",
          error: data.error,
        });
        return;
      }

      setResult(data);

      if (data.available) {
        saveCompanyName(companyName.trim());
        router.push(`/cart`);
      } else {
        saveCompanyName("");
      }
    } catch (error: any) {
      setResult({
        available: false,
        message:
          "There was an error connecting to the Companies House API. Please try again later.",
        error: error.message,
      });
      saveCompanyName("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <form
        role="search"
        aria-label="Company search"
        className="bg-black/60 rounded-lg p-1 md:min-w-xl"
        onSubmit={handleSubmit}
      >
        <div className="border rounded-md border-white flex p-2">
          <input
            type="search"
            name="company"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Search your company"
            aria-label="Search for a company"
            className="w-full bg-transparent placeholder:text-white placeholder:pl-3 text-white pl-2 border-0 focus:outline-0"
            disabled={loading}
            required
          />
          <button
            type="submit"
            className="bg-orange rounded p-1 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            aria-label="Search"
            disabled={loading}
          >
            <Search />
          </button>
        </div>
      </form>

      {/* Validation Error */}
      {validationError && (
        <div
          className="mt-4 p-4 rounded-lg bg-yellow-500/20 border border-yellow-500"
          role="alert"
        >
          <p className="text-yellow-200 font-medium">{validationError}</p>
        </div>
      )}

      {/* API Result */}
      {result && (
        <div
          className={`mt-4 p-4 rounded-lg ${
            result.available
              ? "bg-green-500/20 border border-green-500"
              : "bg-red-500/20 border border-red-500"
          }`}
          role="status"
          aria-live="polite"
        >
          <p
            className={`text-white font-medium ${
              result.available ? "text-green-200" : "text-red-200"
            }`}
          >
            {result.message}
          </p>
        </div>
      )}

      {loading && (
        <div
          className="mt-4 text-white text-center"
          role="status"
          aria-live="polite"
        >
          Searching...
        </div>
      )}
    </div>
  );
}
