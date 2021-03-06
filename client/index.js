import { fetchEarthquakes } from './lib/earthquakes';
import {
  el,
  element,
  formatDate,
  earthheader,
} from './lib/utils';
import { init, createPopup } from './lib/map';

document.addEventListener('DOMContentLoaded', async () => {
  // TODO
  // Bæta við virkni til að sækja úr lista
  // Nota proxy
  // Hreinsa header og upplýsingar þegar ný gögn eru sótt
  // Sterkur leikur að refactora úr virkni fyrir event handler í sér fall

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const type = urlParams.has('type') ? urlParams.get('type') : 'all';
  const period = urlParams.has('period') ? urlParams.get('period') : 'hour';

  const earthquakes = await fetchEarthquakes(period, type);

  // Fjarlægjum loading skilaboð eftir að við höfum sótt gögn
  const loading = document.querySelector('.loading');
  const parent = loading.parentNode;
  parent.removeChild(loading);

  if (!earthquakes) {
    parent.appendChild(
      el('p', 'Villa við að sækja gögn'),
    );
  }

  const header = document.querySelector('.earthquakes_header');
  const ul = document.querySelector('.earthquakes');
  const map = document.querySelector('.map');

  init(map);

  const eheader = earthheader(earthquakes.header.type, earthquakes.header.period);

  const div = el('div');

  div.appendChild(el('h1', `${eheader.period} Jarðskjálftar, seinasta ${eheader.type}`));
  div.appendChild(el('h2', `Gögn eru: ${earthquakes.timer.text}, Fyrir spurn tók: ${earthquakes.timer.time}`));

  header.appendChild(div);

  // console.log(earthquakes);
  earthquakes.data.features.forEach((quake) => {
    const {
      title, mag, time, url,
    } = quake.properties;

    const link = element('a', { href: url, target: '_blank' }, null, 'Skoða nánar');

    const markerContent = el('div',
      el('h3', title),
      el('p', formatDate(time)),
      el('p', link));
    const marker = createPopup(quake.geometry, markerContent.outerHTML);

    const onClick = () => {
      marker.openPopup();
    };

    const li = el('li');

    li.appendChild(
      el('div',
        el('h2', title),
        el('dl',
          el('dt', 'Tími'),
          el('dd', formatDate(time)),
          el('dt', 'Styrkur'),
          el('dd', `${mag} á richter`),
          el('dt', 'Nánar'),
          el('dd', url.toString())),
        element('div', { class: 'buttons' }, null,
          element('button', null, { click: onClick }, 'Sjá á korti'),
          link)),
    );

    ul.appendChild(li);
  });
});
