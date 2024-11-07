import fetch from "node-fetch";
import dotenv from "dotenv";

import { CACHE_DURATION } from "../constants.mjs";
import logger from "../utils/logger.mjs";

dotenv.config();

const cache = {
  championsData: null,
  version: null,
  timestamp: 0,
  languages: null,
  championDetails: new Map(),
};

const fetchLatestVersion = async () => {
  const response = await fetch(process.env.DDRAGON_VERSIONS_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch versions");
  }

  const versions = await response.json();

  if (!Array.isArray(versions) || versions.length === 0) {
    throw new Error("Invalid versions data");
  }

  return versions[0];
};

const fetchLanguages = async () => {
  const response = await fetch(process.env.DDRAGON_LANGUAGES_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch languages");
  }

  const languages = await response.json();

  if (!Array.isArray(languages) || languages.length === 0) {
    throw new Error("Invalid languages data");
  }

  return languages;
};

const fetchChampionsData = async (version, lang) => {
  const response = await fetch(
    `${process.env.DDRAGON_CHAMPIONS_URL}/${version}/data/${lang}/champion.json`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch champions data");
  }

  const data = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error("Invalid champions data");
  }

  return data;
};

const fetchChampionDetails = async (version, lang, championId) => {
  const response = await fetch(
    `${process.env.DDRAGON_CHAMPIONS_URL}/${version}/data/${lang}/champion/${championId}.json`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch data for champion ${championId}`);
  }

  const data = await response.json();

  if (!data || typeof data !== "object") {
    throw new Error(`Invalid data for champion ${championId}`);
  }

  return data;
};

export const getLanguages = async () => {
  if (cache.languages) {
    logger.info("Returning cached languages data");

    return cache.languages;
  }

  cache.languages = await fetchLanguages();
  logger.info("Fetched new languages data");

  return cache.languages;
};

export const getChampionsData = async (lang = "en_US") => {
  const now = Date.now();

  if (cache.championsData && now - cache.timestamp < CACHE_DURATION) {
    logger.info("Returning cached champions data");

    return cache.championsData;
  }

  const latestVersion = await fetchLatestVersion();

  if (latestVersion !== cache.version) {
    cache.version = latestVersion;
    cache.championsData = await fetchChampionsData(latestVersion, lang);
    cache.timestamp = now;
    logger.info("Fetched new champions data");
  }

  return cache.championsData;
};

export const getChampionDetails = async (championId, lang = "en_US") => {
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

  cache.championDetails.set(cacheKey, { data, timestamp: now });
  logger.info(`Fetched new data for champion ${championId}`);

  return data;
};
