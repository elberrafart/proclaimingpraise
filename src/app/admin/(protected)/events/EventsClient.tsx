"use client";

import { useState, useTransition } from "react";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events";
import { Plus, Pencil, Trash2, Star, X, Check } from "lucide-react";

type Event = {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
};

const emptyForm = {
  title: "",
  location: "",
  date: "",
  time: "",
  description: "",
  image_url: "",
  featured: false,
};

function EventForm({
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
      className="grid sm:grid-cols-2 gap-4"
    >
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Title <span className="text-gold">*</span>
        </label>
        <input
          name="title"
          required
          defaultValue={initial.title}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Location <span className="text-gold">*</span>
        </label>
        <input
          name="location"
          required
          defaultValue={initial.location}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Date <span className="text-gold">*</span>
        </label>
        <input
          name="date"
          required
          defaultValue={initial.date}
          placeholder="e.g. April 18, 2026"
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Time <span className="text-gold">*</span>
        </label>
        <input
          name="time"
          required
          defaultValue={initial.time}
          placeholder="e.g. 6:00 PM"
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Image URL
        </label>
        <input
          name="image_url"
          type="url"
          defaultValue={initial.image_url ?? ""}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={initial.description ?? ""}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
        />
      </div>
      <div className="sm:col-span-2 flex items-center gap-3">
        <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={initial.featured}
            className="w-4 h-4 accent-gold"
          />
          Featured event
        </label>
      </div>
      <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
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

export function EventsClient({ events }: { events: Event[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleCreate(fd: FormData) {
    startTransition(async () => {
      await createEvent(fd);
      setShowAdd(false);
    });
  }

  function handleUpdate(id: string, fd: FormData) {
    startTransition(async () => {
      await updateEvent(id, fd);
      setEditingId(null);
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    startTransition(() => deleteEvent(id));
  }

  return (
    <div className="space-y-4">
      {/* Add button */}
      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-deep-black text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      )}

      {/* Add form */}
      {showAdd && (
        <div className="bg-white border border-gold/30 rounded-2xl p-6">
          <h3 className="font-semibold text-charcoal mb-4">New Event</h3>
          <EventForm
            onSubmit={handleCreate}
            onCancel={() => setShowAdd(false)}
            pending={isPending}
            submitLabel="Create Event"
          />
        </div>
      )}

      {/* Events list */}
      <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
        {events.length === 0 ? (
          <p className="px-6 py-10 text-center text-charcoal/40 text-sm">
            No events yet. Add your first one above.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-warm-white text-charcoal/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Featured</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray">
              {events.map((event) =>
                editingId === event.id ? (
                  <tr key={event.id}>
                    <td colSpan={5} className="px-6 py-4">
                      <EventForm
                        initial={{
                          title: event.title,
                          location: event.location,
                          date: event.date,
                          time: event.time,
                          description: event.description ?? "",
                          image_url: event.image_url ?? "",
                          featured: event.featured,
                        }}
                        onSubmit={(fd) => handleUpdate(event.id, fd)}
                        onCancel={() => setEditingId(null)}
                        pending={isPending}
                        submitLabel="Save Changes"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr
                    key={event.id}
                    className="hover:bg-warm-white/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-charcoal">
                      {event.title}
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">{event.date}</td>
                    <td className="px-6 py-4 text-charcoal/60">
                      {event.location}
                    </td>
                    <td className="px-6 py-4">
                      {event.featured ? (
                        <span className="flex items-center gap-1 text-gold text-xs font-medium">
                          <Star className="w-3 h-3 fill-gold" /> Featured
                        </span>
                      ) : (
                        <span className="text-charcoal/30 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(event.id)}
                          className="p-1.5 text-charcoal/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(event.id)}
                          className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
