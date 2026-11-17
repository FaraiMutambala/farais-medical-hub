
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

type Category = {
  id: string;
  year: string;
  name: string;
  slug: string;
  sort_order: number;
};

const academicYears = [
  { value: "fourth-year", label: "Fourth Year" },
  { value: "fifth-year", label: "Fifth Year" },
  { value: "sixth-year", label: "Sixth Year" },
];

type Props = {
  category: Category;
  onClose: () => void;
};

function toSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function EditCategoryForm({
  category,
  onClose,
}: Props) {
  const router = useRouter();

  const [name, setName] = useState(category.name);
  const [year, setYear] = useState(category.year);
  const [sortOrder, setSortOrder] = useState(
    String(category.sort_order)
  );
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const trimmedName = name.trim();
    const slug = toSlug(trimmedName);
    const order = Number(sortOrder);

    if (!trimmedName || !slug) {
      setErrorMessage("Please enter a valid category name.");
      return;
    }

    if (!Number.isInteger(order) || order < 1) {
      setErrorMessage("Display order must be a positive whole number.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const supabase = createClient();

      const categoryIdentityChanged =
        year !== category.year || slug !== category.slug;

      if (categoryIdentityChanged) {
        const { data: resources, error: resourceError } =
          await supabase
            .from("resources")
            .select("id")
            .eq("year", category.year)
            .eq("subject", category.slug)
            .limit(1);

        if (resourceError) throw resourceError;

        if (resources && resources.length > 0) {
          throw new Error(
            "This category already has resources attached. Its name and academic year cannot be changed until those resources have been safely reassigned."
          );
        }
      }

      const { data: duplicate, error: checkError } = await supabase
        .from("academic_categories")
        .select("id")
        .eq("year", year)
        .eq("slug", slug)
        .neq("id", category.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (duplicate) {
        throw new Error(
          "Another category with this name already exists in that academic year."
        );
      }

      const { data: updated, error } = await supabase
        .from("academic_categories")
        .update({
          name: trimmedName,
          slug,
          year,
          sort_order: order,
        })
        .eq("id", category.id)
        .select("id")
        .maybeSingle();

      if (error) throw error;

      if (!updated) {
        throw new Error(
          "Category was not updated. Please check your administrator permissions."
        );
      }

      router.refresh();
      onClose();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to update category."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-blue-200 bg-blue-50 p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-4">
        <h3 className="text-lg font-bold text-blue-950">
          Edit Category
        </h3>

        <button
          type="button"
          onClick={onClose}
          disabled={loading}
          className="text-sm font-semibold text-slate-500 hover:text-slate-800"
        >
          Cancel
        </button>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Category Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Academic Year
          </label>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800"
          >
            {academicYears.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-700">
            Display Order
          </label>
          <input
            type="number"
            min="1"
            step="1"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            required
            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-slate-800"
          />
        </div>
      </div>

      {errorMessage && (
        <p className="mt-4 text-sm font-medium text-red-600">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="mt-5 rounded-lg bg-blue-950 px-6 py-3 font-semibold text-white hover:bg-blue-900 disabled:opacity-50"
      >
        {loading ? "Saving Changes..." : "Save Changes"}
      </button>
    </form>
  );
}
