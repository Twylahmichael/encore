import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { MembershipModalProvider } from './components/MembershipSignupModal';
import { CartProvider } from './lib/cartStore';
import { Home } from './pages/Home';
import { FitnessStudio } from './pages/FitnessStudio';
import { OurProducts } from './pages/OurProducts';
import { ProductDetail } from './pages/ProductDetail';
import { Contacts } from './pages/Contacts';
import { Login } from './pages/Login';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { AdminLayout } from './pages/admin/AdminLayout';
import { Dashboard } from './pages/admin/Dashboard';
import { ScheduleManager } from './pages/admin/ScheduleManager';
import { ContentManager } from './pages/admin/ContentManager';
import { BookingsView } from './pages/admin/BookingsView';
import { AuditLog } from './pages/admin/AuditLog';
import { PortalLayout } from './pages/portal/PortalLayout';
import { MyCalendar } from './pages/portal/MyCalendar';
import { BookClass } from './pages/portal/BookClass';

export function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <MembershipModalProvider>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/fitness-studio" element={<FitnessStudio />} />
                <Route path="/our-products" element={<OurProducts />} />
                <Route path="/product/:slug" element={<ProductDetail />} />
                <Route path="/contacts" element={<Contacts />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />

                {/* Admin panel — owner/staff only, see AdminLayout */}
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="schedule" element={<ScheduleManager />} />
                  <Route path="content" element={<ContentManager />} />
                  <Route path="bookings" element={<BookingsView />} />
                  <Route path="audit" element={<AuditLog />} />
                </Route>

                {/* Member portal — Phase 2 of the Encore proposal */}
                <Route path="/my-encore" element={<PortalLayout />}>
                  <Route index element={<MyCalendar />} />
                  <Route path="book" element={<BookClass />} />
                </Route>
              </Routes>
            </main>
            <Footer />
          </div>
        </MembershipModalProvider>
      </CartProvider>
    </BrowserRouter>
  );
}
