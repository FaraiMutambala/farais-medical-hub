
"use client";

import { useState } from "react";
import EditCategoryForm from "./EditCategoryForm";
import DeleteCategoryButton from "./DeleteCategoryButton";

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
  categories: Category[];
};

export default function CategoryManager({ categories }: Props) {
  const [editingCategory, setEditingCategory] =
    useState<Category | null>(null);

  return (
    <div className="space-y-8">
      {academicYears.map((year) => {
        const yearCategories = categories
          .filter((category) => category.year === year.value)
          .sort((a, b) => a.sort_order - b.sort_order);

        return (
          <section
            key={year.value}
            className="overflow-hidden rounded-xl border border-slate-200 bg-white"
          >
            <div className="border-b border-slate-200 bg-blue-950 px-6 py-5 text-white">
              <h2 className="text-xl font-bold">{year.label}</h2>
              <p className="mt-1 text-sm text-blue-100">
                {yearCategories.length} categories
              </p>
            </div>

            <div className="divide-y divide-slate-100">
              {yearCategories.map((category) => (
                <div key={category.id}>
                  <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {category.name}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {category.slug}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm text-slate-600">
                        Order: {category.sort_order}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setEditingCategory(category)
                        }
                        className="rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-800 transition hover:bg-blue-50"
                      >
                        Edit
                      </button>

                      <DeleteCategoryButton category={category} />
                    </div>
                  </div>

                  {editingCategory?.id === category.id && (
                    <div className="border-t border-slate-100 p-5">
                      <EditCategoryForm
                        category={category}
                        onClose={() => setEditingCategory(null)}
                      />
                    </div>
                  )}
                </div>
              ))}

              {yearCategories.length === 0 && (
                <p className="px-6 py-5 text-sm text-slate-500">
                  No categories have been added for this year.
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
