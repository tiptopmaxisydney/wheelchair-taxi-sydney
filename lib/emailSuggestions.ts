// Client-side email helpers shared by the email autocomplete inputs: domain
// suggestions while typing, and "Did you mean …?" corrections for common typos.
// No network calls. Suggestions only — nothing here ever changes an address on
// its own, and unknown/custom domains (e.g. name@company.com.au) are never flagged.

// Priority order: the first entries are offered as soon as someone types the
// part before "@".
export const EMAIL_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "bigpond.com",
  "live.com",
  "msn.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "fastmail.com",
  "fastmail.fm",
  "aol.com",
  "mail.com",
  "gmx.com",
  "gmx.net",
  "zoho.com",
  "yandex.com",
  "yandex.ru",
  "mail.ru",
  "qq.com",
  "163.com",
  "naver.com",
  "web.de",
];

export const MAX_EMAIL_SUGGESTIONS = 6;

// Known misspellings → intended domain.
const DOMAIN_TYPOS: Record<string, string> = {
  "gmial.com": "gmail.com",
  "gmai.com": "gmail.com",
  "gmal.com": "gmail.com",
  "gamil.com": "gmail.com",
  "gnail.com": "gmail.com",
  "gmaill.com": "gmail.com",
  "gmail.co": "gmail.com",
  "gmail.cm": "gmail.com",
  "hotmial.com": "hotmail.com",
  "hotmal.com": "hotmail.com",
  "hotmai.com": "hotmail.com",
  "hotamil.com": "hotmail.com",
  "hotmail.co": "hotmail.com",
  "outlok.com": "outlook.com",
  "outllok.com": "outlook.com",
  "outloo.com": "outlook.com",
  "outlook.co": "outlook.com",
  "yaho.com": "yahoo.com",
  "yahooo.com": "yahoo.com",
  "yhoo.com": "yahoo.com",
  "yahoo.co": "yahoo.com",
  "iclod.com": "icloud.com",
  "iclould.com": "icloud.com",
  "icloud.co": "icloud.com",
  "bigpon.com": "bigpond.com",
  "bigpong.com": "bigpond.com",
  "bigpond.co": "bigpond.com",
  "bigponds.com": "bigpond.com",
  "protonmial.com": "protonmail.com",
  "protonmal.com": "protonmail.com",
};

// Fuzzy (one-typo-away) matching is limited to longer, very common domains —
// short ones like me.com / msn.com / qq.com would turn real custom domains into
// false "corrections".
const FUZZY_DOMAINS = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com",
  "bigpond.com",
  "protonmail.com",
  "fastmail.com",
];

// Mistyped ".com" endings on an otherwise-known domain (gmail.con, yahoo.cmo …).
const BAD_COM_TLDS = ["con", "cmo", "cm", "om", "comm", "ocm", "vom", "xom", "cpm", "coom"];

// True when a and b differ by exactly one insert/delete/substitute or one adjacent swap.
function isOneEditAway(a: string, b: string) {
  if (a === b || Math.abs(a.length - b.length) > 1) return false;
  if (a.length === b.length) {
    const diffs: number[] = [];
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diffs.push(i);
    if (diffs.length === 1) return true;
    return diffs.length === 2 && diffs[1] === diffs[0] + 1 && a[diffs[0]] === b[diffs[1]] && a[diffs[1]] === b[diffs[0]];
  }
  const [shorter, longer] = a.length < b.length ? [a, b] : [b, a];
  let i = 0;
  while (i < shorter.length && shorter[i] === longer[i]) i++;
  return shorter.slice(i) === longer.slice(i + 1);
}

/** Full addresses to offer while typing, or [] when there is nothing useful to show. */
export function getEmailSuggestions(input?: string, limit = MAX_EMAIL_SUGGESTIONS): string[] {
  const text = (input || "").trim();
  if (!text || /\s/.test(text)) return [];
  const at = text.indexOf("@");
  if (at !== text.lastIndexOf("@")) return [];
  const local = at === -1 ? text : text.slice(0, at);
  if (!local) return [];
  const typedDomain = at === -1 ? "" : text.slice(at + 1).toLowerCase();
  if (EMAIL_DOMAINS.includes(typedDomain)) return []; // already a complete known address
  return EMAIL_DOMAINS.filter((d) => d.startsWith(typedDomain))
    .slice(0, limit)
    .map((d) => `${local}@${d}`);
}

/** The corrected address when the domain looks like a typo of a common provider, else null. */
export function suggestEmailCorrection(email?: string): string | null {
  const value = (email || "").trim();
  const at = value.lastIndexOf("@");
  if (at < 1) return null;
  const local = value.slice(0, at);
  const domain = value.slice(at + 1).toLowerCase();
  if (!domain || !domain.includes(".") || EMAIL_DOMAINS.includes(domain)) return null;

  let fixed: string | undefined = DOMAIN_TYPOS[domain];
  if (!fixed) {
    const dot = domain.lastIndexOf(".");
    const name = domain.slice(0, dot);
    const tld = domain.slice(dot + 1);
    if (BAD_COM_TLDS.includes(tld) && EMAIL_DOMAINS.includes(`${name}.com`)) fixed = `${name}.com`;
  }
  if (!fixed) fixed = FUZZY_DOMAINS.find((d) => isOneEditAway(domain, d));
  return fixed ? `${local}@${fixed}` : null;
}
