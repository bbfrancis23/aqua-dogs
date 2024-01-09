import {patchBoard} from '@/mongo/controls/board/patchBoard'
import {NextApiRequest, NextApiResponse} from 'next'

export type PatchBoardResponse = {
  message: string
  board?: any
}
export const boardIdApi = async (req: NextApiRequest, res: NextApiResponse<PatchBoardResponse>) => {
  switch (req.method) {
    case 'PATCH':
      await patchBoard(req, res)
      break
    case 'DELETE':
      // await deleteBoard(req, res)
      break
    default:
      res.status(405).json({message: 'Invalid Method'})
      break
  }
  return
}
