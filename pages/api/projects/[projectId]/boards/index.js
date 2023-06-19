import { createBoard } from '/mongo/controls/member/project/board/createBoard';

const handler = async (req, res) => {
  if (req.method === 'POST') {
    await createBoard(req, res);
    return;
  }
  return;
};
export default handler;
