import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Cosmic Card",
    short_name: "Cosmic",
    description: "A soft mobile-first card ritual for daily emotional guidance.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#fff8fc",
    theme_color: "#fff8fc",
    categories: ["health", "lifestyle"],
    icons: [
      {
        src: "/assets/cosmic/avatar-orion.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/assets/cosmic/avatar-orion.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
