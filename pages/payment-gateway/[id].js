import PaymentGatewayForm from '../../components/payment.js';

const PaymentGateway = () => {
  const paymentGatewayObj = {
    name: '',
  };

  return (
    <PaymentGatewayForm
      formId="add-payment-gateway-form"
      paymentGatewayObj={paymentGatewayObj}
      forNewPaymentGateway={false}
    />
  );
};

export default PaymentGateway;
