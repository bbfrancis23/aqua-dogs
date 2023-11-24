import {NextApiRequest, NextApiResponse} from 'next'
import {createBoard} from '@/mongo/controls/member/project/board/createBoard'

import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'

import axios from 'axios'
import db from '@/mongo/db'

const boardsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)
  await db.connect()

  if (req.method !== 'POST') {
    res.status(axios.HttpStatusCode.MethodNotAllowed).json({
      message: 'Invalid Method',
    })
    return
  }

  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({
      message: 'Invalid Session',
    })
    return
  }

  await createBoard(req, res)
  return
}
export default boardsHandler
