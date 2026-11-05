import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Tekshe — Қытай тілін үйрену",
    short_name: "Tekshe",
    description: "Қазақ тілінде қытай тілін үйреніңіз.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F3EDE1",
    theme_color: "#F3EDE1",
    lang: "kk",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" }],
  };
}
