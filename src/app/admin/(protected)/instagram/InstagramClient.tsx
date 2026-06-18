"use client";

import { useState, useRef, useTransition } from "react";
import {
  createInstagramPost,
  updateInstagramPost,
  deleteInstagramPost,
  toggleInstagramPostPublished,
  syncInstagramNow,
} from "@/app/actions/instagram";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, RefreshCw, Upload, Link2, X, Image as ImageIcon } from "lucide-react";
import { InstagramIcon } from "@/components/icons/InstagramIcon";
import type { InstagramPost } from "@/types/database";

// ---------------------------------------------------------------------------
// Storage helper
// ---------------------------------------------------------------------------
async function uploadToStorage(bucket: string, folder: string, file: File): Promise<string> {
  const supabase = createClient();
  const ext = file.name.split(".").pop() ?? "bin";
  const filename = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(filename, file, { upsert: false });
  if (error) throw new Error(`Upload failed: ${error.message}`);
  const { data } = supabase.storage.from(bucket).getPublicUrl(filename);
  return data.publicUrl;
}

// ---------------------------------------------------------------------------
// FileOrUrlInput — toggle between file upload and URL paste
// ---------------------------------------------------------------------------
function FileOrUrlInput({
  label,
  name,
  initialUrl,
  required,
  onFileChange,
}: {
  label: string;
  name: string;
  initialUrl?: string | null;
  required?: boolean;
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
    if (next === "url") clearFile();
    else setPreview(initialUrl ?? null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-medium text-charcoal/60">
          {label} {required && <span className="text-gold">*</span>}
        </label>
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

      <div className="flex items-center gap-3">
        {/* Mini square preview */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-warm-gray shrink-0 border border-warm-gray flex items-center justify-center">
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
            <ImageIcon className="w-5 h-5 text-charcoal/20" />
          )}
        </div>

        {mode === "upload" ? (
          <label className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl cursor-pointer hover:border-gold transition-colors min-w-0">
            <span className="text-sm text-charcoal/50 truncate">
              {fileName ?? "Choose an image…"}
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
            name={name}
            type="url"
            defaultValue={initialUrl ?? ""}
            placeholder="https://…"
            required={required && mode === "url"}
            onChange={(e) => setPreview(e.target.value || null)}
            className="flex-1 px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        )}
      </div>

      {fileName && (
        <p className="mt-1.5 text-xs text-charcoal/40 truncate">{fileName}</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// PostForm
// ---------------------------------------------------------------------------
const emptyForm = {
  image_url: "",
  post_url: "",
  caption: "",
  published: true,
};

function PostForm({
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

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget), imageFile);
      }}
      className="space-y-4"
    >
      <FileOrUrlInput
        label="Image"
        name="image_url"
        initialUrl={initial.image_url || null}
        required
        onFileChange={setImageFile}
      />

      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Instagram Post URL <span className="text-gold">*</span>
        </label>
        <input
          name="post_url"
          type="url"
          required
          defaultValue={initial.post_url}
          placeholder="https://www.instagram.com/p/…"
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Caption
        </label>
        <textarea
          name="caption"
          rows={2}
          defaultValue={initial.caption ?? ""}
          placeholder="Short caption shown on hover…"
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
        />
      </div>

      <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
        <input
          type="checkbox"
          name="published"
          defaultChecked={initial.published}
          className="w-4 h-4 accent-gold"
        />
        Published
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

// ---------------------------------------------------------------------------
// InstagramClient
// ---------------------------------------------------------------------------
export function InstagramClient({ posts }: { posts: InstagramPost[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [syncMessage, setSyncMessage] = useState<{ text: string; ok: boolean } | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function resolveImageUrl(fd: FormData, imageFile: File | null): Promise<FormData> {
    if (imageFile && imageFile.size > 0) {
      const url = await uploadToStorage("event-images", "instagram", imageFile);
      fd.set("image_url", url);
    }
    return fd;
  }

  function handleSync() {
    setSyncMessage(null);
    startTransition(async () => {
      const result = await syncInstagramNow();
      if (result.error) {
        setSyncMessage({ text: result.error, ok: false });
      } else {
        setSyncMessage({
          text: `Synced ${result.synced} posts — ${result.added} new, ${result.updated} updated.`,
          ok: true,
        });
      }
    });
  }

  function handleCreate(fd: FormData, imageFile: File | null) {
    setUploadError(null);
    startTransition(async () => {
      try {
        const resolved = await resolveImageUrl(fd, imageFile);
        await createInstagramPost(resolved);
        setShowAdd(false);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed.");
      }
    });
  }

  function handleUpdate(id: string, fd: FormData, imageFile: File | null) {
    setUploadError(null);
    startTransition(async () => {
      try {
        const resolved = await resolveImageUrl(fd, imageFile);
        await updateInstagramPost(id, resolved);
        setEditingId(null);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this post?")) return;
    startTransition(() => deleteInstagramPost(id));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleInstagramPostPublished(id, !current));
  }

  return (
    <div className="space-y-4">
      {syncMessage && (
        <div
          className={`px-4 py-3 rounded-xl text-sm ${
            syncMessage.ok
              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
              : "bg-red-50 border border-red-200 text-red-600"
          }`}
        >
          {syncMessage.text}
        </div>
      )}

      {uploadError && (
        <div className="px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
          {uploadError}
        </div>
      )}

      <div className="flex items-center gap-3 flex-wrap">
        {!showAdd && (
          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gold text-deep-black text-sm font-semibold rounded-xl hover:bg-gold-light transition-colors"
          >
            <Plus className="w-4 h-4" /> Add Post
          </button>
        )}
        <button
          onClick={handleSync}
          disabled={isPending}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-warm-gray text-charcoal text-sm font-semibold rounded-xl hover:border-gold hover:text-gold transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isPending ? "animate-spin" : ""}`} />
          Sync from Instagram
        </button>
      </div>

      {showAdd && (
        <div className="bg-white border border-gold/30 rounded-2xl p-6">
          <h3 className="font-semibold text-charcoal mb-4">New Instagram Post</h3>
          <PostForm
            onSubmit={handleCreate}
            onCancel={() => setShowAdd(false)}
            pending={isPending}
            submitLabel="Add Post"
          />
        </div>
      )}

      {posts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-warm-gray px-6 py-16 text-center">
          <InstagramIcon className="w-8 h-8 text-charcoal/20 mx-auto mb-3" />
          <p className="text-charcoal/40 text-sm">
            No posts yet. Add your first one above.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) =>
            editingId === post.id ? (
              <div
                key={post.id}
                className="bg-white border border-gold/30 rounded-2xl p-6 sm:col-span-2 lg:col-span-3"
              >
                <h3 className="font-semibold text-charcoal mb-4">Editing Post</h3>
                <PostForm
                  initial={{
                    image_url: post.image_url,
                    post_url: post.post_url,
                    caption: post.caption ?? "",
                    published: post.published,
                  }}
                  onSubmit={(fd, imgFile) => handleUpdate(post.id, fd, imgFile)}
                  onCancel={() => setEditingId(null)}
                  pending={isPending}
                  submitLabel="Save Changes"
                />
              </div>
            ) : (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-warm-gray overflow-hidden"
              >
                {/* Image */}
                <div className="aspect-square bg-warm-gray overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.image_url}
                    alt={post.caption ?? ""}
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Info */}
                <div className="p-4">
                  {post.caption && (
                    <p className="text-charcoal/60 text-xs leading-relaxed line-clamp-2 mb-3">
                      {post.caption}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${
                        post.published
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-warm-gray text-charcoal/50"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleToggle(post.id, post.published)}
                        title={post.published ? "Unpublish" : "Publish"}
                        className={`p-1.5 rounded-lg transition-colors ${
                          post.published
                            ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                            : "text-charcoal/30 hover:text-charcoal hover:bg-warm-white"
                        }`}
                      >
                        {post.published ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(post.id)}
                        className="p-1.5 text-charcoal/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-1.5 text-charcoal/40 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
