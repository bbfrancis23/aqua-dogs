import axios from 'axios'

export default function handler(req, res) {
  const {tagId} = req.query

  if (req.method === 'GET') {
    let status = axios.HttpStatusCode.Ok
    let message = 'Accepted'
    let items = []

    res.status(status).json({
      message,
      items,
    })
  }
}
