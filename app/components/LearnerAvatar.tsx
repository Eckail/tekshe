import type { LearnerAvatarId } from "../data/learnerProfile";

const avatarColors: Record<LearnerAvatarId, string> = {
  terracotta: "bg-terracotta text-white",
  steppe: "bg-steppe text-white",
  charcoal: "bg-charcoal text-cream",
  sand: "bg-sand text-charcoal",
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
  const initial = nickname.trim().slice(0, 1).toLocaleUpperCase("kk-KZ") || "О";

  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-2xl font-semibold tracking-tight ring-1 ring-charcoal/5 ${avatarColors[avatarId]} ${className}`}
    >
      {initial}
    </span>
  );
}
