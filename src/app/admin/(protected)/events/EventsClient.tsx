"use client";

import { useState, useRef, useTransition } from "react";
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Star, Upload, Link2, X, Share2 } from "lucide-react";
import type { Event, RegistrationType } from "@/types/database";
import { EventSharePanel } from "@/components/admin/EventSharePanel";

// ---------------------------------------------------------------------------
// Upload helper — runs in the browser, returns the public storage URL
// ---------------------------------------------------------------------------
async function uploadEventImage(file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "jpg";
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from("event-images")
    .upload(filename, file, { upsert: false });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage
    .from("event-images")
    .getPublicUrl(filename);

  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// Image input — toggle between Upload and URL, with inline thumbnail
// ---------------------------------------------------------------------------
function ImageInput({
  initialUrl,
  onFileChange,
}: {
  initialUrl?: string | null;
  onFileChange: (file: File | null) => void;
}) {
  const [mode, setMode] = useState<"upload" | "url">(initialUrl ? "url" : "upload");
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    onFileChange(file);
    setPreview(URL.createObjectURL(file));
    setFileName(file.name);
  }

  function clearFile() {
    if (fileRef.current) fileRef.current.value = "";
    onFileChange(null);
    setPreview(initialUrl ?? null);
    setFileName(null);
  }

  function switchMode(next: "upload" | "url") {
    setMode(next);
    if (next === "url") {
      clearFile();
    } else {
      setPreview(initialUrl ?? null);
    }
  }

  return (
    <div className="sm:col-span-2">
      {/* Label + toggle on one line */}
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-charcoal/60">Event Image</label>
        <div className="flex items-center bg-warm-white border border-warm-gray rounded-lg p-0.5 gap-0.5">
          <button
            type="button"
            onClick={() => switchMode("upload")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === "upload"
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal/40 hover:text-charcoal/70"
            }`}
          >
            <Upload className="w-3 h-3" /> Upload
          </button>
          <button
            type="button"
            onClick={() => switchMode("url")}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
              mode === "url"
                ? "bg-white text-charcoal shadow-sm"
                : "text-charcoal/40 hover:text-charcoal/70"
            }`}
          >
            <Link2 className="w-3 h-3" /> URL
          </button>
        </div>
      </div>

      {/* Input row — thumbnail + input side by side */}
      <div className="flex items-center gap-3">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-warm-gray shrink-0 border border-warm-gray">
          {preview ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preview} alt="" className="w-full h-full object-cover" />
              {fileName && (
                <button
                  type="button"
                  onClick={clearFile}
                  className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                >
                  <X className="w-4 h-4 text-white" />
                </button>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Upload className="w-5 h-5 text-charcoal/20" />
            </div>
          )}
        </div>

        {/* Active input */}
        {mode === "upload" ? (
          <label className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl cursor-pointer hover:border-gold transition-colors min-w-0">
            <span className="text-sm text-charcoal/50 truncate">
              {fileName ?? "Choose a file…"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFile}
            />
          </label>
        ) : (
          <input
            name="image_url"
            type="url"
            defaultValue={initialUrl ?? ""}
            placeholder="https://…"
            onChange={(e) => setPreview(e.target.value || null)}
            className="flex-1 px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EventForm
// ---------------------------------------------------------------------------
const emptyForm = {
  title: "",
  location: "",
  date: "",
  time: "",
  description: "",
  image_url: "",
  featured: false,
  registration_type: "none" as RegistrationType,
  registration_url: "",
};

function EventForm({
  initial = emptyForm,
  onSubmit,
  onCancel,
  pending,
  submitLabel,
}: {
  initial?: typeof emptyForm;
  onSubmit: (fd: FormData, imageFile: File | null) => void;
  onCancel: () => void;
  pending: boolean;
  submitLabel: string;
}) {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [regType, setRegType] = useState<RegistrationType>(initial.registration_type);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget), imageFile);
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

      <ImageInput
        initialUrl={initial.image_url}
        onFileChange={setImageFile}
      />

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
      {/* Registration */}
      <div className="sm:col-span-2">
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Registration Type
        </label>
        <select
          name="registration_type"
          value={regType}
          onChange={(e) => setRegType(e.target.value as RegistrationType)}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        >
          <option value="none">None — walk-in, no RSVP needed</option>
          <option value="free_rsvp">Free RSVP — collect name &amp; email</option>
          <option value="paid">Paid — redirect to external link (Zeffy, etc.)</option>
        </select>
      </div>
      {regType === "paid" && (
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-charcoal/60 mb-1">
            Registration URL <span className="text-gold">*</span>
          </label>
          <input
            name="registration_url"
            type="url"
            required
            defaultValue={initial.registration_url ?? ""}
            placeholder="https://www.zeffy.com/…"
            className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
      )}

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

// ---------------------------------------------------------------------------
// EventsClient
// ---------------------------------------------------------------------------
export function EventsClient({ events }: { events: Event[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sharingEvent, setSharingEvent] = useState<Event | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function resolveImageUrl(fd: FormData, imageFile: File | null): Promise<FormData> {
    if (imageFile && imageFile.size > 0) {
      const url = await uploadEventImage(imageFile);
      fd.set("image_url", url);
    }
    return fd;
  }

  function handleCreate(fd: FormData, imageFile: File | null) {
    setUploadError(null);
    startTransition(async () => {
      try {
        const resolved = await resolveImageUrl(fd, imageFile);
        await createEvent(resolved);
        setShowAdd(false);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Image upload failed.");
      }
    });
  }

  function handleUpdate(id: string, fd: FormData, imageFile: File | null) {
    setUploadError(null);
    startTransition(async () => {
      try {
        const resolved = await resolveImageUrl(fd, imageFile);
        await updateEvent(id, resolved);
        setEditingId(null);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Image upload failed.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this event?")) return;
    startTransition(async () => {
      const result = await deleteEvent(id);
      if (result?.error) setUploadError(result.error);
    });
  }

  return (
    <div className="space-y-4">
      {uploadError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {uploadError}
        </div>
      )}

      {!showAdd && (
        <button
          onClick={() => setShowAdd(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gold text-deep-black text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Event
        </button>
      )}

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

      <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
        {events.length === 0 ? (
          <p className="px-6 py-10 text-center text-charcoal/40 text-sm">
            No events yet. Add your first one above.
          </p>
        ) : (
          <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[680px]">
            <thead className="bg-warm-white text-charcoal/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Location</th>
                <th className="px-6 py-3 text-left">Featured</th>
                <th className="px-6 py-3 text-right">Share</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray">
              {events.map((event) =>
                editingId === event.id ? (
                  <tr key={event.id}>
                    <td colSpan={6} className="px-6 py-4">
                      <EventForm
                        initial={{
                          title: event.title,
                          location: event.location,
                          date: event.date,
                          time: event.time,
                          description: event.description ?? "",
                          image_url: event.image_url ?? "",
                          featured: event.featured,
                          registration_type: event.registration_type ?? "none",
                          registration_url: event.registration_url ?? "",
                        }}
                        onSubmit={(fd, file) => handleUpdate(event.id, fd, file)}
                        onCancel={() => setEditingId(null)}
                        pending={isPending}
                        submitLabel="Save Changes"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={event.id} className="hover:bg-warm-white/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {event.image_url && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={event.image_url}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover shrink-0"
                          />
                        )}
                        <span className="font-medium text-charcoal">{event.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">{event.date}</td>
                    <td className="px-6 py-4 text-charcoal/60">{event.location}</td>
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
                          onClick={() => setSharingEvent(event)}
                          className="p-1.5 text-charcoal/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          title="Share / QR Code"
                        >
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
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
          </div>
        )}
      </div>

      {sharingEvent && (
        <EventSharePanel
          eventId={sharingEvent.id}
          eventTitle={sharingEvent.title}
          onClose={() => setSharingEvent(null)}
        />
      )}
    </div>
  );
}
