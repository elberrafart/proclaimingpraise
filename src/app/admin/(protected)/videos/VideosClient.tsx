"use client";

import { useState, useRef, useTransition } from "react";
import {
  createVideo,
  updateVideo,
  deleteVideo,
  toggleVideoPublished,
} from "@/app/actions/videos";
import { createClient } from "@/lib/supabase/client";
import { Plus, Pencil, Trash2, Eye, EyeOff, Play, Upload, Link2, X, Image, Home, MonitorPlay } from "lucide-react";
import type { VideoTestimony } from "@/types/database";

// ---------------------------------------------------------------------------
// Storage helpers
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
  accept,
  initialUrl,
  required,
  onFileChange,
  previewType = "image",
}: {
  label: string;
  name: string;
  accept: string;
  initialUrl?: string | null;
  required?: boolean;
  onFileChange: (file: File | null) => void;
  previewType?: "image" | "video";
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
        {/* Mini preview */}
        <div className="relative w-16 h-12 rounded-xl overflow-hidden bg-warm-gray shrink-0 border border-warm-gray flex items-center justify-center">
          {preview ? (
            previewType === "image" ? (
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
              <div className="w-full h-full bg-charcoal flex items-center justify-center relative">
                <Play className="w-4 h-4 text-white/60" />
                {fileName && (
                  <button
                    type="button"
                    onClick={clearFile}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                )}
              </div>
            )
          ) : (
            previewType === "image" ? (
              <Image className="w-5 h-5 text-charcoal/20" />
            ) : (
              <Play className="w-5 h-5 text-charcoal/20" />
            )
          )}
        </div>

        {mode === "upload" ? (
          <label className="flex-1 flex items-center gap-2 px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl cursor-pointer hover:border-gold transition-colors min-w-0">
            <span className="text-sm text-charcoal/50 truncate">
              {fileName ?? "Choose a file…"}
            </span>
            <input
              ref={fileRef}
              type="file"
              accept={accept}
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
// VideoForm
// ---------------------------------------------------------------------------
const emptyForm = {
  title: "",
  video_url: "",
  thumbnail_url: "",
  description: "",
  autoplay: false,
  muted: false,
  loop: false,
  overlay_opacity: 0,
  published: true,
  show_on_home: true,
  show_on_videos: true,
  sort_order: 0,
};

function VideoForm({
  initial = emptyForm,
  onSubmit,
  onCancel,
  pending,
  submitLabel,
}: {
  initial?: typeof emptyForm;
  onSubmit: (fd: FormData, videoFile: File | null, thumbFile: File | null) => void;
  onCancel: () => void;
  pending: boolean;
  submitLabel: string;
}) {
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbFile, setThumbFile] = useState<File | null>(null);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(new FormData(e.currentTarget), videoFile, thumbFile);
      }}
      className="space-y-4"
    >
      <div>
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

      <FileOrUrlInput
        label="Video"
        name="video_url"
        accept="video/*"
        initialUrl={initial.video_url}
        required
        onFileChange={setVideoFile}
        previewType="video"
      />

      <FileOrUrlInput
        label="Thumbnail (optional — shown before video plays)"
        name="thumbnail_url"
        accept="image/*"
        initialUrl={initial.thumbnail_url}
        onFileChange={setThumbFile}
        previewType="image"
      />

      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Description
        </label>
        <textarea
          name="description"
          rows={2}
          defaultValue={initial.description ?? ""}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-none"
        />
      </div>

      {/* Placement */}
      <div>
        <p className="text-xs font-medium text-charcoal/60 mb-2">Show On</p>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
            <input
              type="checkbox"
              name="show_on_home"
              defaultChecked={initial.show_on_home}
              className="w-4 h-4 accent-gold"
            />
            Homepage Carousel
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
            <input
              type="checkbox"
              name="show_on_videos"
              defaultChecked={initial.show_on_videos}
              className="w-4 h-4 accent-gold"
            />
            Videos Page
          </label>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div>
          <label className="block text-xs font-medium text-charcoal/60 mb-1">
            Sort Order
          </label>
          <input
            name="sort_order"
            type="number"
            defaultValue={initial.sort_order}
            className="w-24 px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
          />
        </div>
        <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70 pt-5">
          <input
            type="checkbox"
            name="published"
            defaultChecked={initial.published}
            className="w-4 h-4 accent-gold"
          />
          Published
        </label>
      </div>

      {/* Playback options */}
      <div>
        <p className="text-xs font-medium text-charcoal/60 mb-2">Playback Options</p>
        <div className="flex flex-wrap gap-5">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
            <input
              type="checkbox"
              name="autoplay"
              defaultChecked={initial.autoplay}
              className="w-4 h-4 accent-gold"
            />
            Autoplay
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
            <input
              type="checkbox"
              name="muted"
              defaultChecked={initial.muted}
              className="w-4 h-4 accent-gold"
            />
            Muted
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal/70">
            <input
              type="checkbox"
              name="loop"
              defaultChecked={initial.loop}
              className="w-4 h-4 accent-gold"
            />
            Loop
          </label>
        </div>
        <p className="text-xs text-charcoal/30 mt-1.5">
          Tip: browsers require Muted when Autoplay is on.
        </p>
      </div>

      {/* Overlay */}
      <div>
        <label className="block text-xs font-medium text-charcoal/60 mb-1">
          Overlay Darkness
        </label>
        <select
          name="overlay_opacity"
          defaultValue={initial.overlay_opacity}
          className="w-full px-3 py-2.5 bg-warm-white border border-warm-gray rounded-xl text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
        >
          <option value="0">None</option>
          <option value="20">20% — Subtle</option>
          <option value="40">40% — Light</option>
          <option value="60">60% — Medium</option>
          <option value="80">80% — Heavy</option>
        </select>
        <p className="text-xs text-charcoal/30 mt-1">
          When Autoplay + Overlay are set, the title and description appear on top of the video.
        </p>
      </div>

      <p className="text-xs text-charcoal/40">
        Supported formats: MP4, WebM, MOV. Recommended max size: 500 MB.
      </p>

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
          {pending ? "Uploading…" : submitLabel}
        </button>
      </div>
    </form>
  );
}

// ---------------------------------------------------------------------------
// VideosClient
// ---------------------------------------------------------------------------
export function VideosClient({ videos }: { videos: VideoTestimony[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function resolveUrls(
    fd: FormData,
    videoFile: File | null,
    thumbFile: File | null
  ): Promise<FormData> {
    if (videoFile && videoFile.size > 0) {
      const url = await uploadToStorage("videos", "clips", videoFile);
      fd.set("video_url", url);
    }
    if (thumbFile && thumbFile.size > 0) {
      const url = await uploadToStorage("videos", "thumbs", thumbFile);
      fd.set("thumbnail_url", url);
    }
    return fd;
  }

  function handleCreate(fd: FormData, videoFile: File | null, thumbFile: File | null) {
    setUploadError(null);
    startTransition(async () => {
      try {
        const resolved = await resolveUrls(fd, videoFile, thumbFile);
        await createVideo(resolved);
        setShowAdd(false);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed.");
      }
    });
  }

  function handleUpdate(id: string, fd: FormData, videoFile: File | null, thumbFile: File | null) {
    setUploadError(null);
    startTransition(async () => {
      try {
        const resolved = await resolveUrls(fd, videoFile, thumbFile);
        await updateVideo(id, resolved);
        setEditingId(null);
      } catch (e) {
        setUploadError(e instanceof Error ? e.message : "Upload failed.");
      }
    });
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this video?")) return;
    startTransition(() => deleteVideo(id));
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(() => toggleVideoPublished(id, !current));
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
          <Plus className="w-4 h-4" /> Add Video
        </button>
      )}

      {showAdd && (
        <div className="bg-white border border-gold/30 rounded-2xl p-6">
          <h3 className="font-semibold text-charcoal mb-4">New Video</h3>
          <VideoForm
            onSubmit={handleCreate}
            onCancel={() => setShowAdd(false)}
            pending={isPending}
            submitLabel="Add Video"
          />
        </div>
      )}

      <div className="bg-white rounded-2xl border border-warm-gray overflow-hidden">
        {videos.length === 0 ? (
          <p className="px-6 py-10 text-center text-charcoal/40 text-sm">
            No videos yet. Add your first one above.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-warm-white text-charcoal/50 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-left">Video</th>
                <th className="px-6 py-3 text-left">Placement</th>
                <th className="px-6 py-3 text-left">Order</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-warm-gray">
              {videos.map((video) =>
                editingId === video.id ? (
                  <tr key={video.id}>
                    <td colSpan={5} className="px-6 py-4">
                      <VideoForm
                        initial={{
                          title: video.title,
                          video_url: video.video_url,
                          thumbnail_url: video.thumbnail_url ?? "",
                          description: video.description ?? "",
                          autoplay: video.autoplay,
                          muted: video.muted,
                          loop: video.loop,
                          overlay_opacity: video.overlay_opacity,
                          published: video.published,
                          show_on_home: video.show_on_home,
                          show_on_videos: video.show_on_videos,
                          sort_order: video.sort_order,
                        }}
                        onSubmit={(fd, vf, tf) => handleUpdate(video.id, fd, vf, tf)}
                        onCancel={() => setEditingId(null)}
                        pending={isPending}
                        submitLabel="Save Changes"
                      />
                    </td>
                  </tr>
                ) : (
                  <tr key={video.id} className="hover:bg-warm-white/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-10 rounded-lg overflow-hidden bg-charcoal shrink-0 flex items-center justify-center">
                          {video.thumbnail_url ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={video.thumbnail_url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Play className="w-4 h-4 text-white/30" />
                          )}
                        </div>
                        <span className="font-medium text-charcoal">{video.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {video.show_on_home && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-600">
                            <Home className="w-3 h-3" /> Home
                          </span>
                        )}
                        {video.show_on_videos && (
                          <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full bg-purple-50 text-purple-600">
                            <MonitorPlay className="w-3 h-3" /> Videos
                          </span>
                        )}
                        {!video.show_on_home && !video.show_on_videos && (
                          <span className="text-xs text-charcoal/30">Hidden</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-charcoal/60">{video.sort_order}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          video.published
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-warm-gray text-charcoal/50"
                        }`}
                      >
                        {video.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => handleToggle(video.id, video.published)}
                          title={video.published ? "Unpublish" : "Publish"}
                          className={`p-1.5 rounded-lg transition-colors ${
                            video.published
                              ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100"
                              : "text-charcoal/30 hover:text-charcoal hover:bg-warm-white"
                          }`}
                        >
                          {video.published ? (
                            <Eye className="w-4 h-4" />
                          ) : (
                            <EyeOff className="w-4 h-4" />
                          )}
                        </button>
                        <button
                          onClick={() => setEditingId(video.id)}
                          className="p-1.5 text-charcoal/40 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(video.id)}
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
