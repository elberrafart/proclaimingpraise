import { CommunityClient } from "./CommunityClient";

export const metadata = { title: "Stay Connected | Admin" };

export default function NewsletterPage() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl text-charcoal mb-2">
        Stay Connected
      </h1>
      <p className="text-charcoal/50 text-sm mb-8">
        Everyone who has joined your community list.
      </p>
      <CommunityClient />
    </div>
  );
}
