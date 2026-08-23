import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MembershipModalProvider } from './components/MembershipSignupModal';
import { Home } from './pages/Home';
import { FitnessStudio } from './pages/FitnessStudio';
import { OurProducts } from './pages/OurProducts';
import { Contacts } from './pages/Contacts';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';

export function App() {
  return (
    <BrowserRouter>
      <MembershipModalProvider>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/fitness-studio" element={<FitnessStudio />} />
              <Route path="/our-products" element={<OurProducts />} />
              <Route path="/contacts" element={<Contacts />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </MembershipModalProvider>
    </BrowserRouter>
  );
}
