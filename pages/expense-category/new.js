import ExpenseGatewayForm from '../../components/expenseCategory.js';

const NewExpenseCategory = () => {
  const expenseCategoryObj = {
    name: '',
  };

  return (
    <ExpenseGatewayForm
      formId="add-expense-category-form"
      expenseCategoryObj={expenseCategoryObj}
    />
  );
};

export default NewExpenseCategory;
