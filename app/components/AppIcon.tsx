export type AppIconName = "home" | "book" | "practice" | "progress" | "wallet" | "user" | "arrow" | "check" | "clock" | "spark";

export default function AppIcon({
  name,
  className = "h-5 w-5",
}: {
  name: AppIconName;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "home":
      return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z" /></svg>;
    case "book":
      return <svg {...common}><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" /><path d="M4 5.5v13A2.5 2.5 0 0 1 6.5 16H20M8 7h8M8 10h6" /></svg>;
    case "practice":
      return <svg {...common}><path d="m9 12 2 2 4-5" /><circle cx="12" cy="12" r="9" /><path d="M12 3v2M21 12h-2M12 21v-2M3 12h2" /></svg>;
    case "progress":
      return <svg {...common}><path d="M4 19V5M4 19h16" /><path d="m7 15 4-4 3 2 5-7" /></svg>;
    case "wallet":
      return <svg {...common}><path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H20v16H6.5A2.5 2.5 0 0 1 4 17.5z" /><path d="M4 7h16M15 12h5v4h-5a2 2 0 0 1 0-4Z" /><path d="M17.5 14h.01" /></svg>;
    case "user":
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20a7.5 7.5 0 0 1 15 0" /></svg>;
    case "arrow":
      return <svg {...common}><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
    case "check":
      return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>;
    case "clock":
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>;
    case "spark":
      return <svg {...common}><path d="m12 2 1.8 7.2L21 11l-7.2 1.8L12 20l-1.8-7.2L3 11l7.2-1.8z" /><path d="m19 16 .8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z" /></svg>;
  }
}
