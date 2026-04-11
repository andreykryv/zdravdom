import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Kirill from './pages/Kirill';
import Denis from './pages/Denis';
import Articles from './pages/Articles';
import Admin from './pages/Admin';
import BookingModal from './components/BookingModal';
import PhoneModal from './components/PhoneModal';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [phoneOpen, setPhoneOpen] = useState(false);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout onBook={() => setBookingOpen(true)} onPhone={() => setPhoneOpen(true)} />}>
          <Route path="/" element={<Home onBook={() => setBookingOpen(true)} />} />
          <Route path="/kirill" element={<Kirill onBook={() => setBookingOpen(true)} />} />
          <Route path="/denis" element={<Denis onBook={() => setBookingOpen(true)} />} />
          <Route path="/articles" element={<Articles onBook={() => setBookingOpen(true)} />} />
        </Route>
        <Route path="/admin/*" element={<Admin />} />
      </Routes>
      <BookingModal open={bookingOpen} onClose={() => setBookingOpen(false)} />
      <PhoneModal open={phoneOpen} onClose={() => setPhoneOpen(false)} />
    </>
  );
}