/** Estimate reading time from markdown/plain content (words / 200 wpm). */
export function getReadTime(content) {
  const words = content?.split(/\s+/).filter(Boolean).length || 0;
  return Math.max(1, Math.ceil(words / 200));
}

/** Strip markdown headings for card excerpts. */
export function excerptFromContent(content, maxLength = 140) {
  if (!content) return "";
  const plain = content.replace(/##.*/g, "").trim();
  if (plain.length <= maxLength) return plain;
  return `${plain.substring(0, maxLength)}...`;
}
