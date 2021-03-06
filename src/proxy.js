// TODO útfæra proxy virkni
import express from 'express';
import fetch from 'node-fetch';
import { timerStart, timerEnd } from './time.js';

import { getEarthquakes, setEarthquakes } from './cache.js';

export const router = express.Router();

router.get('/proxy', async (req, res) => {
  const {
    period, type,
  } = req.query;
  const URL = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${period}_${type}.geojson`;

  let result;
  const timer = timerStart();

  // TODO skoða fyrst cachið
  try {
    result = await getEarthquakes(`${period}_${type}`);
    // result = await fetchEarthquakes(period, type);
    // eslint-disable-next-line no-console
    // console.log(result);
  } catch (e) {
    console.error('error getting from cache', e);
  }

  if (result) {
    const dataman = {
      data: JSON.parse(result),
      header: { period, type },
      timer: { text: 'cached', time: timerEnd(timer) },
      info: {
        cached: true,
        time: 0.500,
      },
    };
    res.json(dataman);
    return;
  }

  try {
    result = await fetch(URL);
  } catch (e) {
    console.error('Villa við að sækja gögn frá vefþjónustu', e);
    res.status(500).send('Villa við að sækja gögn frá vefþónustu');
    return;
  }

  if (!result.ok) {
    console.error('Villa frá vefþjónustu', await result.text());
    res.status(500).send('Villa við að sækja gögn frá vefþjónustu');
    return;
  }

  // TODO setja gögn í cache
  const resultText = await result.text();
  await setEarthquakes(`${period}_${type}`, resultText);

  const data = {
    data: JSON.parse(resultText),
    header: { period, type },
    timer: { text: 'not cached', time: timerEnd(timer) },
    info: {
      cached: false,
      time: 0.500,
    },
  };
  res.json(data);
});
