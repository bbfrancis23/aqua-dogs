import { createItem } from 'mongo/controls/member/project/board/column/item/createItem';

export const handler = async (req, res) => {
  if (req.method === 'POST') {
    await createItem(req, res);
    return;
  }
};

export default handler;
