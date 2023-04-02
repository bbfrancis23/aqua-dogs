import { getTags } from '../../../mongo/controllers/tagsControllers';

async function handler(req, res) {
  if (req.method === 'GET') {
    const result = await getTags();
    res.status(result.status).json({
      message: result.message,
      tags: result.tags,
    });
    return;
  }

  return;
}

export default handler;
