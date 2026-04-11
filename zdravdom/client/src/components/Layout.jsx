import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ onBook, onPhone }) {
  return (
    <>
      <Header onBook={onBook} onPhone={onPhone} />
      <main><Outlet /></main>
      <Footer onBook={onBook} />
    </>
  );
}