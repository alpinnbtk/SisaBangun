// Turns raw user input into a safe value for a PostgREST `ilike` filter.
// - strips " and \ (could break out of the quoted value)
// - strips % _ * (wildcards with special meaning)
// - wraps in double quotes so commas/parentheses are treated as plain text
export function toIlikeFilterValue(raw: string | undefined): string | null {
  if (!raw) return null;

  const cleaned = raw
    .replace(/["\\%_*]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 50);

  return cleaned ? `"%${cleaned}%"` : null;
}
