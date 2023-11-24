import {patchBoard} from '@/mongo/controls/member/project/board/patchBoard'
import {patchBoardCols} from '@/mongo/controls/member/project/board/patchBoardCols'
import {getBoard} from '@/mongo/controls/member/project/board/findBoard'
import {NextApiRequest, NextApiResponse} from 'next'
import {Board} from '@/react/board/board-types'
import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import axios from 'axios'

export type PatchBoardResponse = {
  message: string
  board?: Board | null | undefined
}

const handler = async (req: NextApiRequest, res: NextApiResponse<PatchBoardResponse>) => {
  const session = await getServerSession(req, res, authOptions)
  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({
      message: 'Invalid Session',
    })
    return
  }

  if (req.method === 'PATCH') {
    if (req.body.boardCols) {
      await patchBoardCols(req, res)
      return
    } else {
      await patchBoard(req, res)
      return
    }
  } else if (req.method === 'GET') {
    await getBoard(req, res)
    return
  } else if (req.method === 'DELETE') {
    await patchBoard(req, res)
    return
  }
  return
}
export default handler
