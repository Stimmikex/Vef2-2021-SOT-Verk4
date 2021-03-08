import express from 'express';

import { getData } from '../public/dist/bundle.js';

export let router = express.Router();

router.get('/:data?', async (req, res) => {
  const data = getData();
  return res.render('index', { data });
});
// TODO útfæra proxy virkni
