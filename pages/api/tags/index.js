import { getTags } from '/mongo/controllers/tagsControllers';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const tags = await getTags();

    res.status(200).json({
      message: 'success',
      tags,
    });
  }
}
