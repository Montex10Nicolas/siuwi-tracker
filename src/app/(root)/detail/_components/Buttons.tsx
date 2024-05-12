"use client";

import { type Season } from "~/types/tmdb_detail";

type ActionAddAll = (
  season: Season,
  serieId: string,
  userId: string,
) => Promise<void>;

export function SeasonButtons(props: {
  addAllSeason: ActionAddAll;
  season: Season;
  userId: string;
  serieId: string;
  hasWatched: boolean;
}) {
  const {
    addAllSeason: addSeason,
    season,
    userId,
    serieId,
    hasWatched,
  } = props;
  async function addCompleted() {
    await addSeason(season, userId, serieId);
  }

  async function less() {
    console.log("b");
  }

  return (
    <>
      <button
        onClick={addCompleted}
        className="disabled: h-full w-full rounded-sm bg-green-600 font-semibold uppercase text-white disabled:bg-gray-700"
        disabled={hasWatched}
      >
        add
      </button>
      <button
        onClick={less}
        className="h-full w-full rounded-sm bg-sky-600 font-semibold uppercase text-white"
      >
        edit
      </button>
    </>
  );
}
