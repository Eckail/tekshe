"use client";

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
    <Link href="/" className="flex min-h-12 items-center gap-3 rounded-lg text-charcoal focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-terracotta" aria-label="Tekshe — басты бет">
      <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-charcoal text-cream" aria-hidden="true">
        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
          <path d="M5 7h22M16 7v19M10 14h12" stroke="currentColor" strokeWidth="2" />
          <path d="M7 24h7M18 24h7" stroke="currentColor" strokeWidth="2" />
        </svg>
      </span>
      <span>
        <span className="block text-xl font-semibold tracking-tight">tekshe</span>
        <span className="block text-[10px] uppercase tracking-[0.18em] text-charcoal/55">中文学习</span>
      </span>
    </Link>
  );
}

function NavLink({ href, label, icon, active, mobile = false }: {
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
      className={`group flex min-h-12 items-center gap-3 rounded-lg px-3 text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terracotta ${
        active ? "bg-sand/70 font-semibold text-charcoal" : "text-charcoal/65 hover:bg-sand/45 hover:text-charcoal"
      } ${mobile ? "min-h-14 flex-col justify-center gap-1 px-1 text-[10px]" : ""}`}
    >
      <AppIcon name={icon} className={mobile ? "h-5 w-5" : "h-[19px] w-[19px]"} />
      <span className={mobile ? "max-w-full truncate" : ""}>{label}</span>
      {!mobile && active && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-terracotta" aria-hidden="true" />}
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
  ) return;
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
    <div className="min-h-screen overflow-x-clip bg-cream text-charcoal">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-charcoal/10 bg-cream px-5 py-6 md:flex">
        <Brand />
        <p className="mb-3 mt-10 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-charcoal/45">ОҚУ АЙМАҒЫ</p>
        <nav aria-label="Негізгі навигация" className="grid gap-1">
          {navItems.map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} />
          ))}
        </nav>
        <div className="mt-auto border-t border-charcoal/10 pt-5">
          <p className="px-3 text-xs leading-5 text-charcoal/55">Қытай тілін қазақ тілінде үйреніңіз.</p>
          <div className="mt-4"><WalletBalanceLink /></div>
        </div>
      </aside>

      <div className="min-h-screen md:pl-64">
        <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-charcoal/10 bg-cream/95 px-4 backdrop-blur-sm sm:px-6 md:hidden">
          <Brand />
          <WalletBalanceLink compact />
        </header>
        <main className="mx-auto min-h-[calc(100vh-4rem)] w-full max-w-[1500px] px-4 pb-[calc(6.5rem+env(safe-area-inset-bottom))] pt-6 sm:px-6 md:min-h-screen md:px-10 md:pb-12 md:pt-10 lg:px-14">
          {children}
        </main>
        <nav aria-label="Мобильді навигация" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-charcoal/10 bg-paper/95 px-1 pb-[env(safe-area-inset-bottom)] pt-1 shadow-[0_-6px_24px_rgba(36,35,33,0.06)] backdrop-blur-sm md:hidden">
          {[navItems[0], navItems[1], navItems[2], navItems[4], navItems[5]].map((item) => (
            <NavLink key={item.href} {...item} active={isActive(pathname, item.href)} mobile />
          ))}
        </nav>
      </div>
    </div>
  );
}
