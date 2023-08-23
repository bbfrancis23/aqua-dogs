import {Column, ColumnResponse} from '@/interfaces/ColumnInterface'
import {patchColumn} from '@/mongo/controls/member/project/board/column/patchColumn'
import {NextApiRequest, NextApiResponse} from 'next'

const handler = async (req: NextApiRequest, res: NextApiResponse<ColumnResponse>) => {
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
