/**
 * List of the 7 major Okun clans.
 */
export const OKUN_CLANS = [
  { name: 'Bunu', slug: 'bunu', description: 'The Bunu clan is located in the Kabba/Bunu Local Government Area, traditionally known for their rich agricultural heritage and distinct dialect.' },
  { name: 'Owe', slug: 'owe', description: 'The Owe clan (the people of Kabba) reside primarily in Kabba, serving as a historic administrative and cultural center for the Okun people.' },
  { name: 'Oworo', slug: 'oworo', description: 'The Oworo clan represents the easternmost Okun group, historically situated around the Lokoja hills and the Niger river basin.' },
  { name: 'Ijumu', slug: 'ijumu', description: 'The Ijumu clan encompasses multiple historical settlements within the Ijumu Local Government Area, rich in cultural festivals and trade history.' },
  { name: 'Kiri', slug: 'kiri', description: 'The Kiri clan is a historically distinct sub-group of Okun people residing in the Kabba/Bunu mountainous regions.' },
  { name: 'Gbede', slug: 'gbede', description: 'The Gbede clan comprises communities situated in northern Ijumu, known for their traditional governance system and agricultural productivity.' },
  { name: 'Yagba', slug: 'yagba', description: 'The Yagba clan spans Yagba West, Yagba East, and parts of Mopa-Muro, forming one of the largest dialectal sub-groups of the Okun people.' },
] as const;

/**
 * Returns the matching clan slug for a given town based on its attributes and LGA.
 * @param opts The options object containing district, LGA name, town name, and overview.
 * @returns The matching clan slug, or null if no match is found.
 */
export function getClanSlug(opts: {
  districtOrClan?: string | null;
  lgaName?: string | null;
  townName?: string | null;
  overview?: string | null;
}): string | null {
  const districtOrClan = (opts.districtOrClan || '').toLowerCase();
  const lgaName = (opts.lgaName || '').toLowerCase();
  const townName = (opts.townName || '').toLowerCase();
  const overview = (opts.overview || '').toLowerCase();

  const textToSearch = `${districtOrClan} ${townName} ${overview}`;

  // 1. Direct word-match query
  const clans = ['bunu', 'owe', 'oworo', 'ijumu', 'kiri', 'gbede', 'yagba'];
  for (const c of clans) {
    if (textToSearch.includes(c)) {
      return c;
    }
  }

  // 2. Geographic fallbacks based on LGA
  if (lgaName.includes('kabba/bunu') || lgaName.includes('kabba')) {
    if (textToSearch.includes('bunu')) {
      return 'bunu';
    }
    if (textToSearch.includes('kiri')) {
      return 'kiri';
    }
    return 'owe';
  }
  if (lgaName.includes('ijumu')) {
    if (textToSearch.includes('gbede')) {
      return 'gbede';
    }
    return 'ijumu';
  }
  if (lgaName.includes('lokoja')) {
    return 'oworo';
  }
  if (lgaName.includes('yagba') || lgaName.includes('mopa')) {
    return 'yagba';
  }

  return null;
}
