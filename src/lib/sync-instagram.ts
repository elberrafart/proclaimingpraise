import { createServiceClient } from "@/lib/supabase/service";

interface InstagramMediaItem {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url: string;
  permalink: string;
  thumbnail_url?: string; // only present for VIDEO
}

export type SyncResult = { synced: number; added: number; updated: number; error?: string };

export async function syncInstagramFeed(accessToken: string): Promise<SyncResult> {
  // Fetch up to 20 most recent posts from Instagram Graph API
  const fields = "id,caption,media_type,media_url,permalink,thumbnail_url";
  let res: Response;
  try {
    res = await fetch(
      `https://graph.instagram.com/me/media?fields=${fields}&limit=20&access_token=${accessToken}`
    );
  } catch {
    return { synced: 0, added: 0, updated: 0, error: "Network error reaching Instagram API" };
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: { message?: string } };
    return {
      synced: 0,
      added: 0,
      updated: 0,
      error: body?.error?.message ?? `Instagram API error ${res.status}`,
    };
  }

  const { data: posts } = (await res.json()) as { data: InstagramMediaItem[] };
  if (!posts?.length) return { synced: 0, added: 0, updated: 0 };

  // Only displayable media (images, carousels, video thumbnails)
  const displayable = posts.filter((p) => {
    if (p.media_type === "IMAGE" || p.media_type === "CAROUSEL_ALBUM") return true;
    if (p.media_type === "VIDEO" && p.thumbnail_url) return true;
    return false;
  });

  if (!displayable.length) return { synced: 0, added: 0, updated: 0 };

  const supabase = createServiceClient();

  // Get existing instagram_ids to avoid overwriting the published flag on existing rows
  const { data: existing } = await supabase
    .from("instagram_posts")
    .select("instagram_id")
    .not("instagram_id", "is", null);

  const existingIds = new Set(existing?.map((r) => r.instagram_id) ?? []);

  const newPosts = displayable.filter((p) => !existingIds.has(p.id));
  const changedPosts = displayable.filter((p) => existingIds.has(p.id));

  // Insert brand-new posts (published by default)
  if (newPosts.length > 0) {
    await supabase.from("instagram_posts").insert(
      newPosts.map((p) => ({
        instagram_id: p.id,
        image_url: p.media_type === "VIDEO" ? p.thumbnail_url! : p.media_url,
        post_url: p.permalink,
        caption: p.caption ?? null,
        published: true,
      }))
    );
  }

  // Update image + caption on existing rows — never touch published flag
  for (const p of changedPosts) {
    await supabase
      .from("instagram_posts")
      .update({
        image_url: p.media_type === "VIDEO" ? p.thumbnail_url! : p.media_url,
        post_url: p.permalink,
        caption: p.caption ?? null,
      })
      .eq("instagram_id", p.id);
  }

  return { synced: newPosts.length + changedPosts.length, added: newPosts.length, updated: changedPosts.length };
}
