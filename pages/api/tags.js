import dbConnect from "../../lib/dbConnect";
import tagsModel from "../../models/Tags";
import tagTypesModal from "../../models/TagTypes";

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case "GET":
      try {
        const tags = await tagsModel
          .find({})
          .populate({
            path: "tagtype",
            model: TagTypesModel,
          })
          .exec((error, tags) => {
            console.log(error);
            res.status(200).json({ success: true, data: tags });
          });

        res.status(200).json({ success: true, data: tags });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case "POST":
      try {
        const tag = await Tags.create(req.body);
        res.status(201).json({ success: true, data: tag });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
