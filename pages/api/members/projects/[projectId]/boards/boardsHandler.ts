import {NextApiRequest, NextApiResponse} from 'next'
import {createBoard} from '@/mongo/controls/member/project/board/createBoard'

import {getSession} from 'next-auth/react'
import axios from 'axios'

const boardsHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(axios.HttpStatusCode.MethodNotAllowed).json({
      message: 'Invalid Method',
    })
    return
  }

  const session = await getSession({req})
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
