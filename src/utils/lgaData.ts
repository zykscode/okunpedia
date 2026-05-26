export type LgaInfo = {
  name: string;
  slug: string;
  headquarters: string;
  description: string;
  culturalHighlights: string;
  keyStats: {
    communitiesCount: number;
    primaryTribes: string[];
  };
};

export const OKUN_LGAS: Record<string, LgaInfo> = {
  'kabba-bunu': {
    name: 'Kabba/Bunu',
    slug: 'kabba-bunu',
    headquarters: 'Kabba',
    description: 'Kabba/Bunu is a historic local government area in Kogi State, serving as the administrative and cultural heartbeat of the Okun people. Its capital, Kabba, was the former capital of the Kabba Province. The region has an abundant agricultural landscape, and is home to the Owe and Bunu clans, known for their elaborate traditional governance systems and rich historical lineage.',
    culturalHighlights: 'The traditional ruler is the Obaro of Kabba, a highly respected royal throne. Key annual festivals include the Kabba Day celebrations and various seasonal harvest events.',
    keyStats: {
      communitiesCount: 42,
      primaryTribes: ['Owe', 'Bunu', 'Kiri'],
    },
  },
  'ijumu': {
    name: 'Ijumu',
    slug: 'ijumu',
    headquarters: 'Iyara',
    description: 'Ijumu Local Government Area is composed of three main historical groupings: Gbede, Ijumu Arin, and Ogidi. Located in a lush forest-savannah transition zone, Ijumu is historically renowned for its independence, political organisation, and vibrant market networks. It hosts several historic hills and archeological sites.',
    culturalHighlights: 'The Olujumu of Ijumu is the paramount traditional ruler. The region is famous for the Ogidi Ela cultural festival, celebrating Yam harvest and traditional arts.',
    keyStats: {
      communitiesCount: 35,
      primaryTribes: ['Ijumu', 'Gbede'],
    },
  },
  'mopa-muro': {
    name: 'Mopa-Muro',
    slug: 'mopa-muro',
    headquarters: 'Mopa',
    description: 'Mopa-Muro LGA was created out of the former Oyi Local Government. The area is highly educated, and historically notable for early missionary school establishments. The landscape consists of low hills and fertile valleys, with farming and commerce being the primary occupations of the local populace.',
    culturalHighlights: 'The Elulu of Mopa is the paramount monarch. Celebrations include the Mopa Day festival and ancestral drum dances.',
    keyStats: {
      communitiesCount: 18,
      primaryTribes: ['Yagba'],
    },
  },
  'yagba-west': {
    name: 'Yagba West',
    slug: 'yagba-west',
    headquarters: 'Odo-Ere',
    description: 'Yagba West marks the western gateway of Okunland bordering Kwara State. The LGA has a rich landscape with rivers and agricultural plains, fostering rich cocoa, yam, and cassava farming. It consists of multiple historical clans who share deep cultural affiliations with Yagba dialects.',
    culturalHighlights: 'Led by the Olerin of Ere and the traditional council of Yagba West. The annual Egungun (masquerade) festival and yam celebrations are key highlights.',
    keyStats: {
      communitiesCount: 28,
      primaryTribes: ['Yagba'],
    },
  },
  'yagba-east': {
    name: 'Yagba East',
    slug: 'yagba-east',
    headquarters: 'Isanlu',
    description: 'Yagba East is a large local government area with its headquarters at Isanlu. The region features expansive savannah lands and notable natural resources. It is historically a center of trade and traditional weaving, with rich local lore surrounding early migrations from ancestral centres.',
    culturalHighlights: 'The Agbana of Isanlu is the paramount monarch. The Isanlu Day festival showcases local heritage, crafts, and historical reenactments.',
    keyStats: {
      communitiesCount: 30,
      primaryTribes: ['Yagba'],
    },
  },
  'lokoja': {
    name: 'Lokoja',
    slug: 'lokoja',
    headquarters: 'Lokoja',
    description: 'While Lokoja is the state capital and home to diverse groups, the northern and western wards of Lokoja LGA are home to the Oworo clan, a major dialectal group of the Okun people. This area includes the beautiful Oworo hills and communities overlooking the River Niger confluence.',
    culturalHighlights: 'The Olu of Oworo is the paramount ruler for the Okun/Oworo communities in the local government area. The Oworo Cultural Festival showcases distinct regional boat regattas and mountain dances.',
    keyStats: {
      communitiesCount: 15,
      primaryTribes: ['Oworo'],
    },
  },
};
