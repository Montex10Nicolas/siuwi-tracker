import { type Episode, type Season, type Serie } from "~/types/tmdb_detail";

export interface DBErorr extends Error {
  severity_local: string;
  severity: string;
  code: number;
  routing: string;
}

export enum Status {
  "not_started",
  "watching",
  "completed",
}

export interface SerieType {
  id: string;
  name: string;
  serie_data: Serie;
}

export interface SeriesWatchedTableType {
  id: string;
  serieId: string;
  userId: string;
  status: "not_started" | "watching" | "completed";
  seasonCount: number;
}

export interface SeasonType {
  id: string;
  season_data: Season;
}

export interface SeasonsWatchedDB {
  id: string;
  seasonId: string;
  userId: string;
  serieId: string;
  status: "not_started" | "watching" | "completed";
  episodeCount: number;
}

export interface UserInfo {
  id: string;
  userId: string;
  movieDurationTotal: number;
  movieCountTotal: number;
  tvDurationTotal: number;
  tvEpisodeCount: number;
  tvSerieCompleted: number;
  tvSerieWatching: number;
}

export interface SerieDBType {
  id: string;
  serie_data: Serie;
}

export interface SerieWatchedType {
  id: string;
  userId: string;
  serieId: string;
  status: "not_started" | "watching" | "completed";
}

export interface SeasonWatchedType {
  id: string;
  userId: string;
  serieId: string;
  status: "not_started" | "watching" | "completed";
  seasonId: string;
}

export const CODES_STATUS: number[] = [23505];

export function generateErrorMessage(code: number) {
  switch (code) {
    case 23505:
      return "This item already exist";
    default:
      return "Hello";
  }
}
