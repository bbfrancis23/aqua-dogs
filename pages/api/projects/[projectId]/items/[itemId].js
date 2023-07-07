import { patchItem } from 'mongo/controls/member/project/items/patchItem';

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