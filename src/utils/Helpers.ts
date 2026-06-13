import { Env } from '@/libs/Env';

/**
 * Resolves the public base URL of the application.
 * @returns The configured public app URL or the local development URL.
 */
export const getBaseUrl = () => {
  if (Env.NEXT_PUBLIC_APP_URL) {
    return Env.NEXT_PUBLIC_APP_URL;
  }

  return 'http://localhost:3000';
};

/**
 * Converts a string to title case, handling ALL-CAPS and all-lowercase inputs.
 * Preserves hyphens and treats each hyphenated segment independently.
 * @param value Raw string (e.g. "IKERE-EKITI" or "ikere ekiti").
 * @returns Properly capitalised title-case string.
 */
export const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/(?:^|[\s-])\S/gu, (char) => char.toUpperCase());
