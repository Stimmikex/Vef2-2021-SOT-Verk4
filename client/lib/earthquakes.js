export async function fetchEarthquakes(type, period) {
  // TODO sækja gögn frá proxy þjónustu
  let result;
  try {
    result = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/'+ type + '_'+ period + '.geojson');
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
