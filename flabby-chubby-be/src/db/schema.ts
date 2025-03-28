import {
  integer,
  pgSchema,
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
  foreignKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

const flabbySchema = pgSchema("flabby");

export const users = flabbySchema.table("users", {
  user_id: uuid("user_id").defaultRandom().primaryKey(),
  name: text("name"),
  device_id: uuid("device_id").defaultRandom().notNull(),
  device_type: text("device_type").$type<"laptop" | "mobile">(),
  login_token: uuid("login_token").defaultRandom().notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
  leagues: many(leagues),
  leagueMembers: many(leagueMembers),
  scores: many(scores),
}));

export const leagues = flabbySchema.table("leagues", {
  league_id: uuid("league_id").defaultRandom().primaryKey(),
  owner_id: uuid("owner_id")
    .notNull()
    .references(() => users.user_id),
  title: text("title").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const leaguesRelations = relations(leagues, ({ one, many }) => ({
  owner: one(users, {
    fields: [leagues.owner_id],
    references: [users.user_id],
  }),
  leagueMembers: many(leagueMembers),
  scores: many(scores),
}));

export const leagueMembers = flabbySchema.table("league_members", {
  league_member_id: uuid("league_member_id").defaultRandom().primaryKey(),
  league_id: uuid("league_id")
    .notNull()
    .references(() => leagues.league_id),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.user_id),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const leagueMembersRelations = relations(
  leagueMembers,
  ({ one, many }) => ({
    league: one(leagues, {
      fields: [leagueMembers.league_id],
      references: [leagues.league_id],
    }),
    user: one(users, {
      fields: [leagueMembers.user_id],
      references: [users.user_id],
    }),
    scores: many(scores),
  })
);

export const scores = flabbySchema.table("scores", {
  id: uuid("id").defaultRandom().primaryKey(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => users.user_id),
  score: integer("score").notNull(),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const scoresRelations = relations(scores, ({ one }) => ({
  user: one(users, {
    fields: [scores.user_id],
    references: [users.user_id],
  }),
  leagueMember: one(leagueMembers, {
    fields: [scores.user_id],
    references: [leagueMembers.user_id],
  }),
}));
