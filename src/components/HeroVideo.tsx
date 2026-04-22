"use client";

import { useEffect, useRef } from "react";

export function HeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    video.play().catch(() => {
      // Autoplay blocked — nothing to do, video stays paused
    });
  }, []);

  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      className="absolute inset-0 w-full h-full object-cover opacity-50"
    >
      <source
        src="https://acvtoveuwdqsymdbvzto.supabase.co/storage/v1/object/public/videos/clips/01KPSENZPV83QKFGE924BHNNZA.webm"
        type="video/webm"
      />
      <source
        src="https://acvtoveuwdqsymdbvzto.supabase.co/storage/v1/object/public/videos/clips/Background.mp4"
        type="video/mp4"
      />
    </video>
  );
}
