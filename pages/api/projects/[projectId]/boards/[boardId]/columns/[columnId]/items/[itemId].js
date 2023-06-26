import { patchItem } from 'mongo/controllers/itemControllers/patchItem';

import { deleteItem } from 'mongo/controllers/itemControllers/deleteItem';

/* eslint-disable */

export const handler = async (req, res) => {
  const { itemId } = req.query;
  if (req.method === 'PATCH') {
    await patchItem(req, res);
    return;
  } else if (req.method === 'DELETE') {
    await deleteItem(req, res);
    return;
  }
};

export default handler;
