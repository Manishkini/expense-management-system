import dbConnect from '../../../lib/dbConnect';
import Bank from '../../../models/Bank';

export default async function handler(req, res) {
  const { method, query } = req;
  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const bank = await Bank.findById(
          query.id
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: bank });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const bank = await Bank.deleteOne({ _id: query.id });
        res.status(200).json({ success: true, data: bank });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {
        const bank = await Bank.findById(query.id);
        if (bank && bank._id) {
          const updateBank = await Bank.updateOne(
            {
              _id: bank._id,
            },
            {
              $set: { name: req.body.name },
            }
          );
          updateBank.modifiedCount
            ? res.status(201).json({ success: true, data: bank })
            : res.status(400).json({ success: false });
        } else {
          res.status(400).json({ success: false });
        }
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
