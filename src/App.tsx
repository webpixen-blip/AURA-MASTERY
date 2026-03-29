import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { Home } from './pages/Home';
import { Admin } from './pages/Admin';
import { ProductDetails } from './pages/ProductDetails';
import { About } from './pages/About';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { Contact } from './pages/Contact';
import { Affiliates } from './pages/Affiliates';
import { Advertise } from './pages/Advertise';
import { FAQ } from './pages/FAQ';
import { TermsOfUse } from './pages/TermsOfUse';
import { Support } from './pages/Support';
import { Documentation } from './pages/Documentation';
import BlogPage from './pages/Blog';
import BlogPost from './pages/BlogPost';

export default function App() {
  return (
    <Router>
      <Toaster position="top-center" richColors theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/affiliates" element={<Affiliates />} />
        <Route path="/advertise" element={<Advertise />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<TermsOfUse />} />
        <Route path="/support" element={<Support />} />
        <Route path="/documentation" element={<Documentation />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
      </Routes>
    </Router>
  );
}
