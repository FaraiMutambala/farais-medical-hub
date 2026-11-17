
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import CategoryForm from "./CategoryForm";
import CategoryManager from "./CategoryManager";

const academicYears = [
  { value: "fourth-year", label: "Fourth Year" },
  { value: "fifth-year", label: "Fifth Year" },
  { value: "sixth-year", label: "Sixth Year" },
];

type Category = {
  id: string;
  year: string;
  name: string;
  slug: string;
  sort_order: number;
};

export default async function CategoriesPage() {
  const supabase = await createClient();

  const { data, error: claimsError } =
    await supabase.auth.getClaims();

  const claims = data?.claims;

  if (claimsError || !claims?.sub) {
    redirect("/admin/login");
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id")
    .eq("user_id", claims.sub)
    .maybeSingle();

  if (!admin) {
    redirect("/admin/login");
  }

  const { data: categories, error } = await supabase
    .from("academic_categories")
    .select("*")
    .order("year", { ascending: true })
    .order("sort_order", { ascending: true });

  const categoryList = (categories ?? []) as Category[];

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <a
            href="/admin"
            className="text-sm font-medium text-blue-700 hover:underline"
          >
            ← Back to Dashboard
          </a>

          <h1 className="mt-5 text-3xl font-bold text-blue-950">
            Manage Academic Categories
          </h1>

          <p className="mt-2 text-slate-600">
            Manage the subjects available in your medical library.
          </p>
        </div>

        <CategoryForm />

        {error ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-red-700">
            Unable to load categories: {error.message}
          </div>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">
                  Total Categories
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-950">
                  {categoryList.length}
                </p>
              </div>

              <div className="rounded-xl border border-slate-200 bg-white p-6">
                <p className="text-sm text-slate-500">
                  Academic Years
                </p>
                <p className="mt-2 text-3xl font-bold text-blue-950">
                  {academicYears.length}
                </p>
              </div>
            </div>

            <CategoryManager categories={categoryList} />
          </>
        )}
      </div>
    </main>
  );
}
