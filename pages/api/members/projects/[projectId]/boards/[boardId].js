import { patchBoard } from '/mongo/controls/member/project/board/patchBoard';
import { patchBoardCols } from '/mongo/controls/member/project/board/patchBoardCols';

import { findBoard } from '/mongo/controls/member/project/board/findBoard';

const handler = async (req, res) => {
  if (req.method === 'PATCH') {
    if (req.body.boardCols) {
      await patchBoardCols(req, res);
      return;
    } else {
      await patchBoard(req, res);
      return;
    }
  } else if (req.method === 'GET') {
    await findBoard(req, res);
    return;
  }
  return;
};
export default handler;
