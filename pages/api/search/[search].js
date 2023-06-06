import dbConnect from '../../../lib/dbConnect';
import Expense from '../../../models/Expense';

export default async function handler(req, res) {
  const { search } = req.query;
  await dbConnect();
  try {
    let expenses = await Expense.find({})
      .populate(['expense_type', 'payment_gateway', 'bank'])
      .sort({ date: -1 });
    expenses = expenses.filter((expense) => {
      return (
        expense.expense_type.name.includes(search) ||
        expense.payment_gateway.name.includes(search) ||
        expense.bank.name.includes(search)
      );
    });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(400).json({ success: false });
  }
}
