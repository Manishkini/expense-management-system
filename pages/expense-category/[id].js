import ExpenseGatewayForm from '../../components/expenseCategory.js';

const NewExpenseCategory = () => {
  const expenseCategoryObj = {
    name: '',
  };

  return (
    <ExpenseGatewayForm
      formId="add-expense-category-form"
      expenseCategoryObj={expenseCategoryObj}
      forNewExpenseCategory={false}
    />
  );
};

export default NewExpenseCategory;
