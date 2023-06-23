import { patchBoard } from '/mongo/controls/member/project/board/patchBoard';

import { findBoard } from '/mongo/controls/member/project/board/findBoard';

const handler = async (req, res) => {
  if (req.method === 'PATCH') {
    await patchBoard(req, res);
    return;
  } else if (req.method === 'GET') {
    await findBoard(req, res);
    return;
  }
  return;
};
export default handler;
