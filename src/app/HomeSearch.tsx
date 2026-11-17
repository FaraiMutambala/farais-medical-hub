
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase-browser";

type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  year: string;
  subject: string;
  resource_type: string;
  file_format: string;
};

function formatText(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function HighlightText({
  text,
  query,
}: {
  text: string;
  query: string;
}) {
  if (!query.trim()) return <>{text}</>;

  const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const parts = text.split(new RegExp(`(${escapedQuery})`, "gi"));

  return (
    <>
      {parts.map((part, index) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark
            key={index}
            className="rounded bg-yellow-200 px-1 font-semibold text-slate-900"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        )
      )}
    </>
  );
}

export default function HomeSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const searchTerm = query.trim();

    if (searchTerm.length < 2) {
      setResults([]);
      setLoading(false);
      setErrorMessage("");
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      setLoading(true);
      setErrorMessage("");

      try {
        const supabase = createClient();

        const fields = [
          "title",
          "description",
          "year",
          "subject",
          "resource_type",
        ] as const;

        const searches = await Promise.all(
          fields.map((field) =>
            supabase
              .from("resources")
              .select(
                "id, title, description, year, subject, resource_type, file_format"
              )
              .eq("is_published", true)
              .ilike(field, `%${searchTerm}%`)
              .limit(20)
          )
        );

        if (cancelled) return;

        const failedSearch = searches.find((search) => search.error);

        if (failedSearch?.error) throw failedSearch.error;

        const uniqueResults = new Map<string, SearchResult>();

        searches.forEach((search) => {
          (search.data ?? []).forEach((resource) => {
            uniqueResults.set(resource.id, resource as SearchResult);
          });
        });

        setResults(Array.from(uniqueResults.values()));
      } catch {
        if (!cancelled) {
          setErrorMessage("Unable to search the library. Please try again.");
          setResults([]);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [query]);

  function clearSearch() {
    setQuery("");
    setResults([]);
    setErrorMessage("");
  }

  return (
    <section className="bg-white px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-sky-700">
            Find what you need
          </p>

          <h2 className="text-3xl font-bold text-slate-900">
            Search the Medical Library
          </h2>

          <p className="mt-3 text-slate-600">
            Search medical topics, lecture notes, presentations and other
            learning resources across all academic years.
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for a topic, e.g. Acute Kidney Injury..."
            className="w-full rounded-xl border border-slate-300 px-5 py-4 pr-20 text-slate-800 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
          />

          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>

        {query.trim().length < 2 && (
          <p className="mt-4 text-center text-sm text-slate-500">
            Enter at least two characters to search published resources.
          </p>
        )}

        {query.trim().length >= 2 && (
          <div className="mt-6 space-y-3">
            {loading ? (
              <p className="rounded-xl bg-slate-50 p-5 text-center text-slate-600">
                Searching the medical library...
              </p>
            ) : errorMessage ? (
              <p className="rounded-xl bg-red-50 p-5 text-center text-red-700">
                {errorMessage}
              </p>
            ) : (
              <>
                <p className="text-sm text-slate-500">
                  {results.length} resource(s) found
                </p>

                {results.map((item) => (
                  <Link
                    key={item.id}
                    href={`/library/${item.year}/${item.subject}/${item.resource_type}/${item.id}`}
                    className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-sky-400 hover:bg-sky-50"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-slate-800">
                        <HighlightText text={item.title} query={query.trim()} />
                      </p>

                      {item.description && (
                        <p className="mt-1 text-sm text-slate-600">
                          <HighlightText
                            text={item.description}
                            query={query.trim()}
                          />
                        </p>
                      )}

                      <p className="mt-1 text-sm text-slate-500">
                        {formatText(item.year)} · {formatText(item.subject)}
                      </p>

                      <p className="mt-1 text-xs text-sky-700">
                        {formatText(item.resource_type)} · {item.file_format}
                      </p>
                    </div>

                    <span className="shrink-0 text-xl text-sky-600">→</span>
                  </Link>
                ))}

                {results.length > 0 && (
                  <div className="pt-4 text-center">
                    <Link
                      href={`/search?q=${encodeURIComponent(query.trim())}`}
                      className="inline-flex items-center gap-2 rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-sky-700"
                    >
                      View All Search Results
                      <span>→</span>
                    </Link>
                  </div>
                )}

                {results.length === 0 && (
                  <p className="rounded-xl bg-slate-50 p-5 text-center text-slate-600">
                    No matching resources found. Try another medical topic or
                    search term.
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
