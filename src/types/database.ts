// Supabase database type definitions — mirrors supabase/schema.sql exactly.
// Import row types (Event, WorshipRequest, etc.) in components instead of defining inline types.

export type RegistrationType = "none" | "free_rsvp" | "paid";

export type EventRow = {
  id: string;
  title: string;
  location: string;
  date: string;
  time: string;
  description: string | null;
  image_url: string | null;
  featured: boolean;
  registration_type: RegistrationType;
  registration_url: string | null;
  created_at: string;
};

export type EventRsvpRow = {
  id: string;
  event_id: string;
  name: string;
  email: string;
  created_at: string;
};

export type WorshipRequestRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  purpose: "high" | "low";
  description: string;
  event_month: number | null;
  event_day: number | null;
  event_year: number | null;
  event_time: string | null;
  date_tbd: boolean;
  status: "new" | "contacted" | "completed";
  completed_by: string | null;
  created_at: string;
};

export type NewsletterSubscriberRow = {
  id: string;
  email: string;
  status: "active" | "unsubscribed";
  created_at: string;
};

export type VideoTestimonyRow = {
  id: string;
  title: string;
  video_url: string;
  thumbnail_url: string | null;
  description: string | null;
  autoplay: boolean;
  muted: boolean;
  loop: boolean;
  overlay_opacity: number;
  published: boolean;
  show_on_home: boolean;
  show_on_videos: boolean;
  sort_order: number;
  created_at: string;
};

export type InstagramPostRow = {
  id: string;
  instagram_id: string | null;
  image_url: string;
  post_url: string;
  caption: string | null;
  published: boolean;
  created_at: string;
};

export type PraiseReportRow = {
  id: string;
  quote: string;
  name: string;
  role: string;
  published: boolean;
  created_at: string;
};

// Supabase client generic — passed to createBrowserClient / createServerClient.
// Tables must include Relationships to satisfy GenericTable.
export type Database = {
  public: {
    Tables: {
      events: {
        Row: EventRow;
        Insert: {
          id?: string;
          title: string;
          location: string;
          date: string;
          time: string;
          description?: string | null;
          image_url?: string | null;
          featured?: boolean;
          registration_type?: RegistrationType;
          registration_url?: string | null;
          created_at?: string;
        };
        Update: {
          title?: string;
          location?: string;
          date?: string;
          time?: string;
          description?: string | null;
          image_url?: string | null;
          featured?: boolean;
          registration_type?: RegistrationType;
          registration_url?: string | null;
        };
        Relationships: [];
      };
      event_rsvps: {
        Row: EventRsvpRow;
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          email: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
        };
        Relationships: [];
      };
      worship_requests: {
        Row: WorshipRequestRow;
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone: string;
          city: string;
          purpose: "high" | "low";
          description: string;
          event_month?: number | null;
          event_day?: number | null;
          event_year?: number | null;
          event_time?: string | null;
          date_tbd?: boolean;
          status?: "new" | "contacted" | "completed";
          completed_by?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string;
          email?: string;
          phone?: string;
          city?: string;
          purpose?: "high" | "low";
          description?: string;
          event_month?: number | null;
          event_day?: number | null;
          event_year?: number | null;
          event_time?: string | null;
          date_tbd?: boolean;
          status?: "new" | "contacted" | "completed";
          completed_by?: string | null;
        };
        Relationships: [];
      };
      newsletter_subscribers: {
        Row: NewsletterSubscriberRow;
        Insert: {
          id?: string;
          email: string;
          status?: "active" | "unsubscribed";
          created_at?: string;
        };
        Update: {
          email?: string;
          status?: "active" | "unsubscribed";
        };
        Relationships: [];
      };
      video_testimonies: {
        Row: VideoTestimonyRow;
        Insert: {
          id?: string;
          title: string;
          video_url: string;
          thumbnail_url?: string | null;
          description?: string | null;
          autoplay?: boolean;
          muted?: boolean;
          loop?: boolean;
          overlay_opacity?: number;
          published?: boolean;
          show_on_home?: boolean;
          show_on_videos?: boolean;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          title?: string;
          video_url?: string;
          thumbnail_url?: string | null;
          description?: string | null;
          autoplay?: boolean;
          muted?: boolean;
          loop?: boolean;
          overlay_opacity?: number;
          published?: boolean;
          show_on_home?: boolean;
          show_on_videos?: boolean;
          sort_order?: number;
        };
        Relationships: [];
      };
      instagram_posts: {
        Row: InstagramPostRow;
        Insert: {
          id?: string;
          instagram_id?: string | null;
          image_url: string;
          post_url: string;
          caption?: string | null;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          instagram_id?: string | null;
          image_url?: string;
          post_url?: string;
          caption?: string | null;
          published?: boolean;
        };
        Relationships: [];
      };
      praise_reports: {
        Row: PraiseReportRow;
        Insert: {
          id?: string;
          quote: string;
          name: string;
          role: string;
          published?: boolean;
          created_at?: string;
        };
        Update: {
          quote?: string;
          name?: string;
          role?: string;
          published?: boolean;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
};

// Convenience aliases used throughout the app
export type Event = EventRow;
export type WorshipRequest = WorshipRequestRow;
export type NewsletterSubscriber = NewsletterSubscriberRow;
export type PraiseReport = PraiseReportRow;
export type VideoTestimony = VideoTestimonyRow;
export type InstagramPost = InstagramPostRow;
export type EventRsvp = EventRsvpRow;
