
import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase-server";
import ChangePasswordForm from "./ChangePasswordForm";

export default async function AdminProfilePage() {
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

  const { data: userData, error: userError } =
    await supabase.auth.getUser();

  if (userError || !userData.user) {
    redirect("/admin/login");
  }

  const user = userData.user;

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-950 px-6 py-6 text-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              FARAI&apos;S MEDICAL HUB
            </h1>
            <p className="mt-1 text-sm text-slate-300">
              Administrator Profile
            </p>
          </div>

          <Link
            href="/admin"
            className="rounded-lg bg-white/10 px-4 py-2 text-sm font-semibold transition hover:bg-white/20"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        <h2 className="text-3xl font-bold text-slate-900">
          Account Information
        </h2>

        <p className="mt-2 text-slate-600">
          View and manage your administrator account.
        </p>

        <section className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-slate-900 px-7 py-6 text-white">
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-sky-100 text-3xl">
                👤
              </div>

              <div>
                <h3 className="text-xl font-bold">Administrator</h3>
                <p className="mt-1 text-sm text-slate-300">
                  Medical Hub Management Account
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6 p-7">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Email Address
              </p>
              <p className="mt-2 break-all font-semibold text-slate-900">
                {user.email ?? "Not available"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-sm font-medium text-slate-500">
                Account ID
              </p>
              <p className="mt-2 break-all font-mono text-sm text-slate-700">
                {user.id}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-sm font-medium text-slate-500">
                Account Created
              </p>
              <p className="mt-2 font-semibold text-slate-900">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "Not available"}
              </p>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <p className="text-sm font-medium text-slate-500">
                Account Status
              </p>
              <span className="mt-2 inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                Administrator Verified
              </span>
            </div>
          </div>
        </section>

        <ChangePasswordForm />

        <div className="mt-8 rounded-2xl border border-sky-100 bg-sky-50 p-6">
          <h3 className="font-bold text-slate-900">
            Account Security
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            Your account is protected by Supabase authentication and
            administrator access verification. Never share your password
            with anyone.
          </p>
        </div>
      </div>
    </main>
  );
}
