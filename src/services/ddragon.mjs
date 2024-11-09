import fetch from "node-fetch";
import dotenv from "dotenv";

import { CACHE_DURATION, DEFAULT_LANGUAGE } from "../constants.mjs";
import logger from "../utils/logger.mjs";

dotenv.config();

const cache = {
  championsData: null,
  version: null,
  timestamp: 0,
  languages: null,
  championDetails: new Map(),
};

const fetchJson = async (url) => {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Failed to fetch data from ${url}`);
  }

  const data = await res.json();

  if (!data || typeof data !== "object") {
    throw new Error(`Invalid data from ${url}`);
  }

  return data;
};

const fetchLatestVersion = async () => {
  const versions = await fetchJson(process.env.DDRAGON_VERSIONS_URL);

  if (!Array.isArray(versions) || versions.length === 0) {
    throw new Error("Invalid versions data");
  }

  return versions[0];
};

const fetchLanguages = async () => fetchJson(process.env.DDRAGON_LANGUAGES_URL);

const fetchChampionsData = async (version, lang) => {
  const url = `${process.env.DDRAGON_CHAMPIONS_URL}/${version}/data/${lang}/champion.json`;

  return fetchJson(url);
};

const fetchChampionDetails = async (version, lang, championId) => {
  const url = `${process.env.DDRAGON_CHAMPIONS_URL}/${version}/data/${lang}/champion/${championId}.json`;

  return fetchJson(url);
};

export const getLanguages = async () => {
  if (cache.languages) {
    logger.info("Returning cached languages data");

    return cache.languages;
  }

  try {
    const languages = await fetchLanguages();
    cache.languages = languages;
    logger.info("Fetched new languages data");

    return languages;
  } catch (e) {
    logger.error(`Error fetching languages: ${e.message}`);
    throw e;
  }
};

export const getChampionsData = async (lang = DEFAULT_LANGUAGE) => {
  try {
    const validLanguages = await getLanguages();

    if (!validLanguages.includes(lang)) {
      throw new Error(`Invalid language code: ${lang}`);
    }

    const now = Date.now();
    const cacheKey = `championsData-${lang}`;

    if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_DURATION) {
      logger.info(`Returning cached champions data for lang: ${lang}`);

      return cache[cacheKey].data;
    }

    const latestVersion = await fetchLatestVersion();

    if (latestVersion !== cache.version) {
      cache.version = latestVersion;
    }

    const data = await fetchChampionsData(latestVersion, lang);
    cache.timestamp = now;

    const transformedData = {
      version: latestVersion,
      champions: Object.keys(data.data).map((championKey) => {
        const champion = data.data[championKey];
        return {
          [champion.name]: {
            id: champion.id,
            key: champion.key,
            name: champion.name,
            title: champion.title,
            blurb: champion.blurb,
            difficulty: champion.info.difficulty,
            imageLink: champion.image.full,
            tags: champion.tags,
            partype: champion.partype,
          },
        };
      }),
    };

    cache[cacheKey] = {
      data: transformedData,
      timestamp: now,
    };

    logger.info(`Fetched and transformed new champions data for lang: ${lang}`);

    return transformedData;
  } catch (e) {
    logger.error(`Error fetching champions data: ${e.message}`);
    throw e;
  }
};

export const getChampionDetails = async (
  championId,
  lang = DEFAULT_LANGUAGE
) => {
  try {
    const validLanguages = await getLanguages();

    if (!validLanguages.includes(lang)) {
      throw new Error(`Invalid language code: ${lang}`);
    }
    const now = Date.now();
    const cacheKey = `${championId}-${cache.version}-${lang}`;

    if (
      cache.championDetails.has(cacheKey) &&
      now - cache.championDetails.get(cacheKey).timestamp < CACHE_DURATION
    ) {
      logger.info(`Returning cached data for champion ${championId}`);

      return cache.championDetails.get(cacheKey).data;
    }

    const latestVersion = await fetchLatestVersion();
    const data = await fetchChampionDetails(latestVersion, lang, championId);

    const transformedData = {
      version: latestVersion,
      [data.data[championId].name]: {
        id: data.data[championId].id,
        key: data.data[championId].key,
        name: data.data[championId].name,
        title: data.data[championId].title,
        skins: data.data[championId].skins.map((skin) => ({
          id: skin.id,
          num: skin.num,
          name: skin.name,
          chromas: skin.chromas,
        })),
        lore: data.data[championId].lore,
        blurb: data.data[championId].blurb,
        tags: data.data[championId].tags,
        partype: data.data[championId].partype,
        difficulty: data.data[championId].info.difficulty,
        spells: data.data[championId].spells.map((spell) => ({
          id: spell.id,
          name: spell.name,
          description: spell.description,
        })),
        passive: {
          name: data.data[championId].passive.name,
          description: data.data[championId].passive.description,
        },
      },
    };

    cache.championDetails.set(cacheKey, {
      data: transformedData,
      timestamp: now,
    });
    logger.info(`Fetched and transformed new data for champion ${championId}`);

    return transformedData;
  } catch (e) {
    if (e.message.includes("Failed to fetch data from")) {
      logger.warn(`Champion with ID ${championId} does not exist`);
      throw new Error(`Champion with ID ${championId} not found`);
    }
    logger.error(
      `Error fetching champion details for ID ${championId}: ${e.message}`
    );
    throw e;
  }
};
