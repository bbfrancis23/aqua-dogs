import db from '@/mongo/db'
import axios from 'axios'
import {NextApiResponse} from 'next'

export const unauthorizedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Unauthorized).json({
    message,
  })
}

export const unauthRes = async (res: NextApiResponse, message: string) => {
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

export const notFoundRes = async (res: NextApiResponse, message: string) => {
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

export const forbiddenRes = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Forbidden).json({
    message,
  })
}

export const MethodNotAllowedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.MethodNotAllowed).json({
    message,
  })
}

export const badRequestResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.BadRequest).json({
    message,
  })
}

export const internalServerErrorResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.InternalServerError).json({
    message,
  })
}

export const serverErrRes = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.InternalServerError).json({
    message,
  })
}

export const okResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Ok).json({
    message,
  })
}

export const createdResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Created).json({
    message,
  })
}

export const createdRes = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Created).json({
    message,
  })
}

export const noContentResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.NoContent).json({
    message,
  })
}

export const emptyFieldRes = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.UnprocessableEntity).json({
    message,
  })
}

export const conflictResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.Conflict).json({
    message,
  })
}

export const tooManyRequestsResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.TooManyRequests).json({
    message,
  })
}

export const notImplementedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.NotImplemented).json({
    message,
  })
}

export const serviceUnavailableResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.ServiceUnavailable).json({
    message,
  })
}

export const gatewayTimeoutResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.GatewayTimeout).json({
    message,
  })
}

export const httpVersionNotSupportedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.HttpVersionNotSupported).json({
    message,
  })
}

export const variantAlsoNegotiatesResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.VariantAlsoNegotiates).json({
    message,
  })
}

export const insufficientStorageResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.InsufficientStorage).json({
    message,
  })
}

export const loopDetectedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.LoopDetected).json({
    message,
  })
}

export const notExtendedResponse = async (res: NextApiResponse, message: string) => {
  await db.disconnect()
  res.status(axios.HttpStatusCode.NotExtended).json({
    message,
  })
}
