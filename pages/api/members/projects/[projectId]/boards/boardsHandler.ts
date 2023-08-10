import {NextApiRequest, NextApiResponse} from 'next'
import {createBoard} from '@/mongo/controls/member/project/board/createBoard'

const boardsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await createBoard(req, res)
    return
  }
  return
}
export default boardsHandler
