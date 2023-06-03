import ExpenseForm from '../..//components/expense';

const Expense = () => {
  const expenseObj = {
    expense_type: '',
    bank: '',
    payment_gateway: '',
    isDebited: '',
    amount: '',
    description: '',
    date: '',
  };

  return (
    <ExpenseForm
      formId="add-expense-form"
      expenseObj={expenseObj}
      forNewExpense={false}
    />
  );
};

export default Expense;
