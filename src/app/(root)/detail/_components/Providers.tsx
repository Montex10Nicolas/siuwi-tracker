"use client";
import { useState, type ChangeEvent } from "react";
import { fromIsoToName, getAllIso } from "~/_utils/available_region";
import { TMDB_IMAGE_URL } from "~/_utils/utils";
import { type FlatRentBuy, type ProviderResult } from "~/types/tmdb_detail";

function fixProvider(
  flatrate: FlatRentBuy[] | undefined,
  buy: FlatRentBuy[] | undefined,
  rent: FlatRentBuy[] | undefined,
) {
  let all: FlatRentBuy[] = [];
  if (flatrate != undefined) all = [...all, ...flatrate];
  if (buy != undefined) all = [...all, ...buy];
  if (rent != undefined) all = [...all, ...rent];

  let final: FlatRentBuy[] = [];
  for (const obj of all) {
    const found = final.find((a) => {
      if (a.provider_id === obj.provider_id) return obj;
    });

    if (found === undefined) {
      final = [...final, obj];
    } else {
      continue;
    }
  }
  final = final.sort((a, b) => a.display_priority - b.display_priority);
  return final;
}

function DisplayProvider(props: { provider: ProviderResult | undefined }) {
  const { provider } = props;

  if (provider === undefined)
    return (
      <div className="text-xl text-red-400">
        This content is not available in this country
      </div>
    );

  const { flatrate, buy, rent } = provider;
  const final = fixProvider(flatrate, buy, rent);

  let colLen = final.length;
  if (colLen > 4) colLen = 4;

  return (
    <div className="flex h-16 flex-row flex-wrap space-x-4">
      {final.map((prov) => {
        return (
          <div key={prov.provider_id} className="w-16">
            <img
              className="rounded-sm border border-slate-800 object-fill"
              src={TMDB_IMAGE_URL(prov.logo_path)}
              alt={prov.provider_name}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function Provider(props: {
  providers: Record<string, ProviderResult>;
}) {
  const { providers } = props;

  const [country, setCountry] = useState<string>("IT");
  const providerData = providers[country];

  function handleChange(event: ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    setCountry(value.toUpperCase());
  }

  const keys = getAllIso();

  return (
    <div className="flex flex-col gap-2">
      <select
        onChange={handleChange}
        value={country}
        className="cursor-pointer rounded-sm bg-white px-4 py-2 text-black"
      >
        {keys.map((key) => {
          return (
            <option key={key} value={key}>
              {fromIsoToName(key)}
            </option>
          );
        })}
      </select>
      <DisplayProvider provider={providerData} />
    </div>
  );
}
