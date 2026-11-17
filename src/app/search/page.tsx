
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
    year?: string;
    subject?: string;
    type?: string;
    sort?: string;
    page?: string;
  }>;
};

type SearchResult = {
  id: string;
  title: string;
  description: string | null;
  year: string;
  subject: string;
  resource_type: string;
  file_format: string;
  created_at: string;
};

type AcademicCategory = {
  id: string;
  year: string;
  name: string;
  slug: string;
  sort_order: number;
};

type ResourceType = {
  id: string;
  name: string;
  slug: string;
  sort_order: number;
};

const academicYears = [
  { name: "Fourth Year", slug: "fourth-year" },
  { name: "Fifth Year", slug: "fifth-year" },
  { name: "Sixth Year", slug: "sixth-year" },
];

const PAGE_SIZE = 10;

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

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q, year, subject, type, sort, page } = await searchParams;
  const query = q?.trim() ?? "";

  const selectedYear = academicYears.some((item) => item.slug === year)
    ? year!
    : "";

  const selectedSort = ["newest", "oldest", "title"].includes(sort ?? "")
    ? sort!
    : "newest";

  const [
    { data: categories, error: categoryError },
    { data: resourceTypes, error: typeError },
  ] = await Promise.all([
    supabase
      .from("academic_categories")
      .select("id, year, name, slug, sort_order")
      .order("sort_order", { ascending: true }),
    supabase
      .from("resource_types")
      .select("id, name, slug, sort_order")
      .order("sort_order", { ascending: true }),
  ]);

  const allCategories: AcademicCategory[] = categories ?? [];
  const allResourceTypes: ResourceType[] = resourceTypes ?? [];

  const availableCategories = allCategories.filter(
    (category) => !selectedYear || category.year === selectedYear
  );

  const selectedSubject = availableCategories.some(
    (category) => category.slug === subject
  )
    ? subject!
    : "";

  const selectedType = allResourceTypes.some(
    (resourceType) => resourceType.slug === type
  )
    ? type!
    : "";

  const uniqueSubjects = Array.from(
    new Map(
      availableCategories.map((category) => [
        category.slug,
        category,
      ])
    ).values()
  );

  let results: SearchResult[] = [];
  let errorMessage = "";

  if (categoryError || typeError) {
    errorMessage = "Unable to load search filters. Please try again.";
  } else if (query.length >= 2) {
    const fields = [
      "title",
      "description",
      "year",
      "subject",
      "resource_type",
    ] as const;

    const searches = await Promise.all(
      fields.map((field) => {
        let request = supabase
          .from("resources")
          .select(
            "id, title, description, year, subject, resource_type, file_format, created_at"
          )
          .eq("is_published", true)
          .ilike(field, `%${query}%`);

        if (selectedYear) {
          request = request.eq("year", selectedYear);
        }

        if (selectedSubject) {
          request = request.eq("subject", selectedSubject);
        }

        if (selectedType) {
          request = request.eq("resource_type", selectedType);
        }

        if (selectedSort === "oldest") {
          request = request.order("created_at", { ascending: true });
        } else if (selectedSort === "title") {
          request = request.order("title", { ascending: true });
        } else {
          request = request.order("created_at", { ascending: false });
        }

        return request.limit(1000);
      })
    );

    const failedSearch = searches.find((search) => search.error);

    if (failedSearch?.error) {
      errorMessage = "Unable to load search results. Please try again.";
    } else {
      const uniqueResults = new Map<string, SearchResult>();

      searches.forEach((search) => {
        (search.data ?? []).forEach((resource) => {
          uniqueResults.set(resource.id, resource as SearchResult);
        });
      });

      results = Array.from(uniqueResults.values());

      if (selectedSort === "oldest") {
        results.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        );
      } else if (selectedSort === "title") {
        results.sort((a, b) => a.title.localeCompare(b.title));
      } else {
        results.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime()
        );
      }
    }
  }

  const totalResults = results.length;
  const totalPages = Math.max(1, Math.ceil(totalResults / PAGE_SIZE));

  const requestedPage =
    Number.isInteger(Number(page)) && Number(page) > 0
      ? Number(page)
      : 1;

  const currentPage = Math.min(requestedPage, totalPages);

  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = Math.min(startIndex + PAGE_SIZE, totalResults);

  const paginatedResults = results.slice(startIndex, endIndex);

  function getPageUrl(pageNumber: number) {
    const params = new URLSearchParams();

    if (query) params.set("q", query);
    if (selectedYear) params.set("year", selectedYear);
    if (selectedSubject) params.set("subject", selectedSubject);
    if (selectedType) params.set("type", selectedType);

    params.set("sort", selectedSort);
    params.set("page", String(pageNumber));

    return `/search?${params.toString()}`;
  }

  const selectedSubjectName = availableCategories.find(
    (category) => category.slug === selectedSubject
  )?.name;

  const selectedTypeName = allResourceTypes.find(
    (resourceType) => resourceType.slug === selectedType
  )?.name;

  const sortLabels: Record<string, string> = {
    newest: "Newest First",
    oldest: "Oldest First",
    title: "Title A–Z",
  };

  const visiblePages = Array.from(
    {
      length:
        Math.max(
          0,
          Math.min(totalPages, currentPage + 2) -
            Math.max(1, currentPage - 2) +
            1
        ),
    },
    (_, index) => Math.max(1, currentPage - 2) + index
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-6 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <Link
            href="/library"
            className="text-sm text-sky-300 transition hover:text-white"
          >
            ← Back to Medical Library
          </Link>

          <p className="mt-8 text-sm font-bold uppercase tracking-widest text-sky-400">
            Medical Resource Discovery
          </p>

          <h1 className="mt-3 text-3xl font-bold md:text-5xl">
            Search Results
          </h1>

          <p className="mt-4 text-blue-100/80">
            {query
              ? `Showing published resources matching "${query}".`
              : "Search across the medical learning library."}
          </p>

          <form
            action="/search"
            method="GET"
            className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
          >
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder="Search medical topics..."
              className="min-w-0 rounded-xl border border-white/20 bg-white px-5 py-4 text-slate-900 outline-none focus:ring-2 focus:ring-sky-400"
            />

            <select
              name="year"
              defaultValue={selectedYear}
              className="rounded-xl border border-white/20 bg-white px-4 py-4 text-slate-900 outline-none"
            >
              <option value="">All Academic Years</option>
              {academicYears.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>

            <select
              name="subject"
              defaultValue={selectedSubject}
              className="rounded-xl border border-white/20 bg-white px-4 py-4 text-slate-900 outline-none"
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map((category) => (
                <option key={category.slug} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </select>

            <select
              name="type"
              defaultValue={selectedType}
              className="rounded-xl border border-white/20 bg-white px-4 py-4 text-slate-900 outline-none"
            >
              <option value="">All Resource Types</option>
              {allResourceTypes.map((resourceType) => (
                <option key={resourceType.slug} value={resourceType.slug}>
                  {resourceType.name}
                </option>
              ))}
            </select>

            <select
              name="sort"
              defaultValue={selectedSort}
              className="rounded-xl border border-white/20 bg-white px-4 py-4 text-slate-900 outline-none"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title A–Z</option>
            </select>

            <div className="flex flex-wrap gap-3 sm:col-span-2 lg:col-span-4">
              <button
                type="submit"
                className="flex-1 rounded-xl bg-sky-600 px-6 py-4 font-semibold text-white transition hover:bg-sky-500"
              >
                Search Library
              </button>

              <Link
                href={`/search?q=${encodeURIComponent(query)}`}
                className="rounded-xl border border-white/30 bg-white/10 px-6 py-4 text-center font-semibold text-white transition hover:bg-white/20"
              >
                Clear All Filters
              </Link>
            </div>
          </form>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        {query.length < 2 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <h2 className="text-xl font-bold text-blue-950">
              Enter a search term
            </h2>
            <p className="mt-3 text-slate-600">
              Enter at least two characters to search published medical resources.
            </p>
          </div>
        ) : errorMessage ? (
          <p className="rounded-xl bg-red-50 p-5 text-red-700">
            {errorMessage}
          </p>
        ) : (
          <>
            <div className="mb-7 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl font-bold text-blue-950">
                  {totalResults} resource(s) found
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Search term: {query}
                  {selectedYear && ` · ${formatText(selectedYear)}`}
                  {selectedSubjectName && ` · ${selectedSubjectName}`}
                  {selectedTypeName && ` · ${selectedTypeName}`}
                  {` · ${sortLabels[selectedSort]}`}
                </p>

                {totalResults > 0 && (
                  <p className="mt-2 text-sm text-slate-500">
                    Showing {startIndex + 1}–{endIndex} of {totalResults} resources
                  </p>
                )}
              </div>

              <Link
                href="/"
                className="text-sm font-semibold text-sky-700 hover:text-blue-950"
              >
                Return Home →
              </Link>
            </div>

            {paginatedResults.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedResults.map((resource) => (
                    <Link
                      key={resource.id}
                      href={`/library/${resource.year}/${resource.subject}/${resource.resource_type}/${resource.id}`}
                      className="block rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-0.5 hover:border-sky-300 hover:shadow-md"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-blue-950">
                            <HighlightText
                              text={resource.title}
                              query={query}
                            />
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {resource.description ? (
                              <HighlightText
                                text={resource.description}
                                query={query}
                              />
                            ) : (
                              "No description available."
                            )}
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2 text-xs">
                            <span className="rounded-full bg-sky-50 px-3 py-1.5 font-medium text-sky-800">
                              {formatText(resource.year)}
                            </span>

                            <span className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700">
                              {formatText(resource.subject)}
                            </span>

                            <span className="rounded-full bg-indigo-50 px-3 py-1.5 font-medium text-indigo-700">
                              {formatText(resource.resource_type)}
                            </span>

                            <span className="rounded-full bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">
                              {resource.file_format}
                            </span>
                          </div>
                        </div>

                        <span className="shrink-0 font-semibold text-sky-700">
                          View Resource →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav
                    aria-label="Search results pages"
                    className="mt-10 flex flex-wrap items-center justify-center gap-2"
                  >
                    {currentPage > 1 ? (
                      <Link
                        href={getPageUrl(currentPage - 1)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
                      >
                        ← Previous
                      </Link>
                    ) : (
                      <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-400">
                        ← Previous
                      </span>
                    )}

                    {visiblePages.map((pageNumber) => (
                      <Link
                        key={pageNumber}
                        href={getPageUrl(pageNumber)}
                        aria-current={
                          pageNumber === currentPage ? "page" : undefined
                        }
                        className={`rounded-lg border px-4 py-2 font-semibold transition ${
                          pageNumber === currentPage
                            ? "border-blue-950 bg-blue-950 text-white"
                            : "border-slate-300 bg-white text-slate-700 hover:border-sky-400 hover:text-sky-700"
                        }`}
                      >
                        {pageNumber}
                      </Link>
                    ))}

                    {currentPage < totalPages ? (
                      <Link
                        href={getPageUrl(currentPage + 1)}
                        className="rounded-lg border border-slate-300 bg-white px-4 py-2 font-medium text-slate-700 transition hover:border-sky-400 hover:text-sky-700"
                      >
                        Next →
                      </Link>
                    ) : (
                      <span className="cursor-not-allowed rounded-lg border border-slate-200 bg-slate-100 px-4 py-2 text-slate-400">
                        Next →
                      </span>
                    )}
                  </nav>
                )}
              </>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
                <div className="text-4xl">🔎</div>

                <h3 className="mt-4 text-xl font-bold text-blue-950">
                  No matching resources found
                </h3>

                <p className="mt-3 text-slate-600">
                  Try a different keyword, medical topic or subject.
                </p>
              </div>
            )}
          </>
        )}
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai&apos;s Medical Hub
      </footer>
    </main>
  );
}
