import dbConnect from '../../../lib/dbConnect';
import Bank from '../../../models/Bank';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const banks = await Bank.find(
          {}
        ); /* find all the data in our database */
        res.status(200).json({ success: true, data: banks });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const bank = await Bank.create(
          req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: bank });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
