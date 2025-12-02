import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Blog } from './pages/Blog';
import { BlogPost } from './pages/BlogPost';
import { Newsletter } from './pages/Newsletter';
import { Contact } from './pages/Contact';
import { Admin } from './pages/Admin';

// Wrapper to conditionally render layout (admin has its own layout structure)
const AppContent: React.FC = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  if (isAdminRoute) {
     return (
        <Routes>
           <Route path="/admin" element={<Admin />} />
           <Route path="/admin/*" element={<Admin />} />
        </Routes>
     );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/newsletter" element={<Newsletter />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </Layout>
  );
};

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
