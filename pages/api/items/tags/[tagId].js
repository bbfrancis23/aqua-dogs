import { getItemsByTag } from '../../../../mongo/controllers/itemControllers';

import axios from 'axios';

export default async function handler(req, res) {
  const { tagId } = req.query;

  if (req.method === 'GET') {
    let status = axios.HttpStatusCode.Ok;
    let message = 'Accepted';
    let items = [];

    await db.connect();

    try {
      items = await getItemsByTag(tagId);
    } catch (e) {
      status = axios.HttpStatusCode.InternalServerError;
      message = `Error Getting Items by TagId: ${e}`;
    }

    await db.disconnect();

    res.status(status).json({
      message,
      items,
    });
  }
}
