
"use client";

import TeksheLogo from "./TeksheLogo";
import Link from "next/link";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import AppIcon, { type AppIconName } from "./AppIcon";
import WalletBalanceLink from "./WalletBalanceLink";

const navItems: { href: string; label: string; icon: AppIconName }[] = [
  { href: "/", label: "Басты бет", icon: "home" },
  { href: "/learn", label: "Оқу", icon: "book" },
  { href: "/practice", label: "Жаттығу", icon: "practice" },
  { href: "/progress", label: "Ілгерілеу", icon: "progress" },
  { href: "/wallet", label: "Әмиян", icon: "wallet" },
  { href: "/profile", label: "Профиль", icon: "user" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function Brand() {
  return (
    <Link
      href="/"
      className="flex min-h-12 items-center rounded-2xl transition-transform duration-200 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue"
      aria-label="Tekshe — басты бет"
    >
      <TeksheLogo />
    </Link>
  );
}

function NavLink({
  href,
  label,
  icon,
  active,
  mobile = false,
}: {
  href: string;
  label: string;
  icon: AppIconName;
  active: boolean;
  mobile?: boolean;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex items-center transition-all duration-200",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue",
        mobile
          ? "min-h-14 flex-col justify-center gap-1 rounded-xl px-1 text-[10px]"
          : "min-h-11 gap-3 rounded-xl px-3 text-sm",
        active
          ? "bg-blue/10 font-semibold text-blue-dark"
          : "text-text-secondary hover:bg-blue/5 hover:text-text-primary",
      ].join(" ")}
    >
      <AppIcon
        name={icon}
        className={mobile ? "h-5 w-5" : "h-[19px] w-[19px]"}
      />

      <span className={mobile ? "max-w-full truncate" : ""}>
        {label}
      </span>

      {!mobile && active && (
        <span
          className="ml-auto h-1.5 w-1.5 rounded-full bg-blue"
          aria-hidden="true"
        />
      )}
    </Link>
  );
}

function rememberLearningPath(pathname: string) {
  if (
    pathname !== "/learn" &&
    pathname !== "/learn/pinyin" &&
    pathname !== "/learn/hsk" &&
    !pathname.startsWith("/learn/pinyin/") &&
    !pathname.startsWith("/learn/hsk/")
  ) {
    return;
  }

  try {
    window.localStorage.setItem("tekshe-last-learning-route:v1", pathname);
  } catch {
    // Navigation remains usable when browser storage is unavailable.
  }
}

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    rememberLearningPath(pathname);
  }, [pathname]);

  return (
    <div className="min-h-dvh overflow-x-clip bg-ice text-text-primary">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] flex-col border-r border-border-soft bg-warm-white/80 px-5 py-7 backdrop-blur-xl lg:flex">
        <Brand />

        <div className="mb-3 mt-11 px-3">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-text-secondary">
            ОҚУ АЙМАҒЫ
          </p>
        </div>

        <nav aria-label="Негізгі навигация" className="grid gap-1.5">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              active={isActive(pathname, item.href)}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4 border-t border-border-soft pt-5">
          <div className="rounded-2xl bg-card-soft p-4">
            <p className="text-xs font-medium leading-5 text-text-secondary">
              Қытай тілін қазақ тілінде үйреніңіз.
            </p>
            <p className="mt-2 text-[10px] tracking-wide text-blue-dark">
              学习 · 探索 · 成长
            </p>
          </div>

        </div>
      </aside>

      {/* Main application area */}
      <div className="min-h-dvh lg:pl-[264px]">
        {/* Mobile header */}
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-border-soft bg-warm-white/80 px-4 backdrop-blur-xl sm:px-6 lg:hidden">
          <Brand />
          <WalletBalanceLink compact />
        </header>

        {/* Desktop top bar */}
        <header className="sticky top-0 z-20 hidden h-[72px] items-center justify-between border-b border-border-soft bg-warm-white/80 px-8 backdrop-blur-xl lg:flex xl:px-12">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-text-secondary">
              TEKSHE LEARNING SPACE
            </p>
            <p className="mt-1 text-sm font-medium text-text-primary">
              Қытай тілін үйрену кеңістігі
            </p>
          </div>

          <WalletBalanceLink />
        </header>

        <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1440px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 lg:min-h-[calc(100vh-72px)] lg:px-8 lg:pb-12 lg:pt-8 xl:px-12">
          {children}
        </main>

        {/* Mobile bottom navigation */}
        <nav
          aria-label="Мобильді навигация"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 rounded-t-[24px] border-t border-border-soft bg-warm-white/85 px-1 pb-[calc(env(safe-area-inset-bottom)+6px)] pt-2 shadow-[0_-8px_28px_rgba(38,55,70,0.06)] backdrop-blur-xl lg:hidden"
        >
          {[navItems[0], navItems[1], navItems[2], navItems[3], navItems[5]].map(
            (item) => (
              <NavLink
                key={item.href}
                {...item}
                active={isActive(pathname, item.href)}
                mobile
              />
            ),
          )}
        </nav>
      </div>
    </div>
  );
}
