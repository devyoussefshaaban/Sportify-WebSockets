import { pgTable, pgEnum, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

/**
 * Match Status Enum
 * Defines the lifecycle of a sporting event.
 */
export const matchStatusEnum = pgEnum('match_status', ['scheduled', 'live', 'finished']);

/**
 * Matches Table
 * Core entity for storing match information and real-time scores.
 */
export const matches = pgTable('matches', {
    id: serial('id').primaryKey(),
    sport: text('sport').notNull(),
    homeTeam: text('home_team').notNull(),
    awayTeam: text('away_team').notNull(),
    status: matchStatusEnum('status').default('scheduled').notNull(),
    startTime: timestamp('start_time').notNull(),
    endTime: timestamp('end_time'),
    homeScore: integer('home_score').default(0).notNull(),
    awayScore: integer('away_score').default(0).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

/**
 * Commentary Table
 * Stores real-time play-by-play events. 
 * Includes metadata (JSONB) for event-specific data (e.g., coordinates, player IDs) 
 * and tags for categorized filtering.
 */
export const commentary = pgTable('commentary', {
    id: serial('id').primaryKey(),
    matchId: integer('match_id')
        .references(() => matches.id, { onDelete: 'cascade' })
        .notNull(),
    minute: integer('minute'),
    sequence: integer('sequence').notNull(), // To ensure order within the same minute
    period: text('period'), // e.g., '1st Half', 'Extra Time'
    eventType: text('event_type').notNull(), // e.g., 'goal', 'card', 'substitution'
    actor: text('actor'), // Main player involved
    team: text('team'),
    message: text('message').notNull(),
    metadata: jsonb('metadata'), // Flexible storage for event-specific details
    tags: text('tags').array(), // Text array for flexible categorization
    createdAt: timestamp('created_at').defaultNow().notNull(),
});
