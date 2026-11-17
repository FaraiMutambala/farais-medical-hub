"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

const academicYears = [
  { value: "fourth-year", label: "Fourth Year" },
  { value: "fifth-year", label: "Fifth Year" },
  { value: "sixth-year", label: "Sixth Year" },
];

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function CategoryForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [year, setYear] = useState("fourth-year");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const slug = toSlug(trimmedName);

    if (!trimmedName || !slug) {
      setErrorMessage("Please enter a valid category name.");
      return;
    }

    setLoading(true);
    setMessage("");
    setErrorMessage("");

    try {
      const supabase = createClient();

      const { data: existingCategory, error: checkError } = await supabase
        .from("academic_categories")
        .select("id")
        .eq("year", year)
        .eq("slug", slug)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingCategory) {
        throw new Error("This category already exists for the selected academic year.");
      }

      const { data: existingCategories, error: orderError } = await supabase
        .from("academic_categories")
        .select("sort_order")
        .eq("year", year)
        .order("sort_order", { ascending: false })
        .limit(1);

      if (orderError) throw orderError;

      const nextOrder =
        (existingCategories?.[0]?.sort_order ?? 0) + 1;

      const { error } = await supabase
        .from("academic_categories")
        .insert({
          name: trimmedName,
          slug,
          year,
          sort_order: nextOrder,
        });

      if (error) throw error;

      setName("");
      setMessage("Category added successfully!");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to add category."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-10 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      <h2 className="text-xl font-bold text-blue-950">
        Add New Category
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        Add a subject to one of your academic years.
      </p>

      <div className="mt-6 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Cardiology"
            required
            className="w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Academic Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {academicYears.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white transition hover:bg-blue-900 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Adding Category..." : "Add Category"}
        </button>

        {message && (
          <p className="text-sm font-medium text-green-700">
            {message}
          </p>
        )}

        {errorMessage && (
          <p className="text-sm font-medium text-red-600">
            {errorMessage}
          </p>
        )}
      </div>
    </form>
  );
}