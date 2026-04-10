"use client";

import { useState, useTransition } from "react";
import {
  createPraiseReport,
  updatePraiseReport,
  deletePraiseReport,
  togglePublished,
} from "@/app/actions/praise-reports";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type Report = {
  id: string;
  quote: string;
  name: string;
  role: string;
  published: boolean;
};

const emptyForm = { quote: "", name: "", role: "", published: false };

function ReportForm({
  initial = emptyForm,
  onSubmit,
  onCancel,
  pending,
  submitLabel,
}: {
  initial?: typeof emptyForm;
  onSubmit: (fd: FormData) => void;
  onCancel: () => void;
  pending: boolean;
  submitLabel: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget));
      }}
      className="space-y-4"
    >
      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Quote <span className="text-gold">*</span>
        </label>
        <textarea
          name="quote"
          required
          rows={4}
          defaultValue={initial.quote}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-charcoal/60 mb-1">
            Name <span className="text-gold">*</span>
          </label>
          <input
            name="name"
            required
            defaultValue={initial.name}
            className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-charcoal/60 mb-1">
            Role / Title <span className="text-gold">*</span>
          </label>
          <input
            name="role"
            required
            defaultValue={initial.role}
            placeholder="e.g. Worship Attendee"
            className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
      </div>
      <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial.published}
          className="w-4 h-4 accent-gold"
        />
        Publish to public site
      </label>
      <div className="flex gap-3 justify-end pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm text-charcoal/60 hover:text-charcoal border border-warm-gray rounded-xl transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="px-5 py-2 bg-gold text-deep-black text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors disabled:opacity-60"
        >
          {pending ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

export function PraiseClient({ reports }: { reports: Report[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(fd: FormData) {
    startTransition(async () => {
      await createPraiseReport(fd);
      setShowAdd(false);
    });
  }

  function handleUpdate(id: string, fd: FormData) {
    startTransition(async () => {
      await updatePraiseReport(id, fd);
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this praise report?")) return;
    startTransition(() => deletePraiseReport(id));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => togglePublished(id, !current));
  }

  return (
    <div className="space-y-4">
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-deep-black text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Praise Report
        </button>
      )}

      {showAdd && (
        <div className="bg-white border border-gold/30 rounded-2xl p-6">
          <h3 className="font-semibold text-charcoal mb-4">New Praise Report</h3>
          <ReportForm
            onSubmit={handleCreate}
            onCancel={() => setShowAdd(false)}
            pending={isPending}
            submitLabel="Add Report"
          />
        </div>
      )}

      {reports.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-gray px-6 py-16 text-center">
          <p className="text-charcoal/40 text-sm">
            No praise reports yet.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {reports.map((r) =>
            editingId === r.id ? (
              <div
                key={r.id}
                className="bg-white border border-gold/30 rounded-2xl p-6 sm:col-span-2"
              >
                <h3 className="font-semibold text-charcoal mb-4">
                  Editing Report
                </h3>
                <ReportForm
                  initial={{ quote: r.quote, name: r.name, role: r.role, published: r.published }}
                  onSubmit={(fd) => handleUpdate(r.id, fd)}
                  onCancel={() => setEditingId(null)}
                  pending={isPending}
                  submitLabel="Save Changes"
                />
              </div>
            ) : (
              <div
                key={r.id}
                className="bg-white rounded-2xl border border-warm-gray p-6 flex flex-col"
              >
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-gold text-sm">★</span>
                  ))}
                </div>
                <p className="text-charcoal/70 text-sm leading-relaxed italic flex-1 mb-4">
                  &ldquo;{r.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-semibold text-charcoal">{r.name}</p>
                    <p className="text-xs text-charcoal/40">{r.role}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleToggle(r.id, r.published)}
                      title={r.published ? "Unpublish" : "Publish"}
                      className={`p-1.5 rounded-lg transition-colors ${
                        r.published
                          ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                          : "text-charcoal/30 hover:text-charcoal hover:bg-warm-white"
                      }`}
                    >
                      {r.published ? (
                        <Eye className="w-4 h-4" />
                      ) : (
                        <EyeOff className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => setEditingId(r.id)}
                      className="p-1.5 text-charcoal/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-warm-gray">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      r.published
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-warm-gray text-charcoal/50"
                    }`}
                  >
                    {r.published ? "Published" : "Draft"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
