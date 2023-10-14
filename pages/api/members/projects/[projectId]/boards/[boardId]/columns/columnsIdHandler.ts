import {Column, ColumnResponse} from '@/react/column/column-types'
import {patchColumn} from '@/mongo/controls/member/project/board/column/patchColumn'
import axios from 'axios'
import {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from 'next-auth/react'

const handler = async (req: NextApiRequest, res: NextApiResponse<ColumnResponse>) => {
  const session = await getSession({req})
  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({
      message: 'Invalid Session',
    })
    return
  }

  if (req.method === 'PATCH') {
    await patchColumn(req, res)
    return
  } else if (req.method === 'GET') {
    // await getColumn(req, res)
    return
  } else if (req.method === 'DELETE') {
    await patchColumn(req, res)
    return
  }
  return
}
export default handler
