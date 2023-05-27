import { createItem } from 'mongo/controllers/itemControllers/createItem';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    await createItem(req, res);
    return;
  }
}
