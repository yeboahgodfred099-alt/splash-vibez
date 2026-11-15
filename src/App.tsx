import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Registration from './pages/Registration';
import PaymentStatus from './pages/PaymentStatus';
import Ticket from './pages/Ticket';
import NotFound from './pages/NotFound';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen bg-brand-dark bg-mesh-pattern text-slate-100">
        <Header />
        <main className="flex-1 py-6 sm:py-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Registration />} />
            <Route path="/payment-status" element={<PaymentStatus />} />
            <Route path="/ticket" element={<Ticket />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
};

export default App;

