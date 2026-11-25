"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { LearnerAvatarId } from "../data/learnerProfile";
import {
  getLearnerAvatar,
  LEARNER_AVATAR_UPDATED_EVENT,
} from "../data/learnerAvatar";

const avatarColors: Record<LearnerAvatarId, string> = {
  terracotta: "bg-blue text-white",
  steppe: "bg-mint text-mint-dark",
  charcoal: "bg-blue-dark text-white",
  sand: "bg-sky text-text-primary",
};

export default function LearnerAvatar({
  avatarId,
  nickname,
  className = "h-12 w-12 text-lg",
}: {
  avatarId: LearnerAvatarId;
  nickname: string;
  className?: string;
}) {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  const initial =
    nickname.trim().slice(0, 1).toLocaleUpperCase("kk-KZ") || "О";

  useEffect(() => {
    let active = true;
    let requestId = 0;
    let currentUrl: string | null = null;

    async function refreshAvatar() {
      const currentRequest = ++requestId;

      try {
        const blob = await getLearnerAvatar();

        if (!active || currentRequest !== requestId) return;

        const nextUrl = blob ? URL.createObjectURL(blob) : null;

        if (currentUrl) URL.revokeObjectURL(currentUrl);

        currentUrl = nextUrl;
        setPhotoUrl(nextUrl);
      } catch {
        if (active && currentRequest === requestId) {
          setPhotoUrl(null);
        }
      }
    }

    function handleUpdate() {
      void refreshAvatar();
    }

    void refreshAvatar();

    window.addEventListener(LEARNER_AVATAR_UPDATED_EVENT, handleUpdate);

    let channel: BroadcastChannel | null = null;

    try {
      channel = new BroadcastChannel("tekshe-avatar");
      channel.addEventListener("message", handleUpdate);
    } catch {
      channel = null;
    }

    return () => {
      active = false;
      requestId += 1;

      window.removeEventListener(LEARNER_AVATAR_UPDATED_EVENT, handleUpdate);
      channel?.removeEventListener("message", handleUpdate);
      channel?.close();

      if (currentUrl) URL.revokeObjectURL(currentUrl);
    };
  }, []);

  return (
    <span
      role="img"
      aria-label={`${nickname || "Оқушы"} аватары`}
      className={[
        "relative inline-flex shrink-0 items-center justify-center",
        "overflow-hidden rounded-2xl font-semibold tracking-tight",
        "ring-1 ring-text-primary/5",
        avatarColors[avatarId],
        className,
      ].join(" ")}
    >
      {photoUrl ? (
        <Image
          src={photoUrl}
          alt=""
          fill
          unoptimized
          sizes="64px"
          className="object-cover"
        />
      ) : (
        initial
      )}
    </span>
  );
}
