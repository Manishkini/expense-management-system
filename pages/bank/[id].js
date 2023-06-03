import BankForm from '../../components/bank';

const Bank = () => {
  const bankObj = {
    name: '',
  };

  return (
    <BankForm formId="add-bank-form" bankObj={bankObj} forNewBank={false} />
  );
};

export default Bank;
