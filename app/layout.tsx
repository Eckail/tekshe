import type { Metadata, Viewport } from "next";
import { Geist_Mono, Noto_Sans } from "next/font/google";
import AppShell from "./components/AppShell";
import ServiceWorkerRegistration from "./components/ServiceWorkerRegistration";
import { ThemeProvider } from "./components/ThemeProvider";
import "./globals.css";

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Tekshe — Қытай тілін үйрену",
  applicationName: "Tekshe",
  description: "Қазақ тілінде қытай тілінің негіздерін үйреніңіз.",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#EAF4FA",
  colorScheme: "light dark",
};

const themeBootstrap = `
(function () {
  try {
    var saved = localStorage.getItem("tekshe-theme:v1");
    var theme = saved === "light" || saved === "dark" || saved === "system"
      ? saved
      : "system";

    var dark = theme === "dark" ||
      (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);

    var resolved = dark ? "dark" : "light";
    document.documentElement.dataset.theme = resolved;
    document.documentElement.style.colorScheme = resolved;
  } catch (error) {
    document.documentElement.dataset.theme = "light";
  }
})();
`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="kk"
      suppressHydrationWarning
      className={`${notoSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrap }} />
      </head>
      <body className="min-h-full">
        <ThemeProvider>
          <AppShell>{children}</AppShell>
        </ThemeProvider>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
