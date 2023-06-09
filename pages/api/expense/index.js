import dbConnect from '../../../lib/dbConnect';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const expenses = await Expense.find({}).sort({
          date: -1,
        }); /* find all the data in our database */
        res.status(200).json({ success: true, data: expenses });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const expense = await Expense.create(
          req.body
        ); /* create a new model in the database */
        res.status(201).json({ success: true, data: expense });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
