import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  integer,
  jsonb,
  pgTable,
  serial,
  text,
  timestamp,
} from 'drizzle-orm/pg-core';

// ==========================================
// REMOTE DATABASE TABLES (Prisma-managed, PascalCase)
// These map to the real tables in the Neon production database.
// ==========================================

/** Maps to the `LGA` table created by the Prisma schema. */
export const lgaTable = pgTable('LGA', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  stateId: text('stateId').notNull(),
});

/** Maps to the `Town` table created by the Prisma schema. */
export const townTable = pgTable('Town', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull(),
  tagline: text('tagline'),
  overview: text('overview').notNull(),
  metaDescription: text('metaDescription'),
  lat: doublePrecision('lat'),
  lng: doublePrecision('lng'),
  population: integer('population'),
  founded: text('founded'),
  published: boolean('published').notNull().default(false),
  featured: boolean('featured').notNull().default(false),
  lgaId: text('lgaId').notNull(),
  tribeId: text('tribeId'),
  createdById: text('createdById').notNull(),
  rulerTitle: text('rulerTitle'),
  traditionalRuler: text('traditionalRuler'),
  randomFacts: text('randomFacts').array(),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

/** Maps to the `ProminentPerson` table created by the Prisma schema. */
export const prominentPersonTable = pgTable('ProminentPerson', {
  id: text('id').primaryKey(),
  townId: text('townId').notNull(),
  name: text('name').notNull(),
  title: text('title'),
  role: text('role'),
  biography: text('biography'),
  birthYear: integer('birthYear'),
  deathYear: integer('deathYear'),
  isAlive: boolean('isAlive'),
  imageUrl: text('imageUrl'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull(),
});

// Relations for the remote tables
export const townTableRelations = relations(townTable, ({ one, many }) => ({
  lga: one(lgaTable, { fields: [townTable.lgaId], references: [lgaTable.id] }),
  persons: many(prominentPersonTable),
}));

export const lgaTableRelations = relations(lgaTable, ({ many }) => ({
  towns: many(townTable),
}));

export const prominentPersonTableRelations = relations(prominentPersonTable, ({ one }) => ({
  town: one(townTable, { fields: [prominentPersonTable.townId], references: [townTable.id] }),
}));


// This file defines the structure of your database tables using the Drizzle ORM.

// To modify the database schema:
// 1. Update this file with your desired changes.
// 2. Generate a new migration by running: `pnpm run db:generate`

// The generated migration file will reflect your schema changes.
// It automatically run the command `db-server:file`, which apply the migration before Next.js starts in development mode,
// Alternatively, if your database is running, you can run `pnpm run db:migrate` and there is no need to restart the server.

// Need a database for production? Check out https://get.neon.com/BMFYNtx
// Tested and compatible with Next.js Boilerplate

export const counterSchema = pgTable('counter', {
  id: serial('id').primaryKey(),
  count: integer('count').default(0),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ==========================================
// OKUNPEDIA DIGITAL HERITAGE ECOSYSTEM SCHEMAS
// ==========================================

export const communitiesSchema = pgTable('communities', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  name: text('name').notNull(),
  lga: text('lga').notNull(), // e.g., Kabba/Bunu, Mopa-Muro, Ijumu, Yagba East, Yagba West
  districtOrClan: text('district_or_clan').notNull(),
  historicalBackground: text('historical_background'),
  foundingStories: text('founding_stories'),
  cultureAndTraditions: text('culture_and_traditions'),
  festivalsAndRituals: text('festivals_and_rituals'),
  economicActivities: text('economic_activities'),
  languagesAndDialects: jsonb('languages_and_dialects').default([]),
  socialAmenitiesLacked: jsonb('social_amenities_lacked').default([]),
  sisterTowns: jsonb('sister_towns').default([]),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  boundaryCoordinates: jsonb('boundary_coordinates').default([]),
  coverImageUrl: text('cover_image_url'),
  mediaUrls: jsonb('media_urls').default([]),
  status: text('status').default('published').notNull(), // draft, published, archived
  createdBy: text('created_by').notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const prominentIndigenesSchema = pgTable('prominent_indigenes', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  biography: text('biography').notNull(),
  achievements: jsonb('achievements').default([]),
  profileImageUrl: text('profile_image_url'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const traditionalRulersSchema = pgTable('traditional_rulers', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(), // e.g., Obaro, Elulu, Olubunu, Agbana, Alamuro
  name: text('name').notNull(),
  reignStart: text('reign_start'),
  reignEnd: text('reign_end'),
  isIncumbent: boolean('is_incumbent').default(true),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const amenitiesSchema = pgTable('amenities', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  category: text('category').notNull(), // education, healthcare, road, water, power, market
  name: text('name').notNull(),
  status: text('status').notNull(), // functional, dilapidated, under_construction, abandoned
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const userProfilesSchema = pgTable('user_profiles', {
  id: text('id').primaryKey(), // Clerk user ID
  username: text('username').unique().notNull(),
  fullName: text('full_name'),
  communityId: integer('community_id').references(() => communitiesSchema.id, {
    onDelete: 'set null',
  }),
  bio: text('bio'),
  role: text('role').default('member').notNull(), // member, moderator, editor, admin
  profileImageUrl: text('profile_image_url'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const blogPostsSchema = pgTable('blog_posts', {
  id: serial('id').primaryKey(),
  slug: text('slug').unique().notNull(),
  title: text('title').notNull(),
  excerpt: text('excerpt').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id')
    .references(() => userProfilesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  communityId: integer('community_id').references(() => communitiesSchema.id, {
    onDelete: 'set null',
  }),
  category: text('category').notNull(), // history, news, editorial, development, culture
  coverImageUrl: text('cover_image_url'),
  status: text('status').default('draft').notNull(), // draft, published
  publishedAt: timestamp('published_at', { mode: 'date' }),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const communityStoriesSchema = pgTable('community_stories', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  authorId: text('author_id')
    .references(() => userProfilesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  mediaUrls: jsonb('media_urls').default([]),
  status: text('status').default('pending_review').notNull(), // pending_review, approved, archived
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ==========================================
// SCALABLE PLATFORM EXPANSION SCHEMAS
// ==========================================

export const commentsSchema = pgTable('comments', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id'), // Self-referential for threaded recursion
  authorId: text('author_id')
    .references(() => userProfilesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  communityId: integer('community_id').references(() => communitiesSchema.id, {
    onDelete: 'cascade',
  }),
  blogPostId: integer('blog_post_id').references(() => blogPostsSchema.id, {
    onDelete: 'cascade',
  }),
  content: text('content').notNull(),
  isApproved: boolean('is_approved').default(true).notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const reactionsSchema = pgTable('reactions', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => userProfilesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  targetType: text('target_type').notNull(), // 'community' | 'blog' | 'story'
  targetId: integer('target_id').notNull(),
  reactionType: text('reaction_type').default('like').notNull(), // like, love, celebrate
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const moderationLogsSchema = pgTable('moderation_logs', {
  id: serial('id').primaryKey(),
  moderatorId: text('moderator_id')
    .references(() => userProfilesSchema.id, { onDelete: 'set null' }),
  targetType: text('target_type').notNull(),
  targetId: integer('target_id').notNull(),
  actionTaken: text('action_taken').notNull(), // 'approved' | 'rejected' | 'flagged'
  reason: text('reason'),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const gisPolygonsSchema = pgTable('gis_polygons', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  featureCollection: jsonb('feature_collection').notNull(), // standard GeoJSON mapping polygon arrays
  centerLatitude: doublePrecision('center_latitude'),
  centerLongitude: doublePrecision('center_longitude'),
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

// ==========================================
// DRIZZLE TABLE RELATIONS
// ==========================================

export const communitiesRelations = relations(communitiesSchema, ({ many }) => ({
  indigenes: many(prominentIndigenesSchema),
  rulers: many(traditionalRulersSchema),
  amenities: many(amenitiesSchema),
  blogPosts: many(blogPostsSchema),
  stories: many(communityStoriesSchema),
  users: many(userProfilesSchema),
  comments: many(commentsSchema),
  gisPolygons: many(gisPolygonsSchema),
}));

export const prominentIndigenesRelations = relations(prominentIndigenesSchema, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [prominentIndigenesSchema.communityId],
    references: [communitiesSchema.id],
  }),
}));

export const traditionalRulersRelations = relations(traditionalRulersSchema, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [traditionalRulersSchema.communityId],
    references: [communitiesSchema.id],
  }),
}));

export const amenitiesRelations = relations(amenitiesSchema, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [amenitiesSchema.communityId],
    references: [communitiesSchema.id],
  }),
}));

export const userProfilesRelations = relations(userProfilesSchema, ({ one, many }) => ({
  community: one(communitiesSchema, {
    fields: [userProfilesSchema.communityId],
    references: [communitiesSchema.id],
  }),
  blogPosts: many(blogPostsSchema),
  stories: many(communityStoriesSchema),
  comments: many(commentsSchema),
  reactions: many(reactionsSchema),
}));

export const blogPostsRelations = relations(blogPostsSchema, ({ one, many }) => ({
  author: one(userProfilesSchema, {
    fields: [blogPostsSchema.authorId],
    references: [userProfilesSchema.id],
  }),
  community: one(communitiesSchema, {
    fields: [blogPostsSchema.communityId],
    references: [communitiesSchema.id],
  }),
  comments: many(commentsSchema),
}));

export const communityStoriesRelations = relations(communityStoriesSchema, ({ one }) => ({
  author: one(userProfilesSchema, {
    fields: [communityStoriesSchema.authorId],
    references: [userProfilesSchema.id],
  }),
  community: one(communitiesSchema, {
    fields: [communityStoriesSchema.communityId],
    references: [communitiesSchema.id],
  }),
}));

export const commentsRelations = relations(commentsSchema, ({ one }) => ({
  author: one(userProfilesSchema, {
    fields: [commentsSchema.authorId],
    references: [userProfilesSchema.id],
  }),
  community: one(communitiesSchema, {
    fields: [commentsSchema.communityId],
    references: [communitiesSchema.id],
  }),
  blogPost: one(blogPostsSchema, {
    fields: [commentsSchema.blogPostId],
    references: [blogPostsSchema.id],
  }),
}));

export const gisPolygonsRelations = relations(gisPolygonsSchema, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [gisPolygonsSchema.communityId],
    references: [communitiesSchema.id],
  }),
}));
