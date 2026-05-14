const LOCAL_API_BASE_URL = "http://localhost:8080";

export function getCosmicApiBaseUrl() {
  return (
    process.env.COSMIC_CARD_API_URL ??
    process.env.NEXT_PUBLIC_COSMIC_CARD_API_URL ??
    LOCAL_API_BASE_URL
  );
}

export function getCosmicApiEnvSource() {
  if (process.env.COSMIC_CARD_API_URL) {
    return "COSMIC_CARD_API_URL";
  }

  if (process.env.NEXT_PUBLIC_COSMIC_CARD_API_URL) {
    return "NEXT_PUBLIC_COSMIC_CARD_API_URL";
  }

  return "fallback";
}

export function getSafeCosmicApiBaseUrl() {
  const url = new URL(getCosmicApiBaseUrl());
  url.username = "";
  url.password = "";
  url.pathname = url.pathname.replace(/\/$/, "");
  url.search = "";
  url.hash = "";

  return url.toString().replace(/\/$/, "");
}
