import '../css/style.css';
import '../css/form.css';
import Head from 'next/head';
import Link from 'next/link';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Expense Management System App</title>
      </Head>

      <div className="top-bar border-b border-neutral-900">
        <div className="nav">
          <Link href="/">Home</Link>
          <Link href="/bank">Banks</Link>
          <Link href="/payment-gateway">Modes of Payments</Link>
          <Link href="/expense-category">Expense Categories</Link>
        </div>

        <img
          id="title"
          src="https://w7.pngwing.com/pngs/890/998/png-transparent-expense-management-appbrain-deloitte-luxembourg-expense-grass-revenue-money-thumbnail.png"
          alt="expense management system logo"
        ></img>
      </div>
      <div className="grid wrapper">
        <Component {...pageProps} />
      </div>
    </>
  );
}

export default MyApp;
