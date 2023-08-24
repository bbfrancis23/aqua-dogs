import axios from 'axios'
import {createItem} from 'mongo/controls/member/project/board/column/item/createItem'
import {NextApiRequest, NextApiResponse} from 'next'
import {getSession} from 'next-auth/react'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({req})
  if (!session) {
    res.status(axios.HttpStatusCode.Unauthorized).json({
      message: 'Invalid Session',
    })
    return
  }

  if (req.method === 'POST') {
    await createItem(req, res)
    return
  }
}

export default handler
