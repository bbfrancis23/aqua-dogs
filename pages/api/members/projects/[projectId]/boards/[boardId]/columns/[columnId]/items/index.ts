import {createItem} from 'mongo/controls/member/project/board/column/item/createItem'
import {NextApiRequest, NextApiResponse} from 'next'

export const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await createItem(req, res)
    return
  }
}

export default handler
