import { relations } from 'drizzle-orm';
import {
  boolean,
  doublePrecision,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  serial,
  text,
  timestamp,
  uniqueIndex,
  type AnyPgColumn,
} from 'drizzle-orm/pg-core';

// ==========================================
// ENUMS
// ==========================================

export const userRoleEnum         = pgEnum('user_role',          ['SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR', 'USER']);
export const userStatusEnum       = pgEnum('user_status',        ['ACTIVE', 'SUSPENDED', 'BANNED']);
export const communityStatusEnum  = pgEnum('community_status',   ['draft', 'published', 'archived']);
export const revisionStatusEnum   = pgEnum('revision_status',    ['pending', 'approved', 'rejected']);
export const amenityStatusEnum    = pgEnum('amenity_status',     ['functional', 'dilapidated', 'under_construction', 'abandoned']);
export const amenityCategoryEnum  = pgEnum('amenity_category',   ['education', 'healthcare', 'road', 'water', 'power', 'market', 'security']);
export const mediaTypeEnum        = pgEnum('media_type',         ['image', 'video', 'audio', 'document']);
export const auditTargetTypeEnum  = pgEnum('audit_target_type',  ['community', 'revision', 'user', 'media', 'indigene', 'ruler', 'amenity']);

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

/** Maps to the `User` table created by the Prisma schema. */
export const userTable = pgTable('User', {
  id: text('id').primaryKey(),
  email: text('email').notNull(),
  emailVerified: timestamp('emailVerified', { mode: 'date' }),
  name: text('name'),
  image: text('image'),
  password: text('password'),
  role: text('role'), // 'SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR', 'USER'
  status: text('status'), // 'ACTIVE', 'SUSPENDED', 'BANNED'
  bio: text('bio'),
  location: text('location'),
  createdAt: timestamp('createdAt', { mode: 'date' }).notNull().defaultNow(),
  updatedAt: timestamp('updatedAt', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('User_email_key').on(table.email),
  index('user_role_idx').on(table.role),
  index('user_status_idx').on(table.status),
]);

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
  tagline: text('tagline'), // from Town.tagline
  overview: text('overview'), // from Town.overview
  metaDescription: text('meta_description'), // from Town.metaDescription
  lga: text('lga').notNull(), // text representation for backward compatibility or display
  lgaId: text('lga_id').references(() => lgaTable.id), // properly normalized FK
  districtOrClan: text('district_or_clan').notNull(),
  historicalBackground: text('historical_background'),
  foundingStories: text('founding_stories'),
  cultureAndTraditions: text('culture_and_traditions'),
  festivalsAndRituals: text('festivals_and_rituals'),
  economicActivities: text('economic_activities'),
  languagesAndDialects: jsonb('languages_and_dialects').default([]),
  socialAmenitiesLacked: jsonb('social_amenities_lacked').default([]),
  latitude: doublePrecision('latitude'),
  longitude: doublePrecision('longitude'),
  boundaryCoordinates: jsonb('boundary_coordinates').default([]),
  coverImageUrl: text('cover_image_url'),
  mediaUrls: jsonb('media_urls').default([]),
  status: text('status').default('draft').notNull(), // 'draft' | 'published' | 'archived'
  featured: boolean('featured').default(false).notNull(),
  population: integer('population'),
  founded: text('founded'),
  createdBy: text('created_by').notNull(),
  createdById: text('created_by_id').references(() => userTable.id, { onDelete: 'set null' }),
  parentCommunityId: integer('parent_community_id').references((): AnyPgColumn => communitiesSchema.id, { onDelete: 'set null' }),
  settlementType: text('settlement_type').default('standalone_town').notNull(), // 'collective_town' | 'standalone_town' | 'quarter' | 'village' | 'district' | 'satellite_settlement' | 'clan_settlement'
  classification: text('classification'), // 'clan_base' | 'royal_seat' etc.
  updatedAt: timestamp('updated_at', { mode: 'date' })
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('communities_slug_idx').on(table.slug),
  index('communities_status_idx').on(table.status),
  index('communities_lgaId_idx').on(table.lgaId),
]);

export const communityHierarchySchema = pgTable('community_hierarchy', {
  id: serial('id').primaryKey(),
  parentId: integer('parent_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  childId: integer('child_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  context: text('context').notNull(), // 'administrative' | 'historical' | 'social' | 'cultural'
  notes: text('notes'),
}, (table) => [
  index('hierarchy_parent_idx').on(table.parentId),
  index('hierarchy_child_idx').on(table.childId),
]);

export const communityRelationshipsSchema = pgTable('community_relationships', {
  id: serial('id').primaryKey(),
  sourceCommunityId: integer('source_community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  targetCommunityId: integer('target_community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  relationshipType: text('relationship_type').notNull(), // 'sister_town' | 'migrated_from' | 'cultural_alliance' | 'shared_monarchy' | 'shared_festival' | 'dialect_cluster'
  description: text('description'),
  establishedPeriod: text('established_period'),
}, (table) => [
  index('relationship_source_idx').on(table.sourceCommunityId),
  index('relationship_target_idx').on(table.targetCommunityId),
]);

export const communityAliasesSchema = pgTable('community_aliases', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  alias: text('alias').notNull(),
  type: text('type').default('dialectal').notNull(), // 'dialectal' | 'historical' | 'anglicized'
}, (table) => [
  index('alias_community_idx').on(table.communityId),
]);

export const communityTimelineSchema = pgTable('community_timeline', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  title: text('title').notNull(),
  description: text('description').notNull(),
  eventType: text('event_type').notNull(), // 'migration' | 'war' | 'merger' | 'split' | 'dynasty_transition' | 'administrative_change' | 'general'
  periodStart: text('period_start'),
  periodEnd: text('period_end'),
  references: jsonb('references').default([]),
}, (table) => [
  index('timeline_community_idx').on(table.communityId),
  index('timeline_event_type_idx').on(table.eventType),
]);

export const prominentIndigenesSchema = pgTable('prominent_indigenes', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  title: text('title'),
  role: text('role'),
  biography: text('biography').notNull(),
  birthYear: integer('birth_year'),
  deathYear: integer('death_year'),
  isAlive: boolean('is_alive'),
  profileImageUrl: text('profile_image_url'),
  achievements: jsonb('achievements').default([]),
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
  id: text('id')
    .primaryKey()
    .references(() => userTable.id, { onDelete: 'cascade' }), // user ID
  username: text('username').unique().notNull(),
  fullName: text('full_name'),
  communityId: integer('community_id').references(() => communitiesSchema.id, {
    onDelete: 'set null',
  }),
  bio: text('bio'),
  role: text('role').default('member').notNull(), // member, moderator, editor, admin
  profileImageUrl: text('profile_image_url'),
  occupation: text('occupation'),
  phoneNumber: text('phone_number'),
  phoneNumberVerified: boolean('phone_number_verified').default(false).notNull(),
  verificationDocumentUrl: text('verification_document_url'),
  verificationStatus: text('verification_status').default('unverified').notNull(),
  socialLinks: jsonb('social_links').default({}).notNull(),
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
}, (table) => [
  index('blog_posts_category_idx').on(table.category),
  index('blog_posts_status_idx').on(table.status),
]);

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
// DRIZZLE AUTH & SECURITY TABLES
// ==========================================

export const sessionsTable = pgTable('sessions', {
  sessionToken: text('sessionToken').primaryKey(),
  userId: text('userId')
    .notNull()
    .references(() => userTable.id, { onDelete: 'cascade' }),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const verificationTokensTable = pgTable('verification_tokens', {
  identifier: text('identifier').notNull(),
  token: text('token').notNull(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
}, (table) => [
  {
    pk: {
      columns: [table.identifier, table.token],
      name: 'verification_tokens_identifier_token_pk',
    },
  }
]);

export const passwordResetTokensTable = pgTable('password_reset_tokens', {
  email: text('email').notNull(),
  token: text('token').primaryKey(),
  expires: timestamp('expires', { mode: 'date' }).notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
});

export const loginActivityTable = pgTable('login_activity', {
  id: serial('id').primaryKey(),
  userId: text('user_id')
    .references(() => userTable.id, { onDelete: 'cascade' }),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  status: text('status').notNull(), // 'success', 'failed'
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('login_user_idx').on(table.userId),
  index('login_status_idx').on(table.status),
]);

// ==========================================
// VERSIONING, REVISIONS & AUDIT
// ==========================================

/** Maps to the unified `community_revisions` table. */
export const communityRevisionsTable = pgTable('community_revisions', {
  id: serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  name: text('name').notNull(),
  tagline: text('tagline'),
  overview: text('overview'),
  districtOrClan: text('district_or_clan'),
  historicalBackground: text('historical_background'),
  foundingStories: text('founding_stories'),
  cultureAndTraditions: text('culture_and_traditions'),
  festivalsAndRituals: text('festivals_and_rituals'),
  economicActivities: text('economic_activities'),
  submittedById: text('submitted_by_id').notNull(),
  status: text('status').default('pending').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).notNull().defaultNow(),
}, (table) => [
  index('community_revisions_community_idx').on(table.communityId),
  index('community_revisions_status_idx').on(table.status),
]);

/**
 * Stores full JSON snapshots of community rows before each edit.
 * Enables rollback to any previous state.
 */
export const communityVersionsTable = pgTable('community_versions', {
  id:          serial('id').primaryKey(),
  communityId: integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' })
    .notNull(),
  snapshot:    jsonb('snapshot').notNull(),
  changedById: text('changed_by_id').references(() => userTable.id, { onDelete: 'set null' }),
  changeNote:  text('change_note'),
  createdAt:   timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('community_versions_community_idx').on(table.communityId),
  index('community_versions_changed_by_idx').on(table.changedById),
]);

/**
 * Immutable audit trail — records who performed which action on which record.
 */
export const auditLogsTable = pgTable('audit_logs', {
  id:         serial('id').primaryKey(),
  actorId:    text('actor_id').references(() => userTable.id, { onDelete: 'set null' }),
  action:     text('action').notNull(), // 'publish', 'archive', 'approve_revision', 'promote_user', 'delete', ...
  targetType: auditTargetTypeEnum('target_type').notNull(),
  targetId:   text('target_id').notNull(),
  before:     jsonb('before'),
  after:      jsonb('after'),
  ipAddress:  text('ip_address'),
  createdAt:  timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('audit_actor_idx').on(table.actorId),
  index('audit_target_idx').on(table.targetType, table.targetId),
  index('audit_action_idx').on(table.action),
]);

/**
 * Structured media records replacing jsonb mediaUrls arrays.
 * Linked to any community via communityId.
 */
export const mediaTable = pgTable('media', {
  id:           text('id').primaryKey(),
  communityId:  integer('community_id')
    .references(() => communitiesSchema.id, { onDelete: 'cascade' }),
  uploadedById: text('uploaded_by_id').references(() => userTable.id, { onDelete: 'set null' }),
  type:         mediaTypeEnum('type').notNull().default('image'),
  url:          text('url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  caption:      text('caption'),
  altText:      text('alt_text'),
  mimeType:     text('mime_type'),
  sizeBytes:    integer('size_bytes'),
  width:        integer('width'),
  height:       integer('height'),
  isHero:       boolean('is_hero').default(false).notNull(),
  sortOrder:    integer('sort_order').default(0).notNull(),
  createdAt:    timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
}, (table) => [
  index('media_community_idx').on(table.communityId),
  index('media_type_idx').on(table.type),
  index('media_hero_idx').on(table.isHero),
]);

// ==========================================
// ADMIN TRACKER TABLES
// ==========================================

/** Personal admin todo items. */
export const adminTodosTable = pgTable('admin_todos', {
  id:          serial('id').primaryKey(),
  title:       text('title').notNull(),
  notes:       text('notes'),
  completed:   boolean('completed').default(false).notNull(),
  createdAt:   timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
});

/** App issues: bugs, feature requests, technical debt. */
export const adminIssuesTable = pgTable('admin_issues', {
  id:          serial('id').primaryKey(),
  title:       text('title').notNull(),
  description: text('description'),
  type:        text('type').default('bug').notNull(),     // 'bug' | 'feature' | 'debt' | 'improvement'
  priority:    text('priority').default('medium').notNull(), // 'low' | 'medium' | 'high' | 'critical'
  status:      text('status').default('open').notNull(),  // 'open' | 'in_progress' | 'resolved' | 'closed'
  createdAt:   timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt:   timestamp('updated_at', { mode: 'date' }).defaultNow().$onUpdate(() => new Date()).notNull(),
}, (table) => [
  index('admin_issues_status_idx').on(table.status),
  index('admin_issues_priority_idx').on(table.priority),
]);

// ==========================================
// DRIZZLE TABLE RELATIONS DEFINITIONS
// ==========================================

export const lgaTableRelations = relations(lgaTable, ({ many }) => ({
  communities: many(communitiesSchema),
}));

export const userTableRelations = relations(userTable, ({ many }) => ({
  revisions: many(communityRevisionsTable),
  createdCommunities: many(communitiesSchema),
}));

export const communitiesRelations = relations(communitiesSchema, ({ one, many }) => ({
  lga: one(lgaTable, { fields: [communitiesSchema.lgaId], references: [lgaTable.id] }),
  createdByUser: one(userTable, { fields: [communitiesSchema.createdById], references: [userTable.id] }),
  parentCommunity: one(communitiesSchema, {
    fields: [communitiesSchema.parentCommunityId],
    references: [communitiesSchema.id],
    relationName: 'hierarchy_parent',
  }),
  childCommunities: many(communitiesSchema, {
    relationName: 'hierarchy_parent',
  }),
  indigenes: many(prominentIndigenesSchema),
  rulers: many(traditionalRulersSchema),
  amenities: many(amenitiesSchema),
  polygons: many(gisPolygonsSchema),
  userProfiles: many(userProfilesSchema),
  blogPosts: many(blogPostsSchema),
  stories: many(communityStoriesSchema),
  comments: many(commentsSchema),
  revisions: many(communityRevisionsTable),
  parentRelations: many(communityHierarchySchema, { relationName: 'hierarchy_child_rel' }),
  childRelations: many(communityHierarchySchema, { relationName: 'hierarchy_parent_rel' }),
  sourceRelationships: many(communityRelationshipsSchema, { relationName: 'relation_source' }),
  targetRelationships: many(communityRelationshipsSchema, { relationName: 'relation_target' }),
  aliases: many(communityAliasesSchema),
  timeline: many(communityTimelineSchema),
  versions: many(communityVersionsTable),
  media: many(mediaTable),
}));

export const communityHierarchyRelations = relations(communityHierarchySchema, ({ one }) => ({
  parent: one(communitiesSchema, {
    fields: [communityHierarchySchema.parentId],
    references: [communitiesSchema.id],
    relationName: 'hierarchy_parent_rel',
  }),
  child: one(communitiesSchema, {
    fields: [communityHierarchySchema.childId],
    references: [communitiesSchema.id],
    relationName: 'hierarchy_child_rel',
  }),
}));

export const communityRelationshipsRelations = relations(communityRelationshipsSchema, ({ one }) => ({
  sourceCommunity: one(communitiesSchema, {
    fields: [communityRelationshipsSchema.sourceCommunityId],
    references: [communitiesSchema.id],
    relationName: 'relation_source',
  }),
  targetCommunity: one(communitiesSchema, {
    fields: [communityRelationshipsSchema.targetCommunityId],
    references: [communitiesSchema.id],
    relationName: 'relation_target',
  }),
}));

export const communityAliasesRelations = relations(communityAliasesSchema, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [communityAliasesSchema.communityId],
    references: [communitiesSchema.id],
  }),
}));

export const communityTimelineRelations = relations(communityTimelineSchema, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [communityTimelineSchema.communityId],
    references: [communitiesSchema.id],
  }),
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

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(userTable, {
    fields: [sessionsTable.userId],
    references: [userTable.id],
  }),
}));

export const loginActivityRelations = relations(loginActivityTable, ({ one }) => ({
  user: one(userTable, {
    fields: [loginActivityTable.userId],
    references: [userTable.id],
  }),
}));

export const communityRevisionsRelations = relations(communityRevisionsTable, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [communityRevisionsTable.communityId],
    references: [communitiesSchema.id],
  }),
  submittedByUser: one(userTable, {
    fields: [communityRevisionsTable.submittedById],
    references: [userTable.id],
  }),
}));

export const communityVersionsRelations = relations(communityVersionsTable, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [communityVersionsTable.communityId],
    references: [communitiesSchema.id],
  }),
  changedBy: one(userTable, {
    fields: [communityVersionsTable.changedById],
    references: [userTable.id],
  }),
}));

export const mediaRelations = relations(mediaTable, ({ one }) => ({
  community: one(communitiesSchema, {
    fields: [mediaTable.communityId],
    references: [communitiesSchema.id],
  }),
  uploadedBy: one(userTable, {
    fields: [mediaTable.uploadedById],
    references: [userTable.id],
  }),
}));
