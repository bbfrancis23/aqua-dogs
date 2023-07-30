import db from '@/mongo/db'
import axios from 'axios'
import {NextApiResponse} from 'next'

export const unauthorizedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Unauthorized).json({
    message,
  })
}

export const notFoundResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.NotFound).json({
    message,
  })
}

export const forbiddenResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Forbidden).json({
    message,
  })
}
