// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { Many, relations } from "drizzle-orm";
import {
  integer,
  json,
  pgTableCreator,
  primaryKey,
  smallint,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";
import { generateId } from "lucia";
import {
  type Episode,
  type MovieDetail,
  type Season,
  type TVDetail,
} from "~/types/tmdb_detail";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `siuwi-tracker_${name}`);

export const userTable = createTable("user", {
  id: varchar("id", { length: 256 }).primaryKey(),
  username: varchar("username", { length: 256 }).notNull().unique(),
  password_hash: varchar("password", { length: 256 }).notNull(),
});

export const userTableRelation = relations(userTable, ({ one }) => ({
  info: one(userInfoTable, {
    fields: [userTable.id],
    references: [userInfoTable.userId],
  }),
}));

export const userInfoTable = createTable("user_info", {
  id: varchar("id", { length: 256 }).primaryKey().default(generateId(32)),
  userId: varchar("user_id", { length: 256 })
    .unique()
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  movieDurationTotal: integer("movie_duration_total").notNull().default(0),
  movieCountTotal: integer("movie_count_total").notNull().default(0),
  tvDurationTotal: integer("tv_duration_total").notNull().default(0),
  tvEpisodeCount: integer("tv_episode_count").notNull().default(0),
  tvSeasonCompleted: integer("tv_season_completed").notNull().default(0),
  tvSeasonWatching: integer("tv_season_Watching").notNull().default(0),
});

export const sessionTable = createTable("session", {
  id: varchar("id", { length: 256 }).primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userTable.id, { onDelete: "cascade" }),
  expiresAt: timestamp("expires_at", {
    withTimezone: true,
    mode: "date",
  }).notNull(),
});

export const moviesTable = createTable("movie", {
  id: varchar("movie_id", {
    length: 256,
  })
    .primaryKey()
    .notNull(),
  movie_data: json("movie_data").$type<MovieDetail>().notNull(),
});

export const moviesTableRelations = relations(moviesTable, ({ many }) => ({
  watchedBy: many(userToMovie),
}));

export const userToMovie = createTable(
  "movies-watched",
  {
    userId: varchar("user_id", { length: 256 })
      .notNull()
      .references(() => userTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    movieId: varchar("movie_id", { length: 256 })
      .notNull()
      .references(() => moviesTable.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    duration: smallint("duration").notNull(),
    timeWatched: smallint("time_watched").notNull(),
    dateWatched: timestamp("date_watched").notNull(),
  },
  (uToM) => ({
    union: primaryKey({
      name: "union",
      columns: [uToM.userId, uToM.movieId],
    }),
  }),
);

export const userToMovieRelations = relations(userToMovie, ({ one }) => ({
  user: one(userTable, {
    fields: [userToMovie.userId],
    references: [userTable.id],
  }),
  movie: one(moviesTable, {
    fields: [userToMovie.movieId],
    references: [moviesTable.id],
  }),
}));

export const seriesTable = createTable("tv-series-table", {
  id: varchar("id", { length: 256 }).notNull().primaryKey(),
  name: varchar("name", { length: 256 }).notNull(),
  serie_data: json("serie_data").$type<TVDetail>().notNull(),
});

export const seriesRelations = relations(seriesTable, ({ many }) => ({
  seasons: many(seasonTable),
  watchedBy: many(seriesWatchedTable),
}));

export const seriesWatchedTable = createTable("tv-series-watched", {
  id: varchar("id", { length: 256 }).primaryKey(),
  seriesId: varchar("series_id", { length: 256 })
    .notNull()
    .references(() => seriesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  status: text("status", {
    enum: ["not_started", "watching", "completed"],
  }).notNull(),
});

export const seriesWatchedRelations = relations(
  seriesWatchedTable,
  ({ one }) => ({
    serie: one(seriesTable, {
      references: [seriesTable.id],
      fields: [seriesWatchedTable.seriesId],
    }),
    user: one(userTable, {
      references: [userTable.id],
      fields: [seriesWatchedTable.userId],
    }),
  }),
);

export const seasonTable = createTable("tv-season", {
  id: varchar("id").primaryKey().notNull(),
  season_data: json("season_data").$type<Season>().notNull(),
  seriesId: varchar("series_id")
    .notNull()
    .references(() => seriesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  serieName: varchar("serie_name", {
    length: 256,
  }).notNull(),
  seasonName: varchar("name", { length: 256 }).notNull(),
});

export const seasonRelations = relations(seasonTable, ({ one, many }) => ({
  episodes: many(episodeTable),
  series: one(seriesTable, {
    references: [seriesTable.id],
    fields: [seasonTable.seriesId],
  }),
}));

export const seasonWatchedTable = createTable("tv-season-watched", {
  id: varchar("id", { length: 256 }).primaryKey(),
  seasonId: varchar("season_id")
    .references(() => seasonTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  userId: varchar("user_id")
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    })
    .notNull(),
  serieId: varchar("serie_id", { length: 256 })
    .notNull()
    .references(() => seriesTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  status: text("status", {
    enum: ["not_started", "watching", "completed"],
  }).notNull(),
});

export const seasonWatchedRelations = relations(
  seasonWatchedTable,
  ({ one, many }) => ({
    season: one(seasonTable, {
      references: [seasonTable.id],
      fields: [seasonWatchedTable.seasonId],
    }),
    user: one(userTable, {
      references: [userTable.id],
      fields: [seasonWatchedTable.userId],
    }),
  }),
);

export const episodeTable = createTable("tv-episode", {
  id: varchar("id", {
    length: 256,
  }).primaryKey(),
  seasonId: varchar("season_id", { length: 256 })
    .notNull()
    .references(() => seasonTable.id, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  episodeDate: json("episode_date").$type<Episode>().notNull(),
});

export const episodeRelations = relations(episodeTable, ({ many, one }) => ({
  watchedBy: many(episodeWatchedTable),
  season: one(seasonTable, {
    fields: [episodeTable.seasonId],
    references: [seasonTable.id],
  }),
}));

export const episodeWatchedTable = createTable("tv-episode-watched", {
  id: varchar("id").primaryKey(),
  userId: varchar("user_id", { length: 256 })
    .notNull()
    .references(() => userTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  episodeId: varchar("episode_id", { length: 256 })
    .notNull()
    .references(() => episodeTable.id, {
      onDelete: "cascade",
      onUpdate: "cascade",
    }),
  duration: smallint("duration").notNull(),
});

export const episodeWatRelations = relations(
  episodeWatchedTable,
  ({ one }) => ({
    user: one(userTable, {
      fields: [episodeWatchedTable.userId],
      references: [userTable.id],
    }),
    episode: one(episodeTable, {
      fields: [episodeWatchedTable.episodeId],
      references: [episodeTable.id],
    }),
  }),
);
