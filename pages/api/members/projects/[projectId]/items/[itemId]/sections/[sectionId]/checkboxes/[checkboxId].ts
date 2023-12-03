import {patchCheckbox} from '@/controls/member/project/items/sections/checkboxes/patchCheckbox'
import {NextApiRequest, NextApiResponse} from 'next/types'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'PATCH') {
    await patchCheckbox(req, res)
    return
  }
  // else if (req.method === 'DELETE') {
  //   await deleteComment(req, res)
  //   return
  // }
}
