
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LogoutButton from "./LogoutButton";

const adminTools = [
  {
    title: "Upload Resources",
    description: "Add lecture notes, presentations and clinical guidelines.",
    icon: "📤",
    link: "/admin/upload",
  },
  {
    title: "Manage Resources",
    description: "View, edit, publish, unpublish and delete resources.",
    icon: "📚",
    link: "/admin/resources",
  },
  {
    title: "Manage Categories",
    description: "Organise academic years and medical subjects.",
    icon: "📂",
    link: "/admin/categories",
  },
  {
    title: "Manage Resource Types",
    description: "Add, edit and organise the types of learning materials.",
    icon: "🗂️",
    link: "/admin/resource-types",
  },
];

function formatText(value: string) {
  return value
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { data, error: claimsError } = await supabase.auth.getClaims();
  const claims = data?.claims;

  if (claimsError || !claims?.sub) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (adminError || !admin) {
    redirect("/admin/login");
  }

  // Fetch dashboard statistics
  const [
    totalResult,
    publishedResult,
    unpublishedResult,
    categoriesResult,
  ] = await Promise.all([
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase
      .from("resources")
      .select("id", { count: "exact", head: true })
      .eq("is_published", true),
    supabase
      .from("resources")
      .select("id", { count: "exact", head: true })
      .eq("is_published", false),
    supabase
      .from("academic_categories")
      .select("id", { count: "exact", head: true }),
  ]);

  const statistics = [
    {
      title: "Total Resources",
      value: totalResult.count ?? "—",
      icon: "📚",
      description: "All uploaded learning materials",
    },
    {
      title: "Published Resources",
      value: publishedResult.count ?? "—",
      icon: "🌐",
      description: "Visible to public visitors",
    },
    {
      title: "Unpublished Resources",
      value: unpublishedResult.count ?? "—",
      icon: "📝",
      description: "Hidden from public visitors",
    },
    {
      title: "Academic Categories",
      value: categoriesResult.count ?? "—",
      icon: "📂",
      description: "Subjects across all academic years",
    },
  ];

  const { data: recentResources, error: resourcesError } = await supabase
    .from("resources")
    .select(
      "id, title, year, subject, resource_type, is_published, created_at"
    )
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 px-8 py-6 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              FARAI&apos;S MEDICAL HUB
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Administrator Dashboard
            </p>
          </div>
          <LogoutButton />
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Welcome, Administrator
        </h2>

        <p className="mt-2 text-slate-600">
          Manage your medical learning resources and website content.
        </p>

        {/* Dashboard Statistics */}
        <section className="mt-10">
          <h3 className="mb-5 text-xl font-bold text-slate-900">
            Library Overview
          </h3>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat) => (
              <div
                key={stat.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>
                  <span className="text-2xl">{stat.icon}</span>
                </div>

                <p className="mt-4 text-3xl font-bold text-slate-900">
                  {stat.value}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {stat.description}
                </p>
              </div>
            ))}
          </div>

          {(totalResult.error ||
            publishedResult.error ||
            unpublishedResult.error ||
            categoriesResult.error) && (
            <p className="mt-3 text-sm text-amber-700">
              Some statistics could not be loaded. Please refresh the page.
            </p>
          )}
        </section>

        {/* Management Cards */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {adminTools.map((tool) => (
            <a
              key={tool.title}
              href={tool.link}
              className="group rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-sky-300 hover:shadow-lg"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-sky-50 text-3xl transition group-hover:bg-sky-100">
                {tool.icon}
              </div>

              <h3 className="text-lg font-bold text-slate-900 group-hover:text-sky-700">
                {tool.title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {tool.description}
              </p>

              <div className="mt-6 text-sm font-semibold text-sky-700">
                Open Management →
              </div>
            </a>
          ))}
        </div>

        {/* Recent Uploads */}
        <section className="mt-12">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">
                Recent Uploads
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                The latest resources added to your medical library.
              </p>
            </div>

            <a
              href="/admin/resources"
              className="text-sm font-semibold text-sky-700 transition hover:text-sky-900"
            >
              Manage All Resources →
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {resourcesError ? (
              <div className="p-8 text-center text-sm text-red-600">
                Unable to load recent uploads. Please refresh the page.
              </div>
            ) : !recentResources || recentResources.length === 0 ? (
              <div className="p-8 text-center">
                <p className="font-semibold text-slate-700">
                  No resources uploaded yet.
                </p>
                <p className="mt-2 text-sm text-slate-500">
                  Your recent uploads will appear here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {recentResources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="min-w-0">
                      <h4 className="font-semibold text-slate-900">
                        {resource.title}
                      </h4>

                      <p className="mt-1 text-sm text-slate-600">
                        {formatText(resource.year)} ·{" "}
                        {formatText(resource.subject)}
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        {formatText(resource.resource_type)}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Uploaded{" "}
                        {new Date(resource.created_at).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          resource.is_published
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {resource.is_published ? "Published" : "Unpublished"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Website Administration */}
        <div className="mt-10 rounded-2xl bg-slate-900 p-7 text-white">
          <h3 className="text-lg font-semibold">
            Website Administration
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-300">
            Use this dashboard to maintain your academic library,
            manage learning materials and keep your website organised.
          </p>

          <a
            href="/"
            className="mt-5 inline-flex rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-sky-100"
          >
            Visit Public Website →
          </a>
        </div>
      </div>
    </main>
  );
}
