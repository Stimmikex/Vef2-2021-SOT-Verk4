import fetch from 'node-fetch';
/**
 * Gets the Earthquakes from the proxy server.
 * @param {*} type
 * @param {*} period
 * @returns data
 */
export async function fetchEarthquakes(type, period) {
  // TODO sækja gögn frá proxy þjónustu
  let result;
  try {
    // eslint-disable-next-line no-undef
    result = await fetch(`http://localhost:3001/proxy?period=${period}&type=${type}`);
  } catch (e) {
    console.error('Villa við að sækja', e);
    return null;
  }

  if (!result.ok) {
    console.error('Ekki 200 svar', await result.text());
    return null;
  }

  const data = await result.json();

  return data;
}
