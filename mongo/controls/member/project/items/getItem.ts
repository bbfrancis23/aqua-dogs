import {Item} from '@/react/item/item-types'
import {NextApiRequest, NextApiResponse} from 'next'
import {findItem} from './findItem'

import {getServerSession} from 'next-auth/next'
import {authOptions} from '@/pages/api/auth/[...nextauth]'
import axios from 'axios'

export const getItem = async (req: NextApiRequest, res: NextApiResponse) => {
  const authSession = await getServerSession(req, res, authOptions)

  if (!authSession) {
    return res
      .status(axios.HttpStatusCode.Unauthorized)
      .json({message: 'You must be an authenticated member to access this endpoint.', item: null})
  }

  const item: Item = await findItem(req.query.itemId as string)

  if (!item) {
    return res.status(axios.HttpStatusCode.NotFound).json({message: 'Item not found.', item: null})
  }

  return res.status(axios.HttpStatusCode.Ok).json({message: 'success', item})
}

export default getItem
