export function normalizeMediaUrl(url) {
  if (!url || typeof url !== "string") {
    return null;
  }

  const trimmed = url.trim();
  const match = trimmed.match(/^(?:https?:\/\/)?(?:api|localhost|127\.0\.0\.1)(?::8000)?(\/media\/.*)$/i);
  if (match) {
    return match[1];
  }

  return trimmed;
}
