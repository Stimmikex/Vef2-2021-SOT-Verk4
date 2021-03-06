// TODO útfæra redis cache
import redis from 'redis';
import { promisify } from 'util';

const client = redis.createClient({
  url: 'redis://127.0.0.1:6379/0',
});

const asyncGet = promisify(client.get).bind(client);
const asyncSet = promisify(client.set).bind(client);

/**
  * gets the earthquakes in the cashe
  * @param {*} key
  * @returns
  */
export async function getEarthquakes(key) {
  const earthquakes = await asyncGet(key);
  return earthquakes;
}

/**
  * Set the earthquakes in the cashe
  * @param {*} key
  * @param {*} earthquakes
  */
export async function setEarthquakes(key, earthquakes) {
  await asyncSet(key, earthquakes);
}
