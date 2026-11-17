
import Link from "next/link";
import {
  supabase,
  getResourceDownloadUrl,
} from "@/lib/supabase";

type ResourcePageProps = {
  params: Promise<{
    year: string;
    subject: string;
    resourceType: string;
    resourceId: string;
  }>;
};

function formatText(text: string) {
  return text
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function formatFileSize(bytes: number | null) {
  if (bytes === null) return "Size unavailable";

  const mb = bytes / (1024 * 1024);

  if (mb < 1) {
    return `${(bytes / 1024).toFixed(0)} KB`;
  }

  return `${mb.toFixed(1)} MB`;
}

export default async function ResourcePage({
  params,
}: ResourcePageProps) {
  const { year, subject, resourceType, resourceId } = await params;

  const { data: resource, error } = await supabase
    .from("resources")
    .select(
      "id, title, description, year, subject, resource_type, file_name, file_format, file_size_bytes, storage_path, created_at"
    )
    .eq("id", resourceId)
    .eq("year", year)
    .eq("subject", subject)
    .eq("resource_type", resourceType)
    .eq("is_published", true)
    .maybeSingle();

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-red-800">
            Unable to load resource
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Something went wrong while retrieving this resource. Please try again later.
          </p>

          <Link
            href="/library"
            className="mt-6 inline-block font-semibold text-sky-700 hover:text-sky-900"
          >
            Return to Medical Library
          </Link>
        </div>
      </main>
    );
  }

  if (!resource) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
        <div className="max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <div className="text-4xl">📚</div>

          <h1 className="mt-4 text-2xl font-bold text-blue-950">
            Resource not found
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            This resource may have been removed or is no longer published.
          </p>

          <Link
            href="/library"
            className="mt-6 inline-block rounded-xl bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-900"
          >
            Return to Medical Library
          </Link>
        </div>
      </main>
    );
  }

  const downloadUrl = resource.storage_path
    ? await getResourceDownloadUrl(resource.storage_path)
    : null;

  const formattedYear = formatText(year);
  const formattedSubject = formatText(subject);
  const formattedResourceType = formatText(resourceType);

  const formattedDate = new Date(resource.created_at).toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="bg-gradient-to-br from-blue-950 via-blue-900 to-slate-900 px-6 py-14 text-white">
        <div className="mx-auto max-w-5xl">
          <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-2 text-sm text-blue-100/70"
          >
            <Link href="/library" className="transition hover:text-white">
              Medical Library
            </Link>

            <span>/</span>

            <Link
              href={`/library/${year}`}
              className="transition hover:text-white"
            >
              {formattedYear}
            </Link>

            <span>/</span>

            <Link
              href={`/library/${year}/${subject}`}
              className="transition hover:text-white"
            >
              {formattedSubject}
            </Link>

            <span>/</span>

            <Link
              href={`/library/${year}/${subject}/${resourceType}`}
              className="transition hover:text-white"
            >
              {formattedResourceType}
            </Link>

            <span>/</span>

            <span className="font-semibold text-white">
              {resource.title}
            </span>
          </nav>

          <div className="mt-10">
            <div className="inline-flex rounded-full border border-sky-400/30 bg-sky-400/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-300">
              {formattedResourceType}
            </div>

            <h1 className="mt-5 max-w-4xl text-3xl font-bold leading-tight md:text-5xl">
              {resource.title}
            </h1>

            <p className="mt-5 text-base text-blue-100/80">
              {formattedYear} <span className="mx-2">•</span>{" "}
              {formattedSubject}
            </p>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm md:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-50 text-sm font-bold text-sky-700">
                {resource.file_format}
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Medical learning resource
                </p>

                <h2 className="mt-1 text-xl font-bold text-blue-950">
                  Resource Overview
                </h2>
              </div>
            </div>

            <div className="mt-8">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                About this resource
              </h3>

              <p className="mt-3 text-base leading-8 text-slate-600">
                {resource.description ||
                  "No description has been provided for this resource."}
              </p>
            </div>

            <div className="mt-9 border-t border-slate-100 pt-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                Academic classification
              </h3>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-500">Academic year</p>
                  <p className="mt-2 font-bold text-blue-950">
                    {formattedYear}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5">
                  <p className="text-xs text-slate-500">Subject</p>
                  <p className="mt-2 font-bold text-blue-950">
                    {formattedSubject}
                  </p>
                </div>

                <div className="rounded-xl bg-slate-50 p-5 sm:col-span-2">
                  <p className="text-xs text-slate-500">Resource category</p>
                  <p className="mt-2 font-bold text-blue-950">
                    {formattedResourceType}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-9 border-t border-slate-100 pt-7">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">
                File information
              </h3>

              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-xs text-slate-500">File name</p>
                  <p className="mt-1 break-all text-sm font-medium text-slate-800">
                    {resource.file_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-slate-500">Format</p>
                    <p className="mt-1 font-semibold text-blue-950">
                      {resource.file_format}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-500">File size</p>
                    <p className="mt-1 font-semibold text-blue-950">
                      {formatFileSize(
                        resource.file_size_bytes === null
                          ? null
                          : Number(resource.file_size_bytes)
                      )}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-slate-500">Date published</p>
                  <p className="mt-1 font-semibold text-blue-950">
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-2xl">
              📥
            </div>

            <h2 className="mt-5 text-xl font-bold text-blue-950">
              Access this resource
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Download this learning material to study offline and access it whenever you need it.
            </p>

            {downloadUrl ? (
              <a
                href={downloadUrl}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 py-4 text-center font-semibold text-white shadow-sm transition hover:bg-sky-800"
              >
                <span>Download Resource</span>
                <span aria-hidden="true">↓</span>
              </a>
            ) : (
              <p className="mt-7 rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                This resource does not currently have an available download. Please check again later.
              </p>
            )}

            <p className="mt-4 text-center text-xs leading-5 text-slate-400">
              File: {resource.file_format} •{" "}
              {formatFileSize(
                resource.file_size_bytes === null
                  ? null
                  : Number(resource.file_size_bytes)
              )}
            </p>

            <div className="mt-7 border-t border-slate-100 pt-6">
              <Link
                href={`/library/${year}/${subject}/${resourceType}`}
                className="flex items-center gap-2 text-sm font-semibold text-sky-700 transition hover:text-blue-950"
              >
                <span aria-hidden="true">←</span>
                Back to {formattedResourceType}
              </Link>
            </div>
          </aside>
        </div>

        <Link
          href="/library"
          className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-sky-700"
        >
          <span aria-hidden="true">←</span>
          Return to Medical Library
        </Link>
      </section>

      <footer className="bg-blue-950 px-6 py-8 text-center text-sm text-blue-100/70">
        © {new Date().getFullYear()} Farai&apos;s Medical Hub
      </footer>
    </main>
  );
}
