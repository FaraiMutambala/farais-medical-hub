
import Link from "next/link";
import ResetPasswordForm from "./ResetPasswordForm";

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-100 text-3xl">
            🔑
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            Create a New Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            Enter and confirm your new administrator password below.
          </p>
        </div>

        <ResetPasswordForm />

        <div className="mt-6 text-center">
          <Link
            href="/admin/login"
            className="text-sm font-semibold text-sky-700 hover:text-sky-900"
          >
            ← Back to Administrator Login
          </Link>
        </div>
      </div>
    </main>
  );
}
