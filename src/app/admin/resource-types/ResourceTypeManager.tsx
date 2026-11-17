
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import type { ResourceType } from "./page";

type Props = {
  resourceTypes: ResourceType[];
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

export default function ResourceTypeManager({ resourceTypes }: Props) {
  const router = useRouter();

  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");
  const [editingOrder, setEditingOrder] = useState(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function addResourceType(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    const trimmedName = name.trim();
    const slug = toSlug(trimmedName);

    if (!trimmedName || !slug) {
      setErrorMessage("Please enter a valid resource type name.");
      return;
    }

    if (
      resourceTypes.some(
        (item) => item.slug === slug || item.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setErrorMessage("This resource type already exists.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const nextOrder =
        Math.max(0, ...resourceTypes.map((item) => item.sort_order)) + 1;

      const { error } = await supabase.from("resource_types").insert({
        name: trimmedName,
        slug,
        sort_order: nextOrder,
      });

      if (error) throw error;

      setName("");
      setMessage("Resource type added successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to add resource type."
      );
    } finally {
      setLoading(false);
    }
  }

  function startEditing(item: ResourceType) {
    setEditingId(item.id);
    setEditingName(item.name);
    setEditingOrder(item.sort_order);
    setMessage("");
    setErrorMessage("");
  }

  async function saveEdit(id: string) {
    setMessage("");
    setErrorMessage("");

    const trimmedName = editingName.trim();

    if (!trimmedName) {
      setErrorMessage("Resource type name cannot be empty.");
      return;
    }

    if (
      resourceTypes.some(
        (item) =>
          item.id !== id &&
          item.name.toLowerCase() === trimmedName.toLowerCase()
      )
    ) {
      setErrorMessage("Another resource type already has this name.");
      return;
    }

    if (!Number.isInteger(editingOrder) || editingOrder < 1) {
      setErrorMessage("Display order must be a positive whole number.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from("resource_types")
        .update({
          name: trimmedName,
          sort_order: editingOrder,
        })
        .eq("id", id);

      if (error) throw error;

      setEditingId(null);
      setMessage("Resource type updated successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to update resource type."
      );
    } finally {
      setLoading(false);
    }
  }

  async function deleteResourceType(item: ResourceType) {
    setMessage("");
    setErrorMessage("");

    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"?`
    );

    if (!confirmed) return;

    setLoading(true);

    try {
      const supabase = createClient();

      const { count, error: checkError } = await supabase
        .from("resources")
        .select("id", { count: "exact", head: true })
        .eq("resource_type", item.slug);

      if (checkError) throw checkError;

      if ((count ?? 0) > 0) {
        throw new Error(
          `This resource type is currently used by ${count} resource(s). Please reassign those resources before deleting it.`
        );
      }

      const { error } = await supabase
        .from("resource_types")
        .delete()
        .eq("id", item.id);

      if (error) throw error;

      setMessage("Resource type deleted successfully.");
      router.refresh();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Unable to delete resource type."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-8 space-y-8">
      <form
        onSubmit={addResourceType}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <h2 className="text-xl font-bold text-slate-900">
          Add Resource Type
        </h2>

        <p className="mt-2 text-sm text-slate-600">
          Create another type of learning material for your library.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Case Studies"
            className="flex-1 rounded-lg border border-slate-300 p-3 outline-none focus:border-sky-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-sky-700 px-6 py-3 font-semibold text-white hover:bg-sky-800 disabled:opacity-50"
          >
            Add Resource Type
          </button>
        </div>
      </form>

      {message && (
        <p className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </p>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-6">
          <h2 className="text-xl font-bold text-slate-900">
            Existing Resource Types
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            {resourceTypes.length} resource types available.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {resourceTypes.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between"
            >
              {editingId === item.id ? (
                <div className="flex flex-1 flex-col gap-3 sm:flex-row">
                  <input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    className="flex-1 rounded-lg border border-slate-300 p-3"
                    placeholder="Resource type name"
                  />

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={editingOrder}
                    onChange={(e) => setEditingOrder(Number(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 p-3 sm:w-28"
                    aria-label="Display order"
                  />

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => saveEdit(item.id)}
                    className="rounded-lg bg-sky-700 px-4 py-2 font-semibold text-white disabled:opacity-50"
                  >
                    Save
                  </button>

                  <button
                    type="button"
                    disabled={loading}
                    onClick={() => setEditingId(null)}
                    className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Slug: {item.slug} · Display order: {item.sort_order}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => startEditing(item)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      disabled={loading}
                      onClick={() => deleteResourceType(item)}
                      className="rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {resourceTypes.length === 0 && (
            <p className="p-6 text-sm text-slate-500">
              No resource types have been added yet.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
