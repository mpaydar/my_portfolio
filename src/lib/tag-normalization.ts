const HASHTAG_PATTERN = /#[A-Za-z][A-Za-z0-9]*/g;

// Handles both clean single tags and pasted hashtag blobs like
// "#DataEngineering #ApacheAirflow #SystemDesign" stored as one array item.
function extractTagsFromBlob(raw: string): string[] {
  const matches = raw.match(HASHTAG_PATTERN);
  if (matches && matches.length > 0) {
    return matches.map((match) => match.slice(1));
  }

  const trimmed = raw.trim();
  return trimmed ? [trimmed] : [];
}

export function normalizeTagList(tags: { tag: string }[]): string[] {
  const seen = new Set<string>();
  const result: string[] = [];

  for (const { tag } of tags) {
    for (const extracted of extractTagsFromBlob(tag)) {
      const key = extracted.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(extracted);
      }
    }
  }

  return result;
}

export function tagListsDiffer(before: string[], after: string[]): boolean {
  if (before.length !== after.length) return true;
  return before.some((tag, index) => tag !== after[index]);
}
